# Build Log: Part 3

What was built in the GrocerBot System Docs Figma file (`nBmhDyEDpFPrMq0ztmHDb0`) for Part 3, notification delivery, with node ids so later tasks can find and edit instead of redraw. Built 2026-09-07. Every entry was verified from a full-board screenshot at native scale, cropped and inspected region by region, unless marked otherwise.

## VISUAL DOCUMENTATION page (`7001:129074`), Part 3 board

Frame `P3 · Notification Delivery`, node `9073:2997`, 9100 by 3243, at y 7286, below the Part 2 board. Lanes at the same heights as the other boards. Title `9073:2998`, subtitle `9073:2999`, lane labels `9073:3000` to `9073:3002`, rail `9073:3003`.

**Rail (Process).** Lines `9074:3048` to `9074:3058`: the duplicate shelf, the two loops back to the stream (`rail:loop1` at y 399, `rail:loop2` at y 319, sharing `rail:loop-down` at the rail's start), the two artifact connectors, and the failure shelf. Captions `9074:3059` to `9074:3072`, including the three pass labels above the rail and the two loop labels.

| Piece | Node | Treatment |
| --- | --- | --- |
| Notifier | `9074:2997` | Actor, Agent; caption CONSUMER GROUP NOTIFIER · ONE CONSUMER |
| Browser worker | `9074:3011` | Actor, Agent; caption ON THE BROWSER WORKER · GRAFTPUNK-HTTP |
| Worker | `9074:3025` | Actor, Agent; caption ON THE WORKER · QUEUE CORE |
| Store staff | `9074:3039` | Actor, Internal Human; caption IN THE TENANT CHANNEL #BEK |
| The primary embed | `9074:74380` | Artifact, Discord, hanging below POSTS TO THE CHANNEL |
| The thread | `9074:74385` | Artifact, Discord, hanging below the primary embed |
| READS THE STREAM | `9074:74169` | Operation, Trigger; centred on the Notifier card's tie |
| DROPS A REPEAT | `9074:74181` | Operation, Route |
| CLOSES THE LOSER'S RUN | `9074:74194` | Operation, Write, duplicate shelf, dead end |
| PICKS THE STAGE | `9074:74201` | Operation, Route; centred on the Routes card's tie |
| PUSHES AUGMENT | `9074:74214` | Operation, Write; centred on the Faktory card's tie |
| FETCHES ORDER AND INVOICE | `9074:74221` | Operation, View; centred on the Augment card's tie |
| CACHES PDF AND CSV | `9074:74234` | Operation, Write |
| PUBLISHES .AUGMENTED | `9074:74241` | Operation, Output; loop 1 rises after it |
| PUSHES CANONICALIZE | `9074:74254` | Operation, Write; centred on the Canonicalize card's tie |
| HANDS THE CSV TO CORE | `9074:74261` | Operation, Route, muted |
| PUBLISHES .CANONICALIZED | `9074:74274` | Operation, Output, muted; loop 2 rises after it |
| PUSHES DISCORD.NOTIFY | `9074:74287` | Operation, Write; centred on the Discord notify card's tie |
| RENDERS THE EMBED | `9074:74294` | Operation, Route; centred on the Embed builder card's tie |
| POSTS TO THE CHANNEL | `9074:74307` | Operation, Output; centred on the Discord card's tie |
| OPENS A THREAD | `9074:74320` | Operation, Write |
| POSTS DETAILS | `9074:74327` | Operation, Output |
| CLOSES THE RUN | `9074:74340` | Operation, Write; centred on the Workflow wrapper card's tie |
| READS THE CHANNEL | `9074:74347` | Operation, Action |
| FAILS THE RUN | `9074:74360` | Operation, Write, failure shelf |
| RELEASES THE DEDUP KEY | `9074:74367` | Operation, Write, failure shelf, dead end |
| P2 · PUBLISH BEFORE SAVE | `9074:74374` | Principle pill under READS THE STREAM |
| P4 · THE ORCHESTRATOR DRIVES, CORE EXECUTES | `9074:74376` | Principle pill under PUSHES CANONICALIZE |
| P3 · FAIL LOUD | `9074:74378` | Principle pill under CLOSES THE RUN |

**Piping cards**, left to right at pitch 780 from x 300: Notifier `9075:3166`, Routes and triggers `9075:3387` (dispatch table), Faktory `9075:3532`, Augment `9075:3612`, BEK portal `9075:3805` (External Tool), Canonicalize `9075:74974` (muted, Part 4), Discord notify `9075:75081`, Embed builder `9075:75245` (the primary embed table), Discord `9075:75400` (External Tool), Workflow wrapper `9075:75477`.

**Data cards**, left to right: events stream `9076:3717` (Redis, TABLE, the read side), job_enqueues `9076:3864` (muted), invoice blob cache `9076:3984` (Redis, ROW), workflow_side_effects `9076:4121` (muted), attempt counters `9076:4245` (Redis, ROW), dedup keys `9076:4368` (Redis, ROW), workflow_runs `9076:4491` (PostgreSQL, TABLE), job_executions `9076:4630` (muted).

**Ties.** Rail to card `9074:74390` to `9074:74398`, nine, from each tag's centre. Augment to BEK portal `9074:74399`, horizontal at y 1240. Card to data `9076:4750` to `9076:4761`, twelve segments for six ties: the Notifier's second tie leaves its card at x 800 and bends at y 2300 to job_enqueues; the wrapper's ties to attempt counters and dedup keys leave at x 7400 and 7500 and bend at y 2300 and 2380. No tie crosses another. Muted pieces carry opacity 0.55.

## Component change on SYSTEM LEGEND (`7001:129072`)

- Table Components `9018:1335`: the first-column text in every variant is now auto height and fill width, so long field names wrap inside the 220 px column. The dispatch table's event types clipped before this. All three boards were checked for card-to-data ties that no longer met their card's bottom edge afterwards; none had moved.

## How the cards were built

As on Part 2: clones of the Part 1 card shells refilled from block prototypes, with every table cell set by direct text override in x order.

## Checks run

A scan of the 460 text nodes on the board found none extending past a clipping ancestor or its card. Screenshot inspection at native scale covered the rail in four crops, every Piping card, every Data card, and the tie band, before and after the fixes.

## Known leftovers, none blocking

- The board is a working board. None of the release checks in Visual Rules section 7 has been approved.
- The loops back to the stream use the branch-line convention; no legend piece describes a feedback loop.
- The tenant channel is a caption on the reader, not an Interface card.
