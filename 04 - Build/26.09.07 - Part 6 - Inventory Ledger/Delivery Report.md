# Delivery Report: Part 6, Inventory Ledger

Dated 2026-09-07. Written per step 7 of the Function.

## Request and resolution

"Next", after the Part 5 report named Part 6, resolved to Part 6, the inventory ledger: from the plan build's first touch of a family, through the receipts and the composition edges, the store's sales and recounts between syncs, the pull's observations and the witness engine, to the projections written back into the plan and the muted apply the loop returns from. Standing per the harness: designed, not wired, read as a statement about the entry point; the code is complete for v1 and drawn as current.

## Sources read

Core at `dd74fe9`: the inventory package, the two ledger migrations, the POS glue that writes and reads the ledger, the Clover stock path, the tests, the consumption-DAG design, the ledger spec, and core issues #28, #30, #32, #33, #35, #36. The Context Record lists every file opened and why. No failure to open a file is recorded there.

## Produced

- Part 6 board on VISUAL DOCUMENTATION, node `9095:6740`: two actors, eighteen operations (one muted), four principle pills, nine Piping cards, seven Data cards, sixteen tie segments, one loop, one shelf.
- Legend change: none.
- In this folder: Context Record, Handoff Brief with its nature pass, Build Log, this report, and the behind-the-scenes audit.
- Lexicon: `baseline` and `anomaly stream`.

## Deviations from the brief and the visual rules

- The rail is 6920 wide, shorter than the other boards', because the part has nine cards.
- One tag caption sits at y 660 rather than 640 to clear its neighbour.
- The Pull card's horizontal tie runs leftward to the Clover card.

## Corrections for the owner

- The POS spec names an `item_stocks` fallback for truncated expansions; the client has none. Whether the truncation is real is the spec's claim, unverified here.
- `product_families.barcode` is written and read by nothing; the model comment already says so.
- `cogs_cents` is called by tests only.

## Unresolved naming and boundaries

- Whether Store staff belongs on a core board. Drawn, because the witness reads what they do.
- Whether the ledger's standing should read "reached only through the plan build" rather than "designed, not wired". A harness wording question for Sam.
- `baseline` is a code-comment word for `synced_field_values.stock`; added to the lexicon as such.

## Source conflicts

As recorded in the Context Record: the spec's fallback versus the client; columns without readers; a formula without a caller; the harness standing versus the tree.

## Findings for the owner

Eight, listed in the audit and the Context Record. None was filed: one rests on an unverifiable platform fact, three are acknowledged in the design or the code, one is a design gap, and three are the owner's open issues.

## Verification

One full-board screenshot at native scale, cropped and inspected: the rail in three crops, every Piping card, every Data card, and the tie band. A geometry scan of the 394 text nodes found no overflow, no overlaps, no wrapped captions, and no caption crossed by a line. No fixes were needed. Nothing on the board was checked against a running environment; nothing runs the ledger outside tests.

## Next

Sam's three approvals. Then Part 7, reliability and operations, the last part: the workflow framework, the reapers, the DLQ monitor, compensations, unique jobs, the ops summaries and pings, the dedup metrics, and the OpenObserve alerts, much of which Parts 1 to 5 drew muted. Or the SYSTEM REGISTRY page.

## Issues filed, 2026-09-07

None for this part. The reasons are in the audit.
