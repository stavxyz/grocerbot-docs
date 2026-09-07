# Build Log: Part 2

What was built in the GrocerBot System Docs Figma file (`nBmhDyEDpFPrMq0ztmHDb0`) for Part 2, email ingestion, with node ids so later tasks can find and edit instead of redraw. Built 2026-09-06 to 2026-09-07. Every entry was verified from full-board screenshots at native scale, cropped and inspected region by region, unless marked otherwise.

## VISUAL DOCUMENTATION page (`7001:129074`), Part 2 board

Frame `P2 · Email Ingestion`, node `9058:72874`, 9100 by 3243, placed at y 3643, below the Part 1 board. Lanes at the same heights as Part 1: the Process rail at y 599, Piping cards from y 1180, Data cards from y 2540. Title `9058:72875`, subtitle `9058:72876`, lane labels `9058:72877` to `9058:72879`, rail `9058:72880`.

**Rail (Process).** Branch lines `9061:1875` to `9061:1884`: the door (`rail:doors`, `rail:doors-up`), the duplicate shelf, the three rule shelves under one drop, and the unresolved stub. Captions `9061:1885` to `9061:1898`.

| Piece | Node | Treatment |
| --- | --- | --- |
| Vendor | `9061:1776` | Actor, External Human, dotted ring; caption BEK · EMAILS THE STORE'S GMAIL |
| Store staff | `9061:1793` | Actor, Internal Human, on the door above the rail |
| Gmail forwarding rule | `9061:1872` | Interface, Code block: GMAIL · FORWARDING RULE, one line |
| Email worker | `9061:1802` | Actor, Agent; caption CLOUDFLARE WORKER · PROD AND DEV |
| API | `9061:1816` | Actor, Agent; caption FASTAPI BEHIND THE CLOUDFLARE TUNNEL |
| Worker | `9061:1830` | Actor, Agent; caption ON THE WORKER · QUEUE DEFAULT |
| Browser worker | `9061:1844` | Actor, Agent, muted, on the poll shelf; caption PART 1 · VENDOR PORTAL MONITORING |
| Notifier | `9061:1858` | Actor, Agent, muted; caption PART 3 · NOTIFICATION DELIVERY |
| Forwarding Confirmed | `9061:73178` | Artifact, Discord, at the end of the confirm shelf |
| SETS UP FORWARDING | `9061:72995` | Operation, Action, door |
| EMAIL ARRIVES | `9061:73008` | Operation, Trigger; centred on the Email worker card's tie |
| STORES RAW EMAIL | `9061:73020` | Operation, Write |
| CALLS THE WEBHOOK | `9061:73027` | Operation, Route; centred on the API card's tie |
| PUSHES EMAIL JOB | `9061:73040` | Operation, Write; centred on the Faktory card's tie |
| CHECKS FOR A REPEAT | `9061:73047` | Operation, Route; centred on the Worker card's tie |
| RECORDS THE DUPLICATE | `9061:73060` | Operation, Write, duplicate shelf, dead end |
| RESOLVES TENANT · VENDOR · TYPE | `9061:73067` | Operation, Route; centred on the Resolver card's tie |
| MATCHES RULES | `9061:73080` | Operation, Route; centred on the Rules engine card's tie |
| TRIGGERS A POLL | `9061:73093` | Operation, Write, poll shelf, to the Browser worker |
| STORES ATTACHMENTS | `9061:73100` | Operation, Write, attachments shelf, dead end |
| CONFIRMS FORWARDING | `9061:73107` | Operation, Write, confirm shelf; centred on the Auto-confirm card's tie |
| POSTS TO OPS | `9061:73114` | Operation, Output, confirm shelf |
| PUBLISHES EVENT | `9061:73127` | Operation, Output; centred on the Emitter card's tie |
| RECORDS THE ARRIVAL | `9061:73140` | Operation, Write |
| FLAGS UNRESOLVED | `9061:73147` | Operation, Output, muted, unresolved stub, dead end |
| CONSUMES THE STREAM | `9061:73160` | Operation, Trigger, muted |
| P3 · FAIL LOUD | `9061:73172` | Principle pill under STORES RAW EMAIL |
| P5 · THE SAAS INVARIANT | `9061:73174` | Principle pill under RESOLVES |
| P1 · DETERMINISTIC | `9061:73176` | Principle pill under MATCHES RULES |

