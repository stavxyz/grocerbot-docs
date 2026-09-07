# Build Log: Part 4

What was built in the GrocerBot System Docs Figma file (`nBmhDyEDpFPrMq0ztmHDb0`) for Part 4, document canonicalization, with node ids so later tasks can find and edit instead of redraw. Built 2026-09-07. Every entry was verified from two full-board screenshots at native scale, cropped and inspected region by region.

## VISUAL DOCUMENTATION page (`7001:129074`), Part 4 board

Frame `P4 · Document Canonicalization`, node `9084:4121`, 9100 by 3243, at y 10929, below the Part 3 board. Lanes at the same heights as the other boards. Title `9084:4122`, subtitle `9084:4123`, lane labels `9084:4124` to `9084:4126`, rail `9084:4127`, 8120 wide, 200 more than Part 3's so the publish tag fits.

**Rail (Process).** Lines `9085:4364` to `9085:4373`: the pass-through shelf (`rail:pass-down` at x 1039, `rail:pass` at y 859), the 409 door (`rail:door-up` at x 3099, `rail:door` at y 399 from x 3100 to 7920, `rail:door-down` at x 7919), the teaching shelf (`rail:teach-down` at x 4649, `rail:teach` at y 859 from x 4650 to 6220, `rail:ping-down` at x 4899 to the artifact), and the failure shelf (`rail:fail-down` at x 7829, `rail:fail` at y 1059 from x 7830 to 8530). Captions `9085:4374` to `9085:4392`, including the three chapter captions at y 520, the two "the worker again" captions, the door caption at y 380, and one caption per shelf.

| Piece | Node | Treatment |
| --- | --- | --- |
| Worker | `9085:4121` | Actor, Agent; caption THE CANONICALIZE JOB · BUDGET -1 |
| Core API | `9085:4135` | Actor, Agent; caption GROCERBOT-CORE · FASTAPI · TRUSTED CALLER |
| Operator | `9085:4149` | Actor, Internal Human, on the teaching shelf; caption READS #OPS · NO GBC COMMAND FOR MAPPINGS |
| The teaching ping | `9085:4393` | Artifact, Discord, hanging from the teaching shelf under PINGS OPS |
| Operator HTTP | `9085:4398` | Interface, Code block, under FIXES THE MAPPINGS; one PUT line |
| PICKS UP CANONICALIZE | `9085:4158` | Operation, Trigger; centred on the Canonicalize task card's tie |
| READS THE CACHED CSV | `9085:4170` | Operation, View |
| PASSES THROUGH | `9085:4310` | Operation, Output, pass-through shelf, dead end |
| RESOLVES TYPE AND TENANT | `9085:4183` | Operation, Route |
| UPLOADS THE CSV | `9085:4196` | Operation, Write; centred on the Core client card's tie |
| DETECTS AND PARSES | `9085:4203` | Operation, Write; centred on the Format and parse card's tie |
| EXTRACTS THE IDENTITY | `9085:4210` | Operation, Route |
| ANSWERS 409 IF SEEN | `9085:4223` | Operation, Route; centred on the Upload and scoping card's tie; the door rises after it |
| STORES THE FILE | `9085:4236` | Operation, Write |
| DRIVES THE STAGES | `9085:4243` | Operation, Write |
| ASSIMILATES | `9085:4250` | Operation, Write; centred on the Assimilate card's tie; the teaching shelf drops after it |
| PINGS OPS | `9085:4323` | Operation, Output, teaching shelf; centred on the Ops ping card's tie |
| FIXES THE MAPPINGS | `9085:4336` | Operation, Action, teaching shelf; centred on the Seed and mappings card's tie |
| CANONICALIZES | `9085:4257` | Operation, Write; centred on the Canonicalize stage card's tie |
| CROSS-CHECKS THE CUSTOMER NUMBER | `9085:4264` | Operation, Route |
| PROJECTS THE FACETS | `9085:4277` | Operation, Write; centred on the Policies card's tie; the failure shelf drops after it |
| FAILS THE DOCUMENT | `9085:4349` | Operation, Write, failure shelf, dead end |
| READS THE SNAPSHOT | `9085:4284` | Operation, View; the door lands before it |
| PUBLISHES .CANONICALIZED | `9085:4297` | Operation, Output; ends the rail |
| P4 · THE ORCHESTRATOR DRIVES, CORE EXECUTES | `9085:4356` | Principle pill under DRIVES THE STAGES |
| P3 · FAIL LOUD | `9085:4358` | Principle pill under PINGS OPS, on the shelf |
| P6 · ONE CANONICAL FORMAT IS THE CONTRACT | `9085:4360` | Principle pill under CANONICALIZES |
| P5 · THE SAAS INVARIANT | `9085:4362` | Principle pill under CROSS-CHECKS THE CUSTOMER NUMBER |

**Piping cards**, left to right at pitch 780 from x 300: Canonicalize task `9086:4272`, Core client `9086:4478` (routes table), Format and parse `9086:4659`, Upload and scoping `9086:4785` (state gates table), Cloudflare R2 `9086:5042` (External Tool), Assimilate `9086:5113` (seeded vendors table), Ops ping `9086:5316`, Seed and mappings `9086:5467` (config, Pipe icon), Canonicalize stage `9086:5562`, Policies `9086:5746` (config, the two policies side by side).

**Data cards**, left to right: invoice blob cache `9086:76983` (Redis, ROW, the read side), events stream `9086:77106` (Redis, TABLE, the write side), tenants `9086:77239` (PostgreSQL, TABLE), documents `9086:77357` (PostgreSQL, TABLE), document object `9086:77535` (Cloudflare R2, ROW), audit_log `9086:77670` (muted, no writer), unique locks `9086:77795` (muted, Part 1), vendors `9086:77918` (PostgreSQL, TABLE), tenant_vendor_settings `9086:78057` (PostgreSQL, TABLE).

**Ties.** Rail to card `9085:4401` to `9085:4409`, nine, from each tag's centre; the two shelf ties start under their shelf tags at y 920 and y 885. Upload and scoping to Cloudflare R2 `9085:4410`, horizontal at y 1240. Card to data `9086:78182` to `9086:78192`, eleven segments for seven ties: the task card's second tie leaves at x 800 and bends at y 2300 to the events stream; the upload card's second tie leaves at x 3100 and bends at y 2380 to the document object. No tie crosses another. Muted pieces carry opacity 0.55.

## Component changes on SYSTEM LEGEND

None. The config-card icon (Pipe) was read from the Part 3 Routes card and reused.

## How the cards were built

As on Parts 2 and 3: clones of the Part 1 card shells refilled from block prototypes, with every table cell set by direct text override in x order. The rail pieces are clones of Part 2 and Part 3 pieces.

## Checks run

A scan of the 514 text nodes on the board found one overflow, the plain-text name TAUGHT MAPPINGS by 2 px on the Seed and mappings card, renamed TAUGHT, and one overlap of caption boxes whose texts did not touch, narrowed. Screenshot inspection at native scale covered the rail in four crops, every Piping card, every Data card, and the tie band; a second screenshot after the fixes covered the three rail regions that changed. Fixes between the two: the four shelf tags, the shelf pill, the Operator, the artifact, and the code block were re-appended above their shelf lines; four captions that a tie crossed were shortened; the failure caption was shortened to one line.

## Known leftovers, none blocking

- The board is a working board. None of the release checks in Visual Rules section 7 has been approved.
- The Worker acts three times on the rail and is drawn once, with two captions where it acts again.
- The Code block interface now carries an HTTP request line rather than a CLI command; Visual Rules open item 4 notes it.
