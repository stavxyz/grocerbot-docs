# Context Record: System Registry

Dated 2026-09-07. Written before the SYSTEM REGISTRY page was touched. Sam's instruction was "continue" after the seventh board's report named the empty registry page as the natural next build.

## Request

Build the SYSTEM REGISTRY page (`7001:129073`) in the GrocerBot System Docs Figma file: the census of every instance the seven boards drew, each thing once, with pointers to the boards it appears on. The page has been empty since the file was duplicated from DRAPER's on 2026-09-06.

## Sources read, and why

- `02 - Tools/Figma/Live Legend Read 26.09.06.md`, the registry section: what the example registry holds (a charter, an entry format, a list and a cards frame per level, a one-line definition per level). The only written description of the registry's shape in this repository.
- `02 - Tools/Figma/Visual Rules.md` sections 4 and 5: the Record and Card definitions ("the pill and the card are the same row at two zoom levels") and the piece treatments the nature pass classifies against. Section 4 has no treatment for a registry list row; recorded below as a gap.
- `02 - Tools/Figma/Instructions.md`: the load order, the non-negotiables, the workflow, and the handoff brief format.
- `Function - Visual Documentation.md`: has no registry step. The DRAPER example's charter says a registry pass ends every run and that the rule belongs in the Function doc; GrocerBot's Function doc never received it. Recorded as a finding.
- The example registry page `Ex System Registry - DRAPER` (`2800:440`), read live for its shape only: metadata for the page's top level, one list frame, one entry instance, and one screenshot. Its content is DRAPER's and was not read as a source about GrocerBot.
- The GrocerBot legend page, read live: the Color Tag, Tools, Records, Actor, and Operations sets and their variants; the Principles sheet's seven names and statements.
- The seven boards, read live: every card's title, header mark, grain, opacity, height, and first sentence, and every rail piece's name and title. This is the census's raw material.
- The seven Build Logs and Handoff Briefs in `04 - Build/`: node ids of every actor, artifact, interface, pill, and card, and the one-line descriptions written at brief time for each element.

Nothing in `03 - Example/` was read as a source about GrocerBot. No source file failed to open.

## Boundary

In: everything drawn on the seven boards that is an instance with a name, once per instance: the seven principles, eleven actors, eight interfaces, eight artifacts, fifty-five piping units, and thirty-five data things. Out: operations. Each operation is one step on one board and its census is the board; the example registered its equivalent (Actions) and the decision to leave them out is recorded in the audit and left open for Sam.

## Findings, not decisions

1. **Two tables named `vendors`.** The orchestrator's `vendors` (Part 1, reconciled from the seed YAML) and core's `vendors` (Part 4, four seeded rows with mappings) are different tables in different databases. No board says so because no board holds both. The registry names them `vendors (orchestrator)` and `vendors (core)`; the lexicon has no entry for the pair.
2. **The unique lock is named three ways.** `unique lock` on Part 1, `unique locks` on Parts 4 and 7. One thing. The registry uses `unique locks`.
3. **The emitter is drawn twice** under two titles, `Emitter` on Part 1 and `Emitter · email path` on Part 2. One unit, `pipelines/emit.py`. One entry.
4. **Scheduler and init are one card on Part 7** and two on Part 1. Two entries, Init and Scheduler, each pointing at both boards.
5. **Four interfaces were captioned, never drawn as cards**: the ops channel, the tenant channel, the Faktory web UI, and the OpenObserve dashboards. The Visual Rules name all four as GrocerBot interfaces. They get rows and no specimen.
6. **Buyer is a designation on the legend's Actor set and on no board.** Not registered.
7. **`audit_log` has no writer** and appears once, muted. Registered with its muted specimen; the row says it has no writer.
8. **The Function doc has no registry pass.** The example's charter makes the pass the last step of every run. If Sam adopts it, the Function doc's step 6 gains a line and the Protocol a rule. Not edited here.
9. **The Part 5 orchestrator chain and its report are still bracketed.** They carry into the registry bracketed, with the same TBD badge treatment, so nothing settles by being listed.

## Interpretations made

- The registry follows the example's shape: a charter sheet, then one band per kind of instance, each band a list at the left and one specimen per entry at the right. Bands are six because the Process level holds three kinds of instance (actors, interfaces, artifacts) and the other three levels one each.
- A specimen is a clone of the fullest card any board drew for the entry, taken from the board that owns the thing. The boards keep the full instance at every appearance.
- The KIND column carries the database for Postgres tables, because the two `vendors` proved the store's mark alone cannot tell them apart.
- The WHERE column lists every board the entry appears on, muted or full, as `P1 · P3 · P7`.
