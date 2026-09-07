# Harness

What GrocerBot is now, and the standard the visual documentation reconciles against.

Written 2026-09-06 from a full read of the code and design records at the SHAs listed under Sources at the end. This is the aim, per `Logic - Reasoning.md`, not proven fact: it describes version 2 in its intended full shape and stamps each part with a standing. Standings live here in text only. Boards show the design; they do not track deploy status.

The four standings used below:

- **live**: running in production according to the repo's own records. Not verified against the droplets in this session.
- **dev only**: merged to the branch of record, `dev`, but not confirmed deployed to production.
- **designed, not wired**: implemented on one side of a boundary with the other side unbuilt, or built with no surface that reaches it. Drawn in brackets or marked TBD on boards.
- **version 1**: the legacy shape. Never drawn as current.

---

## 1. What the system is now

GrocerBot is a deterministic, rule-based system of systems for an independent grocery store. It watches vendor portals and vendor email, turns what it sees into events, notifies staff in Discord, normalises vendor documents into one canonical format, and, in its newest part, pushes item, cost, price, and stock changes into the store's point of sale while keeping a base-unit inventory ledger. There is no AI anywhere in the automation loop. It is built multi-tenant so it can become a SaaS product, and today it has one tenant, `freco`, and one live vendor, `bek`.

The system is two services plus the plumbing between them:

- **grocerbot-orchestrator** drives. It schedules, polls, ingests email, diffs, routes, retries, notifies, and observes. It talks to the vendor side: the BEK portal through the graftpunk BEK plugin, and vendor email through a Cloudflare Worker.
- **grocerbot-core** executes bounded steps. It owns the canonical document pipeline, tenancy, the POS subsystem, and the inventory ledger, as a request and response FastAPI service. It talks to the POS side: Clover.

The rule that splits them, stated in the POS design and enforced in review: the orchestrator drives and holds no business logic; core holds the business logic and touches no job queue. Canonical data meets in the middle.

### The four levels

The documentation is built at four levels. There is no Function or Logic level, because there are no AI calls to describe with a trigger, prompt, inputs, outputs, and logic blocks.

**Principles.** Seven stated engineering rules that the code and specs enforce by name. One sheet each. They are the test a reviewer applies when a board looks wrong.

1. Deterministic and rule-based. No AI in the automation loop. Discord is the primary staff interface. (`grocerbot-orchestrator/README.md`, `docs/plans/2025-02-04-orchestrator-design.md`)
2. Event-driven, producers decoupled from consumers. Publish before save: a poll publishes its change events before it saves the new snapshot, so a failed publish is rediscovered on the next poll instead of lost. (`src/orchestrator/tasks/vendor_poll.py`)
3. Fail loud. Transient failures raise for retry. Misconfigurations, contract violations, and data-shape errors raise `NonRetryableError` and stop, because a misconfig plus infinite retry is a silent outage. (`grocerbot-orchestrator/CLAUDE.md`, `src/orchestrator/workflows/errors.py`)
4. The orchestrator drives, core executes. Whoever owns the workflow drives its continuation. No POS business logic in the orchestrator, ever; core is a pure request and response service. (`grocerbot-core/docs/superpowers/specs/2026-07-18-clover-pos-subsystem-design.md`)
5. The SaaS invariant. No tenant-varying value is read from process environment. Tenant and connection state live in the database; process env carries only infrastructure config. (same spec, section 2 and 9)
6. One canonical format is the contract. Vendor mess is cleaned before the boundary; POS specifics happen after it. Money is integer cents, UPCs are digits, pack sizes are structured. (`grocerbot-core/CLAUDE.md`, `src/core/domain/models.py`)
7. One ledger number per product family; tiers are views. Base units are the only stored inventory truth. Summing tier quantities is always wrong. Packaging state is witnessed, never declared. (`grocerbot-core/docs/superpowers/specs/2026-07-23-inventory-ledger-unitization-design.md`)

**Process.** Who acts, where, on what, and what moves between them. The pieces are Actor, Interface, Connection, and Artifact, carried over from the method. Whether the word for the links is Connection or Action is open; see the lexicon.

