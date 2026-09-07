# Map Brief: Part 5, POS Sync

Written 2026-09-07 in the format at the end of `02 - Tools/Figma/Instructions.md`, in GrocerBot's four-level vocabulary. The nature pass at the end maps each nature to the piece families in `02 - Tools/Figma/Visual Rules.md`. Under the standing instruction to continue without asking, this brief is recorded and then built.

Purpose: a reader should see within ten seconds that core turns the invoices past a connection's cursor into one plan per connection, after pulling what Clover holds and resolving each line into case, pack, and single tiers; that the plan is matched exactly, priced by a rule cascade, checked by guardrails, and either approved on its own or parked for an operator; that applying is a bounded batch of absolute writes to Clover that records every outcome and advances the cursor; and that everything that would drive this from the orchestrator, the tick, the handlers, the loop, and the Discord report, is designed and not built.

Target: file `nBmhDyEDpFPrMq0ztmHDb0`, page VISUAL DOCUMENTATION (`7001:129074`), a new frame below the Part 4 board. Components from SYSTEM LEGEND (`7001:129072`).

Standing: core side dev only, drawn as current; orchestrator side designed and not wired, drawn bracketed with a TBD badge.

## Elements

One per line: name | nature | one-line description | modifiers.

**Actors**

- [Scheduler] | actor, agent | the orchestrator's cron tick that would push `pos.dispatch` | bracketed, TBD
- [Worker] | actor, agent | would run `pos.plan`, `pos.apply`, and `pos.reap` against core | bracketed, TBD
- Core API | actor, agent | the `/v1/pos` surface; system routes for the tick and the reaper | none
- Operator | actor, human | runs `gbc pos`: creates the connection, sets rules, enables, approves or rejects a parked plan | on the parked shelf

**Interfaces**

- Operator terminal | interface, code block | `gbc pos plan-approve --plan-id <id>` or `plan-reject` | Code block convention, on the parked shelf

**Artifacts**

- [Clover sync report] | artifact, Discord message | the designed embed: counts, guardrails, price movements with rationale, a thread of per-action detail, a CSV | bracketed, TBD

**Operations, the rail in order**

- [Ticks pos.dispatch] | operation, trigger | a static system schedule; asks core for enabled connections | bracketed, TBD
- [Lists enabled connections] | operation, view | `GET /v1/pos/connections`, system principal | bracketed
- [Pushes pos.plan] | operation, write | one job per connection, unique on the id; opens a `pos.sync` run | bracketed
- [Calls plan] | operation, write | `POST /v1/pos/connections/{id}/plan` with the trigger and the run id | bracketed; P4 pill
- Selects the documents | operation, route | invoices past `plan_cursor` or `since`; the same key returns the active plan; a different one is 409 | none
- Resolves the families | operation, write | a `product_families` row per vendor and item code, last cost wins; commits first | Part 6 table
- Pulls Clover | operation, view | items modified since the sync high-water mark; link by native id, barcode, sku, else a stray | none
- Witnesses the counts | operation, write | sale witnesses, corrections, anomalies, adoptions, packaging; Part 6 | muted
- Derives tier lines | operation, route | case, pack, single per invoice line with multipliers, suffixed skus, tier costs, base units received | P6 pill
- Matches each line | operation, route | family and tier, then barcode among strays with adoption, then vendor code among strays; exact only | none
- Prices by the cascade | operation, route | item over vendor over category over default; basis points or a fixed price | none
- Plans the actions | operation, write | create (the item row is made now), update cost, update price, unplannable; ordinals | none
- Records receipts | operation, write | one movement per line's single tier, once per document | none
- Projects stock | operation, write | an absolute `UPDATE_STOCK` per tracked tier on this connection, floor of base units over the tier's quantity, drift-gated | P7 pill
- Evaluates guardrails | operation, route | five checks; pass is approved_auto; a breach or a backfill parks | P3 pill
- Parks the plan | operation, route | pending holds the connection's slot | shelf below
- Approves or rejects | operation, action | the operator, by `gbc`; reject is a bare status flip | shelf, ends at the operator
- [Pushes pos.apply] | operation, write | for an approved plan | bracketed, TBD
- Applies a batch | operation, write | fifty actions by ordinal; per-action commit and heartbeat; failures recorded and skipped past | none
- Writes to Clover | operation, output | find before create; post the fields; set stock absolute | none
- [Re-enqueues while more remains] | operation, route | the checkpoint loop | bracketed, loop above the rail
- Closes the plan | operation, write | applied, partially applied, or failed; the cursor advances when anything applied | none
- Builds the report | operation, output | `PlanReport` version 1 on request | none
- [Posts the report] | operation, output | the Discord embed, thread, and CSV | bracketed, TBD; ends at the artifact
- [Ticks pos.reap] | operation, trigger | a second static schedule | bracketed, reap shelf
- Reaps stale plans | operation, write | any active plan except parked with no progress for an hour goes to failed | reap shelf, dead end

