# Build Log: Part 7

What was built in the GrocerBot System Docs Figma file (`nBmhDyEDpFPrMq0ztmHDb0`) for Part 7, reliability and operations, with node ids so later tasks can find and edit instead of redraw. Built 2026-09-07. Every entry was verified from a full-board screenshot at native scale, cropped and inspected region by region.

## VISUAL DOCUMENTATION page (`7001:129074`), Part 7 board

Frame `P7 · Reliability and Operations`, node `9103:7645`, 9100 by 3243, at y 21858, below the Part 6 board. Lanes at the same heights as the other boards. Title `9103:7646`, subtitle `9103:7647`, lane labels `9103:7648` to `9103:7650`, rail `9103:7651`, 8320 wide (x 380 to 8700), the longest of the seven.

**Rail (Process).** Lines `9104:7891` to `9104:7894`: the success shelf (`rail:success-down` at x 1559, `rail:success` at y 859 from x 1560 to 2700) and the two artifact connectors (`rail:summary-down` at x 6479, `rail:alert-down` at x 7660). Captions `9104:7895` to `9104:7913`: three chapter captions at y 520, three actor captions, eleven tag captions at y 640 or 660, the shelf caption, and the terminal caption.

| Piece | Node | Treatment |
| --- | --- | --- |
| Worker | `9104:7645` | Actor, Agent; caption EVERY HANDLER, BOTH WORKERS |
| Scheduler | `9104:7659` | Actor, Agent; caption CRONITER OVER THE SCHEDULES TABLE |
| Operator | `9104:7673` | Actor, Internal Human; caption IN #OPS, THE FAKTORY UI, AND OPENOBSERVE |
| The ops summary | `9104:7914` | Artifact, Discord, hanging from the rail under POSTS THE OPS SUMMARY |
| The alert | `9104:7919` | Artifact, Discord, hanging from the rail under POSTS AN ALERT |
| Operator terminal | `9104:7924` | Interface, Code block, under RUNS GBO; `gbo provenance jid <jid>` |
| RUNS A HANDLER | `9104:7682` | Operation, Trigger; centred on the Workflow wrapper card's tie |
| RECORDS THE EXECUTION | `9104:7694` | Operation, Write; centred on the Execution card's tie; the success shelf drops after it |
| RELEASES THE UNIQUE LOCK | `9104:7873` | Operation, Write, success shelf; centred on the Unique jobs card's tie |
| MARKS THE RUN SUCCEEDED | `9104:7880` | Operation, Write, success shelf, dead end |
| COUNTS THE ATTEMPT | `9104:7701` | Operation, Write |
| CLASSIFIES THE FAILURE | `9104:7708` | Operation, Route |
| FAILS THE RUN | `9104:7721` | Operation, Write; centred on the Workflow runs card's tie |
| ENQUEUES COMPENSATIONS | `9104:7728` | Operation, Write |
| RELEASES THE DEDUP KEY | `9104:7735` | Operation, Write; centred on the Compensation card's tie |
| MARKS COMPENSATED | `9104:7742` | Operation, Write |
| TICKS THE SYSTEM SCHEDULES | `9104:7749` | Operation, Trigger; centred on the Scheduler card's tie |
| REAPS STALLED RUNS | `9104:7761` | Operation, Write |
| SCANS THE DEAD SET | `9104:7768` | Operation, View; centred on the Backstops card's tie |
| COUNTS PHANTOMS | `9104:7781` | Operation, Write |
| GAUGES THE DEDUP KEYS | `9104:7788` | Operation, Write; centred on the Kernel tasks card's tie |
| POSTS THE OPS SUMMARY | `9104:7795` | Operation, Output; the summary artifact hangs below |
| SHIPS LOGS, TRACES, AND METRICS | `9104:7808` | Operation, Output; centred on the Telemetry card's tie |
| EVALUATES SEVEN ALERTS | `9104:7821` | Operation, Route |
| POSTS AN ALERT | `9104:7834` | Operation, Output; the alert artifact hangs below |
| READS #OPS AND THE DASHBOARDS | `9104:7847` | Operation, Action |
| RUNS GBO | `9104:7860` | Operation, Action; centred on the Operator surfaces card's tie; ends the rail |
| P3 · FAIL LOUD | `9104:7887` | Principle pill under CLASSIFIES THE FAILURE |
| P1 · DETERMINISTIC | `9104:7889` | Principle pill under EVALUATES SEVEN ALERTS |

**Piping cards**, left to right at pitch 780 from x 300: Workflow wrapper `9105:7805`, Execution and enqueue audit `9105:7957`, Unique jobs `9105:8103` (modes table), Workflow runs `9105:8283` (transitions table), Compensation `9105:8473`, Scheduler and init `9105:8619` (system schedules table), Backstops `9105:8816`, Kernel tasks `9105:8952` (tasks table), Telemetry `9105:9134`, OpenObserve `9105:9239` (External Tool, alerts table), Operator surfaces `9105:9396` (surfaces table).

**Data cards**, left to right: attempt counters `9106:8403` (Redis, ROW), job_executions `9106:8526`, unique locks `9106:8672` (Redis, ROW), workflow_runs `9106:8802`, workflow_side_effects `9106:8959`, schedules `9106:9091`, Faktory dead set `9106:9230` (Redis, ROW), job_enqueues `9106:9356`, dedup keys `9106:9499` (Redis, ROW, muted, Part 1), OpenObserve data `9106:9622` (Cloudflare R2, ROW).

**Ties.** Rail to card `9104:7927` to `9104:7936`, ten, from each tag's centre; the shelf tie starts under its shelf tag at y 885. Telemetry to OpenObserve `9104:7937`, horizontal at y 1240. Card to data `9106:80846` to `9106:80854`, nine straight ties, one per data card except the muted dedup keys. No tie crosses another.

## Component changes on SYSTEM LEGEND

None.

## How the cards were built

As on Parts 2 to 6: clones of the Part 1 card shells refilled from block prototypes, with every table cell set by direct text override in x order. The rail pieces are clones of Part 2 and Part 3 pieces.

## Checks run

A scan of the 573 text nodes on the board found no overflow, no overlapping rail pieces, and no caption crossed by a vertical line; three captions wrapped and were shortened or widened before the screenshot. Screenshot inspection at native scale covered the rail in four crops, every Piping card, every Data card, and the tie band. No fixes were needed after the screenshot.

## Known leftovers, none blocking

- The board is a working board. None of the release checks in Visual Rules section 7 has been approved.
- The failure path is on the rail and the success path is the shelf; the audit records the choice.
- The ops ping artifact is on the Part 4 board and is not repeated here.