- Actors, human: the two operators, who run the CLIs, read the ops channel, and approve parked plans; store staff and buyers, who read the tenant channels. Roles beyond the `buyers` Discord role key are not named anywhere in the code.
- Actors, external systems: the BEK portal (bekentree.com), Clover, Discord, Cloudflare (Email Routing, Workers, R2, Tunnel), Gmail (only for auto-confirming forwarding).
- Actors, agents (the running processes): scheduler, worker, browser worker, notifier, API, init, the Cloudflare email worker, and the core service. Twelve compose services in total once redis, faktory, faktory-exporter, postgres, fluentbit, and openobserve are counted.
- Interfaces: the tenant Discord channels (notifications and order confirmations, today one channel), the ops summary channel, the forwarding-confirmation channel; the `gbo` CLI (trigger, reset, status, provenance); the `gbc pos` CLI (connection, rules, enable, plan show, approve, reject); the Faktory web UI; the OpenObserve dashboards and alerts; the orchestrator API (health, email webhook, monitoring); the core API.
- Artifacts: the Discord embed with its thread and JSON attachment; the invoice PDF and CSV pulled from the portal; the canonical document with its three snapshots; the plan and its report; the ops summary embed; the ops alert.

**Data.** Two Postgres databases, Redis, and R2.

- Orchestrator Postgres: `vendors`, `schedules`, `snapshots`, `job_executions`, `job_enqueues` (with the view `v_job_executions_with_enqueue`), `email_arrivals`, `workflow_runs`, `workflow_side_effects`, `_migrations`. Numbered SQL migrations 001 to 019 with 017 and 018 absent by history.
- Core Postgres, Alembic: `tenants`, `vendors`, `tenant_vendor_settings`, `documents`, `audit_log`; the POS tables `pos_connections`, `pos_items`, `pos_item_syncs`, `pos_pricing_rules`, `pos_plans`, `pos_plan_actions`; the ledger tables `product_families`, `inventory_movements`, `sellable_compositions`.
- Redis: the `events` stream with consumer group `notifier`; dedup keys in two shapes (`dedup:v2:{tenant}:{vendor}:{business_event}:{entity_id}` and the legacy `dedup:{tenant}:{vendor}:{data_type}:{identity}`); email dedup keys with a 30-day TTL; unique-job locks; per-jid attempt counters; short-lived blob cache for invoice PDFs and CSVs.
- R2: raw emails and attachments; core's invoice files keyed `{tenant}/{vendor}/{document}/{file}`; graftpunk session state; OpenObserve parquet.

**Piping.** The plain code and infrastructure that moves things between Process steps and carries no business meaning of its own: Faktory queues (`core`, `default`, `graftpunk-http`, `graftpunk-browser`); the Redis stream and its consumer; the canonical event envelope and dedup registration; unique-job locks; the workflow run and side-effect records; the Cloudflare email worker and the webhook; the generated core client; the graftpunk BEK plugin and browser session recovery; the two migration runners; seed reconciliation; the `${discord.*}` config substitution; the CI-written `.env`; OTel, fluentbit, and the faktory exporter.

The hard call at this level, and the one the first board will settle: where a Process step ends and Piping begins when everything is code. The working test is whether the thing changes what a human sees or what the store owns. A poll that finds a new order is Process. The queue that carries the job is Piping.

### The seven parts

A run is invoked on one part. Each part is the unit a spoken request resolves to.

**1. Vendor portal monitoring.** *live.* Cron schedules seeded from YAML into the `schedules` table; the scheduler fans one `vendor.poll` per subscribing tenant every 30 minutes for BEK notifications, cart, orders, invoices, and delivery dates. The browser worker runs the poll through the graftpunk BEK plugin, extracts a collection, diffs it against the stored snapshot per item or per whole collection, emits one canonical event per new or changed item, then saves the snapshot. A stale portal session enqueues `browser.login`, guarded by a per-vendor pending slot.

