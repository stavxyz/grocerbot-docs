# Behind the Scenes: Part 5 Build Audit

Every call made without asking while the Part 5 board, POS sync, was built on 2026-09-07 under "next". Each entry names the decision, the alternative not taken, the reason, and what it would take to reverse it. Nothing here is a ruling. The Build Log in this folder carries the Figma node ids.

## Before the board

1. **The standing splits the board.** The harness says core side dev only, orchestrator side designed and not wired, and that only designed-not-wired reaches a board through the bracket and TBD convention. So every core piece is drawn as current and every orchestrator piece is bracketed and badged. Alternative: leave the orchestrator half off and caption its absence, which would hide the shape the spec's section 2 diagram gives this part.
2. **The absence was verified, not assumed.** A grep for the four job types, `clover`, and `/v1/pos` across the orchestrator's `src`, `config`, compose file, and README found nothing; issue #262 is the whole of the orchestrator half. The generated core client's `pos` package was checked so the record can say the contract is regenerated.
3. **The ledger is drawn at its boundary only.** Families, movements, compositions, and the witness are Part 6's; here they appear as one muted rail step, three muted Data cards, and the writes the build makes into them. Alternative: a full witness chain on this rail, which would double the board.
4. **The owner's own POS issues (#32 to #42) were read before the findings were written**, so nothing already filed is refiled and each finding cites the issue that meets it.
5. **Finding 1 was verified end to end** (`_document_ids_since`, `_derive_lines`, `apply_batch`'s drain branch, `advance_plan_cursor`) and its docstring-versus-code mismatch confirmed before filing.

## The board

6. **Four actors.** [Scheduler] and [Worker] bracketed, Core API, and the Operator on the parked shelf. Alternative: one bracketed Orchestrator actor for the designed half; two keep the spec's tick-versus-handler split visible.
7. **The TBD badge is a grey Color Tag** reading TBD · DESIGNED, NOT WIRED, placed under the first tag of each designed cluster (the tick, the apply push, the report post, the reap tick) rather than under every bracketed tag. The Instructions name a badge that no legend piece provides; Visual Rules open item 14. Reverse: delete four instances.
8. **The P4 pill sits under [LISTS ENABLED CONNECTIONS]** rather than [CALLS PLAN], so the pill does not collide with the Core API actor. The principle is about the split, and either tag carries it.
9. **The build's order on the rail is derive, match, price, plan**, with RESOLVES FAMILIES before the pull, as `create_or_get_plan` runs it. The code derives the lines twice, once for the family pre-phase and once in the build; the rail shows the build's derivation and the families step first. `supersede_and_replace` pulls before it resolves; the card says so.
10. **The witness is a muted tag** between PULLS CLOVER and DERIVES TIER LINES, because the pull runs it and a reader following the rail should see where the ledger absorbs Clover's counts. Part 6 will draw it in full.
11. **Act colours.** The two ticks Triggers. [LISTS] and PULLS Views. SELECTS, DERIVES, MATCHES, PRICES, EVALUATES, PARKS, and [RE-ENQUEUES] Routes. [PUSHES] twice, [CALLS PLAN], RESOLVES, WITNESSES, PLANS, RECORDS RECEIPTS, PROJECTS STOCK, APPLIES, CLOSES, and REAPS Writes. WRITES TO CLOVER, BUILDS THE REPORT, and [POSTS] Outputs. APPROVES OR REJECTS the one Action.
12. **Four principle pills**: P4, P6, P7 (its first appearance on a board), and P3 on the shelf under PARKS THE PLAN, where the loud failure is. The P7 pill was shifted 19 px left of its tag so the guardrails tie clears it. Alternative: start that tie lower.
13. **The parked shelf** holds PARKS THE PLAN, the Operator, APPROVES OR REJECTS with its tie to the gbc card, and the terminal code block with both commands on one line. The `#42` ghost-item note is a caption under the block.
14. **The checkpoint loop** is drawn as a line above the rail from after WRITES TO CLOVER back to before APPLIES A BATCH, the Part 3 convention, with a bracketed caption, because the loop itself is designed.
15. **The reap shelf** hangs after CLOSES THE PLAN although reap is a separate tick; the caption says so. Alternative: a fourth actor for the reap tick at the rail's end.
16. **Ten Piping cards**, one of them the bracketed [Orchestrator POS chain] with the whole of #262 in one text block and four bracketed operation rows. The POS API card carries the routes table and the report shape; the Pricing and guardrails card is a config card with the five checks; the gbc card lists what shipped and what did not.
17. **Ten Data cards**, four muted: `documents` as the read side the planner sees, and the three ledger tables. `pos_plans` states its partial unique index in a plain row. Sibling columns are grouped into one row each, as on Part 4.
18. **Six card-to-data ties**, one with a bend. No tie to `documents` or the ledger tables; their READ BY and WRITTEN BY rows name the callers.
19. **Captions.** Four boxes widened after they wrapped; the parked caption moved under its pill. No caption crosses a tie.

## Findings surfaced, not ruled

Recorded in the Context Record. None has been observed running.

1. A plan consumes invoice documents that never canonicalized; an empty plan still advances the cursor. Filed.
2. The orchestrator half does not exist (#262).
3. The first plan on a fresh connection selects every invoice the tenant has, and no command edits `sync_policy`.
4. `plan-reject` leaves ghost items (core #42).
5. Every create pages the whole Clover catalog for a barcode match.
6. Only invoice documents feed plans.
7. `sync_policy` and `projection_policy` have no write path but SQL.

## Issues filed

- `parconditio/grocerbot-core` #45: finding 1, verified in `plan_service.py`, `applying.py`, and `cursor.py` before filing.

Not filed: finding 2 (an open issue already), 3 and 7 (configuration and CLI gaps the spec's first-run note half-anticipates; recorded for the owner), 4 (core #42), 5 (accepted in the code's own comment and probe note), 6 (documented in the Core Brief).

## Not done

- No approvals on the Part 5 board.
- The SYSTEM REGISTRY page is still empty.
- Part 6 will draw the witness engine and the ledger this board only touches.
