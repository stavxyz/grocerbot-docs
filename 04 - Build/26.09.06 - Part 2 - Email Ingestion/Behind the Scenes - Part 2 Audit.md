# Behind the Scenes: Part 2 Build Audit

Every call made without asking while the Part 2 board, email ingestion, was built on 2026-09-06 and 2026-09-07, under the instruction "commit this and continue." Each entry names the decision, the alternative not taken, the reason, and what it would take to reverse it. Nothing here is a ruling. The Build Log in this folder carries the Figma node ids; every repo change is committed on the branch named in entry 2.

## Before the board

1. **Continue meant the next part in the agreed order.** Sam wrote "commit this and continue." The parts list puts email ingestion second, and the Part 1 board already ends at the email door. Alternative: the empty SYSTEM REGISTRY page, or Part 3, which the stream leads into. Reverse: nothing to undo; Part 3 can follow.
2. **Committed on a branch, not on main.** The repo was on `main` with a remote. The working rule for this environment says to branch before committing on the default branch, and Sam's global notes record a collision from an agent committing onto a local `main`. Branch `part-1-vendor-portal-monitoring`, two commits for Part 1, one more at the end of this run. Alternative: commit straight to `main`. Reverse: `git merge` or cherry-pick onto `main`.
3. **Two commits for Part 1**, the method re-base and the build records, so the history separates the method from its first use.
4. **The Part 2 folder is dated 26.09.06**, the local date when the run began, although the board was finished after midnight. The documents inside give both dates.

## The board

