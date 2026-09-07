# Behind the Scenes: Part 7 Build Audit

Every call made without asking while the Part 7 board, reliability and operations, was built on 2026-09-07 under "next". Each entry names the decision, the alternative not taken, the reason, and what it would take to reverse it. Nothing here is a ruling. The Build Log in this folder carries the Figma node ids.

## Before the board

1. **The boundary is everything that runs around a job**, not any one pipeline: the wrapper, the run, the compensation, the two backstops, the locks, the audit rows, the kernel tasks, the telemetry, the alerts, and the operator. Parts 1 to 5 drew this part's tables muted; here they are full. Alternative: three boards (framework, scheduler, observability); one board keeps the failure's whole path readable left to right.
2. **The failure path is the rail and the success path is the shelf.** The part exists for failures; a success is two writes and a lock release. Reverse: swap the shelf and the rail segment between RECORDS THE EXECUTION and MARKS COMPENSATED.
3. **Issue #252 was read before filing**, so the two issues filed are not in its list, and the two backlog items the board cites (the compensation DLQ net, DLQ pagination) are attributed to it.
4. **Findings 1 and 2 were verified in the files before filing**: the seven alerts in `alerts.json` against the spec's four; the scheduler's prune and a grep for any delete on the workflow tables.

## The board

5. **Three actors.** Worker for both workers (the browser worker runs the same wrapper), Scheduler, and Operator. Alternative: OpenObserve as an agent; it is drawn as an External Tool because it is a process the orchestrator does not own, the observability spec's own rule.
6. **The rail runs the wrapper's failure path, then the scheduler's six system jobs in cron order of their appearance in the seed file, then the telemetry out and the alerts back, then the operator.** Three chapter captions name the three. Alternative: a loop from POSTS AN ALERT back to the operator, which the rail already reaches.
7. **Act colours.** RUNS A HANDLER and TICKS Triggers. CLASSIFIES and EVALUATES Routes. SCANS THE DEAD SET the one View. POSTS THE OPS SUMMARY, SHIPS, and POSTS AN ALERT Outputs. READS and RUNS GBO Actions. Everything else Writes, including the two shelf tags.
8. **Two principle pills**: P3 under the classification, where the framework's contract with handlers is decided, and P1 under the alerts, for structured conditions and one winner per race. Alternative: P5 for the per-environment channels, which belongs to tenancy and no board.
9. **Two artifacts** quote the code's templates with placeholders: the ops summary's status line, field shape, colour rule, and footer; the alert template's title, body, and window. No numbers are invented.
10. **The terminal shows one command**, `gbo provenance jid`, because it is the one command that reads this part's tables; the caption lists the others and the absence of workflow commands.
11. **Eleven Piping cards, the most on any board**, at the same pitch; the rail is 8320 wide to reach the last. The Scheduler card carries init because the gate and the tick are the two things every other piece depends on. OpenObserve's table is the alert set as provisioned, with the four missing ones named on its face.
12. **Ten Data cards.** Faktory's dead set is drawn as a Redis ROW because the DLQ monitor reads it as one; OpenObserve's storage is drawn as an R2 ROW because that is where the parquet lives. The dedup keys are muted as Part 1's piece, released here.
13. **Nine straight data ties**, one per card except the muted one; the Kernel tasks card ties to `job_enqueues` for the phantom count rather than to `job_executions`, which the Execution card already owns.
14. **Three captions were shortened or widened before the screenshot** so none wrapped; the dedup-gauge caption ends 4 px short of the summary artifact's connector.
15. **No fixes after the screenshot.**

## Findings surfaced, not ruled

Recorded in the Context Record. None has been observed in production in this session.

1. The framework spec's four workflow alerts were never provisioned; the unknown-compensation counter has no reader. Filed.
2. `workflow_runs` and `workflow_side_effects` are never pruned. Filed.
3. The parent run closes with the poll, not with its children. Added to #268 with the doc drift.
4. Every workflow-aware job retries 25 times after its run is failed (#270).
5. Unrouted child runs are closed only by the reaper (#263); email events open no run (#264).
6. The dedup gauges mis-bucket v2 keys (#266).
7. The DLQ monitor discards dead entries only for compensated runs and reads the whole set (#252).
8. `gbo` has no workflow commands (#252).
9. `docs/observability.md` is stale in four places. Added to #268.

## Issues filed

- `parconditio/grocerbot-orchestrator` #273: finding 1.
- `parconditio/grocerbot-orchestrator` #274: finding 2.
- A comment on #268: finding 9 and finding 3.

Not filed: 4 to 8, which are the owner's open issues.

## Not done

- No approvals on any of the seven boards.
- The SYSTEM REGISTRY page is still empty.
- The seven parts are drawn; what remains is Sam's, and whatever the approvals send back.
