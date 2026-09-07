# Context Record: Part 6, Inventory Ledger

Working artifact for the sixth documentation run, assembled 2026-09-07 per `Logic - Protocol.md`. Sam's instruction: "next", after the Part 5 report named Part 6 as the next part. **Part 6, Inventory ledger**: one base-unit number per product family, kept by an append-only movement stream; every tier's count on Clover is a projection of that number; Clover's own decrements between syncs are read back by the pull as evidence of sales, recounts, and anomalies; packaging state is inferred, never declared. The part begins where Part 5's plan build first touches a family and ends where the projections it emits go back into the plan as stock actions. The apply that writes them to Clover is Part 5's and is drawn muted.

Standing per the harness: **designed, not wired**, with the harness's own gloss that it is implemented in core and exercised only through the POS planner and pull, and that no endpoint or CLI reaches it directly. At `dd74fe9` every v1 piece of the ledger spec exists: the three tables and their migrations, the ledger primitives, the projection, the tiering, the witness engine, the plan-build glue, and the policy, pinned by 21 tests under `tests/test_inventory/` and by the witness, tiering, plan-service, and integration tests under `tests/test_pos/`. Nothing calls the plan build or the pull in production (Part 5), so nothing reaches the ledger; and no code path reads the ledger back for a human. The board draws the code as it is, captions the standing, and brackets nothing, because no v1 piece is missing; the spec's later slices are recorded here, not drawn.

## Files opened

Core at `dd74fe9`. Each line says why the file matters to Part 6.

**The engine, a leaf**

- `src/core/inventory/models.py`: `MovementKind` (receipt, sale_witness, correction, anomaly); `product_families` with the identity constraint on `(tenant_id, vendor, vendor_item_code)`, `base_qoh` as `Numeric(14,3)`, `unit_cost` in cents per base unit, `packaging_state` as a derived cache, `barcode` kept for enrichment and read by nothing; `inventory_movements` with plain UUID provenance columns (no foreign keys upward, the leaf rule), a receipt carrying both the document and the plan; `sellable_compositions` with one edge per item and family. The composite index for the receipt-idempotency query is mirrored into the model so autogenerate never drops it.
- `src/core/inventory/ledger.py`: `FamilySpec`; `get_or_create_family`, race-safe by catching the identity violation and adopting the winner's row, refreshing `unit_cost` and `display_name` on every call (last receipt wins) and filling an empty barcode; `resolve_families`, the pre-phase that commits as it goes and must run before any plan row is pending; `record_movement`, which locks the family row, appends the movement, moves `base_qoh` in the same transaction, clamps at zero, and writes a zero-quantity anomaly carrying the overshoot; it never commits.
- `src/core/inventory/projection.py`: `project_tier_qoh`, floor of `base_qoh` over the composition quantity, 0 for a non-positive balance, an error for a non-positive quantity; `cogs_cents`, `base_qoh × unit_cost`, called by tests only.
- Migrations `6e85ddf7d8ca` (the three tables, `pos_items.family_id` and `sku_type`, `pos_connections.projection_policy`, the enum types created by hand) and `8991f9b84c49` (the `(tenant_id, source_document_id)` index, guarded both ways).

**The POS glue, read for what it does to the ledger**

