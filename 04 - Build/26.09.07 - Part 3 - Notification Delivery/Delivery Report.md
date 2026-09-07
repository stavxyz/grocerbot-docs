# Delivery Report: Part 3, Notification Delivery

Dated 2026-09-07. Written per step 7 of the Function.

## Request and resolution

"Ok go", after the recommendation to take Part 3 next, resolved to Part 3, notification delivery: from an event on the stream to a Discord post with its thread, through augment and the canonicalize hand-off, ending when the terminal job closes the event's run or fails it. Standing per the harness: live.

## Sources read

Orchestrator at `dev` `1304813`, including the BEK plugin package inside it. The Context Record lists every file opened and why. No failure to open a file is recorded there.

## Produced

- Part 3 board on VISUAL DOCUMENTATION, node `9073:2997`: four actors, two artifacts, twenty operations, three principle pills, ten Piping cards, eight Data cards, twenty-two tie segments, two loops.
- Legend change: the Table Components first column wraps.
- In this folder: Context Record, Handoff Brief with its nature pass, Build Log, this report, and the behind-the-scenes audit.

## Deviations from the brief and the visual rules

- Feedback loops drawn with the branch-line convention; no legend piece exists for them. Visual Rules open item 13.
- The tenant channel is a caption on the reader rather than an Interface card.
- Pass labels above the rail, a caption use the other boards did not have.

## Corrections for the owner

- The pipelines README's route example still shows `.augmented`; live routes match `.canonicalized`.
- The workflow framework spec says the framework sets Faktory `retry` to -1 for poll-driven jobs; `create_job` sets no retry.
- Two copies of the Discord client exist; `notifications/discord/client.py` is the older one and is not on the notify path.

## Unresolved naming and boundaries

- Lexicon queue item 5, who reads the channel, stays open; the board says Store staff.
- The word pass, for one trip of an event through the notifier, is a working term from this board; added to the lexicon.
- Whether the workflow wrapper belongs to Part 3 or Part 7. Drawn here as the in-band half; Part 7 gets the backstops.

## Source conflicts

As recorded in the Context Record: the spec's retry default versus the code; the founding designs' shapes since replaced; dead registrations for `invoices` and `email_unresolved`; the duplicated client.

## Findings for the owner

Six, listed in the audit and the Context Record. The retry mismatch was verified end to end in the code this session and filed as an issue; see the note at the end.

## Verification

One full-board screenshot at native scale, cropped and inspected: the rail in four crops, every Piping card, every Data card, and the tie band; a second inline check of the Routes card and the caption region after the fixes. A geometry scan of the 460 text nodes found no overflow. Nothing on the board was checked against production.

## Next

Sam's three approvals. Then Part 4, document canonicalization, whose boundary this board already draws, or the SYSTEM REGISTRY page.

## Issue filed, 2026-09-07

- #270 workflow: route retry -1 never reaches Faktory; jobs retry 25 times after the run is already failed and compensated (Part 3 findings 1 and 6). Verified end to end in `jobs.py`, `decorators.py`, `classification.py`, `wrapper.py`, `errors.py`, and pyfaktory's model default before filing.

Not filed: the empty mention maps (config), the five-minute PDF window (a tuning question), the dead `invoices` thread registration (hygiene), and the one-shot-event recovery gap, which #270 covers on its cause.