5. **Placed below Part 1 on the same page**, at y 3643, same lane heights, no section frame. Alternative: a new page per part. The Visual Rules put one frame per part on VISUAL DOCUMENTATION; a section is for groups of parts.
6. **The Vendor is an actor with an external ring**, designation Vendor, because BEK's systems initiate the email. Alternative: an External Tool card. The Visual Rules make an external system an actor when it initiates.
7. **A door above the rail for the forwarding set-up**: Store staff, the Gmail forwarding rule as a dark Code block with a GMAIL eyebrow, and SETS UP FORWARDING as the one Action on the board. Alternative: start the rail at EMAIL ARRIVES. Every arrival depends on a human having set the rule once, and the confirmation branch below makes no sense without it. The Code block for a third-party setting is the closest existing convention and is recorded as open in the handoff brief.
8. **EMAIL ARRIVES takes the Email worker card's tie**, and STORES RAW EMAIL has none. The arrival is the event that invokes the Worker; the store is what it does first. Alternative: tie from STORES RAW EMAIL, which would have put the tag before the actor that performs it.
9. **Tags are centred on their card's tie** where a card exists, so the dotted line drops from the tag's midpoint. On Part 1 the ties dropped from the rail beside the tag. This is closer to the rule "direct vertical when centres align." Part 1 was not changed. Reverse: move the eight tags.
10. **The dedup check rides the rail as a Route**, CHECKS FOR A REPEAT, with RECORDS THE DUPLICATE on a dead-end shelf. Under the tight cut a lock is bookkeeping and stays on a card, but this check decides whether anything else runs, which changes what the store learns. The key write itself is an Operation field on the Worker card.
11. **Act colours.** EMAIL ARRIVES a Trigger. STORES RAW EMAIL, PUSHES EMAIL JOB, RECORDS THE DUPLICATE, TRIGGERS A POLL, STORES ATTACHMENTS, CONFIRMS FORWARDING, and RECORDS THE ARRIVAL Writes. CALLS THE WEBHOOK, CHECKS FOR A REPEAT, RESOLVES, and MATCHES RULES Routes. PUBLISHES EVENT, POSTS TO OPS, and FLAGS UNRESOLVED Outputs. CONSUMES THE STREAM a muted Trigger. The debatable one is CONFIRMS FORWARDING: it is a POST to Google that changes state there, so Write rather than Output. Reverse: `setProperties` on the tag.
12. **Three shelves under MATCHES RULES**, one drop, one shelf per rule action that leaves the rail: the poll (ending at the muted Browser worker), the attachments (dead end), and the confirmation (ending at the Discord artifact). Alternative: one shelf with three tags in a row, which would read as a sequence they are not.
13. **The two unconsumed publishes are drawn differently.** FLAGS UNRESOLVED is a muted Output tag on a stub with the caption NOTHING CONSUMES IT TODAY, because it is the case the operations guide says alerts ops. `attachment.received` and `email.is_duplicate` appear only in card text, because they are side effects of steps already on the rail.
14. **No cards for the two boundaries.** The Browser worker and Notifier are muted actors with captions naming their parts. Part 1 gave the Notifier a card. Part 2's notifier card would have repeated it.
15. **The Gmail External Tool card carries a NOT BUILT block** naming the dead Gmail polling path. Alternative: leave dead code off the board. The harness lists it as something a run must recognise and leave alone; saying so on the card is how a reader learns that.
16. **Nine Piping cards** in the order Gmail, Email worker, API webhook, Faktory, Worker, Resolver, Rules engine, Auto-confirm, Emitter. Faktory kept its own card for consistency with Part 1 although it is small here. The Resolver and Rules engine each carry a five-row table because the config is the behaviour.
17. **Cards were cloned from Part 1 cards and their blocks**, not from the legend skeletons, then rewritten. The chrome is identical and the Part 1 header fixes carried over. A cost: cloned tables did not take property values for headers and type cells, so every table cell was set by direct override in x order. Those cells no longer follow the component's text properties. Reverse: rebind the cells.
18. **Plain Text values now wrap at the component level.** Four Resolver and Gmail values ran past the card edge in the first screenshot. The fix is on the legend's Container Field Plain Text variant, not per instance, so every Plain Text field on both boards wraps. Part 1's values were short; its board was re-screenshotted after the change.
19. **Eight Data cards**, two of them Part 7 records drawn muted, as on Part 1. Config files appear as Piping pills in READS, not as Data cards, as on Part 1.
20. **Tie routing.** Seven card-to-data ties, two with one bend each; the Worker's second tie leaves the card at x 4300 rather than its centre so it clears the straight tie beside it, and the Emitter's second tie likewise leaves at x 7000. No tie crosses another; checked on the tie-band crops.
21. **A text-only GMAIL mark was added to the Tools set** rather than drawing Google's mark from memory, the same call as the eight text-only marks on Part 1.
22. **The Card Skeletons headers were re-pointed** from deleted DRAPER variants to the GrocerBot ones. This is the Part 1 leftover the Part 1 audit listed as unverified; it was real and is fixed.
23. **Findings appear on cards as findings.** The Resolver's note on unread parsers and the Faktory card's retry note both end with words that mark them as inferred and not ruled. Alternative: keep findings off the board. A reader who sees a parser named in config and never used would otherwise think the board wrong.
24. **Two captions moved after the first screenshot**: the Browser worker boundary caption, which had landed at the end of the attachments shelf, and the order-confirmation caption, which had sat under the wrong tag and was shortened to ORDER CONFIRMATION RULE.
25. **Subtitle of three lines**, longer than Part 1's two, because the part has four outcomes rather than one.
26. **Not drawn**: the inferred-intake fallback address `connect@grocerbot.net`. The Worker sends null hints for it and the Resolver falls through to domains; no code treats it specially. It is in the Context Record.

## Findings surfaced, not ruled

Recorded in the Context Record. None has been discussed or observed in production.

1. Email-sourced canonical events open no workflow run, so Part 7's reaper, DLQ compensation, and terminal success marking do not cover them.
2. A webhook failure rejects the message without writing the `.failed` sibling, so the raw email in R2 is untagged and the sender gets a bounce.
3. `email.unresolved.new`, `email.is_duplicate`, and `attachment.received` have no consumer; the operations guide says the first alerts ops.
4. The 30-day dedup key is scoped by the Worker's hint, so hint-less forwards from two tenants would collide under `_unknown`.
5. Stored attachments have no reader; the designed `email_attachment` fetch rule was not built.
6. The email door into Part 1 carries no unique lock.
7. A failure after the dedup key is set turns the Faktory retry into a duplicate: recorded, never processed. Inferred from the code order.
8. `tenants.yaml` names parsers per type that nothing reads, and `bek_invoice` exists nowhere.
9. `email_arrivals` is written by the worker and read by no code.

## Not done

- No approvals on the Part 2 board.
- The SYSTEM REGISTRY page is still empty.
- Glyphs for the nine text-only marks; the muted treatment has no legend entry; table cells on Part 2 are direct overrides.
- The lexicon's two meanings of dedup are queued, not ruled.
