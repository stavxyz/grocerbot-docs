# Behind the Scenes: System Registry Build Audit

Every call made without asking while the SYSTEM REGISTRY page was built on 2026-09-07 under "continue". Each entry names the decision, the alternative not taken, the reason, and what it would take to reverse it. Nothing here is a ruling. The Build Log in this folder carries the node ids.

## Before the page

1. **"Continue" was read as the registry.** The Part 7 report named the empty registry page as the natural next build; nothing else was pending that was mine to do. Alternative: stop and wait. Reverse: nothing to undo but the page.
2. **The example registry was read for its shape only.** Its charter, list geometry, and entry format were taken as the method's shape; none of its content was treated as a source. The charter was rewritten sentence by sentence for GrocerBot rather than edited.
3. **The Function doc was not given a registry step.** The example's charter says the registry pass belongs in the Function doc. That is a Protocol change and the owner's; the charter's section 6 says "proposed, not yet adopted" and the Delivery Report carries it.

## Shape

4. **Six bands, not four and not eight.** The Process level holds three kinds of named instance, so three bands; Principles, Piping, and Data one each. Alternative: one Process band with a KIND column doing the work; the example separated them and the specimens differ in shape.
5. **Operations are not registered.** About 140 of them across seven boards, each one step on one board. Alternative: an Operations band like the example's Actions band. Left open for Sam in the Delivery Report and Visual Rules item 15.
6. **A list row plus a specimen is the entry.** The example used a compact index card as well; GrocerBot's list row carries the same fields, so the compact card was dropped. Reverse: build the card from the row.
7. **Specimens are clones, never redraws.** Each is the fullest card any board drew, from the board that owns the thing. Alternative: a fresh canonical card per entry merging every board's view; that would be new content nobody handed over.
8. **The KIND cell carries the database for Postgres tables.** The two `vendors` tables made the store's mark insufficient. Alternative: suffix every name with the database; the KIND tag keeps the name clean.
9. **WHERE lists every appearance, muted or full.** Alternative: mark muted appearances; the boards show it.

## Merges and splits

10. One entry each for the Emitter (two boards, two titles), the unique locks (three spellings), Init and Scheduler (one card on Part 7, two on Part 1), Faktory (three boards), Notifier, Workflow wrapper, Canonicalize task, Clover, Pull and witness, Tiering and matching, Plan service, Apply engine, and Witness engine; each points at every board. Two entries for `vendors`. Buyer, designated on the legend and drawn nowhere, is not a row.
11. **Four interfaces get rows and no specimen**: the ops channel, the tenant channel, the Faktory web UI, and the OpenObserve dashboards, all captioned on the boards and all named as interfaces in the Visual Rules. Alternative: leave them out; a reader looking for #ops would not find it.

## The build

12. **The lists were built by cloning the example's list frames** and swapping every tag and mark to GrocerBot's own components, rather than drawn from scratch, so the type and geometry match the example exactly.
13. **The charter sits at x -1200**, left of the bands, where the legend page keeps its own charter.
14. **One fix after the first screenshot**: the HOST cell widened from 105 to 140 so the Cloudflare marks are whole; DESCRIPTION narrowed to match.

## Findings surfaced, not ruled

Recorded in the Context Record: the two `vendors` tables, the three spellings of the unique lock, the twice-drawn emitter, the merged scheduler card, the four card-less interfaces, the undrawn Buyer, the writer-less `audit_log`, the missing registry step in the Function doc, and the still-bracketed Part 5 pieces. None was filed as an issue; none is a code defect.

## Not done

- No approvals, on this page or the seven boards.
- The Function doc and the Protocol are untouched.
