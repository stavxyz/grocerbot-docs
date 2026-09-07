# Context Record: Part 7, Reliability and Operations

Working artifact for the seventh and last documentation run, assembled 2026-09-07 per `Logic - Protocol.md`. Sam's instruction: "next", after the Part 6 report named Part 7 as the last part. **Part 7, Reliability and operations**: what runs around every job so a failure is detected, recorded, compensated, and seen. The wrapper on every job; the workflow run and its side effects; the compensation that releases the dedup key; the two scheduled backstops; the app-side unique locks; the execution and enqueue audit; the kernel tasks that count phantoms, gauge the dedup keys, and post the ops summary; the telemetry pipeline into OpenObserve and its alerts back to the ops channel; and the operator's surfaces. Parts 1 to 5 drew the tables of this part muted; this board draws them in full.

Standing per the harness: **live**. Every piece here has run in production since the workflow framework landed (PR #164, 2026-05) and the app-side unique jobs (2026-07-10), per the specs and the recovery briefing read for Part 3; the last change in the tree is the OpenObserve alerting fix merged as PR #258 at `1304813` on 2026-07-15. Nothing in this run was checked against a running environment.

## Files opened

Orchestrator at `dev` `1304813`, re-checked at the start of this run. Each line says why the file matters to Part 7.

**The wrapper and the run**

- `src/orchestrator/workflows/decorators.py`: `workflow_handler`, the composite; the import-time check against `WORKFLOW_AWARE_JOBTYPES`; the retry budget read once from the route's `retry` value, default -1; `record_execution` outside, `workflow_aware_handler` inside.
- `src/orchestrator/workflows/wrapper.py`: the run id at `args[1]` validated as None or a UUID; on an exception the attempt counter, the budget, `classify_terminal`, and if terminal and still running, `mark_workflow_failed` and `enqueue_compensations`; infra failures in that path logged and the original exception re-raised; a terminal handler's success marks the run succeeded; `WorkflowAlreadyFailedError` is caught and passed through but nothing raises it.
- `src/orchestrator/workflows/classification.py`, `attempts.py`, `budgets.py`, `errors.py`, `registry.py`: `classify_terminal` (NonRetryableError, budget -1 or 0, or attempts past a positive budget); `workflow:attempts:{jid}` with a 24-hour TTL; the budget registry; the three exceptions; the frozenset of three workflow-aware job types.
- `src/orchestrator/workflows/runs.py`: `start_workflow` inserting a running row with the traceparent; the atomic transitions `UPDATE ... WHERE state = expected` for succeeded, failed (reason and message), compensating, compensated; `bump_progress`.
- `src/orchestrator/workflows/side_effects.py`: `register_side_effect` as one INSERT that bumps progress; pending (no jid) versus in flight (jid, not compensated); `mark_side_effect_dispatched` and `mark_side_effect_compensated`, both idempotent.
- `src/orchestrator/tasks/vendor_poll.py` lines 215, 322, 426, 443 and `src/orchestrator/pipelines/emit.py` lines 126 to 140: the poll opens the parent run and closes it itself when the poll returns; each emitted event opens a `canonical_event` child with the `dedup_ratchet` side effect.
- `src/orchestrator/notifier.py` line 93: the suppression path marks a losing child run succeeded.

**Compensation**

- `src/orchestrator/workflows/compensation/dispatch.py`: `enqueue_compensations` refuses a run not failed or compensating; compensating; one `workflow.compensate.{name}` job per pending side effect on queue `core`, source worker, marked dispatched only when the push happened; nothing pending and nothing in flight goes straight to compensated; an unknown name demotes the run to failed with `unknown_compensation`, marks the row compensated with no jid, and adds to `workflow_unknown_compensation_total`; `handle_compensation_job` runs the handler with a context of Redis, the pool, and a producer, marks the row, and closes the run when nothing is outstanding.
- `src/orchestrator/workflows/compensation/registry.py`, `types.py`, `handlers/__init__.py`, `handlers/dedup_ratchet.py`: two registries, functions and Faktory wrapper classes, by identity; the one handler `release_dedup_ratchet` and its picklable class under `record_execution` with class `workflow`.
- `src/orchestrator/dedup.py` `decrement_or_delete_dedup_key`: the winner (seen 1) deletes the key; a loser decrements; absent or below expected is a no-op.

**The backstops**

- `src/orchestrator/workflows/backstops/timeout_reaper.py`: hourly; runs in running or compensating with no progress for `WORKFLOW_TIMEOUT_HOURS` (4 when unset) in batches of 200; running to failed with reason `timeout` and compensations enqueued; a compensating run gets its compensations re-enqueued.
- `src/orchestrator/workflows/backstops/dlq_monitor.py`: every 15 minutes; reads Faktory's `dead` sorted set from Faktory's own Redis over TCP (the custom image binds it); keeps workflow-aware job types; for a running run named at `args[0]`, failed with reason `dead_queue` and compensations; dead entries of compensated runs discarded by MUTATE; the whole set read each tick.
- `config/schedules.seed.yaml` lines 75 to 127: the six `system` schedules with their crons, queue `core`, and `unique_for` windows.

**Unique jobs and the audit**

- `src/orchestrator/unique_jobs.py`, `enqueue.py`, `jobs.py`: the lock key `unique:{jobtype}:{sha256(canonical json of args)}`; success mode with the jid as value and a companion key, released by the execution wrapper by compare-and-delete; expiry mode with a sentinel and no companion; fail-open with one warning per key; the failed-push release; `enqueue_job` as lock, push, then `job_enqueues` row with source, label, and trace id; `create_job` validating `unique_until`; `unique_suppressed_total` and `unique_released_total`.
- `src/orchestrator/execution.py`: `record_execution` with the span, `Job started`, the `job_executions` row with the run id when workflow-aware, `jobs_total` and `job_duration_seconds`, the label truncated to 100 characters, the `RuntimeError` rewrap for the process pool, and the lock release on success.
- `src/orchestrator/faktory.py`, `worker.py`: the lazy producer connection; `TaskRegistry`; `guard_unknown_jobtypes` draining a job type with no handler instead of crashing, counted by `worker_unknown_jobtype_drained`.

**The scheduler and init**

- `src/orchestrator/scheduler.py`: a 60-second tick over enabled schedules of enabled vendors past `next_run_at`; `vendor.poll` fans out per tenant, everything else takes `args_template`; `create_job` with the schedule's `unique_for`; `croniter` advances `next_run_at`; in the first two minutes of midnight UTC, `job_executions` and `job_enqueues` older than 90 days are deleted; nothing prunes the workflow tables.
- `src/orchestrator/startup.py`, `required_env.py`, `main.py` lines 380 to 497, `browser_worker.py`: the init sequence (env gate, session key, migrations, plugins, compensation handlers, Discord config, embed routes, seed reconcile); the worker's registry with every kernel and backstop handler and one Faktory class per compensation; queues `core` and `default` on the worker, `graftpunk-browser` and `graftpunk-http` on the browser worker.

**Kernel tasks**

- `src/orchestrator/tasks/ops_summary.py`: 24 hours of `job_executions` grouped by class and job type; green, yellow, red, or amber by per-group severity; one inline field per group capped at 25; the phantom count in the footer, or `(unavailable)` when its query fails.
- `src/orchestrator/ops_ping.py` and `tasks/ops_ping.py`: one amber embed to the ops channel from `discord.{env}.yaml`; `unique_until` expiry; an enqueue failure logged and swallowed.
- `src/orchestrator/tasks/phantom_reconciliation.py`: `job_enqueues` in the last 24 hours older than 30 minutes with no `job_executions` row; the `phantom_enqueues_24h` gauge.
- `src/orchestrator/tasks/system_metrics_dedup.py`: `dedup:*` scanned; seen max, key count, and stale count per (tenant, vendor, data_type) from the legacy key shape (issue #266).

**Telemetry**

- `src/orchestrator/logging_config.py`, `telemetry.py`, `config/fluent-bit.conf`, `services/faktory-exporter/main.py`: structlog JSON to stderr; OTel tracer and meter providers with Basic auth to OpenObserve, 2-second exporter timeout, batches of 256 every 30 seconds, httpx and psycopg instrumented, noop without an endpoint; FluentBit tailing the Docker JSON logs with a 50 MB disk buffer and unlimited retries; the exporter reading Faktory INFO on an allowlist and pushing by OTel.
- `config/openobserve/alerts.json`, `destination.json`, `alert-template.json`, `docs/observability.md`: seven structured-condition alerts, the Discord webhook destination, the red embed template; the doc's tables.
- `docker-compose.yml`: twelve services; every service `restart: unless-stopped` except init.

**Operator surfaces**

- `src/orchestrator/cli.py`: `gbo trigger`, `reset`, `status`, `provenance jid`.
- `src/orchestrator/api.py`: `/health`, `/health/live`, `/health/ready` (db, redis, faktory; 503 on any failure), `/webhooks/email`, `/api/monitoring/executions`, `/api/monitoring/summary`.

**Tables**

- `migrations/004`, `011` to `016`: `job_executions`, `workflow_runs` with its four partial indexes, `workflow_side_effects`, the `workflow_run_id` column, the progress index extended to compensating, `job_enqueues` with the source check and the view `v_job_executions_with_enqueue`, the jid index.

**Design records and issues**

- `docs/superpowers/specs/2026-05-12-workflow-framework-design.md` (v3, validated): the two abstractions, three-mechanism detection, the retry budget table, the compensation contract, the schema, the four alerts to add, the deferred list.
- `docs/superpowers/specs/2026-07-10-app-side-unique-jobs-design.md` (validated): the lock, the two modes, the seams, the CI proof that OSS Faktory does not dedup.
- `docs/superpowers/specs/2026-05-09-openobserve-observability-design.md` (validated): the exporter, the dedup task, the route label, the eight alerts as designed.
- Issues #252 (the deferred backlog), #263, #264, #266, #270 (filed from Parts 1 to 3), #14 (2026-02-19, retryable versus non-retryable, still open).

## What is current

The part as it runs at the SHA read, around one `discord.notify` job.

1. **The job runs under the wrapper.** pyfaktory binds the jid first; the notifier put the run id second because the job type is workflow-aware. `record_execution` opens a span and logs `Job started`.
2. **On success** a `job_executions` row is written with the run id, `jobs_total` and the duration histogram tick, the unique lock (if any) is released by compare-and-delete, and, because `discord.notify` is terminal, the child run goes to succeeded.
3. **On an exception** the wrapper counts the attempt in Redis, reads the budget (-1 for every workflow-aware job today), classifies the failure terminal, marks the run failed with `non_retryable_error` or `retry_exhausted`, and enqueues compensations; `record_execution` records the failure and re-raises a `RuntimeError` so Faktory sees it. Faktory then retries the job up to its default of 25, because `create_job` sets no retry (#270).
4. **Compensation.** The run moves to compensating; one `workflow.compensate.release_dedup_ratchet` job per pending side effect is pushed to `core`; the handler deletes the key for the winner or decrements it for a loser; the row is marked compensated and, when nothing is outstanding, the run is compensated. A run with no side effects is compensated at once.
5. **The parent.** The poll opened `vendor.poll` and closes it itself, succeeded when the poll returns and failed on its own errors; children close on their own, and the spec's derived rollup is not implemented.
6. **Every 60 seconds the scheduler ticks.** Due schedules push their jobs with the schedule's `unique_for`; the lock in the orchestrator's Redis suppresses a duplicate push inside the window and the audit row is not written; a completed job frees the lock early.
7. **Hourly the reaper** fails any run in running or compensating with no progress for four hours, reason `timeout`, and enqueues compensations; a stuck compensating run gets them again.
8. **Every 15 minutes the DLQ monitor** reads Faktory's dead set from Faktory's own Redis and fails any still-running run it finds there with reason `dead_queue`; dead entries of compensated runs are discarded.
9. **Hourly the phantom count** and **every five minutes the dedup gauges** are emitted; **twice daily the ops summary** posts the 24-hour digest with the phantom count in its footer; **ops pings** post from canonicalize and the poll, one per message text per window.
10. **Logs, traces, and metrics** reach OpenObserve: FluentBit ships the Docker JSON logs; every service pushes spans and metrics by OTLP every 30 seconds; the exporter pushes Faktory's queue depths and set sizes.
11. **Seven alerts** evaluate structured conditions every five to thirty minutes and post a red embed to the ops channel through the Discord webhook, silenced for one or two hours after firing.
12. **The operator** reads the ops channel, the Faktory UI, and the OpenObserve dashboards through the tunnel; runs `gbo provenance jid` to see who enqueued a job and what happened, `gbo status` and `reset` on snapshots, and `gbo trigger` to push a poll.
13. **At init**, before any service starts, every name in `required-env.txt` must be non-empty, migrations run, plugins and compensation handlers register, the Discord config loads, every routed embed resolves, and the seed reconciles.

## What is historical

- The seen counter ratcheting at emit with nothing to release it (issue #151, the framework's motivation); since 2026-05 the `dedup_ratchet` side effect and its compensation.
- An advisory lock or a `pos_sync_runs` table (Part 5); never here.
- `unique_for` as an inert stamp on Faktory OSS (2026-05-09 to 2026-07-10); since then the app-side lock, with the CI smoke assertion that OSS still does not dedup.
- The `route-silent` alert, retired 2026-07-15 because its PromQL join is inexpressible as a structured condition; the spec's eighth alert.
- `high-job-failure-rate` as a 20 percent rate; now an absolute count of three failures in 15 minutes, as the doc says.
- Raw SQL and PromQL alert conditions, which never fired on the deployed OpenObserve (#35 in that repo's history per the doc).
- The dynamic compensation handler class that pyfaktory could not pickle (#170); static classes since.
- `browser.login`'s own `unique_for`; retired for the vendor-keyed guard.

## What was decided, and where

- Faktory's signals and `workflow_runs` must cohere: no exception is swallowed to fake success. Workflow spec, "Faktory protocol contract".
- Three detection mechanisms: in-band, the DLQ scan, the timeout. Workflow spec.
- Poll-driven jobs get a budget of -1; the next tick is the retry. Workflow spec, retry table.
- The workflow-aware set is a frozenset both processes import; the decorator checks it at import. Workflow spec; `registry.py`.
- Compensations are Faktory jobs and must be idempotent. Workflow spec.
- Dedup is an optimization; the enqueue and the execution are load-bearing; every lock path fails open. Unique jobs spec and `unique_jobs.py`.
- Lock semantics are decided at acquire: success mode releases early, expiry mode never does. Unique jobs spec.
- The audit row means actually pushed; a suppressed duplicate writes nothing. `enqueue_job`.
- Code we own pushes metrics by OTel; processes we do not own get a sidecar. Observability spec and doc.
- Alerts use structured conditions only; provisioning converges to the file's set. `docs/observability.md`.
- A job type with no handler is drained, not crashed on. `worker.py`.
- Init fails loud and first on env, before migrations. `startup.py`.

## What is still open

- The workflow-framework backlog in #252: DAG workflows, the `gbo workflow` commands, per-type timeouts, the compensation DLQ safety net, DLQ pagination, the registry consolidation.
- Retryable versus non-retryable classification for non-workflow jobs, #14 since 2026-02.
- Whether the parent run should roll up from its children as the spec says, or close with the poll as the code does.
- Who reads the ops summary and the alerts (lexicon queue item 5).

## Conflicts found, by kind

1. **Designed but not built.** The workflow spec's four alerts (high workflow failure rate, stuck compensating, high compensation failure rate, unknown compensation) are not in `alerts.json`; the counter for the last exists and nothing reads it.
2. **Specification differing from implementation.** The parent run's derived terminal state; the framework "setting Faktory retry to -1" (#270); the `high-job-failure-rate` rate.
3. **Documentation lagging code.** `docs/observability.md`: the queue table says `default` is not consumed and `process_email` sits idle, but the worker consumes `core` and `default`; the cron table lacks the reaper, the DLQ monitor, and the phantom job; the routing section points at `config/pipelines.yaml` and `notifications.py`; the restart-policy table says redis, faktory, and postgres have none, but compose gives every service `unless-stopped` except init.
4. **Retention asymmetry.** `job_executions` and `job_enqueues` are pruned at 90 days; `workflow_runs` and `workflow_side_effects` never are.

## Findings for the owner

Findings are not decisions. Each is inferred from the code and config at the SHA read and none has been observed in production in this session.

1. **The four workflow alerts were never provisioned.** The spec's Observability section adds them to `alerts.json`; the file holds seven alerts, none over workflow state or compensation, and `workflow_unknown_compensation_total` has no consumer. A stuck compensating run or an orphaned side effect is visible only in the tables. Verified in `alerts.json` and the spec.
2. **The workflow tables grow without bound.** The scheduler prunes `job_executions` and `job_enqueues` older than 90 days and nothing else; every poll adds a parent row and every emitted event a child row and a side-effect row. Verified in `scheduler.py` and a grep for any other delete.
3. **The parent run closes with the poll, not with its children.** The spec derives the parent's terminal state from the children; `handle_vendor_poll` marks the parent succeeded when the poll returns. A parent reads succeeded while a child is still running, failing, or compensating. Verified at `vendor_poll.py` lines 322 and 426.
4. **Every workflow-aware job retries 25 times after its run is failed and compensated.** #270.
5. **Child runs for unrouted poll types are closed only by the reaper** (#263), and **email-sourced events open no run** (#264).
6. **The dedup gauges mis-bucket v2 keys** (#266), so `dedup-chronic-flapper` and `dedup-high-key-count` watch buckets named `v2`.
7. **The DLQ monitor discards dead entries only for compensated runs.** A dead job of a run that failed with `unknown_compensation`, or that later succeeded on a Faktory retry, stays in the dead set; the monitor also reads the whole set each tick (#252 lists pagination).
8. **`gbo` has no workflow commands.** `status`, `replay`, and `inspect-dead` are in #252; today a stuck run is found by SQL or the tables' absence from any dashboard.
9. **The observability doc is stale** in the four places listed above.

## Belongs in another document

- The Part 5 and 6 pieces of this part (the `pos.sync` run, the 4-hour reaper against a long apply, the zero-side-effects tripwire) wait on #262.
- The email replay from `email_arrivals` is future work in the workflow spec and Part 2's territory.
- Deploy, the CI-written compose, the tunnel, and secrets are `docs/ops/`; out of the boards' scope by the harness.

## Reconciled against the harness

Everything is drawn as it runs. The principles the board cites: P3 fail loud (the classification and the NonRetryableError contract); P1 deterministic (the structured alert conditions and the atomic transitions, one winner per race); P2 publish before save is not this part's; P5 the SaaS invariant (per-environment channels from `discord.{env}.yaml`, only infrastructure in env). The harness's one named inconsistency, the dedup metrics parser, is finding 6 and issue #266.
