# Behind the Scenes: Part 4 Build Audit

Every call made without asking while the Part 4 board, document canonicalization, was built on 2026-09-07 under "next". Each entry names the decision, the alternative not taken, the reason, and what it would take to reverse it. Nothing here is a ruling. The Build Log in this folder carries the Figma node ids.

## Before the board

1. **The boundary starts at the worker picking up the job**, not at the notifier's push, which Part 3 drew. It ends at the publish. Three exits are drawn because each reaches a different reader: the pass-through reaches the channel degraded, the teaching stop reaches an operator, and the failure reaches Part 7. Alternative: one exit and a caption for the rest.
2. **Core is read at `dd74fe9`**, the SHA the Core Brief names, without checking whether it is deployed; the Context Record marks that unverified.
3. **The operator is drawn on this board.** The teaching ping exists to reach them, and the design's loop closes through their PUT. Part 7 will draw the ops channel's other traffic. Alternative: end the teaching shelf at the ping.
4. **Two findings were verified end to end before the records were written**: the 409 path (task, client, core's dedup query, core's state gates, the wrapper's re-raise) and the seed overwrite (seed, CI workflow, the design's teaching flow, the PUT route). The Context Record cites the files for each.

## The board

5. **One Worker, drawn once**, although it acts before core, in the middle (three POSTs), and after (the GET). Two captions, THE WORKER AGAIN, mark the returns. Alternative: three Worker rings, which would say there are three workers. Reverse: add two actors and delete two captions.
6. **Core API is an Agent actor** with a new designation. The Actor set's name pill takes any text; no legend change was needed.
7. **The 409 door rides above the rail** from ANSWERS 409 IF SEEN to just before READS THE SNAPSHOT, the Part 1 door convention, with finding 1 in its caption. Alternative: a shelf below, which would read as a failure rather than a skip.
8. **Three shelves.** The pass-through shelf at y 859 after READS THE CACHED CSV. The teaching shelf at y 859 after ASSIMILATES, carrying PINGS OPS with its P3 pill, the artifact hanging from the shelf, the Operator on the shelf, FIXES THE MAPPINGS, and the code block. The failure shelf at y 1059 after PROJECTS THE FACETS rather than after CROSS-CHECKS, so the tie from PROJECTS to the Policies card is not crossed; the caption names which 422s land there. Reverse: move `rail:fail-down` to x 7450 and accept the crossing.
9. **Act colours.** PICKS UP CANONICALIZE a Trigger. READS THE CACHED CSV and READS THE SNAPSHOT Views. RESOLVES, EXTRACTS THE IDENTITY, ANSWERS 409, and CROSS-CHECKS Routes. UPLOADS, DETECTS AND PARSES, STORES, DRIVES, ASSIMILATES, CANONICALIZES, PROJECTS, and FAILS THE DOCUMENT Writes. PASSES THROUGH, PINGS OPS, and PUBLISHES Outputs. FIXES THE MAPPINGS the one Action.
10. **Four principle pills**: P4 under DRIVES THE STAGES, P3 under PINGS OPS on the shelf, P6 under CANONICALIZES, P5 under CROSS-CHECKS. P6 appears for the first time on a board. Alternative: P1 on CANONICALIZES for the pure functions; P6 says the more specific thing.
11. **The teaching ping artifact quotes the code's message template** with its placeholders, so nothing on the board is a fabricated alert. Its footer states the label and the unique window.
12. **The operator's interface is a Code block with one PUT line**, the Part 1 CLI convention stretched to an HTTP request because core has no CLI for mappings. Visual Rules open item 4 records the stretch.
13. **Ten Piping cards.** The Core client card is a routes table; the Upload and scoping card carries the state-gates table; the Assimilate card carries a seeded-vendors table that states finding 4; the Policies card is one table with the two policies side by side plus the snapshot shape; the two config cards use the Pipe icon read from Part 3's Routes card. Findings sit on cards where the reader will meet them: ON 409 on the task card, ENV on the client card, TAUGHT on the seed card.
14. **Nine Data cards.** `audit_log` is drawn muted with WRITTEN BY nothing because a reader of the schema will look for it; `unique locks` is muted as Part 1's piece; `tenants` is a small card because the task resolves its UUID from config. The `documents` card groups sibling columns into one row each (the three snapshots, the two timestamps, `failed_at_stage` with `error_detail`) so eighteen columns read as eleven rows.
15. **Ties.** Seven card-to-data ties; the upload card ties to both `documents` and the R2 object because its code writes both; the R2 card gets the horizontal tie from the upload card as the BEK portal did from Augment on Part 3; no tie to `tenants`, whose READ BY names its reader.
16. **Z-order and captions.** The shelf tags were created before the shelf lines and sat under them; re-appended. Four captions that a tie crossed were shortened rather than moved, so each stays under its tag.
17. **The rail is 200 px longer** than Part 3's to fit PUBLISHES .CANONICALIZED inside the frame at the same pitch.

## Findings surfaced, not ruled

Recorded in the Context Record. None has been discussed or observed in production.

1. A failed document is never driven again; core 409s on identity regardless of state and the task skips the stages, so a Faktory retry or a re-enqueue publishes `.canonicalized` with `canonical: {}` and no degraded marker.
2. `CORE_BASE_URL` is required by the task and absent from `required-env.txt`.
3. Every deploy re-applies the seeded mappings, overwriting what the PUT route taught.
4. Three of the four seeded vendors cannot canonicalize as seeded.
5. `audit_log` is never written.
6. The mapping routes have no principal.

## Issues filed

- `parconditio/grocerbot-orchestrator` #271: finding 1.
- `parconditio/grocerbot-orchestrator` #272: finding 2.
- `parconditio/grocerbot-core` #44: finding 3, the first issue filed on the core repository; the Core Brief now carries the pointer.
- A comment on #268: the orchestrator's canonicalization design still describes the flat snapshot.

Not filed: finding 4 (the seed comment says so itself), finding 5 (a design gap, not a bug), and finding 6 (v0.3.x ships trusted caller everywhere by design).

## Not done

- No approvals on the Part 4 board.
- The SYSTEM REGISTRY page is still empty.
- Part 5, POS sync, reads the `documents` row this board ends on.
