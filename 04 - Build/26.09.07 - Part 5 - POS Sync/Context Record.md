# Context Record: Part 5, POS Sync

Working artifact for the fifth documentation run, assembled 2026-09-07 per `Logic - Protocol.md`. Sam's instruction: "next", after the Part 4 report named Part 5 as the next part. **Part 5, POS sync**: a canonical invoice in core becomes a plan of changes to the store's Clover merchant, the plan is applied in bounded batches, and a report comes back; a plan that breaches a guardrail parks until an operator approves it. The part begins at two places: at the `documents` row Part 4 ends on, and, on the designed side, at the scheduler tick that would ask core which connections to sync. It ends when the plan is applied, partially applied, or failed and the report is built, or when a parked plan is rejected. The ledger the planner writes into (families, movements, compositions, the witness) is Part 6; it is drawn here only where the plan build touches it.

Standing per the harness: **core side dev only; orchestrator side designed, not wired.** Every core piece exists in the tree at `dd74fe9` with 37 test files under `tests/test_pos/`; whether that tip runs anywhere is unverified (Core Brief). The orchestrator half is issue #262, open since 2026-07-22, with no schedule entry, handler, client call, or config in the orchestrator tree at `dev` `1304813` (a grep for `pos.dispatch`, `pos.plan`, `pos.apply`, `pos.reap`, `clover`, and `/v1/pos` across `src`, `config`, `docker-compose.yml`, and `README.md` finds nothing). The generated core client in `packages/client` has a `pos` package, so the contract is regenerated; the orchestrator's hand-written `clients/core.py` has no POS calls. Per the harness rule, the designed pieces reach the board bracketed and badged TBD; the core pieces are drawn as current.

## Files opened

Core at `dd74fe9`, orchestrator at `dev` `1304813`. Each line says why the file matters to Part 5.

**The HTTP surface and the CLI**

- `src/core/api/pos.py`: the five routes. `GET /v1/pos/connections` (enabled only, system principal), `POST /v1/pos/connections/{id}/plan` (body: `trigger` invoice, manual, or backfill; `workflow_run_id`; `since` for backfill), `POST /v1/pos/plans/{id}/apply`, `GET /v1/pos/plans/{id}/report`, `POST /v1/pos/reap` (system principal, `threshold_seconds` 3600). `PlanInProgress` is 409 `PLAN_IN_PROGRESS` with the active plan id; `PlanNotApplicable` is 409.
- `src/core/api/_scoping.py` lines 198 to 255: `usable_pos_connection` (missing or disabled is the same 404), `require_system_principal` (403 for a user principal; TrustedCaller passes), `get_scoped_pos_connection` and `get_scoped_pos_plan` (tenant from the row).
- `src/core/api/schemas_pos.py` and `src/core/pos/report.py`: `PlanReport` version 1: outcome, counts by kind, guardrail checks, the twenty largest price movements with rationale, unplannable lines by ordinal, per-action errors, source document ids. Presentation-neutral by rule; the `pos_plans.report` column is reserved and never written.
- `src/core/pos/cli.py` and `src/core/cli/main.py`: `gbc pos version`, `connection` (prompts for the token, stores it encrypted, disabled), `rules` (one of `--markup-bps` or `--fixed-price`), `enable` (refuses without a default rule), `plan-show`, `plan-approve` (pending to approved_manual), `plan-reject` (pending to rejected, a bare status flip marked `TODO(#42)`). The spec's `connection list|disable`, `rules list`, and `plan approve <id>` forms do not exist as written.
- `src/core/pos/credentials.py` and `registry.py`: Fernet under `POS_CREDENTIALS_KEY`, required at start; `build_adapter` per connection with the host by environment.

**The plan build**