**Piping cards**, left to right at pitch 780 from x 700, all 683 wide: Gmail `9062:1960` (External Tool, GMAIL mark), Email worker `9062:2034` (Runner, CLOUDFLARE mark), API webhook `9062:2231`, Faktory `9063:2122` (FAKTORY mark), Worker · process_email `9063:2202`, Resolver `9063:2417` (table of the five email types), Rules engine `9063:73666` (table of the five rules), Auto-confirm `9063:73845`, Emitter · email path `9063:74005`. Code cards carry the GITHUB mark.

**Data cards**, left to right from x 1480: raw emails `9065:2518` (Cloudflare R2, ROW), job_enqueues `9065:2653` (PostgreSQL, ROW, muted), email_arrivals `9065:2780` (PostgreSQL, TABLE, sixteen rows), email dedup keys `9065:2989` (Redis, ROW), attachments `9065:3119` (Cloudflare R2, ROW), dedup keys `9065:3247` (Redis, ROW), events stream `9065:3370` (Redis, TABLE), job_executions `9065:3524` (PostgreSQL, ROW, muted).

**Ties.** Rail to card: `9061:73183` to `9061:73190`, eight, each dropping from its tag's centre (y 640, or 660 under a pill; the confirm tie from y 1085 on the shelf). Card to data: `9065:3644` to `9065:3654`, eleven segments for seven ties; the Worker to email dedup keys tie leaves the Worker card at x 4300 and bends at y 2380; the Emitter to dedup keys tie leaves at x 7000 and bends at y 2380. No tie crosses another. Muted pieces carry opacity 0.55.

## Component changes on SYSTEM LEGEND (`7001:129072`)

- Tools set `9018:442`: new text-only variant `Tool=Gmail` (`9058:538`), cloned from the BEK mark. Glyph TBD, like the other eight text-only marks.
- Card Skeletons `9018:1361`: the Data skeleton header (`9018:1425`) and External Tool skeleton header (`9018:1433`) pointed at deleted DRAPER variants (Supabase, Calendly) with text overrides; now `Tool=PostgreSQL` and `Tool=BEK`. This was the Part 1 leftover.
- Container Field `9018:1295`, Plain Text variant: the value text (`9018:1299`) is now auto height and fill width, so long values wrap instead of running past the card edge. Part 1's Plain Text values were all short; that board was re-screenshotted after the change.
- Table Components `9018:1335`: the type-column text in the Header, Row, and Changed Row variants is now auto height and fill width, so long type values wrap inside the 130 px column instead of clipping. This grew the Rules engine card to 865 and the Resolver to 755 here, and the Part 1 Diff engine card by 32 px; the two data ties that hung from those cards (`tie:rules-attachments:0` here, `tie:diff-snapshots:0` on Part 1) were re-anchored to the new card bottoms and both boards re-screenshotted.

## How the cards were built

Each Part 2 card is a clone of a Part 1 card shell with its body emptied to the title row, then refilled from block prototypes cloned from Part 1 cards: Description Container, Container Title, Text Container, Container Field (Operation, Record, Plain Text), and the table frame. Header marks swapped to the right Tools variant and reset. Table headers and type cells did not accept property values through the instance, so every table cell was set by direct text override in x order (field, type, this row); those cells no longer follow the component's text properties.

## Checks run

A scan of the 479 text nodes on the board found none extending past a clipping ancestor or its card and no fixed-size text with content larger than its box. The scan did not catch the clipped Plain Text values, which the screenshots did; the component fix above is the remedy. Screenshot inspection at native scale covered the rail in four crops, every Piping card, every Data card, and the tie band, before and after the fixes.

## Known leftovers, none blocking

- The board is a working board. None of the release checks in Visual Rules section 7 has been approved.
- Muted still has no legend entry; it is opacity 0.55 on the piece, as on Part 1.
- The Gmail mark is text only.
- Table cells on this board are direct overrides, not property values.