**2. Email ingestion.** *live.* Vendor email to `{type}@{tenant}.grocerbot.net` hits the Cloudflare Worker, which stores the raw `.eml` in R2 and posts a webhook. The worker job dedups on Message-ID with a 30-day window, resolves tenant from recipient domain, vendor from sender domain, and email type from subject and attachment regexes, evaluates glob rules, stores attachments, and runs actions: emit a domain event, trigger a vendor poll, or auto-confirm Gmail forwarding. Every arrival is recorded in `email_arrivals`. The Gmail polling path in the code is dead: registered by no worker, enqueued by nothing.

**3. Notification delivery.** *live.* The notifier consumes the stream and matches each event against per-vendor pipeline config. A raw event with an augment trigger becomes an `augment` job on the browser worker, which fetches order detail, invoice list and detail, and caches the invoice PDF and CSV in Redis. An augmented event with a canonicalize trigger becomes a `canonicalize` job (part 4). A canonicalized event matching a route becomes a `discord.notify` job, which renders the named embed builder into a primary message, a thread, overflow embeds, and a JSON attachment, with the PDF attached when present. Duplicates are suppressed at the first post-emit consumer using the `seen` counter. Mentions are configured but both mention maps are empty in prod and dev, so none render today.

**4. Document canonicalization.** *live.* The orchestrator's `canonicalize` job uploads the cached CSV to core under the tenant's core UUID and drives upload, parse, assimilate, canonicalize, then reads back the canonical snapshot and publishes the canonicalized event. In core, upload detects format, parses inline, extracts the document's identity from header rows via the vendor's metadata mappings, dedups on tenant, vendor, document type, and identity, and stores the bytes in R2. Assimilate maps vendor columns to canonical names and returns a 422 teaching response listing unmapped columns when the vendor has no mapping; the orchestrator turns that into an ops alert and stops. Canonicalize types the values, explodes sellable SKUs by slash count in the pack description, extracts metadata, cross-checks the customer number against tenant vendor settings, and projects into the three facets Document, Transactional, and Financial. Two document types exist: invoice and order confirmation.

**5. POS sync.** *core side dev only; orchestrator side designed, not wired.* Per POS connection, core pulls current Clover items into canonical form, matches each invoice line by family and tier, then GTIN-14 barcode, then vendor item code, prices through a most-specific-wins cascade of tenant rules in basis points with a required default floor, and builds a plan of create, update cost, update price, update stock, and unplannable actions. Guardrails evaluate at plan time; a pass auto-approves, a breach parks the plan pending human approval via `gbc`, and backfills always park. Apply drains actions in bounded batches with absolute set-to-target writes, records per-action outcomes, and advances the connection's plan cursor when receipts were consumed. A reap sweeps stale active plans. A partial unique index holds one active plan per connection. The design gives the orchestrator two job types, `pos.dispatch` and `pos.plan` chaining into `pos.apply` and `pos.reap`, and a Discord plan report; none of that exists in the orchestrator yet. Only invoices feed plans; order confirmations do not.

**6. Inventory ledger.** *designed, not wired.* Product families hold one base-unit quantity and unit cost per tenant, vendor, and vendor item code. Receipts from plan builds append movements. Tier quantities are projections, `floor(base_qoh / composition qty)`, emitted as stock actions. The witness loop inside the pull reads Clover's own stock bookkeeping as a sensor: drops become sale witnesses, single-tier increases become corrections, everything else becomes an anomaly, and packaging state is inferred. Implemented in core and exercised only through the POS planner and pull; no endpoint or CLI reaches it directly.

**7. Reliability and operations.** *live.* Every poll opens a parent workflow run and every emitted event a child run with a `dedup_ratchet` side effect. Workflow-aware jobs carry the run id; a terminal `discord.notify` marks the run succeeded. Terminal failure is detected in-band by error class and retry budget, by a 15-minute DLQ monitor over Faktory's dead set, and by an hourly timeout reaper at 4 hours; failures enqueue compensations that release the dedup ratchet. Unique-job locks dedup scheduled enqueues app-side because Faktory OSS does not. Twice-daily ops summaries, deduped ops pings, phantom-enqueue reconciliation, dedup metrics, structured logs, traces, and seven OpenObserve alerts complete the part. One known code inconsistency: the dedup metrics job parses only the legacy key shape and mis-buckets v2 keys.

### Tenancy and configuration, cross-cutting

