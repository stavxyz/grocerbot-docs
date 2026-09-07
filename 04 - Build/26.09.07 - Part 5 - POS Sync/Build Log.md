# Build Log: Part 5

What was built in the GrocerBot System Docs Figma file (`nBmhDyEDpFPrMq0ztmHDb0`) for Part 5, POS sync, with node ids so later tasks can find and edit instead of redraw. Built 2026-09-07. Every entry was verified from two full-board screenshots at native scale, cropped and inspected region by region.

## VISUAL DOCUMENTATION page (`7001:129074`), Part 5 board

Frame `P5 · POS Sync`, node `9090:5379`, 9100 by 3243, at y 14572, below the Part 4 board. Lanes at the same heights as the other boards. Title `9090:5380`, subtitle `9090:5381`, lane labels `9090:5382` to `9090:5384`, rail `9090:5385`, 8120 wide as on Part 4.

**Rail (Process).** Lines `9092:5703` to `9092:5710`: the parked shelf (`rail:park-down` at x 4659, `rail:park` at y 859 from x 4660 to 5640), the checkpoint loop (`rail:loop-down` at x 5979, `rail:loop` at y 399 from x 5980 to 7000, `rail:loop-up` at x 6999), the artifact connector (`rail:artifact-down` at x 8199), and the reap shelf (`rail:reap-down` at x 7419, `rail:reap` at y 1059 from x 7420 to 8500). Captions `9092:5711` to `9092:5731`, including the five chapter captions at y 520 (two of them naming the designed cluster), the loop caption at y 380, and one caption per shelf.

| Piece | Node | Treatment |
| --- | --- | --- |
| [Scheduler] | `9092:5379` | Actor, Agent, bracketed; caption A STATIC SYSTEM SCHEDULE · TBD |
| [Worker] | `9092:5393` | Actor, Agent, bracketed; caption POS.SYNC RUN · TBD |
| Core API | `9092:5407` | Actor, Agent; caption GROCERBOT-CORE · /V1/POS · TRUSTED CALLER |
| Operator | `9092:5421` | Actor, Internal Human, on the parked shelf; caption GBC POS PLAN-SHOW · THEN APPROVE OR REJECT |
| [Clover sync report] | `9092:5732` | Artifact, Discord, bracketed, hanging from the rail after [POSTS THE REPORT] |
| Operator terminal | `9092:5737` | Interface, Code block, on the parked shelf; the approve and reject lines |
| [TICKS POS.DISPATCH] | `9092:5430` | Operation, Trigger, bracketed; TBD badge `9092:5695`; centred on the [Orchestrator POS chain] card's tie |
| [LISTS ENABLED CONNECTIONS] | `9092:5442` | Operation, View, bracketed |
| [PUSHES POS.PLAN] | `9092:5455` | Operation, Write, bracketed |
| [CALLS PLAN] | `9092:5462` | Operation, Write, bracketed; centred on the POS API card's tie |
| SELECTS THE DOCUMENTS | `9092:5469` | Operation, Route |
| RESOLVES FAMILIES | `9092:5482` | Operation, Write |
| PULLS CLOVER | `9092:5489` | Operation, View; centred on the Pull and witness card's tie |
| WITNESSES THE COUNTS | `9092:5502` | Operation, Write, muted, Part 6 |
| DERIVES TIER LINES | `9092:5509` | Operation, Route; centred on the Tiering and matching card's tie |
| MATCHES EACH LINE | `9092:5522` | Operation, Route |
| PRICES BY THE CASCADE | `9092:5535` | Operation, Route |
| PLANS THE ACTIONS | `9092:5548` | Operation, Write; centred on the Plan service card's tie |
| RECORDS RECEIPTS | `9092:5555` | Operation, Write |
| PROJECTS STOCK | `9092:5562` | Operation, Write |
| EVALUATES GUARDRAILS | `9092:5569` | Operation, Route; centred on the Pricing and guardrails card's tie; the parked shelf drops after it |
| PARKS THE PLAN | `9092:5642` | Operation, Route, parked shelf |
| APPROVES OR REJECTS | `9092:5655` | Operation, Action, parked shelf; centred on the gbc pos card's tie |
| [PUSHES POS.APPLY] | `9092:5582` | Operation, Write, bracketed; TBD badge `9092:5697` |
| APPLIES A BATCH | `9092:5589` | Operation, Write; centred on the Apply engine card's tie; the loop lands before it |
| WRITES TO CLOVER | `9092:5596` | Operation, Output; centred on the Clover adapter card's tie; the loop rises after it |
| CLOSES THE PLAN | `9092:5609` | Operation, Write; the reap shelf drops after it |
| BUILDS THE REPORT | `9092:5616` | Operation, Output |
| [POSTS THE REPORT] | `9092:5629` | Operation, Output, bracketed; TBD badge `9092:5699`; ends the rail |
| [TICKS POS.REAP] | `9092:5668` | Operation, Trigger, bracketed, reap shelf; TBD badge `9092:5701` |
| REAPS STALE PLANS | `9092:5680` | Operation, Write, reap shelf, dead end |
| P4 · THE ORCHESTRATOR DRIVES, CORE EXECUTES | `9092:5687` | Principle pill under [LISTS ENABLED CONNECTIONS] |
| P6 · ONE CANONICAL FORMAT IS THE CONTRACT | `9092:5689` | Principle pill under DERIVES TIER LINES |
| P7 · ONE LEDGER NUMBER PER FAMILY, TIERS ARE VIEWS | `9092:5691` | Principle pill under PROJECTS STOCK, shifted 19 px left so the guardrails tie clears it |
| P3 · FAIL LOUD | `9092:5693` | Principle pill under PARKS THE PLAN, on the shelf |

