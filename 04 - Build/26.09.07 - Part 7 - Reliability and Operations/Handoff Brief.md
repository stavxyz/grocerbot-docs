# Map Brief: Part 7, Reliability and Operations

Written 2026-09-07 in the format at the end of `02 - Tools/Figma/Instructions.md`, in GrocerBot's four-level vocabulary. The nature pass at the end maps each nature to the piece families in `02 - Tools/Figma/Visual Rules.md`. Under the standing instruction to continue without asking, this brief is recorded and then built.

Purpose: a reader should see within ten seconds that every job runs under one wrapper that records it and, on a terminal failure, fails the event's run and enqueues the compensation that releases the dedup key; that the scheduler's system schedules drive two backstops, an hourly reaper and a dead-set scan, and three kernel tasks that count, gauge, and summarise; that logs, traces, and metrics leave for OpenObserve, whose seven alerts come back to the ops channel; and that the operator reads that channel and runs `gbo`.

Target: file `nBmhDyEDpFPrMq0ztmHDb0`, page VISUAL DOCUMENTATION (`7001:129074`), a new frame below the Part 6 board. Components from SYSTEM LEGEND (`7001:129072`).

Standing: live. Drawn as current.

## Elements

One per line: name | nature | one-line description | modifiers.

**Actors**

- Worker | actor, agent | every handler on the worker and the browser worker runs under the wrapper | none
- Scheduler | actor, agent | the 60-second tick over the schedules table; the six system schedules | none
- Operator | actor, human | reads #ops, the Faktory UI, and the OpenObserve dashboards; runs `gbo` | none

**Interfaces**

- Operator terminal | interface, code block | `gbo provenance jid <jid>` | Code block convention, under Runs gbo

**Artifacts**

- The ops summary | artifact, Discord message | the twice-daily digest: a status line, one field per class and job type, the phantom count in the footer | under Posts the ops summary
- The alert | artifact, Discord message | OpenObserve's red embed: the alert name, the stream, the matched count against the threshold, the window | under Posts an alert

**Operations, the rail in order**

- Runs a handler | operation, trigger | jid first; the run id second for a workflow-aware job | none
- Records the execution | operation, write | a span, `Job started`, then the `job_executions` row, the counter, and the histogram | none
- Releases the unique lock | operation, write | on success, by compare-and-delete through the companion key | success shelf
- Marks the run succeeded | operation, write | on success of a terminal handler | success shelf, dead end
- Counts the attempt | operation, write | INCR per jid, 24 hours | the failure path
- Classifies the failure | operation, route | NonRetryableError, a budget of -1 or 0, or attempts past a positive budget | P3 pill
- Fails the run | operation, write | running to failed with the reason; only from running | none
- Enqueues compensations | operation, write | one job per pending side effect; the run to compensating | none
- Releases the dedup key | operation, write | the winner deletes, a loser decrements | none
- Marks compensated | operation, write | when nothing is pending or in flight | none
- Ticks the system schedules | operation, trigger | every 60 seconds; due rows; unique for the cadence | Scheduler
- Reaps stalled runs | operation, write | hourly; four hours without progress; reason timeout | none
- Scans the dead set | operation, view | every 15 minutes; Faktory's Redis; reason dead_queue | none
- Counts phantoms | operation, write | hourly; enqueued, not executed after 30 minutes | none
- Gauges the dedup keys | operation, write | every five minutes; per bucket; the legacy key shape only | none
- Posts the ops summary | operation, output | twice daily; 24 hours of executions | ends at the artifact
- Ships logs, traces, and metrics | operation, output | FluentBit and OTel to OpenObserve | none
- Evaluates seven alerts | operation, route | structured conditions every 5 to 30 minutes; silence 60 to 120 | none
- Posts an alert | operation, output | the Discord webhook | ends at the artifact
- Reads #ops and the dashboards | operation, action | Operator | none
- Runs gbo | operation, action | trigger, reset, status, provenance | none

**Piping**

- Workflow wrapper | piping, code | `workflows/decorators.py`, `wrapper.py`, `classification.py`, `attempts.py`, `budgets.py`, `errors.py` | none
- Execution and enqueue audit | piping, code | `execution.py`, `enqueue.py`: the two rows, the metrics, the rewrap, the release | none
- Unique jobs | piping, code | `unique_jobs.py`, `jobs.py`: the key, the two modes, fail-open | table
- Workflow runs | piping, code | `runs.py`, `side_effects.py`, `registry.py`: the state machine and who moves it | table
- Compensation | piping, code | `compensation/`: dispatch, the registries, the one handler | none
- Scheduler and init | piping, code | `scheduler.py`, `startup.py`, `required_env.py`: the tick, the prune, the gate | table
- Backstops | piping, code | `backstops/timeout_reaper.py`, `dlq_monitor.py` | none
- Kernel tasks | piping, code | `tasks/ops_summary.py`, `ops_ping.py`, `phantom_reconciliation.py`, `system_metrics_dedup.py` | table
- Telemetry | piping, code | `logging_config.py`, `telemetry.py`, `fluent-bit.conf`, the exporter | none
- OpenObserve | piping, external tool | one node per droplet; the seven alerts | table; tied horizontally from Telemetry
- Operator surfaces | piping, code | `cli.py`, `api.py`, the Faktory UI, the dashboards | table

