# Build Log: System Registry

What was built on the SYSTEM REGISTRY page (`7001:129073`) of the GrocerBot System Docs Figma file (`nBmhDyEDpFPrMq0ztmHDb0`) on 2026-09-07, with node ids so later tasks can find and edit instead of redraw. Every list was verified from a screenshot at native scale; every specimen frame from a screenshot showing every card present and none overlapping.

## The page

Twenty-five top-level nodes. The charter at the left, then six bands stacked down the page, each a title, a definition line, a list at x 100, and a specimen frame at x 1360 on the same baseline. Page bottom at y 7704; the widest band, Piping, runs to x 40005.

| Node | Id | Position | Size |
| --- | --- | --- | --- |
| charter | `9114:533` | x -1200, y 0 | 992 by 924 |
| band:principles, band-def:principles | `9119:6361`, `9119:6362` | y 0 | |
| list:principles | `9116:538` | y 100 | 1200 by 449, 7 rows `9116:554` to `9116:608` |
| cards:principles | `9118:1260` | y 100 | 1720 by 100, 7 pills |
| band:actors, band-def:actors | `9119:6363`, `9119:6364` | y 749 | |
| list:actors | `9116:617` | y 849 | 1200 by 595, 11 rows `9116:633` to `9116:713` |
| cards:actors | `9118:1275` | y 849 | 1764 by 160, 11 actors |
| band:interfaces, band-def:interfaces | `9119:6365`, `9119:6366` | y 1644 | |
| list:interfaces | `9116:721` | y 1744 | 1200 by 475, 8 rows `9116:740` to `9116:824` |
| cards:interfaces | `9118:1517` | y 1744 | 1948 by 100, 4 code blocks |
| band:artifacts, band-def:artifacts | `9119:6367`, `9119:6368` | y 2419 | |
| list:artifacts | `9116:836` | y 2519 | 1200 by 475, 8 rows `9116:855` to `9116:939` |
| cards:artifacts | `9118:1530` | y 2519 | 3727 by 172, 8 artifacts |
| band:piping, band-def:piping | `9119:6369`, `9119:6370` | y 3194 | |
| list:piping | `9117:590` | y 3294 | 1200 by 2355, 55 rows `9117:609` to `9117:1257` |
| cards:piping | `9118:1571` | y 3294 | 38645 by 983, 55 cards |
| band:data, band-def:data | `9119:6371`, `9119:6372` | y 5849 | |
| list:data | `9117:80896` | y 5949 | 1200 by 1561, 35 rows `9117:80915` to `9117:81323` |
| cards:data | `9118:84846` | y 5949 | 24585 by 723, 35 cards |

## How it was built

- **The charter** is a clone of the example registry's charter sheet with every text rewritten: title, intro, six numbered sections. Its type is the sheet's own: 36 Semi Bold, 20 Semi Bold, 14 Regular.
- **The lists** are clones of two example list frames, one with a HOST column and one without, trimmed to a single row and then filled: title, definition, head cells, and one row per entry cloned from the template row. Each row is a horizontal auto-layout: a tag cell 135 wide, NAME 175, DESCRIPTION 445, HOST 140, WHERE 150 (the no-host lists keep DESCRIPTION at 500 and WHERE at 882). The list frame hugs its rows. Row names are `row:<slug>`.
- **The KIND cell** is GrocerBot's own Color Tag (`9018:1110` set): Grey for actor and interface kinds, Outline for EXTERNAL actors, Blue for artifacts, Brown for piping code kinds, Grey for EXTERNAL and DESIGNED piping, Pink for data. Principles rows carry a clone of the board pill `9054:1773` with its text cut to the number.
- **The HOST cell** is GrocerBot's Tools mark (`9018:442` set), swapped per row; rows with no host keep an empty host frame so the columns align.
- **The specimens** are clones of the board pieces named in the Handoff Brief, renamed `reg:<original name>`, laid out left to right at gap 20 (cards) or 40 (rail pieces), top-aligned. Nothing was redrawn.
- The two templates were removed at the end.

## Checks run

Screenshots at native scale of the charter and all six lists, and of all six specimen frames (the Piping and Data frames at a quarter scale, enough to see every card present and none overlapping). A scan of the 372 row texts found no cell wrapped past two lines, no clipped tag or mark, and no cell overlapping its neighbour; a scan of the 25 top-level nodes found no overlap. One fix after the first screenshot: the HOST cell was 105 wide and clipped the two Cloudflare marks to "CLOUDFLAI"; widened to 140 with DESCRIPTION narrowed to 445, which wrapped one description (schedules) to two lines.

## Component changes on SYSTEM LEGEND

None. The list row is not a legend piece; Visual Rules open item 15 records it.

## Known leftovers, none blocking

- The page is a working page; none of the release checks has been approved.
- Four interface rows have no specimen because no board drew one.
- Operations have no band.