- `src/core/pos/plan_service.py`: `create_or_get_plan` selects invoice documents past the connection's `plan_cursor` (or past `since`), returns the active plan on the same key or raises `PlanInProgress` on a different one, derives the lines, resolves families (a pre-phase that commits), pulls Clover, builds and persists the plan, and commits; an `IntegrityError` on the partial unique index becomes `PlanInProgress`. `_build_and_persist` creates the plan row pending, matches and prices each tier line, creates a `pos_items` row at plan time for every `CREATE_ITEM`, writes composition edges, records one receipt movement per line's single tier once per document, seeds packaging counts, emits drift-gated `UPDATE_STOCK` projections for every tracked tier on this connection, checks the ordinals, evaluates guardrails, and sets `approved_auto` or `pending`. `supersede_and_replace` marks and inserts in one commit.
- `src/core/pos/planning.py`: `plan_line`: an unpriceable cost or a line with neither barcode nor vendor code is one `UNPLANNABLE`; no match is a `CREATE_ITEM` with the cascade's price; a match diffs cost and price.
- `src/core/pos/matching.py`: three legs, exact only: `(family_id, sku_type)`, then GTIN-14 barcode among family-less items with adoption into the family, then raw vendor item code among family-less items.
- `src/core/pos/tiering.py`: multipliers from the sibling `sku_relationship`s; the per-tier sku `{vendor_item_code}:{tier}`; family unit cost as ceil(line cost / as-purchased multiplier); `quantity_shipped == 0` zeroes the receipt; `is_unpriceable_cost` (None, 0, negative) shared by every gate.
- `src/core/pos/pricing.py`: `item` over `vendor` over `category` over `default`; `price = cost * (10000 + bps) // 10000` or `fixed_price`; `NoPricingFloor` at enable and, defensively, at resolve.
- `src/core/pos/guardrails.py`: `max_actions_per_plan` 200, `max_price_change_pct` 30, `max_price_updates` 50, `creates_require_review_above` 100 from `sync_policy` with defaults, and the fixed `no_nonpositive_prices`; backfill always parks.
- `src/core/pos/cursor.py`: `advance_plan_cursor` to the max `created_at` of the plan's source documents, never backward, never to now.

**The pull and the witness**

- `src/core/pos/pull.py`: `since` is the max `pos_modified_at` of the connection's sync rows; each pulled item links by native id, then barcode, then sku, else a new `pos_items` row with `source` pos_pull; a sync row per item; observations are collected from already-linked items before the refresh; the witness runs; the canonical rows are refreshed; commits internally.
- `src/core/pos/witness.py`: read for the boundary. Barcode adoption fill-if-empty, conflict as an anomaly; a stock drop is a sale witness of `delta * qty`; a single-tier increase is a correction re-anchoring `base_qoh`; a non-single increase is an anomaly; packaging inference; the baseline advances to the observed count. Part 6 owns the inside.

**The apply**

- `src/core/pos/applying.py`: `apply_batch` refuses a plan outside the appliable set (active minus parked), sets `applying`, takes the next 50 pending actions by ordinal, skips `UNPLANNABLE`, applies each with a per-action commit and heartbeat, records a failure on the action and its sync row and continues, and on drain sets `applied`, `partially_applied`, or `failed` and advances the cursor when anything applied. `_apply_action`: create finds an existing native item by barcode then by sku before posting, and links rather than creates; updates post the field changes and advance the canonical item; stock is an absolute set-to-target with the baseline recorded.
- `src/core/pos/reap.py`: every reapable plan (active minus parked) with no progress past the threshold goes to `failed`; the cursor advances if anything applied.

**The Clover adapter**

- `src/core/pos/adapter.py`, `capabilities.py`, `adapters/clover/adapter.py`, `client.py`, `mapping.py`: the protocol (`pull_items`, `create_item`, `find_item`, `find_item_by_sku`, `update_item`, `set_stock`); writable fields; 10 requests per second and four concurrent by design against Clover's 16 and 5; the client's `User-Agent`, 30-second timeout, four attempts with `retry-after` on 429 and backoff on 5xx, `AdapterRejection` on other 4xx; `GET /items` paged by 1000 with `expand=itemStock` and a `modifiedTime` filter; `find_by_code` pages the whole catalog and matches client-side because `code` is not filterable (probe of 2026-07-24); `find_by_sku` filters server-side; `POST /items`, `POST /items/{id}`, `POST /item_stocks/{id}`; the mapping's three landmines (`available` is active, `defaultTaxRates` is taxable with `isRevenue` always true, no `description`).

