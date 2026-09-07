# Context Record: Part 1, Vendor Portal Monitoring

Working artifact for the first documentation run, assembled 2026-09-06 per `Logic - Protocol.md`. Sam's request: "part 1, go ahead." Resolves to **Part 1, Vendor portal monitoring**: schedule, browser login, poll, diff against snapshot, emit events. The part ends when a canonical event is on the Redis stream. What happens to the event after that is Part 3 (notification delivery) and Part 7 (reliability), and is named here only where Part 1 touches it.

Standing per the harness: **live**. The whole chain is on the orchestrator's `dev` and `main`, and the repo's own records say it has run in production since 2026-07-01. Not verified against the droplets in this session.

## Files opened

All at the SHAs recorded in `01 - Sources/`: orchestrator `1304813`, graftpunk plugins `a8b8e99`. Each line says why the file matters to Part 1.

**Configuration, the source of truth for what runs**

- `config/schedules.seed.yaml`: the five BEK poll schedules, all `*/30 * * * *` on queue `graftpunk-http` with `unique_for: 1800`; the disabled `login` schedule; the system schedules that are Part 7.
- `config/pipelines/bek.yaml`: per data type, the graftpunk command, JMESPath path, identity and compare fields, sort, filter, parser, and what consumes the events. This file decides what a poll fetches, how it diffs, and whether anything downstream listens.
- `config/pipelines/README.md`: the schema and the dedup key rules.
- `config/tenants.yaml`: which tenants subscribe to which vendor; drives the scheduler's fan-out.
- `config/vendors.yaml`: display metadata only.
- `config/required-env.txt`: `BEK_USERNAME`, `BEK_PASSWORD`, `GRAFTPUNK_SESSION_KEY` are Part 1's credentials.
- `docker-compose.yml`: the `scheduler`, `browser-worker`, `init` services; the browser worker's queues, memory cap, healthcheck, and the note that the deploy compose is written inline by CI.
- `Dockerfile.browser`: Chromium plus Xvfb under s6-overlay; the browser worker's image.

**Migrations, the data Part 1 owns or writes**

- `migrations/001_create_vendors.sql`, `002_create_schedules.sql`, `003_create_snapshots.sql`, `005_add_schedule_jobtype.sql`, `009_add_schedule_unique_for.sql`, `010_drop_snapshots_dev.sql`: the three tables Part 1 owns and their history.
- `migrations/004_create_job_executions.sql`, `015_create_job_enqueues.sql`, `016_add_job_executions_jid_index.sql`, `011_create_workflow_runs.sql`, `012_create_workflow_side_effects.sql`: the audit and workflow tables every poll writes to. Owned by Part 7.

**Code, the behaviour**

- `src/orchestrator/scheduler.py`: the 60-second tick, due-schedule query, per-tenant fan-out, next-run update, nightly prune.
- `src/orchestrator/seed.py` and `startup.py`: YAML to database reconcile on every deploy, the delete cap, the init container's sequence.
- `src/orchestrator/jobs.py`, `enqueue.py`, `unique_jobs.py`: how a job is created, deduped app-side, pushed, and audited.
- `src/orchestrator/worker.py`, `browser_worker.py`, `handlers/vendor_poll.py`: which process consumes which queue, strict priority, the handler wrapper.
- `src/orchestrator/execution.py`: the `record_execution` wrapper that writes `job_executions`, emits metrics, and releases the unique lock on success.
- `src/orchestrator/tasks/vendor_poll.py`: the poll itself, start to finish.
- `src/orchestrator/tasks/_browser_login_recovery.py` and `tasks/browser_login.py`: session-invalid detection, the pending slot, the freshness window, the `gp bek login` subprocess.
- `src/orchestrator/graftpunk_bootstrap.py`: the session encryption key materialised from env.
- `src/orchestrator/diff.py`: JMESPath extraction, sorting with year injection, identity keys, checksums, per-item and whole-collection diff, the all-None guard.
- `src/orchestrator/parsers/__init__.py`, `parsers/poll/__init__.py`, `parsers/poll/bek_notification.py`, `parsers/poll/bek_order_confirmation.py`: how a polled item becomes identity fields plus a business event and entity id.
- `src/orchestrator/pipelines/emit.py`, `events.py`, `dedup.py`: the canonical envelope, dedup registration, the child workflow run, publish, rollback.
- `src/orchestrator/workflows/runs.py`: the parent and child workflow runs a poll opens.
- `src/orchestrator/workflows/backstops/timeout_reaper.py`: what happens to a child run nothing consumes.
- `src/orchestrator/cli.py`: `gbo trigger`, `reset`, `status`, `provenance`.
- `src/orchestrator/types.py`: the typed shapes, including the stale `PipelineConfig` and `NotifyConfig` from the single-file era.
- `src/orchestrator/notifier.py`: read only for what it does with a Part 1 event: match, or log "No route matched".