Tenancy is a property of every part, not a part. In the orchestrator a tenant is a slug (`freco`) resolved from email domains and fanned into poll jobs, mapped per environment to a core tenant UUID in `tenants.yaml`. In core a tenant is a row, every document and POS row carries a tenant id, and the URL is the only place tenant enters at document creation. Per-environment values are env-keyed maps resolved by `APP_ENV`. All Discord snowflakes live in `discord.{env}.yaml` and are substituted into pipeline, schedule, and rule config at load. Seed YAML is the source of truth for vendors and schedules and is reconciled into the database on every deploy.

## 2. Outside the system

These do not get drawn as parts of GrocerBot. They are named so a run can recognise them and leave them alone.

- Infrastructure provisioning and deployment: Pulumi and Terraform, the GitHub Actions workflows, the CI-written `.env`, droplet SSH, Cloudflare Tunnel configuration.
- Secrets management: 1Password and the `op` CLI. Credential values never appear in documentation.
- Third-party internals: Faktory itself, Redis itself, OpenObserve itself, Clover's platform behaviour beyond what the adapter encodes, Cloudflare's routing.
- The graftpunk framework on PyPI. The BEK plugin is in scope as Piping; the framework it plugs into is not.
- Developer tooling: justfiles, test suites, ruff, the client code generator, the Claude Code skills and plugins in each repo.
- The legacy CLI's ShopKeep and reorder paths. Version 1, see section 3.
- Dead code in the live repos: the Gmail polling task, the unrouted `email.unresolved.new` and `email.is_duplicate` events, the `audit_log` table that nothing writes, the reserved `pos_plans.report` column. Real in the tree, not part of how the system works.

## 3. What it replaced

Version 1 is the legacy `grocerbot` CLI, `gb`, at `~/src/grocerbot`. It is still maintained and still in use for the ShopKeep path. Version 2 is what this document describes. The difference is structural, and old material describing version 1 must be recognised on sight so it is not drawn back as current.

Version 1 in one paragraph: a local Python CLI processes vendor invoice spreadsheets through supplier modules, calculates retail prices with markup rules and quarter-magic rounding, and writes a ShopKeep bulk-manage import CSV. Every supplier module outputs Lightspeed-specific columns, so each vendor is coupled to each POS. There is no API, no service, no tenancy, no event stream, no database of its own; the POS is the store of record and the CLI is a transformation step a human runs.

How to recognise version 1 in sources:

- The words Lightspeed, ShopKeep, BackOffice, bulk-manage, `TEMPLATE`, quarter magic, `Discountable`, `Price Type`, `Register Status`.
- The flat canonical format with floats: `item_id`, `product_description`, `upc`, `quantity`, `unit_type`, `case_price`, `unit_price`, `pack_size`, `line_total`.
- Supplier names as classes in `suppliers/*.py`: UNFI, Alberts, BEK, Glazers, Affiliated, Fintech, McLane.
- Paths under `~/projects/grocerbot` or `~/src/grocerbot`, and the `gb` command.

Version 2 also carries its own earlier shapes inside the live repos, confidently described in documents that were not updated. These are old material too:

- In core: `InvoiceRecord` and the `invoices` table (now `DocumentRecord` and `documents`); `POST /v1/invoices/upload` without a tenant (now under `/v1/tenants/{id}/`); the flat `CanonicalInvoice` with `metadata` and `line_items` (now the three facets); the states `created` and `parsed` as written states (upload now writes `underivative` directly); three seeded vendors (now four); "zero POS-specific code" (a full Clover adapter now ships).
- In the orchestrator: a single `config/pipelines.yaml` with `pipelines:` and `notify:` blocks (now `config/pipelines/*.yaml` with `routes:`); routes on `.augmented` with the `bek_notification` embed (now `.canonicalized` with `bek_canonical`); the `snapshots_dev` table and the `retailer` column (both migrated away); Gmail polling as a live ingress; migrations "001 to 009"; a six-process system with no canonicalize stage and no workflow framework; the reverted auto-ingest schema (`invoice_polls`, `core_invoice_id`, `tenant_id` on `email_arrivals`).

## 4. Where the correction came from

