# Delivery Report: Part 1, Vendor Portal Monitoring

Dated 2026-09-06. Written per step 7 of the Function.

## Request and resolution

"Part 1, go ahead" resolved to Part 1, vendor portal monitoring: schedule, browser login, poll, diff against snapshot, emit events, ending when a canonical event is on the Redis stream. Standing per the harness: live.

## Sources read

Orchestrator at `dev` `1304813`; graftpunk BEK plugin at `a8b8e99`. Core was read for the Principles sheet at the SHAs in the harness table. The Context Record lists every file opened and why. No failure to open a file is recorded there.

## Produced

- SYSTEM LEGEND page: sixteen sheets and four card examples, node ids in the Build Log.
- Part 1 board on VISUAL DOCUMENTATION, node `9040:537`: five actors, fourteen operations, one interface, one artifact, four principle pills, nine Piping cards, eleven Data cards, twenty-five tie segments.
- In this folder: Context Record, Handoff Brief, Build Log, this report, and the behind-the-scenes audit.
- Elsewhere in the repo: harness, source briefs, lexicon, visual rules re-based to four levels, live legend read, Figma brief and instructions. All uncommitted.

## Deviations from the brief and the visual rules

- Captions instead of the six phase panels the brief listed.
- The five data types tray became a six-row table inside the Diff engine card.
- The Redis key convention changed from key pattern in the Eyebrow to key pattern in the table; Visual Rules section 5 now says so.
- The principle pill is a rebound Color Tag; no dedicated variant exists.
- Muted pieces use reduced opacity; the treatment has no legend entry.
- Unique lock and job_enqueues swapped columns to remove a tie crossing.
- The lane order in the brief's first draft (Piping above Process) was corrected before drawing.

## Corrections for the owner

- The handoff brief's tray line says five data types and lists six. The lexicon and the board say six.
- The Principles sheet intro read "orange Record pill"; the pill is a Color Tag. Corrected in the legend on 2026-09-06.

## Unresolved naming and boundaries

- Lexicon queue items 2 to 6 stay open: the store's name, the vendor's display name, the two meanings of snapshot, the human roles, and the envelope's level.
- New working term: door, for the three ways a poll job is pushed.
- The Notifier card carries Part 3 matches, and three Part 7 record cards sit on a Part 1 board. Both are boundary calls, listed in the audit.

## Source conflicts

As recorded in the Context Record: the founding design's row lock, CliRunner, coarse events, and hourly cron were all superseded; the README lags the code on pipeline config, migrations, table count, and Gmail; snapshot and init each name two things; one documented policy (`sources.vendor_poll.augment`) is read by no code.

## Verification

Two full-board screenshots at native scale were cropped and inspected region by region: rail, every Piping card, every Data card, the tie band, and, after each fix, the changed region. A geometry scan of the 498 text nodes found none extending past a clipping ancestor or its card and no fixed-size text with content larger than its box. The board has not been checked against production behaviour; everything on it is read from the code at the SHAs above.

## Next

Sam's three approvals on the board: semantics, visuals, and the release checks. Then Part 2, or the SYSTEM REGISTRY page.