**The tables**

- `src/core/pos/models.py` and migration `f39d860fd72a`: `pos_connections`, `pos_items`, `pos_item_syncs`, `pos_pricing_rules`, `pos_plans`, `pos_plan_actions`; the partial unique index `uq_pos_plans_active_connection` on `connection_id` where status is pending, approved_auto, approved_manual, or applying; `ACTIVE_PLAN_STATUSES`, `PARKED_PLAN_STATUSES`, `REAPABLE_PLAN_STATUSES`; `SYNCED_STOCK_KEY`; `ProjectionPolicy` all_tiers or tier_of_record.
- `src/core/inventory/ledger.py`, `projection.py`, `models.py`: read for what the build calls: `resolve_families` (get-or-create per `(tenant, vendor, vendor_item_code)`, last cost wins, commits), `record_movement` (row lock, clamp at zero with an anomaly for the overshoot), `project_tier_qoh` (floor of `base_qoh / qty`).

**Design records and issues**

- `docs/superpowers/specs/2026-07-18-clover-pos-subsystem-design.md`: the whole shape, validated round 4 on 2026-07-21; section 5 re-brainstormed 2026-07-20 after the advisory-lock design failed review; section 12 increment 7 is the orchestrator half.
- `docs/superpowers/specs/2026-07-23-inventory-ledger-unitization-design.md` sections 5 to 7: projections, the witness loop, `projection_policy`.
- Orchestrator issue #262 (open, 2026-07-22): `pos.dispatch`, `pos.plan`, `pos.apply`, `pos.reap`, the Discord report, three OpenObserve alerts, the zero-side-effects tripwire.
- Core issues #32 to #42 (open): the owner's own POS findings, cited below where they meet this record.
- `config/schedules.seed.yaml` in the orchestrator: the `system` vendor and the static entry shape a `pos.dispatch` row would take; no such row exists.

## What is current

The core chain as it runs at `dd74fe9` when something calls it. Today the only callers are the test suite and `gbc`; the designed callers are in brackets.