**Piping**

- [Orchestrator POS chain] | piping, code | issue #262: `pos.dispatch`, `pos.plan`, `pos.apply`, `pos.reap`, the report renderer, three alerts, the zero-side-effects tripwire | bracketed, TBD
- POS API | piping, code | `api/pos.py`, `_scoping.py`, `report.py`: the five routes, their principals and 404s, the 409s, the report shape | table
- Pull and witness | piping, code | `pull.py` and the witness boundary: the since mark, the three links, the two passes, the commit | none
- Tiering and matching | piping, code | `tiering.py`, `matching.py`, `gtin.py`: multipliers, skus, costs, zeroed receipts; the three legs | none
- Plan service | piping, code | `plan_service.py`, `planning.py`, `cursor.py`: the key, the pre-phase, the build, receipts, projections, ordinals, supersede | none
- Pricing and guardrails | piping, config | `pricing.py`, `guardrails.py`: the cascade and the five checks with their defaults | table
- gbc pos | piping, code | `cli.py`, `credentials.py`: the seven commands, Fernet under `POS_CREDENTIALS_KEY`, the `#42` note | none
- Apply engine | piping, code | `applying.py`, `reap.py`: the appliable set, the batch, per-action truth, the terminal status, the cursor, the reaper | none
- Clover adapter | piping, code | `adapters/clover/`: the client's pacing and retries, the mapping's landmines, find by code and by sku | none
- Clover | piping, external tool | the merchant API: hosts, token, the item, stock, and filter endpoints, the per-token limits | tied horizontally from the adapter

**Data**

- documents | data, table | read side: invoices of the tenant with `created_at` past the cursor, any state; `transactional.line_items` and `sellable_skus` | muted, Part 4
- pos_connections | data, table | the root: tenant, merchant, environment, ciphertext, `sync_policy`, `projection_policy`, `plan_cursor`, enabled | none
- pos_items | data, table | the canonical item: identity, commerce, provenance, family and tier | none
- pos_item_syncs | data, table | per connection: the native id, `synced_field_values` with the stock baseline, status and error | none
- pos_plans | data, table | the run: trigger, status, source documents, guardrail result, checkpoint, `last_progress_at`, `workflow_run_id`; one active per connection | none
- pos_pricing_rules | data, table | scope type and value, `markup_bps` or `fixed_price`; the default row is required | none
- product_families | data, table | Part 6: `base_qoh`, `unit_cost`, `packaging_state` | muted
- pos_plan_actions | data, table | kind, item, `field_changes` from and to, rationale, reason, status, error, ordinal | none
- inventory_movements | data, table | Part 6: receipt, sale witness, correction, anomaly | muted
- sellable_compositions | data, table | Part 6: one edge per tier item, the multiplier | muted

**Principles**

