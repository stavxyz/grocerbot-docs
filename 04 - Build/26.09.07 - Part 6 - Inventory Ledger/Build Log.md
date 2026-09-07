# Build Log: Part 6

What was built in the GrocerBot System Docs Figma file (`nBmhDyEDpFPrMq0ztmHDb0`) for Part 6, the inventory ledger, with node ids so later tasks can find and edit instead of redraw. Built 2026-09-07. Every entry was verified from a full-board screenshot at native scale, cropped and inspected region by region.

## VISUAL DOCUMENTATION page (`7001:129074`), Part 6 board

Frame `P6 · Inventory Ledger`, node `9095:6740`, 9100 by 3243, at y 18215, below the Part 5 board. Lanes at the same heights as the other boards. Title `9095:6741`, subtitle `9095:6742`, lane labels `9095:6743` to `9095:6745`, rail `9095:6746`, 6920 wide (x 380 to 7300); the board has nine Piping cards and the rail ends after the last.

**Rail (Process).** Lines `9096:6945` to `9096:6949`: the clamp shelf (`rail:clamp-down` at x 4659, `rail:clamp` at y 859 from x 4660 to 5000) and the sensor loop (`rail:loop-down` at x 2699, `rail:loop` at y 399 from x 2700 to 7060, `rail:loop-up` at x 7059). Captions `9096:6950` to `9096:6967`: four chapter captions at y 520, the loop caption at y 380, two actor captions, ten tag captions at y 640 (one at y 660 to clear its neighbour), and the shelf caption.

| Piece | Node | Treatment |
| --- | --- | --- |
| Core API | `9096:6740` | Actor, Agent; caption THE PLAN BUILD AND THE PULL |
| Store staff | `9096:6754` | Actor, Internal Human; caption AT THE REGISTER AND THE SHELF; the loop lands before it |
| DERIVES THE MULTIPLIERS | `9096:6763` | Operation, Route; centred on the Tiering card's tie |
| RESOLVES A FAMILY | `9096:6776` | Operation, Write |
| WRITES THE COMPOSITION EDGE | `9096:6783` | Operation, Write; centred on the Plan build card's tie |
| RECORDS THE RECEIPT | `9096:6790` | Operation, Write; centred on the Ledger card's tie |
| SEEDS UNBROKEN PACKAGES | `9096:6797` | Operation, Write |
| SELLS ANY FORMAT | `9096:6804` | Operation, Action, Store staff |
| RECOUNTS OR SCANS | `9096:6817` | Operation, Action, Store staff |
| PULLS THE COUNTS | `9096:6830` | Operation, View; centred on the Pull card's tie |
| DIFFS AGAINST THE BASELINE | `9096:6843` | Operation, Route |
| WITNESSES A SALE | `9096:6856` | Operation, Write; centred on the Witness engine card's tie; the clamp shelf drops after it |
| CLAMPS AT ZERO | `9096:6924` | Operation, Route, clamp shelf, dead end |
| RE-ANCHORS ON A RECOUNT | `9096:6863` | Operation, Write |
| INFERS PACKAGING | `9096:6870` | Operation, Write |
| ADOPTS A BARCODE | `9096:6877` | Operation, Write |
| ADVANCES THE BASELINE | `9096:6884` | Operation, Write |
| PROJECTS EACH TIER | `9096:6891` | Operation, Route; centred on the Projection card's tie |
| EMITS UPDATE_STOCK | `9096:6904` | Operation, Output |
| APPLY SETS STOCK ON CLOVER | `9096:6917` | Operation, Write, muted, Part 5; centred on the muted Apply card's tie; the loop rises after it |
| P6 · ONE CANONICAL FORMAT IS THE CONTRACT | `9096:6937` | Principle pill under DERIVES THE MULTIPLIERS |
| P1 · DETERMINISTIC | `9096:6939` | Principle pill under DIFFS AGAINST THE BASELINE |
| P3 · FAIL LOUD | `9096:6941` | Principle pill under CLAMPS AT ZERO, on the shelf |
| P7 · ONE LEDGER NUMBER PER FAMILY, TIERS ARE VIEWS | `9096:6943` | Principle pill under PROJECTS EACH TIER |

**Piping cards**, left to right at pitch 780 from x 300: Tiering `9097:6873` (shapes table), Plan build, ledger half `9097:7048`, Ledger `9097:7217`, Clover, the sensor `9097:7360` (External Tool), Pull, the sensor read `9097:7427`, Witness engine `9097:7570` (movements table), Ledger tests `9097:7744` (pins table), Projection `9097:7938`, Apply, the stock write `9097:8094` (muted, Part 5).

**Data cards**, left to right: sellable_compositions `9097:79283`, product_families `9097:79408`, inventory_movements `9097:79554`, pos_items `9097:79704` (muted), pos_item_syncs `9097:79829` (muted), pos_connections `9097:79947` (muted), pos_plan_actions `9097:80058` (muted). All PostgreSQL, TABLE.

**Ties.** Rail to card `9096:6968` to `9096:6974`, seven, from each tag's centre; the ties under the P6 and P7 pills start at y 660; the tie to the muted Apply card carries the muted opacity. Pull to Clover `9096:6975`, horizontal at y 1240, leftward from the Pull card to the Clover card. Card to data `9097:80176` to `9097:80184`, nine segments for five ties: the Plan build card's second tie leaves at x 1300 and bends at y 2300 to sellable_compositions; the Projection card's tie leaves at x 6000 and bends at y 2300 to pos_plan_actions. No tie crosses another. Muted pieces carry opacity 0.55.

## Component changes on SYSTEM LEGEND

None.

## How the cards were built

As on Parts 2 to 5: clones of the Part 1 card shells refilled from block prototypes, with every table cell set by direct text override in x order. The rail pieces are clones of Part 2 and Part 3 pieces.

## Checks run

A scan of the 394 text nodes on the board found no overflow, no overlapping rail pieces, no wrapped captions, and no caption crossed by a vertical line. Screenshot inspection at native scale covered the rail in three crops, every Piping card, every Data card, and the tie band. No fixes were needed after the first screenshot.

## Known leftovers, none blocking

- The board is a working board. None of the release checks in Visual Rules section 7 has been approved.
- The loop uses the branch-line convention; open item 13.
- The rail is shorter than the other boards' because the part has nine cards; the frame keeps the shared width.
