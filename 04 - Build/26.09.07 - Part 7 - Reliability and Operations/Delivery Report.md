# Delivery Report: Part 7, Reliability and Operations

Dated 2026-09-07. Written per step 7 of the Function.

## Request and resolution

"Next", after the Part 6 report named Part 7 as the last part, resolved to Part 7, reliability and operations: the wrapper on every job and its failure path through the run, the compensation, and the dedup release; the scheduler's six system jobs, two of them backstops; the audit rows and the app-side locks; the telemetry into OpenObserve and its seven alerts back to the ops channel; and the operator's surfaces. Standing per the harness: live.

## Sources read

Orchestrator at `dev` `1304813`: the whole `workflows/` package, the scheduler, startup, the env gate, execution and enqueue, unique jobs, the kernel tasks, telemetry and logging, the worker and the CLI, the API routes, the six system schedules, the OpenObserve config, the observability doc, the three specs, the seven migrations, and issues #252, #14, and the eleven filed from Parts 1 to 5. The Context Record lists every file opened and why. No failure to open a file is recorded there.

## Produced

- Part 7 board on VISUAL DOCUMENTATION, node `9103:7645`: three actors, two artifacts, one interface, twenty-one operations, two principle pills, eleven Piping cards, ten Data cards, twenty tie segments, one shelf.
- Legend change: none.
- In this folder: Context Record, Handoff Brief with its nature pass, Build Log, this report, and the behind-the-scenes audit.
- Lexicon: `backstop`, `phantom`, and `kernel task`.
- The Orchestrator Brief's issues pointer now runs to #274.

## Deviations from the brief and the visual rules

- The rail is 8320 wide, the longest of the seven, to reach the eleventh card.
- The failure path is on the rail and the success path is a shelf.

## Corrections for the owner

- The four workflow alerts in the framework spec are not in `alerts.json`. Filed as #273.
- The workflow tables have no retention. Filed as #274.
- `docs/observability.md` is stale in four places, and the spec's parent rollup is not what the code does. Added to #268.

## Unresolved naming and boundaries

- Who reads #ops and the alerts. Operator; lexicon queue item 5.
- Whether the parent run should roll up from its children. A design question for Sam, recorded on #268.
- `phantom` and `kernel task` are the code's and the doc's own words; added as settled.

## Source conflicts

As recorded in the Context Record: designed alerts never provisioned; the spec's parent rollup and retry default versus the code; the observability doc versus the worker's queues, the schedules, the routing config, and the restart policies; the retention asymmetry.

## Findings for the owner

Nine, listed in the audit and the Context Record. Two were verified end to end and filed; one went to #268; the rest are the owner's open issues.

## Verification

One full-board screenshot at native scale, cropped and inspected: the rail in four crops, every Piping card, every Data card, and the tie band. A geometry scan of the 573 text nodes found no overflow, no overlaps, and no crossed captions; three wrapped captions were fixed before the screenshot. Nothing on the board was checked against a running environment.

## Next

The seven parts are drawn. What remains is Sam's: the three approvals per board, the naming queue, and the findings. The SYSTEM REGISTRY page is empty and is the natural next build: one sheet per part's tables and keys, cross-referenced to the boards.

## Issues filed, 2026-09-07

- `parconditio/grocerbot-orchestrator` #273: the four workflow alerts the framework spec adds to `alerts.json` were never provisioned; `workflow_unknown_compensation_total` has no reader (finding 1). Verified in `alerts.json`, the spec, and `dispatch.py`.
- `parconditio/grocerbot-orchestrator` #274: `workflow_runs` and `workflow_side_effects` are never pruned (finding 2). Verified in `scheduler.py` and by a grep for any other delete.
- A comment on #268 for the observability doc's four stale places and the parent rollup.

Not filed: findings 4 to 8, which are #270, #263, #264, #266, and #252.
