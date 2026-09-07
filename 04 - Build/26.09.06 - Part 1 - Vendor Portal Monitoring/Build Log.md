# Build Log

What was built in the GrocerBot System Docs Figma file (`nBmhDyEDpFPrMq0ztmHDb0`) during this run, with node ids so later tasks can find and edit instead of redraw. Every entry below was verified from an inline screenshot returned by the script that made it, unless marked otherwise.

## 2026-09-06, SYSTEM LEGEND page (`7001:129072`)

The legend was built by cloning the DRAPER example legend's sheets onto the empty GrocerBot page, re-pointing every instance to the cloned components, and pruning and renaming for four levels. Thirty-one Figma MCP calls on the Professional plan.

| Sheet | Node | Position | State |
| --- | --- | --- | --- |
| Legend Charter | `9030:604` | x -3596 | new: title and one paragraph naming the four levels and the sheet order |
| Principles | `9030:609` | x -1698 | new: P1 to P7 with eyebrow, name, statement, source; eyebrow bound to `Levels/Principles/Color` |
| Colors | `9018:56` | x 0 | Functions and Logic rows removed; Principles row added with new variables `Levels/Principles/Color` `#E96B0C`, `Outline` `#FBE9DC`, `Fill` `#FEF8F3`; Artifact / Output retitled; three descriptions rewritten; Supabase and Draper App logotype rows removed |
| Typography | `9018:294` | x 1698 | cloned unchanged; the nine styles are the file's local text styles |
| Layout Tokens | `9018:366` | x 3396 | cloned unchanged |
| Locations | `9018:434` | x 5094 | `Tools` set `9018:442` now Github, Cloudflare R2, Cloudflare, Discord, Faktory, Redis, PostgreSQL, Clover, BEK, OpenObserve, DigitalOcean; the eight new marks are text only, glyphs TBD; Transfer Mark reads POSTGRESQL to FAKTORY, Multi-Tool reads GITHUB plus CLOUDFLARE R2; the usage card is the vendor.poll runner |
| Operations | `9018:638` | x 6734 | set renamed `Operations` (`9018:646`), property renamed `Operation`; Voice variant and card removed; eight variants: Action, Trigger, Write, View, Output, Route, External, Secondary; examples WRITES SNAPSHOT and TICK FIRES |
| Records | `9018:721` | x 8374 | set renamed `Records` (`9018:729`); variants Piping (brown, Pipe icon), Data, Artifact, Output Data; Logic removed; GrocerBot pill examples |
| Icons | `9018:797` | x 10014 | set `9018:805` pruned to Runner, Router, Data, Action, Trigger, Create, View, Pipe, External Tool in Square and Rounded |
| Tags | `9018:1062` | x 11654 | cloned unchanged |
| Actor | `9018:1129` | x 13294 | designations: Vendor; Operator, Store Staff, Buyer; Scheduler, Worker, Browser Worker, Notifier, API, Init, Email Worker, Core |
| Card Blocks | `9018:1236` | x 14934 | cloned; the Tool example mark now reads GITHUB |
| Card Skeletons | `9018:1361` | x 16574 | Function, Mr Draper, Logic columns removed; Runner, Router, Data, External Tool remain; marks POSTGRESQL and BEK PORTAL |
| Card - Piping Runner | `9018:1449` | y 3200 | retitled from Draper Harness |
| Card - Piping Router | `9018:1491` | y 3200 | text re-based |
| Card - Data | `9018:1533` | y 3200 | store text re-based |
| Card - External Tool | `9018:1604` | y 3200 | examples re-based |

Component sets on the page after the build: Tools `9018:442`, Operations `9018:646`, Records `9018:729`, Icons `9018:805`, Change Tag `9018:1083` and `9018:1093`, Color Tag `9018:1110`, Actor `9018:1206`, Container Field `9018:1295`, Table Components `9018:1335`. Standalone: Multi-Tool Location `9018:614`, Change Tag `9018:1075`, Code block `9018:1103`, Container Title `9018:1249`, Description Container `9018:1257`, Text Container `9018:1264`, Closed Container `9018:1272`, Operation Reference `9018:1279`.

Known leftovers, none blocking:

- Three instances still point at DRAPER-page components that were not cloned: one `Location Transfer` and two `Connections/Write`. They render correctly.
- The Colors sheet's column labels and two texts used a font not installed here (PP Mori); those texts were switched to Inter Semi Bold when edited. Other untouched texts may still carry PP Mori and will fall back in Figma's renderer.
- The Operations set has no Create variant; Output carries the blue, as in DRAPER's live legend.
- Eight location marks have no glyph. Adding a real vendor vector to each variant is an owner task.
- The Card Blocks sheet still carries DRAPER phrasing in a few captions.

## 2026-09-06, VISUAL DOCUMENTATION page (`7001:129074`), Part 1 board

Board frame `card`-style name `Part 1 · Vendor portal monitoring`, node `9040:537`, 9083 by 3243. Three lanes: the Process rail at y 599, Piping cards from y 1180, Data cards from y 2540. Every piece is an instance of a SYSTEM LEGEND component or a clone of a legend card skeleton. Verified from two full-board screenshots at native scale, cropped and inspected region by region, after the fixes listed under Component changes.

**Rail (Process).** Title `9040:538`, subtitle `9040:539`, lane labels `9040:540` to `9040:542`, rail and branch lines `9040:543` to `9040:552`, captions `9040:553` to `9040:559`.