**The BEK plugin, the portal side**

- `graftpunk_bek/plugin.py`: the plugin class, `site_name` `bek`, `session_name` `bekentree`, `base_url`, nodriver backend, the login config (fields, submit, failure text), the CSRF token config (browser extraction, 24h cache), and the `notifications`, `cart get`, `delivery_dates` commands.
- `graftpunk_bek/_order.py` and `_invoice.py`: `order list` and `invoice list`, the other two poll commands, and the shape of what they return.
- `docs/bek.md`: the portal's surface as the plugin sees it.

**Design records, the intent and its history**

- `docs/plans/2025-02-05-milestone-3-vendor-scraping-design.md`: the founding design of the poll. Describes a `FOR UPDATE` row lock, coarse `vendor.<type>.changed` events, and CliRunner invocation. All three are history.
- `docs/plans/2026-02-07-graftpunk-cli-integration.md`: the CliRunner plan. Replaced by the `GraftpunkClient` Python API.
- `docs/plans/2026-02-09-incremental-diff-design.md`: the per-item diff engine, identity and compare, the snapshot JSONB shape. Current in substance; its config example is the single-file era.
- `docs/superpowers/specs/2026-04-20-bek-session-recovery-design.md`: reactive `browser.login`. Current, later extended to four phrasings.
- `docs/superpowers/specs/2026-05-05-graftpunk-chrome-zombie-reap-design.md`: why Chrome processes were leaking; fixed upstream in graftpunk.
- `docs/superpowers/specs/2026-06-16-seed-reconcile-design.md`: YAML as the single source of truth for vendors and schedules, and the crash-loop incident that forced it.
- `docs/superpowers/specs/2026-07-10-app-side-unique-jobs-design.md`: why `unique_for` had been inert and how the app-side lock works.
- `docs/superpowers/specs/2026-04-18-convergent-events-design.md` and `2026-06-21-provenance-agnostic-dedup-design.md`: the envelope and the dedup key, read earlier in the session.

## What is current

The chain as it runs at the SHA read, in order.