1. **[The scheduler ticks `pos.dispatch`]**, asks core for enabled connections, and pushes `pos.plan(connection_id)` per connection, unique on the id. Designed; nothing in the tree.
2. **[The worker opens a `pos.sync` run and calls plan.]** Designed.
3. **Core selects the documents.** Invoice documents of the connection's tenant with `created_at` past `plan_cursor`, or past `since` for a backfill. If an active plan exists with the same trigger and document set it is returned as is (`created` false); a different active plan is 409.
4. **Core derives the lines and resolves the families.** Each document's `sellable_skus` are grouped by parent line; each line yields one tier line per sku type with the multiplier, the suffixed sku, the tier cost, and the base units received; a line with an unpriceable cost or no vendor code yields one legacy line that will be `UNPLANNABLE` and carries no receipt. The single-tier lines become `FamilySpec`s and `resolve_families` gets or creates a `product_families` row per `(vendor, vendor_item_code)`, refreshing unit cost and name, committing as it goes.
5. **Core pulls Clover.** Items modified since the sync rows' high-water mark (everything on the first pull) are linked by native id, barcode, or sku, or created as strays with `source` pos_pull; the witness diffs observed stock against each linked item's last-written baseline and writes sale witnesses, corrections, anomalies, adoptions, and packaging counts into the ledger; then the canonical rows are refreshed; the pull commits.
6. **Core builds the plan.** A pending `pos_plans` row is inserted (the partial unique index is the race backstop). For each tier line: match, then `plan_line` prices through the cascade and emits `CREATE_ITEM` (the `pos_items` row and its composition edge are created now), `UPDATE_COST`, `UPDATE_PRICE`, or `UNPLANNABLE`; a matched stray gets its composition edge, and a changed multiplier is recorded as a repack anomaly. Orphan skus become `UNPLANNABLE`. Unwritable fields are noted in the rationale. Actions get ordinals. One receipt movement per line's single tier is recorded, skipped for any document already receipted; packaging seeds are added. Then an `UPDATE_STOCK` per tracked tier item on this connection whose projection differs from its baseline, `floor(base_qoh / qty)`. Guardrails are evaluated and recorded; pass is `approved_auto`, breach or backfill is `pending`. Commit.
7. **A parked plan waits for the operator.** `gbc pos plan-show`, then `plan-approve` (approved_manual) or `plan-reject`. A parked plan holds the connection's slot.
8. **[The worker pushes `pos.apply` for an approved plan and re-enqueues while more remains.]** Designed.
9. **Core applies a batch.** Fifty pending actions by ordinal. Create: find by barcode then by sku on Clover, link if found, else `POST /items` and a sync row born synced. Update: `POST /items/{id}` with the mapped fields, the sync row's `synced_field_values` and the canonical item advanced. Stock: `POST /item_stocks/{id}` with the frozen absolute target, the baseline recorded. A failure marks the action and its sync row and continues. Each action commits and bumps `last_progress_at`. On drain: `applied`, `partially_applied`, or `failed`; the cursor advances to the newest source document when anything applied.
10. **Core builds the report** on request: counts, guardrails, movements, unplannable, errors.
11. **[The worker posts the report to Discord.]** Designed: the main embed, a thread of per-action detail, a CSV attachment.
12. **[The scheduler ticks `pos.reap`]** and core fails any reapable plan with no progress for an hour. Designed caller; the endpoint exists.

## What is historical

- The advisory lock across a long `BackgroundTask` inside core, and the `pos_sync_runs` table; deleted on 2026-07-20 for the job chain and the partial unique index.
- A seed row per enabled connection in `schedules.seed.yaml`; replaced on 2026-07-21 by the static tick with handler-level fan-out.
- The v1 `parent_item_id` reservation on `pos_items`; dropped 2026-07-21.
- Stock actions emitted per invoice line by the planner; since the ledger spec of 2026-07-23 stock is a projection of `base_qoh` and the planner emits none.
- The `SHIPPED` versus `SHIPPED QTY` label and the legacy CLI's ShopKeep export, which the spec leaves on the graftpunk path.

## What was decided, and where

- The orchestrator drives, core executes bounded steps; core touches no job queue. POS spec section 5, 2026-07-20.
- One active plan per connection, enforced by a partial unique index; the in-flight plan is the run. Spec sections 3 and 5.
- Plan create is idempotent on `(connection, trigger, source documents)`; a competing plan is 409 and the caller fetches and drives the active one. Spec section 5.
- Receipts are consumed once: the cursor advances on applied and partially applied, and on a reaped plan with anything applied; a wholly failed plan advances nothing. Spec sections 5 and 7; `applying.py`, `reap.py`.
- Every write is an absolute set-to-target frozen at plan time. Spec section 5.
- Exact matching only; a loud unmatched line beats a silent wrong match. Spec section 5, `matching.py`.
- The default pricing rule is required at enable. Spec section 6, `cli.py`.
- Backfill always parks; `no_nonpositive_prices` is not tunable. Spec section 7 and PR #41.
- The pull is not its own job. Spec section 8.
- Core owns the batch size; the orchestrator never sends a limit. Spec section 5.
- The `pos.sync` workflow registers zero side effects. Spec section 13 and issue #262.
- Tenant equals location in v1; no `location_id`. Spec section 2; core issue #39 tracks the multi-location model.

## What is still open