**Piping cards**, left to right at pitch 780 from x 300: [Orchestrator POS chain] `9094:5582` (bracketed title), POS API `9094:5742` (routes table), Pull and witness `9094:5923`, Tiering and matching `9094:6094` (matching table), Plan service `9094:6272`, Pricing and guardrails `9094:6460` (config, Pipe icon, guardrails table), gbc pos `9094:6604` (commands table), Apply engine `9094:6792`, Clover adapter `9094:6954` (mapping table), Clover `9094:7145` (External Tool).

**Data cards**, left to right: documents `9094:78312` (muted, Part 4, the read side), pos_connections `9094:78437`, pos_items `9094:78601`, pos_item_syncs `9094:78758`, pos_plans `9094:78890`, pos_pricing_rules `9094:79054`, product_families `9094:79179` (muted, Part 6), pos_plan_actions `9094:79304`, inventory_movements `9094:79450` (muted, Part 6), sellable_compositions `9094:79568` (muted, Part 6). All PostgreSQL, TABLE.

**Ties.** Rail to card `9092:5740` to `9092:5748`, nine, from each tag's centre; the shelf tie starts under its shelf tag at y 885; the ties under the TBD badge and the P6 pill start at y 660. Clover adapter to Clover `9092:5749`, horizontal at y 1240. Card to data `9094:79679` to `9094:79686`, eight segments for six ties: the Pull and witness card's second tie leaves at x 2350 and bends at y 2300 to pos_item_syncs. No tie crosses another. Muted pieces carry opacity 0.55; bracketed pieces are at full opacity with a grey badge.

## Component changes on SYSTEM LEGEND

None. The TBD badge is a Color Tag, Grey variant (`9018:1117`), instanced four times with the text TBD · DESIGNED, NOT WIRED; no legend piece describes it. Visual Rules open item 14.

## How the cards were built

As on Parts 2 to 4: clones of the Part 1 card shells refilled from block prototypes, with every table cell set by direct text override in x order. The rail pieces are clones of Part 2 and Part 3 pieces; the badges are fresh instances.

## Checks run

A scan of the 585 text nodes on the board found no overflow. A piece-overlap scan found the parked shelf's caption under its pill, moved down. Four caption boxes wrapped to two lines and were widened. Screenshot inspection at native scale covered the rail in four crops, every Piping card, every Data card, and the tie band; a second screenshot after the fixes covered the three rail regions that changed.

## Known leftovers, none blocking

- The board is a working board. None of the release checks in Visual Rules section 7 has been approved.
- The TBD badge has no legend piece.
- The witness step is drawn muted on this rail and will be drawn in full on Part 6.
