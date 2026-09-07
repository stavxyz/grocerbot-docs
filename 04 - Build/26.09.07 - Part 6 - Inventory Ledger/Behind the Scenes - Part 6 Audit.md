# Behind the Scenes: Part 6 Build Audit

Every call made without asking while the Part 6 board, the inventory ledger, was built on 2026-09-07 under "next". Each entry names the decision, the alternative not taken, the reason, and what it would take to reverse it. Nothing here is a ruling. The Build Log in this folder carries the Figma node ids.

## Before the board

1. **The standing was read as a statement about the entry point, not the code.** The harness stamps Part 6 designed, not wired, and in the same breath says it is implemented in core and reached only through the planner and the pull. Every v1 piece of the spec exists at `dd74fe9` and is pinned by tests. So the board draws the code as it is, captions the standing on the rail's first chapter, and brackets nothing; the missing wiring is Part 5's orchestrator half, bracketed there. Alternative: bracket the whole board, which would say the ledger does not exist. Reverse: add TBD badges.
2. **The design document was read as the why and the spec as the what.** The consumption-DAG document's eight invariants and its sensor hierarchy shaped the rail's chapters; the spec's sections shaped the cards. The marketing draft was not opened.
3. **The owner's issues #32, #33, and #36 were read first**, so the findings cite them and none is refiled.
4. **Finding 1 was checked as far as the tree allows**: the client reads stock only through the item expansion and has no `item_stocks` read; the truncation the spec records is a platform fact from docs.clover.com that cannot be verified here and is marked so. Not filed.

## The board

5. **Two actors.** Core API for the plan build and the pull, and Store staff for the sales and recounts the witness reads. Alternative: no human, since the ledger is core code; the design's point is that staff declare nothing and the sensor reads what they do, so they belong on the rail.
6. **The rail is a loop.** Left to right: the build's four ledger writes, the store between syncs, the pull and the five witness steps, the projection and the emit, and Part 5's apply drawn muted; a line above the rail returns from after the apply to before the staff, captioned with the design's own sentence about decrements, reads, absorbing, and re-anchoring. Alternative: end at the emit and caption the return; the loop is the design's central claim.
7. **The chapter order follows `create_or_get_plan`**: derive the tiers, resolve the families, then pull, then build. `supersede_and_replace` pulls first; the Plan build card says so. The rail shows the build's edge, receipt, and seed after the pull because the build runs after it.
8. **Act colours.** DERIVES, DIFFS, PROJECTS, and CLAMPS Routes. RESOLVES, WRITES THE EDGE, RECORDS THE RECEIPT, SEEDS, WITNESSES, RE-ANCHORS, INFERS, ADOPTS, ADVANCES, and the muted APPLY Writes. PULLS a View. EMITS an Output. SELLS and RECOUNTS the two Actions.
9. **Four principle pills**: P6 under the tier derivation, P1 under the diff (the two-phase witness makes the balance independent of Clover's ordering), P3 on the clamp shelf, P7 under the projection. P1 appears for the first time since Part 1.
10. **The clamp is a shelf**, a dead end under WITNESSES A SALE, because the underflow is the one place the ledger refuses a movement and says so on the record. Alternative: a caption.
11. **Nine Piping cards.** Clover is drawn as the sensor rather than the write target, with the missing fallback and the missing delete on its face. The Ledger tests card exists because the design says the invariants are the sentences the tests pin and no other document lists them; its third column carries the test names verbatim. Apply is muted as Part 5's write the loop returns from.
12. **The Pull card is tied to Clover leftward**, from the Pull card's left edge to the Clover card's right edge, because the sensor sits before the read on the rail. Alternative: put Clover after the Pull, which would break the rail's order.
13. **Seven Data cards, four muted.** The three ledger tables in full, with the columns nothing reads named as such; the four Part 5 tables reduced to the columns the ledger touches.
14. **Five card-to-data ties**, two with a bend, both leftward. No tie to `pos_items` or `pos_connections`; their rows name the readers.
15. **One caption at y 660** under ADOPTS A BARCODE, because its neighbour under INFERS PACKAGING would have overlapped it at y 640; the Part 3 board used the second height once too.
16. **No fixes after the screenshot.** The scan found nothing and the crops agreed.

## Findings surfaced, not ruled

Recorded in the Context Record. None has been observed running.

1. No stock read outside the item expansion; the spec's fallback is not implemented (platform fact unverified).
2. The witness is dormant for an item until its first successful stock apply.
3. A sale witness conflates restocks within a window.
4. Nothing reads the ledger for a human; `cogs_cents` has no caller.
5. Re-canonicalizing a receipted document keeps the wrong quantities (core #32).
6. The planning limb is not connection-scoped (core #33).
7. A policy flip never un-tracks on Clover (core #36).
8. `base_unit` is always each.

## Issues filed

None. Finding 1 rests on a platform fact this session cannot verify; 2, 3, and 8 are acknowledged in the design or the code; 4 is a design gap, not a defect; 5 to 7 are the owner's open issues.

## Not done

- No approvals on the Part 6 board.
- The SYSTEM REGISTRY page is still empty.
- Part 7, reliability and operations, is the last part.
