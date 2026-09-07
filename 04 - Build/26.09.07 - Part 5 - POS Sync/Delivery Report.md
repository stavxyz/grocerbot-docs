# Delivery Report: Part 5, POS Sync

Dated 2026-09-07. Written per step 7 of the Function.

## Request and resolution

"Next", after the Part 4 report named Part 5, resolved to Part 5, POS sync: from the canonical invoice in core, and from the designed scheduler tick, through the pull, the tier lines, matching, pricing, the plan, guardrails and the parked shelf, the batched apply to Clover, the close, the report, and the reap. Standing per the harness: core side dev only, drawn as current; orchestrator side designed and not wired, drawn bracketed with TBD badges.

## Sources read

Core at `dd74fe9` and the orchestrator at `dev` `1304813`, plus orchestrator issue #262 and core issues #32 to #42. The Context Record lists every file opened and why. No failure to open a file is recorded there.

## Produced

- Part 5 board on VISUAL DOCUMENTATION, node `9090:5379`: four actors, one artifact, one interface, twenty-six operations (nine bracketed, one muted), four principle pills, four TBD badges, ten Piping cards, ten Data cards, eighteen tie segments, one loop, two shelves.
- Legend change: none; the TBD badge is a grey Color Tag instance.
- In this folder: Context Record, Handoff Brief with its nature pass, Build Log, this report, and the behind-the-scenes audit.
- Lexicon: `stray` and the two clocks called cursor.
- Visual Rules open item 14, the TBD badge.

## Deviations from the brief and the visual rules

- The TBD badge is a grey Color Tag, not a dedicated piece.
- The P4 pill sits under the listing tag, not the call, to clear the Core API actor.
- The reap shelf hangs after CLOSES THE PLAN although reap is its own tick; the caption says so.

## Corrections for the owner

- The `_document_ids_since` docstring says canonicalized; the query filters no state. Filed as core #45.
- The POS spec's `gbc` command list differs from the shipped commands; no list or disable command exists.
- `pos_plans.report` is reserved and never written, as the Core Brief already notes.

## Unresolved naming and boundaries

- Whether the designed orchestrator half belongs here or on Part 7. Drawn here.
- Whether the witness belongs on this rail. Drawn muted; Part 6 owns it.
- `stray` and `adoption` are code-comment words; added to the lexicon as such.

## Source conflicts

As recorded in the Context Record: designed versus built; the spec's CLI versus the shipped one; the docstring versus the query; the reserved column.

## Findings for the owner

Seven, listed in the audit and the Context Record. One was verified end to end and filed; four meet issues the owner already has.

## Verification

Two full-board screenshots at native scale, cropped and inspected: the rail in four crops, every Piping card, every Data card, and the tie band, then the three rail regions that changed after the fixes. A geometry scan of the 585 text nodes found no overflow. Nothing on the board was checked against a running environment; the orchestrator half has nothing to check.

## Next

Sam's three approvals. Then Part 6, the inventory ledger, whose tables this board draws muted and whose witness engine runs inside the pull drawn here, or the SYSTEM REGISTRY page.

## Issue filed, 2026-09-07

- `parconditio/grocerbot-core` #45: plan sources select invoices by `created_at` regardless of state, so an uncanonicalized document is consumed by the cursor and never planned (finding 1). Verified in `plan_service.py`, `applying.py`, and `cursor.py` before filing.

Not filed: the missing orchestrator half (#262 exists), the first-plan-is-a-full-history behaviour and the absent `sync_policy` command (configuration, recorded), the ghost items on reject (core #42), the per-create catalog page (accepted in code), and invoice-only planning (documented).