- `src/core/pos/tiering.py`: multipliers assembled from the sibling `sku_relationship`s (single 1; pack the singles per pack; case the packs per case times that); the per-tier sku `{vendor_item_code}:{tier}`; the family unit cost as ceil(line cost over the as-purchased multiplier); `base_units_received` from the single tier's sellable quantity, zeroed when `quantity_shipped` is 0 and kept for forecasts; `packaging_seed`, the unbroken packages a receipt adds per non-single tier, or loose singles for a single-only line.
- `src/core/pos/plan_service.py`: `_family_specs_from_lines` (last document wins, an older barcode kept); the family pre-phase in both build paths; `_ensure_composition_edge` (a matched stray gets its edge; a changed multiplier is a repack, the edge rewritten with a zero-delta anomaly); `_create_item_for_line` writing the edge at birth; the receipt block (one movement per line on its single-tier carrier, skipped for any document already receipted, tenant-wide; the packaging seed added); `_emit_projection_actions` (every tier item with a sync row on this connection or created by this build, tracked per the policy, an absolute `UPDATE_STOCK` only where the target differs from the connection's stock baseline, unconditional when there is none; the `track_inventory` flip on the canonical row only, `TODO(#36)`).
- `src/core/pos/witness.py`: `Observation` and `WitnessSummary`; barcode adoption fill-if-empty with GTIN-14 normalising on both sides before a conflict, and a conflict recorded once per pair; the delta against the baseline under `SYNCED_STOCK_KEY`; a missing composition edge as an anomaly with the baseline held; two phases, drops first, so the result does not depend on Clover's ordering; a drop as a sale witness of `delta × qty` with packaging cascading down the chain or a break inferred; a single-tier increase as a correction to the observed count, skipped when already there; a non-single increase as an anomaly; the baseline advanced for every explained observation.
- `src/core/pos/pull.py`: observations taken from already-linked items before the refresh; the witness run; then the pulled values written back and recorded under `stock_quantity`, a different key from the baseline; the commit that spans the ledger writes and never touches connection or plan rows.
- `src/core/pos/applying.py` `_apply_action`, the `UPDATE_STOCK` branch: the frozen target to Clover, the canonical `stock_quantity`, and the baseline key, with the accepted crash window between the write and the commit.
- `src/core/pos/adapters/clover/client.py` and `mapping.py`: `GET /items` with `expand=itemStock`; `itemStock.quantity` as a decimal, absent until stock is first set; `POST /item_stocks/{id}`; no read of `/item_stocks` and no delete.
- `src/core/pos/models.py`: `SYNCED_STOCK_KEY` and why it is a separate key; `ProjectionPolicy`; `SkuTier`.

**Tests, read for what they pin**

- `tests/test_inventory/`: conservation, atomic balance, clamp and anomaly, movement rides the caller's transaction, idempotent get-or-create, last cost wins, barcode never overwritten, the leaf rule (no foreign keys into pos), one edge per item and family, floor not round, never negative, COGS is not a tier sum, the family race on real Postgres, concurrent movements serialize on the row.
- `tests/test_pos/test_witness.py`, `test_tiering.py`, `test_plan_service.py`, `test_inventory_integration.py`, `test_pull.py`, `test_apply_batch.py`, `test_clover_stock_semantics.py`: the sale witness times the multiplier, the correction re-anchor and its zero skip, the non-single anomaly, break inference as a ledger no-op, the cascade down and never up, order independence, equivalent barcode spellings, the persistent-conflict gate, the shorted line that mints no receipt, the oversell that clamps and drags Clover to zero next cycle, the repack anomaly, the supersede and all-failed re-feeds that record no second receipt, the sibling-connection scope, the brownfield stray adopted by UPC, the tier-of-record policy, and the frozen Clover stock shape from the 2026-07-22 sandbox probe.

**Design records and issues**

- `docs/design/consumption-dag-inventory-engine.md` (2026-07-23): the model. One number, many views; explosion is composition with one ingredient; breaking a pack is a no-op; packaging is witnessed; the ledger is an estimator re-anchored by witnesses; the sensor hierarchy (pull delta, then order-level sell-through, then physical counts); native-POS citizenship; eight invariants; the roadmap.
- `docs/superpowers/specs/2026-07-23-inventory-ledger-unitization-design.md` (validated round 3, 2026-07-24): the v1 slice, the data model, the planner changes, projections, the witness loop, `projection_policy`, out of scope, the crown pins, the increments.
- `docs/superpowers/specs/2026-07-18-clover-pos-subsystem-design.md` section 4: the Clover stock facts the adapter encodes, including the expansion truncation note.
- Core issues #28 (closed, the unitization gap that produced this part), #35 (merged, the implementation), #32, #33, #36 (open, cited below).

## What is current

The cycle as it runs at `dd74fe9` whenever a plan is built for a connection and Clover is pulled.

1. **The plan build derives the tiers.** Each invoice line's sellable skus become tier specs: the multipliers from the sibling relationships, the suffixed sku, the family unit cost as ceil(line cost over the as-purchased multiplier), the tier costs, and the base units received (the single tier's sellable quantity, zero for a shorted line). A line with an unpriceable cost or no vendor code yields no tier and no receipt.
2. **Families are resolved first.** One `FamilySpec` per family from the single-tier lines, the newest document's cost and name, an older line's barcode kept; `resolve_families` gets or creates each `product_families` row and commits before any plan row exists, so a race between two connections of one tenant is caught and the loser adopts the winner.
3. **Clover is pulled and the witness runs** (step 5 below), before the build, so the plan diffs against reality.
4. **The build writes the ledger's edges and receipts.** A created tier item gets its composition edge with the multiplier; a matched stray gets one; an edge whose quantity differs from this invoice is a repack, rewritten with a zero-delta anomaly. One receipt movement per line, `+base units`, on the single-tier carrier, with the document and the plan as provenance, skipped for any document whose receipts already exist anywhere in the tenant; the packaging cache gains the unbroken packages the line delivered. All of this rides the build transaction, so a failed build rolls its receipts back while the pull's witnesses stay.
5. **The witness reads Clover as a sensor.** For every already-linked item the pull observed: an empty canonical barcode adopts the observed one; a different one is an anomaly, once per pair. With a family, an observed stock, and a baseline: the delta is observed minus the last target this connection wrote or absorbed. Drops are absorbed first: a sale witness of `delta × qty` moves `base_qoh` down, the packaging cache cascades down the chain for a non-single sale or infers a break for a single sale past the loose count. Then increases: on the single tier a correction re-anchors `base_qoh` to the observed count (a recount wins over the freshest state); on any other tier an anomaly with no balance change. A delta with no composition edge is an anomaly and the baseline is held so it keeps surfacing. Every explained observation advances the baseline to the observed count. `base_qoh` never goes below zero: a movement past it is clamped and a zero-quantity anomaly carries the overshoot.
6. **Projections are emitted.** For every tier item on this connection (a sync row here, or created by this build), tracked per the connection's policy (every tier, or the single tier only), the target is floor(`base_qoh` over the edge quantity); an `UPDATE_STOCK` with `{from: baseline, to: target}` is written into the plan only where the target differs from the baseline, and unconditionally where no baseline exists yet. The canonical `track_inventory` flag follows the policy; nothing pushes an un-track to Clover.
7. **Apply writes the target** (Part 5), sets the canonical stock, and records the target as the baseline the next diff will read.
8. **Between syncs Clover decrements on every sale**, staff recount shelves and scan barcodes into tiers, and nothing is declared; the next pull reads it all.