- P4 · The orchestrator drives, core executes | principle | on [Calls plan]
- P6 · One canonical format is the contract | principle | on Derives tier lines
- P7 · One ledger number per family, tiers are views | principle | on Projects stock
- P3 · Fail loud | principle | on Evaluates guardrails

## Groupings

- Part 5 frame | part frame | everything above
- Designed, not wired | cluster | every bracketed piece; a chapter caption naming issue #262 above the rail's start and again above the apply push
- The plan build | cluster | a chapter caption from Selects the documents to Evaluates guardrails
- Shelves | cluster | the parked shelf under Evaluates guardrails with the operator and the terminal; the reap shelf after Closes the plan
- The loop | cluster | a line above the rail from after Writes to Clover back to before Applies a batch

## Relationships

- [Ticks] -> [Lists] -> [Pushes pos.plan] -> [Calls plan] -> Selects -> Resolves -> Pulls -> Witnesses -> Derives -> Matches -> Prices -> Plans -> Records receipts -> Projects stock -> Evaluates -> [Pushes pos.apply] -> Applies -> Writes to Clover -> Closes -> Builds the report -> [Posts the report] | flow | the rail
- Evaluates -> Parks the plan -> Operator -> Approves or rejects | flow | branch, the parked shelf
- Writes to Clover -> Applies a batch | feedback | [the checkpoint loop], above the rail
- [Ticks pos.reap] -> Reaps stale plans | flow | the reap shelf, dead end
- [Ticks] -> [Orchestrator POS chain] card; [Calls plan] -> POS API card; Pulls -> Pull and witness card; Derives -> Tiering and matching card; Plans -> Plan service card; Evaluates -> Pricing and guardrails card; Approves -> gbc pos card (from the shelf); Applies -> Apply engine card; Writes to Clover -> Clover adapter card | tie
- Clover adapter card -> Clover card | tie, horizontal
- POS API card -> pos_connections; Pull and witness card -> pos_items; Pull and witness card -> pos_item_syncs (one bend); Plan service card -> pos_plans; Pricing and guardrails card -> pos_pricing_rules; Apply engine card -> pos_plan_actions | tie

Reading order: left to right. The designed tick and push, core's plan build in eleven steps with the parked shelf under the guardrails, the designed apply push, the apply with its loop, the close, the report, and the designed post; the reap shelf at the end.

Color semantics beyond the standard planes: none. Muted pieces at opacity 0.55. Bracketed pieces at full opacity with a grey TBD badge.

Undecided:

- Whether the designed orchestrator pieces belong on this board at all, or on Part 7's. Drawn here bracketed because the spec's section 2 diagram puts them in this part.
- The TBD badge has no legend piece; drawn as a grey Color Tag reading TBD · DESIGNED, NOT WIRED. Visual Rules open item.
- Whether the witness step should appear on this rail or only on Part 6's. Drawn muted because the pull runs it.

## Nature pass

| Nature used here | Family in Visual Rules | Match |
| --- | --- | --- |
| actor, agent, bracketed | Actor, Agent, name in brackets | match; the name pill takes any text |
| actor, agent | Actor, Agent, designation Core API | match; Part 4 used it |
| actor, human | Actor, Internal Human, designation Operator | match |
| interface, code block | Interface, Code block convention (open item 4) | match; a CLI line this time |
| artifact, Discord message, bracketed | Artifact | match; the shell with a bracketed title |
| operation, all acts | Operation | match; View for the listing and the pull |
| piping, code / config | Piping Runner and Router cards | match |
| piping, external tool | External Tool card | match; the Clover mark exists |
| data, table | Data card per section 5 | match |
| principle | Color Tag rebound to Principles | match; P7 appears for the first time |
| TBD badge | none | gap; drawn as a grey Color Tag, recorded as open |
| feedback loop | a line above the rail, the Part 3 convention | open item 13 |

One gap, the TBD badge, drawn as a grey Color Tag.