1. **Deploy time.** The init container reconciles `schedules.seed.yaml` into `vendors` and `schedules` inside one transaction: insert, update, delete, with a 10 percent per-table delete cap and hard failure on an empty list or an unknown vendor. Two vendor rows exist, `bek` and `system`. Five BEK poll schedules are enabled.
2. **Every 60 seconds** the scheduler selects schedules whose `next_run_at` has passed and whose vendor is enabled. For a `vendor.poll` schedule it looks up which tenants subscribe to the vendor in `tenants.yaml` and creates one job per tenant with args `[vendor, data_type, tenant]`, label `bek/notifications/freco`, source `scheduler`, `unique_for` 1800. If no tenant subscribes it warns and skips. It then advances `next_run_at` from the cron.
3. **Enqueue.** The app-side unique lock `unique:vendor.poll:{sha256(args)}` is taken in Redis with the job id as value; a lost race suppresses the push and writes no audit row. A won race pushes to Faktory queue `graftpunk-http` and writes a `job_enqueues` row with source, label, and trace id.
4. **Two other doors into the same job.** An operator runs `gbo trigger bek notifications --tenant freco`, which pushes the same job with source `cli` and an optional Discord channel override, and no dedup. An email rule action `trigger_vendor_poll` (Part 2) pushes it with source `email_rule`, also without dedup.
5. **The browser worker** consumes `graftpunk-browser` then `graftpunk-http` with strict priority and concurrency one, so a recovery login always runs before queued polls. Every BEK call needs Chrome for CSRF extraction on a cache miss, which is why polls do not run on the lightweight worker.
6. **The poll** loads the `vendors` row, loads the pipeline config for the data type, and opens a parent workflow run named `vendor.poll`. It then calls the BEK plugin through `GraftpunkClient("bek")` with the configured command. The session comes from R2 through graftpunk's S3 backend, decrypted with the Fernet key that `GRAFTPUNK_SESSION_KEY` materialised to disk at boot.
7. **The five commands.** `notifications` hits `GET /my-account/notification/getAll` for page 0, 50 items. `cart get` hits `GET /cart/getCart`. `order list` hits `GET /my-account/getPaginatedOrders`. `invoice list` posts to `/invoice/list-data`. `delivery_dates` hits `GET /single/getNextAvailableDates`. The order confirmations data type reuses the notifications command and filters to subjects containing "is ready for delivery".
8. **Session recovery.** A `BrowserError`, `SessionExpiredError`, `SessionNotFoundError`, a `TimeoutError`, a Chrome-related `OSError`, or a `ValueError` matching one of four known phrasings all mean the session is dead. The poll takes a per-vendor pending slot in Redis (600 seconds), enqueues `browser.login` on `graftpunk-browser`, marks its parent run failed, and raises so Faktory retries the poll. The login job skips if a login succeeded within 300 seconds, otherwise runs `gp bek login` as a subprocess with a 120-second timeout; graftpunk drives Chrome through BEK's Akamai-protected SSO form with `BEK_USERNAME` and `BEK_PASSWORD`, extracts the CSRF token from `ACC.config.CSRFToken`, and persists the session to R2. Success frees the slot and stamps freshness.
9. **Diff.** The collection is extracted by JMESPath, filtered if configured, sorted (notifications by `creationtime`, parsed with a format that has no year, so the current year is injected), and diffed against the previous `snapshots` row. Per-item mode keys each item by its identity fields and checksums only the compare fields; a key absent before is `new`, a changed checksum is `changed`. Whole-collection mode, used by cart and delivery, checksums the whole list and emits one `changed`. A first poll saves the baseline and emits nothing.
10. **Parse and emit.** Each event's item goes through the configured parser. `bek_notification` requires `orderNo`, `notificationType`, `creationtime`, and for `track` items `trackingStatus`; it extracts `account` and `po_number` from the subject and derives a business event from the tracking status or the subject marker, raising on anything unmapped. `bek_order_confirmation` needs a PO number in the subject. Passthrough copies identity fields. A parser failure skips the item, sends a deduped ops ping, and the snapshot still advances. For each surviving event the emitter builds the dedup key, either `dedup:v2:{tenant}:{vendor}:{business_event}:{entity_id}` or the legacy shape, registers it in Redis with a 24-hour TTL to get a `seen` count, opens a child workflow run named `canonical_event` with a `dedup_ratchet` side effect, and publishes the envelope to the `events` stream. A failed publish rolls the dedup registration back.
11. **Save.** Only after every event is published is the new snapshot upserted. The parent run is marked succeeded, the handler returns metrics, `record_execution` writes `job_executions` and releases the unique lock.

The order in step 11 is the second principle in the harness: publish before save.

## What is historical

- The `FOR UPDATE` row lock from the founding design was never built; a `TODO(#60)` in the poll says so.
- CliRunner invocation and `VENDOR_COMMAND_MAP` were replaced by `GraftpunkClient` and the pipeline config.
- Coarse `vendor.cart.changed` events became per-item `{vendor}.{data_type}.{new|changed}` canonical envelopes.
- The single `config/pipelines.yaml` with `notify:` blocks became `config/pipelines/*.yaml` with `routes:`. `types.py` still carries `PipelineConfig` and `NotifyConfig` from that era.
- The hourly cron in the founding design became every 30 minutes.
- Scheduled `browser.login` every two hours was disabled in favour of reactive recovery. The seed entry remains with `enabled: false`.
- The `snapshots_dev` table and the `retailer` column were migrated away.
- `unique_for` was inert until 2026-07-10, when the app-side lock made it real.
- Session-invalid detection grew from one phrasing to four, each added after a production silence.

## What was decided, and where

