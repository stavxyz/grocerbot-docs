# Behind the Scenes: Part 3 Build Audit

Every call made without asking while the Part 3 board, notification delivery, was built on 2026-09-07 under "ok go". Each entry names the decision, the alternative not taken, the reason, and what it would take to reverse it. Nothing here is a ruling. The Build Log in this folder carries the Figma node ids.

## Before the board

1. **The boundary with Part 4 is the canonicalize job.** Part 3 dispatches it and consumes what it publishes; its inside is Part 4. Drawn as a muted actor caption, a muted tag pair, and a muted card that says only what goes in and what comes back. Alternative: leave canonicalize off this board entirely, which would break the chain a reader follows.
2. **The workflow wrapper is drawn here** although it is Part 7 machinery, because it runs inside every job in this part and decides what "failed" means for a notification. Part 7 will draw the reaper, the DLQ monitor, and the compensation dispatch.
3. **The build folder was first created inside the orchestrator checkout** because the shell was still there, then moved. Nothing was left behind; the orchestrator's working tree shows only its six known untracked files.

## The board

4. **One notifier, three passes, two loops.** The rail runs once from raw event to Discord post; the return of `.augmented` and `.canonicalized` to the stream is drawn as two lines above the rail that rejoin at its start, with captions. Alternative: three Notifier actors in sequence, which reads faster but says the wrong thing (there is one consumer), or three stacked rails, which breaks left-to-right reading. Reverse: delete `rail:loop1`, `rail:loop2`, `rail:loop-down` and their captions.
5. **The loops are branch lines**, the same convention as the doors on Parts 1 and 2. The Visual Rules have no feedback-loop piece; recorded as open item 13.
6. **Pass labels above the rail.** FIRST PASS, SECOND PASS, THIRD PASS as captions at y 520, where Part 1 and 2 had nothing. Alternative: phase panels, which the brief never proposed. Reverse: delete three captions.
7. **The repeat check rides the rail** as DROPS A REPEAT with a dead-end shelf for the loser's run closing. It is the first thing the notifier decides and the reason the dedup spec exists. Alternative: a field on the Notifier card only.
8. **Act colours.** READS THE STREAM a Trigger. DROPS A REPEAT, PICKS THE STAGE, HANDS THE CSV TO CORE, and RENDERS THE EMBED Routes. FETCHES ORDER AND INVOICE a View, the only one on the three boards, because augment reads BEK and writes nothing there. The pushes, the caches, OPENS A THREAD, CLOSES THE RUN, CLOSES THE LOSER'S RUN, FAILS THE RUN, and RELEASES THE DEDUP KEY Writes. The three publishes, POSTS TO THE CHANNEL, and POSTS DETAILS Outputs. READS THE CHANNEL the one Action. Reverse: `setProperties` on the tag.
9. **The BEK portal is an External Tool card with no rail tie**, tied horizontally from the Augment card, as on Part 1. The tag CACHES PDF AND CSV therefore has no tie.
10. **Two artifacts stacked under POSTS TO THE CHANNEL**: the primary embed and the thread, joined by a short connector, because the thread hangs off the message in Discord too. Their texts describe the embed's parts rather than quoting a message, so nothing on the board is a fabricated notification. Alternative: one artifact. Reverse: delete `artifact:thread` and `rail:thread-down`.
11. **The reader is Store staff**, an Internal Human at the rail's end with READS THE CHANNEL. The design names two operators and the buyers role; the code names only the role key. Lexicon queue item 5 stays open.
12. **The tenant channel is a caption, not an Interface card.** An Interface card wants a mockup of the surface; the embed artifact already shows what the channel holds. Recorded in the Build Log as a leftover.
13. **The failure path is one shelf** under CLOSES THE RUN: FAILS THE RUN, RELEASES THE DEDUP KEY, and a caption naming the triggers and Part 7. Alternative: a failure branch at every stage, which would triple the rail.
14. **Ten Piping cards**, in rail order, with the Canonicalize card muted. Routes and triggers is a config card with a five-row dispatch table; Embed builder has an eight-row table of the embed's parts. Faktory kept its own card. Alternative: fold Faktory into the Notifier card.
15. **Eight Data cards**, three of them Part 7 records muted. The events stream card shows its read side here (group, commands, the three event types), where Parts 1 and 2 showed its write side. dedup keys is drawn again because the compensation deletes it here.
16. **Findings on cards.** The Faktory card states the retry mismatch as a finding; the Routes card says the mention maps are empty; the Embed builder card says the invoices thread builder has no route.
17. **The table's first column now wraps** at the component level, after the dispatch table clipped long event types. This is the third and last column of the Table Components to get the change; all three boards were re-tied afterwards.
18. **The batch caption moved** clear of the P2 pill after the first screenshot.

## Findings surfaced, not ruled

Recorded in the Context Record. None has been discussed or observed in production.

1. The route's `retry: -1` never reaches Faktory; jobs carry pyfaktory's default of 25, so Faktory retries a job whose run the wrapper has already failed and compensated. A late success posts the embed anyway, and a second observation becomes a fresh winner.
2. A transient Discord or BEK error on a one-shot `.new` event has no natural retry once the run is failed; the dead set is the only recovery.
3. Both mention maps are empty.
4. The invoice PDF lives in Redis for five minutes across three jobs on two queues.
5. Thread builders are registered for `invoices`, which has no route.
6. `WorkflowAlreadyFailedError` is defined and never raised; retries re-run the full handler.

## Not done

- No approvals on the Part 3 board.
- Part 4 will need the inside of canonicalize, which this run read only at its boundary.
- The SYSTEM REGISTRY page is still empty.