**Data**

- attempt counters | data, redis key | `workflow:attempts:{jid}`, 24 hours | none
- job_executions | data, table | one row per handler run; the run id since migration 013 | none
- unique locks | data, redis key | `unique:{jobtype}:{sha256}` and `unique_jid:{jid}`; two modes | none
- workflow_runs | data, table | the run: name, labels, state, progress, reason, traceparent, inputs, parent | none
- workflow_side_effects | data, table | type, compensate, payload, dispatched jid, compensated | none
- schedules | data, table | the seeded rows, next_run_at, unique_for, jobtype, args_template | none
- Faktory dead set | data, redis key | Faktory's own `dead` sorted set, read over TCP | none
- job_enqueues | data, table | one row per push; source, label, trace id; the view | none
- dedup keys | data, redis key | Part 1; released here | muted
- OpenObserve data | data, R2 object | parquet under `grocerbot-openobserve-data-{env}`; sqlite metadata on the droplet | none

**Principles**

- P3 · Fail loud | principle | on Classifies the failure
- P1 · Deterministic | principle | on Evaluates seven alerts

## Groupings

- Part 7 frame | part frame | everything above
- Chapters | cluster | captions above the rail: in every job, the wrapper; on the scheduler, the system schedules; to OpenObserve and back to #ops
- The success shelf | cluster | under Records the execution
- Artifacts | cluster | the ops summary under its post; the alert under its post

## Relationships

- Runs a handler -> Records the execution -> Counts the attempt -> Classifies -> Fails the run -> Enqueues compensations -> Releases the dedup key -> Marks compensated -> Ticks -> Reaps -> Scans -> Counts phantoms -> Gauges -> Posts the ops summary -> Ships -> Evaluates -> Posts an alert -> Reads -> Runs gbo | flow | the rail
- Records the execution -> Releases the unique lock -> Marks the run succeeded | flow | branch, the success shelf
- Runs a handler -> Workflow wrapper card; Records the execution -> Execution card; Releases the unique lock -> Unique jobs card (from the shelf); Fails the run -> Workflow runs card; Releases the dedup key -> Compensation card; Ticks -> Scheduler card; Scans the dead set -> Backstops card; Gauges -> Kernel tasks card; Ships -> Telemetry card; Runs gbo -> Operator surfaces card | tie
- Telemetry card -> OpenObserve card | tie, horizontal
- Wrapper -> attempt counters; Execution -> job_executions; Unique jobs -> unique locks; Workflow runs -> workflow_runs; Compensation -> workflow_side_effects; Scheduler -> schedules; Backstops -> Faktory dead set; Kernel tasks -> job_enqueues; OpenObserve -> OpenObserve data | tie

Reading order: left to right. The wrapper's failure path on the rail with the success shelf below, then the scheduler's tick and the five system jobs, then the telemetry out and the alerts back, then the operator.

Color semantics beyond the standard planes: none. Muted pieces at opacity 0.55.

Undecided:

- Whether the failure path or the success path belongs on the rail. The failure path is drawn on the rail because it is the part's subject; the success path is the shelf.
- Whether OpenObserve is an External Tool or an agent. Drawn as an External Tool card with the alerts as its table.
- Who reads #ops. Operator, the Part 1 designation; lexicon queue item 5.

## Nature pass

| Nature used here | Family in Visual Rules | Match |
| --- | --- | --- |
| actor, agent | Actor, Agent, designations Worker and Scheduler | match; both used on Part 1 |
| actor, human | Actor, Internal Human, designation Operator | match |
| interface, code block | Interface, Code block convention (open item 4) | match; a CLI line |
| artifact, Discord message | Artifact | match; two instances |
| operation, all acts | Operation | match; two Actions for the operator, one View |
| piping, code | Piping Runner cards | match |
| piping, external tool | External Tool card | match; the OpenObserve mark exists |
| data, redis key / table / R2 object | Data card per section 5 | match |
| principle | Color Tag rebound to Principles | match |

No gap.