- When the orchestrator half is built. Issue #262 has no assignee or milestone in the fields read.
- Whether anything runs the core POS code outside tests today. Unverified.
- Interactive Discord approvals, which would replace the `gbc` unlock. Spec section 13.
- The variant, tax, currency, and multi-location questions in core issues #38, #39, and #40.

## Conflicts found, by kind

1. **Designed but not built.** Everything in brackets on the board: the tick, the handlers, the run, the re-enqueue loop, the report post, the alerts.
2. **Intended design differing from implementation.** The spec's `gbc` command list (`connection create|list|enable|disable`, `plan show|approve|reject <id>`, `rules list|set`) versus the shipped commands (`connection`, `rules`, `enable`, `plan-show`, `plan-approve`, `plan-reject` with `--plan-id`); no list or disable command exists.
3. **Docstring differing from code.** `_document_ids_since` says "canonicalized-invoice document ids"; the query filters tenant, type, and `created_at` only.
4. **Reserved column.** `pos_plans.report` is never written or read.

## Findings for the owner

Findings are not decisions. Each is inferred from the code at the SHAs read and none has been observed running.

1. **A plan consumes invoice documents that never canonicalized.** `_document_ids_since` filters by tenant, `document_type`, and `created_at` with no state filter, so a document in `underivative`, `assimilated`, or `failed` is in the plan's `source_document_ids`; `_derive_lines` reads `canonical_snapshot or {}` and yields nothing for it; on drain `advance_plan_cursor` moves the cursor to the max `created_at` of the source documents. A plan with zero actions drains straight to `applied` and advances too. So an invoice that failed at assimilate (the Part 4 teaching stop) and is canonicalized later after the mapping is fixed sits behind the cursor and is never planned unless an operator runs a backfill with `since`. The docstring says canonicalized; the query does not. Verified in `plan_service.py`, `cursor.py`, and `applying.py`.
2. **The orchestrator half does not exist.** No code, config, or schedule entry; issue #262 is the whole of it. The harness already says so; recorded here because the board draws it.
3. **The first plan on a fresh connection is a full history.** `plan_cursor` is NULL at creation, so the first `invoice`-trigger plan selects every invoice the tenant has and auto-approves unless a guardrail parks it. The spec's guarded first run depends on an operator setting `creates_require_review_above` to 0 in `sync_policy` by hand; `gbc pos connection` writes `sync_policy` as `{}`, and no command edits it.
4. **`gbc pos plan-reject` leaves ghost items.** Core issue #42, cited by the code's own `TODO`.
5. **Every `CREATE_ITEM` pages the whole Clover catalog** to look for an existing barcode, because `code` is not a filterable field. Accepted in the code's comment; noted because a first plan with hundreds of creates does it once per create.
6. **Only invoice documents feed plans.** Order confirmations are canonicalized (Part 4) and never planned; `_document_ids_since` filters on `DocumentType.INVOICE`. Documented in the Core Brief.
7. **`sync_policy` and `projection_policy` have no write path but SQL.** No `gbc` command sets either; the CLI writes an empty `sync_policy` and the ORM default `all_tiers`.

## Belongs in another document

- The witness engine, families, movements, compositions, and packaging state are Part 6.
- The `pos.sync` workflow run, the 4-hour reaper, the compensation tripwire, and the alerts are Part 7 material once #262 exists.
- The Clover platform facts beyond what the adapter encodes are out of scope by the harness.

## Reconciled against the harness

The core pieces are drawn as how the system works because they exist in the tree and are pinned by tests; the standing says dev only and the board says nothing about deployment. The orchestrator pieces are drawn bracketed with a TBD badge, the convention the Function names for designed-not-wired. The principles the board cites: P4 the orchestrator drives, core executes (the plan and apply routes); P6 one canonical format is the contract (the tier lines from the canonical snapshot); P7 one ledger number per family, tiers are views (the stock projections); P3 fail loud (the exclusivity 409, the unplannable line, the parked plan); P5 the SaaS invariant (credentials and policy in `pos_connections`, only the master key in env).
