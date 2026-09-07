# Map Brief: Part 6, Inventory Ledger

Written 2026-09-07 in the format at the end of `02 - Tools/Figma/Instructions.md`, in GrocerBot's four-level vocabulary. The nature pass at the end maps each nature to the piece families in `02 - Tools/Figma/Visual Rules.md`. Under the standing instruction to continue without asking, this brief is recorded and then built.

Purpose: a reader should see within ten seconds that inventory truth is one base-unit number per product family, fed by receipts from the plan build; that every tier's count on Clover is a projection of that number, written as an absolute target; that between syncs the store sells any format and recounts shelves with nothing to declare, Clover decrements on its own, and the next pull reads those decrements as evidence, absorbs them as sale witnesses, corrections, and anomalies, infers packaging, and re-anchors; and that the whole loop is reached only through the plan build and the pull, which nothing in production calls yet.

Target: file `nBmhDyEDpFPrMq0ztmHDb0`, page VISUAL DOCUMENTATION (`7001:129074`), a new frame below the Part 5 board. Components from SYSTEM LEGEND (`7001:129072`).

Standing: designed, not wired, per the harness; the code is complete for v1. Drawn as current with the standing captioned; nothing bracketed.

## Elements

One per line: name | nature | one-line description | modifiers.

**Actors**

- Core API | actor, agent | the plan build and the pull, inside Part 5's plan call; no endpoint reaches the ledger | none
- Store staff | actor, human | sell any format at the register, recount a shelf, scan a barcode into a tier; declare nothing | none

**Operations, the rail in order**

- Derives the multipliers | operation, route | case, pack, single from the sibling relationships; the suffixed sku; the family unit cost; base units received | P6 pill
- Resolves a family | operation, write | one `product_families` row per tenant, vendor, and item code; last cost wins; commits before any plan row | none
- Writes the composition edge | operation, write | one edge per tier item with its multiplier; a repack rewrites it with a zero anomaly | none
- Records the receipt | operation, write | plus base units on the single-tier carrier, once per document, with the document and the plan as provenance | none
- Seeds unbroken packages | operation, write | the packaging cache gains the cases and packs the line delivered; a single-only line arrives loose | none
- Sells any format | operation, action | Clover decrements that item's own count | Store staff
- Recounts or scans | operation, action | a single-tier count; a barcode scanned onto a tier | Store staff
- Pulls the counts | operation, view | observed stock and barcode per linked item, taken before the refresh | none
- Diffs against the baseline | operation, route | observed minus the last target this connection wrote or absorbed; no baseline, no diff | P1 pill
- Witnesses a sale | operation, write | a drop times the tier's quantity; drops absorb first | none
- Clamps at zero | operation, route | a movement past zero is clamped; the overshoot is an anomaly | shelf below, dead end; P3 pill
- Re-anchors on a recount | operation, write | a single-tier increase is a correction to the count; any other increase is an anomaly | none
- Infers packaging | operation, write | a single sale past loose stock implies a break; a case sale cascades down the chain; cache only | none
- Adopts a barcode | operation, write | fill if empty; a conflict is one anomaly per pair | none
- Advances the baseline | operation, write | to the observed count, for every explained observation | none
- Projects each tier | operation, route | floor of base units over the edge quantity, per tracked tier on this connection; the policy chooses which tiers | P7 pill
- Emits UPDATE_STOCK | operation, output | an absolute target into the plan, only where the projection moved | none
- Apply sets stock on Clover | operation, write | Part 5: the target to Clover, the canonical stock, and the baseline the next diff reads | muted; the loop rises after it

**Piping**

- Tiering | piping, code | `pos/tiering.py`: the three shapes and their multipliers, the sku, the costs, the receipt feed, the packaging seed | table
- Plan build, ledger half | piping, code | `plan_service.py` seen from the ledger: the pre-phase, the edges, the receipts once per document, the projection pass and its gates | none
- Ledger | piping, code | `inventory/ledger.py`: get-or-create, resolve, record; the lock, the clamp, the leaf rule | none
- Clover | piping, external tool | the sensor: `expand=itemStock`, `item_stocks`, the missing fallback and the missing delete | none
- Pull | piping, code | `pos/pull.py` as the sensor read: observations before the refresh, the two keys, the commit | none
- Witness engine | piping, code | `pos/witness.py`: adoption, the conflict gate, the delta, two phases, the four movements | table
- Ledger tests | piping, code | `tests/test_inventory` and `tests/test_pos`: the pins as sentences | table
- Projection | piping, code | `inventory/projection.py`: the floor, COGS with no caller, the policy, the drift gate | none
- Apply, the stock write | piping, code | Part 5: `applying.py`'s stock branch | muted