## What is historical

- Stock actions per invoice line with a delta, and the flattened single-line explosion that produced two conflicting targets for one case-priced item (dry-run plan `1df37bcf`, 2026-07-22, issue #28); replaced by receipts into the ledger and projections out of it.
- `sku` as the bare vendor code on every tier; now `{vendor_item_code}:{tier}`.
- The dropped `parent_item_id`; `family_id` is the tier link.
- The `pos_items` count as a stored truth; now `stock_quantity` is a snapshot and the family's `base_qoh` is the truth.

## What was decided, and where

- One ledger number per family; tiers are views; summing tier counts is always wrong. Design principle 1, invariants 1 and 8, `projection.py`.
- Explosion is composition with one ingredient; the edge table is general from day one. Principle 2, `sellable_compositions`.
- Breaking a pack is a ledger no-op. Principle 3, pinned.
- Packaging state is witnessed, never declared; no interface declares it. Principle 4, `packaging_state`.
- The native POS is a sensor, never fought mid-window; re-anchored at sync points. Principle 5, the witness's two phases.
- Movements are append-only and evidenced; balance and event commit together; underflow clamps and surfaces. Principle 6, `record_movement`.
- Families are tenant-scoped and resolved in a pre-phase that commits before any plan row. Spec section 3.
- The multiplier has one owner: the composition edge, written by tiering, read back by everyone. Spec section 4.
- A receipt is consumed once per document, not per plan. `_build_and_persist`, the F0/F7 note.
- `projection_policy` chooses which views are written, never what the ledger holds. Spec section 7.
- The ledger is a leaf: pos imports inventory, never the reverse, including in DDL. `inventory/models.py`.

## What is still open

- Order-level sell-through, the sharper witness (POS spec section 13; the roadmap's next slice).
- Reorder thresholds and alerts over the projections, with the orchestrator.
- Recipe compositions (many rows per sellable), catch-weight families (`base_unit` lb), packaging-aware projections for stores that do not break packs, barcode-enrichment delegation and third-party UPC data. Spec section 8.
- Per-family projection policy overrides.
- Whether any surface will read the ledger back for a human: COGS, the anomaly stream, the packaging cache. None does today.

## Conflicts found, by kind

1. **Specification differing from implementation.** The POS spec says nested expansions truncate at 100 and that completeness-critical stock reads fall back to `item_stocks`; the client reads stock only through `expand=itemStock` and has no fallback. The platform fact is the spec's, from docs.clover.com on 2026-07-18, and is unverified here.
2. **Columns without readers.** `product_families.barcode` is written and read by nothing (the model says so); `packaging_state` is written by the receipt seed and the witness and read by the witness only.
3. **A formula without a caller.** `cogs_cents` is called by tests only; no code path answers the COGS question the design leads with.
4. **The harness standing versus the tree.** "Designed, not wired" describes the entry point; the code is complete for v1 and pinned.

## Findings for the owner

Findings are not decisions. Each is inferred from the code at the SHA read and none has been observed running.

1. **No stock read outside the item expansion.** If the truncation the POS spec records is real, an item past the hundredth on a pulled page reports no stock, `to_canonical` yields none, and the witness skips it; the ledger would then miss every sale of such items. The client has no `item_stocks` read to fall back to. Unverified against the platform.
2. **The witness is dormant for an item until its first successful stock apply.** No baseline, no diff. Sales before that seed are absorbed later into one coarse witness against the freshly seeded baseline; the code calls this self-healing, not lossy.
3. **A sale witness conflates restocks within a sync window.** Acknowledged by the design as the coarse v1 sensor; sharpened by sell-through when it arrives.
4. **Nothing reads the ledger for a human.** No endpoint, CLI, report field, or embed reads `base_qoh`, the anomaly stream, or the packaging cache; `cogs_cents` has no caller. The ledger is written by two code paths and read by the projection and the witness only.
5. **Re-canonicalizing a receipted document keeps the wrong quantities.** Core #32.
6. **The planning limb is not connection-scoped.** Core #33.
7. **A policy flip never un-tracks on Clover.** Core #36.
8. **`base_unit` is always each.** The column and the numeric scale are ready for weight; no writer sets anything else.

## Belongs in another document

- The plan build's other half, matching, pricing, guardrails, apply, and the orchestrator chain, is Part 5.
- The reorder and sell-through slices are roadmap, not parts.
- The consumption-DAG design's marketing draft is not a source.

## Reconciled against the harness

The ledger is drawn as it runs inside the plan build and the pull, with the standing in a caption: reached by nothing but those two paths, read back by nothing. The principles the board cites: P7 one ledger number per family, tiers are views (the projection); P6 one canonical format is the contract (the tier lines from the exploded skus); P1 deterministic (the two-phase witness makes the balance independent of Clover's ordering); P3 fail loud (an underflow, a conflict, or a missing edge is an anomaly on the record, never a guess).