The decisions that set version 2's direction, in the order they landed. Each is recorded in a dated design document in the repo named, validated at a SHA where the document says so.

- **The orchestrator as a deterministic event-driven backbone.** `grocerbot-orchestrator/docs/plans/2025-02-04-orchestrator-design.md`. Eight architectural decisions, including no AI in the loop and Discord as the staff interface.
- **The canonical format as the contract, extracted into a service.** `grocerbot-core/docs/plans/2026-03-19-grocerbot-core-design.md` and `docs/CANONICAL_FORMAT_ANALYSIS.md`. The N by M coupling in version 1 is the stated problem.
- **One event contract for every source.** `grocerbot-orchestrator/docs/superpowers/specs/2026-04-18-convergent-events-design.md`. Raw and augmented event forms, per-vendor pipeline files, identity-driven dedup.
- **Durable workflow runs with compensation.** `grocerbot-orchestrator/docs/superpowers/specs/2026-05-12-workflow-framework-design.md`. Fixes the seen-counter ratchet; three failure detection mechanisms.
- **Dedup on what happened to whom, not on the pipeline.** `grocerbot-orchestrator/docs/superpowers/specs/2026-06-21-provenance-agnostic-dedup-design.md`. `business_event` and `entity_id`.
- **Multi-tenant scoping in core.** `grocerbot-core/docs/superpowers/specs/2026-06-09-multi-tenant-scoping-design.md`.
- **The orchestrator drives, core executes bounded steps.** `grocerbot-core/docs/superpowers/specs/2026-07-18-clover-pos-subsystem-design.md`, section 5, re-brainstormed 2026-07-20 after three consecutive critical findings against holding a lock across a long call inside core. This is the sharpest ruling in the corpus and the one most likely to be contradicted by earlier material.
- **One ledger number per family.** `grocerbot-core/docs/superpowers/specs/2026-07-23-inventory-ledger-unitization-design.md`. Fixes conflicting stock targets from case and unit SKUs.
- **The method decisions for this documentation.** Sam, 2026-09-06, recorded in `01 - Sources/01 - Working Decisions/26.09.06 - Method Setup Walkthrough.md`: boundary, four levels, seven parts, standings in text only, pointers not copies, `dev` as branch of record, version 1 as contrast only.

Where a code comment, a README, or a CLAUDE.md contradicts one of these, the dated spec and the current code win, and the contradiction is a finding for the owner.

---

## Sources

The read behind this document, by checkout. Runs verify against these, and record the SHA they read.

| Source | Path | Branch of record | SHA read 2026-09-06 |
| --- | --- | --- | --- |
| grocerbot-orchestrator | `~/src/grocerbot-orchestrator` | `dev` | `1304813` (dev tip; `main` at `c530f51` carries the same content) |
| grocerbot-core | `~/src/grocerbot-core` | `dev` | `dd74fe9` (checkout on `fix/zero-cost-unplannable`; `dev` tip `4b5afac` is only the merge of it; `main` at `0c5e9dc` is 133 commits behind and lacks POS and ledger) |
| graftpunk-plugins-grocerbot | `~/src/graftpunk-plugins-grocerbot` | `main` | `a8b8e99` (checkout on `feat/shopkeep-sales-reporting`, zero commits ahead of `main` at `6e6733c`) |
| grocerbot (version 1) | `~/src/grocerbot` | `main` | `9537159` (two commits ahead of origin) |

Key files for each claim above: orchestrator `README.md`, `CLAUDE.md`, `docker-compose.yml`, `config/*`, `migrations/*.sql`, `src/orchestrator/{main,scheduler,notifier,api,jobs}.py`, `src/orchestrator/tasks/{vendor_poll,canonicalize,discord_notify}.py`, `src/orchestrator/pipelines/emit.py`, `email-worker/src/index.js`, `docs/plans/2025-02-04-orchestrator-design.md`, `docs/email-processing.md`, the specs named in section 4; core `CLAUDE.md`, `src/core/main.py`, `src/core/db/models.py`, `openapi.yaml`, `migrations/versions/*`, the two specs named in section 4. The full per-file inventories with line citations from the 2026-09-06 read are recorded in the source briefs under `01 - Sources/`.
