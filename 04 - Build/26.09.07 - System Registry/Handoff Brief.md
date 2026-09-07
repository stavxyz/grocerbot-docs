# Map Brief: System Registry

Purpose: a reader finds any named thing in GrocerBot's documentation in one place, sees what it is in one line, and knows which boards to open for its full instance.
Target: SYSTEM REGISTRY page, `7001:129073`. Empty at task start, confirmed live.

This brief extends the standard element line with four fields the registry needs and the boards do not: `kind` (the KIND cell), `host` (the Location mark, or none), `where` (the boards the entry appears on), and `specimen` (the board node cloned as the entry's card, or none). The build script is generated from these lines, so the line is the content.

Elements (one per line): `name | band | kind | description | host | where | specimen | modifiers`

## Principles
- Deterministic and rule-based | principles | P1 | No AI in the loop; rules are explicit and behaviour predictable. | none | P1 · P2 · P6 · P7 | 9054:1773 | none
- Publish before save | principles | P2 | A poll publishes its events before it saves the snapshot; nothing is lost. | none | P1 · P3 | 9054:1775 | none
- Fail loud | principles | P3 | Transient errors retry; misconfigurations and bad shapes raise and stop. | none | P1 · P2 · P3 · P4 · P5 · P6 · P7 | 9054:1777 | none
- The orchestrator drives, core executes | principles | P4 | Whoever owns the workflow drives it; core is request and response only. | none | P3 · P4 · P5 | pill:p4@9073:2997 | none
- The SaaS invariant | principles | P5 | No tenant-varying value comes from process env; tenant state is in the DB. | none | P1 · P2 · P4 | 9054:1771 | none
- One canonical format is the contract | principles | P6 | Vendor mess is cleaned before the boundary; POS specifics come after it. | none | P4 · P5 · P6 | pill:p6@9084:4121 | none
- One ledger number per family | principles | P7 | Base units are the stored truth; tiers are views; packaging is witnessed. | none | P5 · P6 | pill:p7@9095:6740 | none

## Actors
- Operator | actors | HUMAN | One of the two people who run gbo and gbc, read #ops, and fix by hand. | none | P1 · P4 · P5 · P7 | 9041:654 | none
- Store staff | actors | HUMAN | Set the forwarding rule, read the tenant channel, sell and recount. | none | P2 · P3 · P6 | 9061:1793 | none
- Vendor | actors | EXTERNAL | BEK's systems emailing the store's Gmail. | none | P2 | 9061:1776 | none
- Init | actors | AGENT | One-shot container at every deploy: env check, migrations, seed. | none | P1 | 9041:537 | none
- Scheduler | actors | AGENT | The 60-second tick over the schedules table; six system schedules. | none | P1 · P5 · P7 | 9041:558 | none
- Browser worker | actors | AGENT | Chromium under s6-overlay; polls, logs in, and augments against BEK. | none | P1 · P2 · P3 | 9041:585 | none
- Worker | actors | AGENT | The lightweight Faktory worker on queues core and default. | none | P2 · P3 · P4 · P5 · P7 | 9061:1830 | none
- Notifier | actors | AGENT | The events stream consumer: group notifier, one consumer. | none | P1 · P2 · P3 | 9074:2997 | none
- API | actors | AGENT | The orchestrator's FastAPI service behind the Cloudflare Tunnel. | none | P2 | 9061:1816 | none
- Email worker | actors | AGENT | The Cloudflare Worker invoked by Email Routing, prod and dev. | none | P2 | 9061:1802 | none
- Core API | actors | AGENT | grocerbot-core, FastAPI: the trusted caller's request and response service. | none | P4 · P5 · P6 | 9085:4135 | none

## Interfaces
- gbo | interfaces | CLI | The orchestrator's operator CLI: trigger, reset, status, provenance. | GitHub | P1 · P7 | 9041:696 | none
- gbc pos | interfaces | CLI | Core's CLI for POS: connections, rules, plan approve and reject. | GitHub | P5 | 9092:5737 | none
- Core HTTP for mappings | interfaces | HTTP | PUT /v1/vendors/{vendor}/mappings; the only way to teach a mapping. | GitHub | P4 | 9085:4398 | none
- Gmail forwarding rule | interfaces | SETTINGS | The store's Gmail forwards to orderconfirmations@{tenant}.grocerbot.net. | Gmail | P2 | 9061:1872 | none
- The ops channel | interfaces | CHANNEL | #ops: the pings, the twice-daily summary, and the alerts. | Discord | P1 · P4 · P7 | none | captioned on the boards, no card
- The tenant channel | interfaces | CHANNEL | #bek in prod: notifications and order confirmations for the store. | Discord | P3 | none | captioned on the boards, no card
- Faktory web UI | interfaces | WEB UI | Queues, retries, and the dead set; every job labelled with its source. | Faktory | P1 · P7 | none | captioned on the boards, no card
- OpenObserve dashboards | interfaces | WEB UI | Logs, traces, metrics, and the seven alerts, behind a Cloudflare tunnel. | OpenObserve | P7 | none | captioned on the boards, no card

## Artifacts
- Ops alert | artifacts | MESSAGE | The amber ping when a poll's parser fails, into the ops channel. | Discord | P1 | 9041:699 | none
- Forwarding Confirmed | artifacts | MESSAGE | Green embed with Source and Destination; red with the link on failure. | Discord | P2 | 9061:73178 | none
- The primary embed | artifacts | MESSAGE | The BEK notification: headline, issues, meta, item rows, footer, PDF. | Discord | P3 | 9074:74380 | none
- The thread | artifacts | THREAD | Named by the headline: overflow items, a summary embed, the JSON file. | Discord | P3 | 9074:74385 | none
- The teaching ping | artifacts | MESSAGE | The 422 teaching stop: vendor, document, unmapped columns, what to do. | Discord | P4 | 9085:4393 | none
- [Clover sync report] | artifacts | MESSAGE | Designed: counts, guardrails, price movements, a thread, a CSV. | Discord | P5 | 9092:5732 | bracketed, TBD
- The ops summary | artifacts | MESSAGE | The twice-daily digest: a status line, a field per class and job type. | Discord | P7 | 9104:7914 | none
- The alert | artifacts | MESSAGE | OpenObserve's red embed: name, stream, matched count, threshold, window. | Discord | P7 | 9104:7919 | none

## Piping
- Init | piping | RUNNER | One-shot container at every deploy: env check, migrations, plugins, seed. | GitHub | P1 · P7 | 9042:677 | none
- Scheduler | piping | RUNNER | A 60-second tick over the schedules table; due schedules become jobs. | GitHub | P1 · P5 · P7 | 9042:760 | none
- Faktory | piping | QUEUE | The job server; workers pull what the scheduler and the handlers push. | Faktory | P1 · P2 · P3 | 9042:880 | none
- Browser worker | piping | RUNNER | Chromium and Xvfb under s6-overlay; the only process that talks to BEK. | GitHub | P1 | 9043:841 | none
- BEK portal | piping | EXTERNAL | bekentree.com, Akamai-protected, reached only through the browser session. | BEK | P1 · P3 | 9043:945 | none
- Session recovery | piping | CODE | Reactive browser.login when a poll or augment finds a dead session. | GitHub | P1 | 9043:990 | none
- Diff engine | piping | CODE | diff.py driven by pipelines/bek.yaml: extract, filter, key, checksum, compare. | GitHub | P1 | 9043:72199 | none
- Emitter | piping | CODE | pipelines/emit.py: one envelope shape for every source, poll or email. | GitHub | P1 · P2 | 9043:72281 | none
- Gmail | piping | EXTERNAL | The store's mailbox; staff forward vendor mail from here. | Gmail | P2 | 9062:1960 | none
- Email worker | piping | RUNNER | The Cloudflare Worker: stores the raw email to R2, calls the webhook. | Cloudflare | P2 | 9062:2034 | none
- API webhook | piping | RUNNER | The FastAPI service on the droplet, behind the Cloudflare Tunnel. | GitHub | P2 | 9062:2231 | none
- Worker · process_email | piping | RUNNER | The lightweight worker on queues core and default; the email job. | GitHub | P2 | 9063:2202 | none
- Resolver | piping | ROUTER | tenant.py: three lookups in a fixed order, then the email type. | GitHub | P2 | 9063:2417 | none
- Rules engine | piping | ROUTER | email_rules.py and the action registry: glob patterns to actions. | GitHub | P2 | 9063:73666 | none
- Auto-confirm | piping | CODE | Clicks Google's forwarding confirmation link so no human is needed. | GitHub | P2 | 9063:73845 | none
- Notifier | piping | RUNNER | The notifier container: one consumer on the events stream. | GitHub | P1 · P2 · P3 | 9075:3166 | none
- Routes and triggers | piping | ROUTER | pipelines/bek.yaml as the notifier reads it: event type to stage. | GitHub | P3 | 9075:3387 | none
- Augment | piping | CODE | tasks/augment.py on the browser worker: fetches order and invoice. | GitHub | P3 | 9075:3612 | none
- Discord notify | piping | CODE | tasks/discord_notify.py: the terminal job that posts the embed. | GitHub | P3 | 9075:75081 | none
- Embed builder | piping | CODE | bek_canonical in the BEK plugin, plus the thread builders. | GitHub | P3 | 9075:75245 | none
- Discord | piping | EXTERNAL | Discord's REST API, version 10, called with the bot token. | Discord | P3 | 9075:75400 | none
- Canonicalize task | piping | CODE | tasks/canonicalize.py on the worker: consumes .augmented, drives core. | GitHub | P3 · P4 | 9086:4272 | none
- Core client | piping | CODE | clients/core.py, hand-written over httpx; the routes it calls. | GitHub | P4 | 9086:4478 | none
- Format and parse | piping | CODE | format_detection.py, stages/parse.py, parse_pdf.py: pure functions. | GitHub | P4 | 9086:4659 | none
- Upload and scoping | piping | CODE | api/invoices.py _do_upload and _scoping.py: one handler, the gates. | GitHub | P4 | 9086:4785 | none
- Cloudflare R2 | piping | EXTERNAL | The document store: S3Storage over the R2 endpoint. | Cloudflare R2 | P4 | 9086:5042 | none
- Assimilate | piping | CODE | stages/assimilate.py: maps vendor columns onto canonical names. | GitHub | P4 | 9086:5113 | none
- Ops ping | piping | CODE | ops_ping.py and unique_jobs.py: the alert the teaching stop sends. | GitHub | P4 | 9086:5316 | none
- Seed and mappings | piping | CONFIG | seed.py and api/vendors.py: where a vendor's mappings come from. | GitHub | P4 | 9086:5467 | none
- Canonicalize stage | piping | CODE | stages/canonicalize.py with upc, eaches, SKU explosion, metadata. | GitHub | P4 | 9086:5562 | none
- Policies | piping | CONFIG | canonicalize/policy.py: one policy per document type. | GitHub | P4 | 9086:5746 | none
- [Orchestrator POS chain] | piping | DESIGNED | The designed dispatch, plan, apply, and reap jobs; not built. | GitHub | P5 | 9094:5582 | bracketed, TBD
- POS API | piping | CODE | api/pos.py, _scoping.py, report.py: the /v1/pos surface. | GitHub | P5 | 9094:5742 | none
- Pull and witness | piping | CODE | pull.py with witness.py at its boundary: the sensor read. | GitHub | P5 · P6 | 9094:5923 | none
- Tiering and matching | piping | CODE | tiering.py, matching.py, gtin.py: tier lines and their matches. | GitHub | P5 · P6 | 9094:6094 | none
- Plan service | piping | CODE | plan_service.py, planning.py, cursor.py: builds and parks a plan. | GitHub | P5 · P6 | 9094:6272 | none
- Pricing and guardrails | piping | CONFIG | pricing.py, guardrails.py: the cascade and the five checks. | GitHub | P5 | 9094:6460 | none
- gbc pos | piping | CODE | cli.py, credentials.py: the operator's seven POS commands. | GitHub | P5 | 9094:6604 | none
- Apply engine | piping | CODE | applying.py, reap.py: writes the plan to the POS and reaps. | GitHub | P5 · P6 | 9094:6792 | none
- Clover adapter | piping | CODE | adapters/clover/: client.py, mapping.py, adapter.py. | GitHub | P5 | 9094:6954 | none
- Clover | piping | EXTERNAL | The merchant API, v3: the native POS and the inventory sensor. | Clover | P5 · P6 | 9094:7145 | none
- Ledger | piping | CODE | inventory/ledger.py: base units only; get-or-create, resolve, record. | GitHub | P6 | 9097:7217 | none
- Witness engine | piping | CODE | pos/witness.py: turns pull evidence into the four movements. | GitHub | P5 · P6 | 9097:7570 | none
- Ledger tests | piping | CODE | tests/test_inventory and tests/test_pos: the pins as sentences. | GitHub | P6 | 9097:7744 | none
- Projection | piping | CODE | inventory/projection.py and the pass in plan_service.py: tier views. | GitHub | P6 | 9097:7938 | none
- Workflow wrapper | piping | CODE | The decorator around every handler: attempts, classification, budgets. | GitHub | P3 · P7 | 9105:7805 | none
- Execution and enqueue audit | piping | CODE | execution.py and enqueue.py: one row per run and one per push. | GitHub | P7 | 9105:7957 | none
- Unique jobs | piping | CODE | unique_jobs.py and jobs.py: the app-side locks and their two modes. | GitHub | P7 | 9105:8103 | none
- Workflow runs | piping | CODE | runs.py, side_effects.py, registry.py: the state machine. | GitHub | P7 | 9105:8283 | none
- Compensation | piping | ROUTER | workflows/compensation/: dispatch, the registries, the dedup ratchet. | GitHub | P7 | 9105:8473 | none
- Backstops | piping | CODE | The timeout reaper and the DLQ monitor. | GitHub | P7 | 9105:8816 | none
- Kernel tasks | piping | CODE | ops_summary, ops_ping, phantom_reconciliation, system_metrics_dedup. | GitHub | P7 | 9105:8952 | none
- Telemetry | piping | CODE | logging_config.py, telemetry.py, fluent-bit, the Faktory exporter. | GitHub | P7 | 9105:9134 | none
- OpenObserve | piping | EXTERNAL | One node per droplet: sqlite metadata, parquet on R2, 90-day retention. | OpenObserve | P7 | 9105:9239 | none
- Operator surfaces | piping | CODE | cli.py (gbo), api.py, the Faktory web UI, the OpenObserve dashboards. | GitHub | P7 | 9105:9396 | none

## Data
- vendors (orchestrator) | data | ORCH · TABLE | Vendor registry, reconciled from the seed YAML at every deploy. | PostgreSQL | P1 | 9043:72453 | none
- schedules | data | ORCH · TABLE | Cron schedules, seeded on every init; the scheduler reads and advances them. | PostgreSQL | P1 · P7 | 9043:72543 | none
- snapshots | data | ORCH · TABLE | The last polled collection per vendor and data type; the diff baseline. | PostgreSQL | P1 | 9043:72930 | none
- email_arrivals | data | ORCH · TABLE | One row per arrival, duplicate or not, resolved or not. | PostgreSQL | P2 | 9065:2780 | none
- job_enqueues | data | ORCH · TABLE | One row per push that happened; source, label, trace id. | PostgreSQL | P1 · P2 · P3 · P7 | 9106:9356 | none
- job_executions | data | ORCH · TABLE | One row per handler run, from every decorated handler on both workers. | PostgreSQL | P1 · P2 · P3 · P7 | 9106:8526 | none
- workflow_runs | data | ORCH · TABLE | One operation end to end: a poll, or one emitted event under it. | PostgreSQL | P1 · P3 · P7 | 9106:8802 | none
- workflow_side_effects | data | ORCH · TABLE | One compensable action per row; read by the compensation dispatch. | PostgreSQL | P3 · P7 | 9106:8959 | none
- tenants | data | CORE · TABLE | Core's tenant rows: the id and display name the task resolves to. | PostgreSQL | P4 | 9086:77239 | none
- documents | data | CORE · TABLE | One row per upload, formerly invoices: identity, type, state, snapshots. | PostgreSQL | P4 · P5 | 9086:77357 | none
- audit_log | data | CORE · TABLE | A stage audit table with a model and a migration, and no writer. | PostgreSQL | P4 | 9086:77670 | muted, no writer
- vendors (core) | data | CORE · TABLE | Four seeded rows: adapter type, column and metadata mappings, settings. | PostgreSQL | P4 | 9086:77918 | none
- tenant_vendor_settings | data | CORE · TABLE | One row per tenant and vendor pair, lazily created on PUT. | PostgreSQL | P4 | 9086:78057 | none
- pos_connections | data | CORE · TABLE | The root aggregate: tenant, merchant, credentials, policies, cursor. | PostgreSQL | P5 · P6 | 9094:78437 | none
- pos_items | data | CORE · TABLE | The canonical item, from an invoice or from a pull. | PostgreSQL | P5 · P6 | 9094:78601 | none
- pos_item_syncs | data | CORE · TABLE | Per connection and item: the native id and the last values written. | PostgreSQL | P5 · P6 | 9094:78758 | none
- pos_plans | data | CORE · TABLE | The run record: trigger, status, guardrail result, checkpoint. | PostgreSQL | P5 | 9094:78890 | none
- pos_pricing_rules | data | CORE · TABLE | Pricing data per tenant, not config: scope, markup or fixed price. | PostgreSQL | P5 | 9094:79054 | none
- pos_plan_actions | data | CORE · TABLE | One row per decision: kind, item, field changes, rationale, status. | PostgreSQL | P5 · P6 | 9094:79304 | none
- product_families | data | CORE · TABLE | The unit of inventory truth: one base-unit balance per family. | PostgreSQL | P5 · P6 | 9097:79408 | none
- inventory_movements | data | CORE · TABLE | The append-only stream: four kinds, signed base units, provenance. | PostgreSQL | P5 · P6 | 9097:79554 | none
- sellable_compositions | data | CORE · TABLE | The DAG edge: selling one of this item consumes base units of a family. | PostgreSQL | P5 · P6 | 9097:79283 | none
- unique locks | data | REDIS · KEY | The app-side unique-jobs lock in the orchestrator's Redis; two modes. | Redis | P1 · P4 · P7 | 9106:8672 | none
- browser login keys | data | REDIS · KEY | Recovery guards, per vendor: pending and last success. | Redis | P1 | 9043:72870 | none
- dedup keys | data | REDIS · KEY | One key per real-world event within 24 hours; the value is seen. | Redis | P1 · P2 · P3 · P7 | 9043:73013 | none
- events stream | data | REDIS · STREAM | The one stream every source publishes to; the notifier consumes it. | Redis | P1 · P2 · P3 · P4 | 9043:73080 | none
- email dedup keys | data | REDIS · KEY | The 30-day memory of what has arrived. | Redis | P2 | 9065:2989 | none
- invoice blob cache | data | REDIS · KEY | Two short-lived blobs augment leaves for the jobs behind it. | Redis | P3 · P4 | 9076:3984 | none
- attempt counters | data | REDIS · KEY | The wrapper's own count of Faktory attempts, per job id, 24 hours. | Redis | P3 · P7 | 9106:8403 | none
- Faktory dead set | data | REDIS · SET | Faktory's own sorted set, in Faktory's bundled Redis, read over TCP. | Redis | P7 | 9106:9230 | none
- graftpunk session | data | R2 · OBJECT | The encrypted BEK browser session graftpunk's S3 backend stores. | Cloudflare R2 | P1 | 9043:72803 | none
- raw emails | data | R2 · OBJECT | Every inbound message, stored by the Worker before anything else. | Cloudflare R2 | P2 | 9065:2518 | none
- attachments | data | R2 · OBJECT | PDFs the destination rules file; no reader today. | Cloudflare R2 | P2 | 9065:3119 | none
- document object | data | R2 · OBJECT | The uploaded bytes, kept as received; written by upload, read by parse. | Cloudflare R2 | P4 | 9086:77535 | none
- OpenObserve data | data | R2 · OBJECT | OpenObserve's parquet on R2; sqlite metadata on the droplet's volume. | Cloudflare R2 | P7 | 9106:9622 | none

Groupings:
- Registry Charter | charter sheet | title, intro, six numbered sections
- Principles | band | title, definition, list of 7, cards of 7 pills
- Actors | band | title, definition, list of 11, cards of 11 actors
- Interfaces | band | title, definition, list of 8, cards of 4 code blocks
- Artifacts | band | title, definition, list of 8, cards of 8 artifacts
- Piping | band | title, definition, list of 55, cards of 55 Piping cards
- Data | band | title, definition, list of 35, cards of 35 Data cards

Relationships: none drawn. The WHERE column is the pointer from an entry to its boards; the boards keep the full instance.

Reading order: the charter at the left; then the six bands top to bottom in the order above, each band read as the list at the left and the specimens to its right in list order.

Color semantics beyond the standard planes: the KIND cell is a Color Tag. Principles rows carry the principle pill itself, cut to its number. Actor and interface kinds are grey. Artifact kinds are blue. Piping kinds are brown, with EXTERNAL and DESIGNED grey. Data kinds are pink. No new colour.

Undecided: the bracketed orchestrator POS chain and the Clover sync report (Part 5, issue #262), carried bracketed; whether the four card-less interfaces should be drawn as cards on their boards; whether operations get a band; whether the registry pass becomes a step in the Function doc.

## Nature pass

| Element | Nature | Treatment | Modifiers |
| --- | --- | --- | --- |
| Charter | a sheet of prose | the legend's charter sheet: white, radius 8, one column of headings and body | none |
| Band title and definition | text | Section Title over one Body line, as on the example registry | none |
| List row | a registry row | no treatment in Visual Rules section 4; adopted from the example registry: a 1200-wide table with KIND, NAME, DESCRIPTION, HOST, WHERE; recorded as open item 15 | none |
| KIND cell | a tag | Color Tag, colour per band as above | none |
| HOST cell | a location | Tools mark, text only | none |
| Principle specimen | a principle | the orange Record pill from its board | none |
| Actor specimen | an actor | the Actor instance from its board | none |
| Interface specimen | an interface | the Code block from its board | four rows have none |
| Artifact specimen | an artifact | the artifact frame from its board | one bracketed |
| Piping specimen | a Piping or External Tool card | the card from its board | one bracketed with its TBD badge |
| Data specimen | a Data card | the card from its board | one muted |

Gap: the list row. The Visual Rules have no registry treatment; the example's geometry and type are used as the working treatment and the choice is recorded for Sam.