- YAML is the single source of truth for schedules and vendors; the database is reconciled on every deploy. Seed reconcile spec, 2026-06-16, after the 2026-06-15 crash loop.
- Polls run on the browser worker, not the lightweight worker, because BEK's CSRF token needs a real Chrome page. Comment in `browser_worker.py` and the `graftpunk-http` queue name's own note that it is misleading.
- Recovery logins are reactive only and pre-empt polls via strict queue priority. Session recovery spec, 2026-04-20, and the `BrowserLoginHandler` note removing jitter.
- Publish before save. `vendor_poll.py` comment and the README.
- Identity for notifications includes `trackingStatus` because BEK emits several `track` items with the same creation time. Comment in `pipelines/bek.yaml`.
- Dedup on business event and entity id for notifications and order confirmations; legacy keys for the rest. Provenance-agnostic dedup spec, 2026-06-21.
- The scheduler fans out per tenant from `tenants.yaml`, never from env. Consistent with the SaaS invariant.

## What is still open

- Whether a poll for a data type nobody consumes should exist at all. See finding 1.
- The `TODO(#60)` concurrency note: two polls of the same data type in flight would both read the same snapshot and could double-emit. The unique lock makes this unlikely on the scheduled path; the CLI and email doors carry no lock.
- Pagination: every poll command fetches page 0 with the plugin's default page size. Whether a burst larger than a page between polls can be missed is not addressed anywhere I read.
- The parent workflow run is marked failed with reason `non_retryable_error` on the browser-login-required path even though Faktory retries the job. The retry opens a fresh parent. Whether that failed run should instead be left running is not discussed in the code.

## Conflicts found, by kind

1. **Intended design differing from implementation.** The founding design's row lock, CliRunner, coarse events, and hourly cron. All superseded by later decisions; none silently.
2. **Documentation lagging code.** The README's pipeline config location and shape, migration range, table count, Gmail as live. Recorded in the orchestrator source brief.
3. **One name for two things.** `snapshot` is the poll's stored collection here and core's stage copies there. `init` is both the migration-runner compose service and s6-overlay's PID 1, which the compose file itself calls out.
4. **A documented policy no code reads.** `sources: {vendor_poll: {augment: ...}}` in the pipeline README.

## Findings for the owner

Findings are not decisions. Each is inferred from the code at the SHA read and none has been observed in production in this session.

1. **Four of the five poll data types emit events that nothing consumes, and every such event opens a child workflow run that only the timeout reaper closes.** `cart`, `orders`, `invoices`, and `delivery` have no augment trigger, no canonicalize trigger, and no route in `pipelines/bek.yaml`; the notifier logs "No route matched" at debug level. But `emit_canonical_event` opens a `canonical_event` child run with a `dedup_ratchet` side effect for every event regardless. Nothing marks those runs succeeded. After four hours the reaper marks each one failed with reason `timeout` and enqueues a `release_dedup_ratchet` compensation, which deletes the dedup key. The provenance-agnostic dedup plan records that these types have "no routes, no dedup-visible behavior" but does not mention the run churn. Whether these four polls exist to keep snapshot state for later use, or are vestigial, is the owner's call. It changes how the board draws them.
2. **The notifications poll reads only the first page.** `diff.command: [notifications]` takes the plugin defaults, page 0 and 50 items. More than 50 new notifications between two polls would push older ones off the page before they were snapshotted.
3. **The email door and the CLI door skip dedup.** Neither `gbo trigger` nor the `trigger_vendor_poll` action stamps `unique_for`, so they can run alongside a scheduled poll of the same data type. The `TODO(#60)` names the double-emit risk.
4. **The scheduled login entry is dead configuration.** It is reconciled into the database on every deploy with `enabled: false` and can never fire. Harmless, but it appears in the `schedules` table as if it were a real schedule.

## Belongs in another document

- Finding 1 also belongs to Part 7, reliability, because it is a steady source of timeout-failed runs and compensations that would show in an ops summary.
- The `init` naming collision belongs in the lexicon's naming queue.
- `snapshot` as one word for two things is already in the lexicon queue.

## Reconciled against the harness

Every element in the handoff brief is drawn as how the system works today because Part 1 is live and the code is the source. Nothing in Part 1 is designed but not wired. The one bracketed item is the fate of the four unconsumed data types, which is a finding awaiting the owner, not a design gap. The principles the board should cite: P1 deterministic, P2 publish before save, P3 fail loud, P5 the SaaS invariant.