| Piece | Node | Treatment |
| --- | --- | --- |
| Init | `9041:537` | Actor, Agent; caption AT DEPLOY |
| Scheduler | `9041:558` | Actor, Agent; caption EVERY 60 SECONDS |
| Operator | `9041:654` | Actor, Internal Human, above the rail on the doors branch |
| Browser worker | `9041:585` | Actor, Agent; caption ON THE BROWSER WORKER |
| Notifier | `9041:634` | Actor, Agent, muted; caption PART 3 · NOTIFICATION DELIVERY |
| Operator terminal | `9041:696` | Interface, Code block: `$ gbo trigger bek notifications --tenant freco` |
| Discord ops alert | `9041:699` | Artifact, on the ping branch |
| RECONCILES SEED | `9041:551` | Operation, Write |
| TICK FIRES | `9041:572` | Operation, Trigger |
| RUNS GBO TRIGGER | `9041:663` | Operation, Action, doors branch |
| EMAIL RULE FIRES | `9041:670` | Operation, Trigger, muted, doors branch |
| PUSHES POLL JOB | `9041:578` | Operation, Write |
| POLLS BEK | `9041:599` | Operation, View |
| SESSION DEAD | `9041:676` | Operation, Trigger, recovery loop |
| LOGS IN VIA CHROME | `9041:682` | Operation, Write, recovery loop |
| DIFFS AGAINST SNAPSHOT | `9041:606` | Operation, Route |
| PARSES EACH CHANGE | `9041:613` | Operation, Route |
| PUBLISHES EVENT | `9041:620` | Operation, Output |
| PINGS OPS | `9041:689` | Operation, Output, ping branch |
| SAVES SNAPSHOT | `9041:627` | Operation, Write |
| CONSUMES THE STREAM | `9041:648` | Operation, Trigger, muted |
| P5 · THE SAAS INVARIANT | `9054:1771` | Principle pill under PUSHES POLL JOB |
| P1 · DETERMINISTIC | `9054:1773` | Principle pill under DIFFS AGAINST SNAPSHOT |
| P2 · PUBLISH BEFORE SAVE | `9054:1775` | Principle pill under SAVES SNAPSHOT |
| P3 · FAIL LOUD | `9054:1777` | Principle pill under PINGS OPS |

**Piping cards**, left to right, all 683 wide: Init `9042:677`, Scheduler `9042:760`, Faktory `9042:880`, Browser worker `9043:841`, BEK portal `9043:945` (External Tool, dashed), Session recovery `9043:990`, Diff engine `9043:72199` (carries the six data types table), Emitter `9043:72281`, Notifier `9043:72409` (muted, Part 3 boundary). Header marks: GITHUB on the code cards, FAKTORY, BEK PORTAL.

**Data cards**, left to right: vendors `9043:72453` (PostgreSQL, TABLE), schedules `9043:72543` (PostgreSQL, TABLE), job_enqueues `9043:72722` (PostgreSQL, ROW, muted, under Faktory), unique lock `9043:72647` (Redis, ROW, under the browser worker), graftpunk session `9043:72803` (Cloudflare R2, ROW), browser login keys `9043:72870` (Redis, ROW), snapshots `9043:72930` (PostgreSQL, TABLE), dedup keys `9043:73013` (Redis, ROW), events stream `9043:73080` (Redis, TABLE), workflow_runs `9043:73176` (PostgreSQL, ROW, muted), job_executions `9043:73243` (PostgreSQL, ROW, muted).

**Ties.** Twenty-five dashed segments `9045:72908` to `9045:72932`, named `tie:<from>-<to>:<segment>`. Rail to Piping ties start at y 640, or y 660 where a principle pill sits under the tag; the recovery login tie starts at y 885 under its tag. Ties with two bends route at y 2300 or y 2380 between the lanes. The unique lock's tie comes from the browser worker card (`9045:72922`, straight at x 2981); the scheduler's tie to job_enqueues bends at y 2300 and lands at x 2100. No tie crosses another. No tie is drawn to workflow_runs or job_executions; their WRITTEN BY rows name the writers.

**Muted pieces** carry opacity 0.55 on the node itself: the email door tag, the Notifier actor, tag, and card, and the job_enqueues, workflow_runs, and job_executions cards.

**Component changes made for this board**, on the SYSTEM LEGEND page:

- Table Components `9018:1335`: FIELD column 220, TYPE column 130, value text set to auto height and fill width in the Header, Row, and Changed Row variants. Before this, 21 table cells on the board truncated.
- Operations `9018:646`: the Output variant `9018:665` text node is now bound to the `Text` property. It was unbound, so every Output instance read `Text` whatever its property said.
- Principles sheet `9030:609`: an example principle pill with caption, row `9054:72875`, so the board's pills instance a documented piece.

**Checks run.** A scan of the 498 text nodes on the board found none extending past a clipping ancestor or past its card, and no fixed-size text with content larger than its box. Screenshot inspection at native scale covered the rail, every Piping card, every Data card, and the tie band.

Known leftovers, none blocking:

- The Actor set's nested name pill is not bound to the set's `Name` property, so the five actors carry a direct text override. Binding it in the legend is an owner task.
- The Data card headers had pointed at deleted DRAPER Tools variants with text overrides; all eleven now point at the GrocerBot variants. The Card Skeletons sheet may still carry the same stale pointer.
- Grain badges: keys and the R2 object carry ROW, the stream TABLE, because the Change Tag set has no other variants.
- The principle pill is a rebound Color Tag, not a variant of its own.
- The board is a working board. None of the release checks in Visual Rules section 7 has been approved.

## Next

Sam's three approvals on the Part 1 board: semantics, visuals, release checks. Then Part 2 or the SYSTEM REGISTRY page, which is still empty.