**Data**

- sellable_compositions | data, table | the DAG edge: item, family, quantity; one row per tier item in v1 | none
- product_families | data, table | the truth: identity, `base_qoh`, `unit_cost`, `packaging_state`, a barcode nothing reads | none
- inventory_movements | data, table | the append-only stream: four kinds, signed base units, provenance, a note | none
- pos_items | data, table | Part 5: `family_id`, `sku_type`, the adopted barcode, `track_inventory`, the observed count | muted
- pos_item_syncs | data, table | Part 5: the baseline key and the observed key inside `synced_field_values` | muted
- pos_connections | data, table | Part 5: `projection_policy` | muted
- pos_plan_actions | data, table | Part 5: the `UPDATE_STOCK` projections | muted

**Principles**

- P6 · One canonical format is the contract | principle | on Derives the multipliers
- P1 · Deterministic | principle | on Diffs against the baseline
- P3 · Fail loud | principle | on Clamps at zero
- P7 · One ledger number per family, tiers are views | principle | on Projects each tier

## Groupings

- Part 6 frame | part frame | everything above
- The loop | cluster | a line above the rail from after Apply sets stock back to before Store staff: Clover decrements between syncs, the next pull reads it, the ledger re-anchors
- Chapters | cluster | captions above the rail: in the plan build; in the store, between syncs; in the pull, the witness engine; at plan time again, projections
- The clamp shelf | cluster | under Witnesses a sale

## Relationships

- Derives -> Resolves -> Writes the edge -> Records the receipt -> Seeds -> Sells -> Recounts -> Pulls -> Diffs -> Witnesses -> Re-anchors -> Infers -> Adopts -> Advances -> Projects -> Emits -> Apply sets stock | flow | the rail
- Witnesses a sale -> Clamps at zero | flow | branch, dead end
- Apply sets stock -> Sells any format | feedback | the loop above the rail
- Derives -> Tiering card; Writes the edge -> Plan build card; Records the receipt -> Ledger card; Pulls -> Pull card; Witnesses -> Witness engine card; Projects -> Projection card; Apply sets stock -> Apply card (muted) | tie
- Pull card -> Clover card | tie, horizontal, leftward
- Plan build card -> product_families; Plan build card -> sellable_compositions (one bend); Ledger card -> inventory_movements; Pull card -> pos_item_syncs; Projection card -> pos_plan_actions (one bend) | tie

Reading order: left to right. The build's four ledger writes, then the store between syncs, then the pull and the witness's five steps with the clamp shelf, then the projection and the emit, and the muted apply the loop returns from.

Color semantics beyond the standard planes: none. Muted pieces at opacity 0.55.

Undecided:

- Whether Store staff belongs on a core board. Drawn, because the witness reads what they do and the design's point is that they declare nothing.
- Whether the tests deserve a card. Drawn as one, because the design says the invariants are the sentences the tests pin and no other document lists them.
- Whether the standing should be bracketed rather than captioned. Captioned, because every v1 piece exists in the tree; the missing wiring is Part 5's orchestrator half, already bracketed there.

## Nature pass

| Nature used here | Family in Visual Rules | Match |
| --- | --- | --- |
| actor, agent | Actor, Agent, designation Core API | match |
| actor, human | Actor, Internal Human, designation Store staff | match; Part 3 used it |
| operation, all acts | Operation | match; two Actions for the staff |
| piping, code | Piping Runner cards | match |
| piping, external tool | External Tool card | match; the Clover mark |
| data, table | Data card per section 5 | match |
| principle | Color Tag rebound to Principles | match; P1 and P7 |
| feedback loop | a line above the rail, the Part 3 convention | open item 13 |

No gap.
