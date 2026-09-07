# Behind the Scenes: Part 1 Build Audit

Every call made without asking while the GrocerBot SYSTEM LEGEND page and the Part 1 board were built on 2026-09-06. Each entry names the decision, the alternative not taken, the reason, and what it would take to reverse it. Nothing here is a ruling. Any entry can be overturned; the Build Log in this folder carries the Figma node ids, and every repo change is uncommitted, so `git diff` shows all of it.

## What Sam ruled before this list starts

These were asked one at a time and are recorded in his words in the walkthrough under Working Decisions. They frame everything below and are not audited here: the system boundary; standings in the harness text only; seven parts; pointer sources with SHAs and `dev` as the branch of record; four levels including Principles; the Figma file; Operation as the tag word; and the tight cut for the rail.

## The legend

1. **Built by cloning DRAPER's sheets, not from scratch.** Alternative: draw a fresh GrocerBot legend. Cloning kept every engineered component (variant sets, card blocks, table rows) and cost about thirty calls instead of a hundred. The price is a few DRAPER captions left in place, listed in the Build Log. Reverse: delete the GrocerBot sheets and redraw.
2. **Eight location marks are text only.** Alternative: draw Discord, Faktory, Redis, PostgreSQL, Clover, BEK, OpenObserve, and DigitalOcean glyphs from memory. The visual rules say a guessed glyph is misinformation, so the variants exist with the right names and no picture until real vectors are added. Reverse: paste vendor vectors into the Tools variants.
3. **The Operations set kept External and Secondary and dropped Voice.** Alternative: prune to the seven acts exactly. External and Secondary are used by Container Field types the cards depend on; Voice has no GrocerBot meaning.
4. **No Create variant was added to the Operations set.** DRAPER's live legend folds Create into the blue Output tag. The board uses Write for record writes and Output for delivered results. Reverse: add a variant and recolour.
5. **Records variants are Piping, Data, Artifact, Output Data.** The Function pill was recoloured brown and given the pipe icon rather than deleted, so the pill geometry stayed proven. Output General became Artifact.
6. **Icons: Harness renamed Runner; Function, Draper, Logic, Voice, and Audience Planes dropped.** Runner is GrocerBot's word for a process that executes a step.
7. **Actor designations came from the code and the design doc.** Vendor for external humans; Operator, Store Staff, Buyer for internal humans; the eight running processes as agents. No role names exist in code beyond the `buyers` Discord key, so Store Staff and Operator are the design doc's words. Lexicon queue item 5 stays open.
8. **Principles as one sheet of seven rows, not seven sheets.** One sheet reads in ten seconds; seven sheets would repeat DRAPER's Anatomy, Properties, and Mockup shell for rules that have no mockup.
9. **Card types: Piping Runner, Piping Router, Data, External Tool.** Mr Draper, Function, and Logic cards were dropped. No Agent card was built; the processes appear as agent actors on the rail and as Runner or Router cards below it. Visual Rules open item 3.
10. **Fonts.** Some cloned texts used PP Mori, which is not installed. Every text edited was switched to Inter Semi Bold when the load failed; untouched texts keep their original font reference.
11. **Principles tints were computed, not sampled.** Outline `#FBE9DC` and fill `#FEF8F3` are the Principles orange at 12 and 4.5 percent over white, the same recipe the other levels' tints describe.

## The board

12. **Lane order Process, Piping, Data.** The handoff brief first proposed Piping above Process; the live DRAPER boards put Process on top, and the brief was corrected before drawing.
13. **Rail density: tight cut.** Ruled by Sam; recorded because it shapes everything below. Bookkeeping steps live on cards as Operation fields.
14. **Act colours for machine steps.** TICK FIRES and SESSION DEAD are Triggers. PUSHES POLL JOB, LOGS IN VIA CHROME, RECONCILES SEED, and SAVES SNAPSHOT are Writes. POLLS BEK is a View. DIFFS AGAINST SNAPSHOT and PARSES EACH CHANGE are Routes, the brown dashed piping hop, because they move data without writing a record. PUBLISHES EVENT and PINGS OPS are Outputs. RUNS GBO TRIGGER is the only Action, because only a human acts there. Alternative readings: the seed reconcile as an Action (it is a process, not a person), and the parse as a Write (it produces the envelope). Reverse: `setProperties` on the tag.
15. **The BEK portal is an External Tool card in the Piping row, not an actor on the rail.** It never initiates anything in Part 1; the browser worker calls it.
16. **Faktory is a Piping card, not an External Tool.** It is infrastructure GrocerBot runs, with its own mark.
17. **The six data types are a table inside the Diff engine card**, not six lanes or the tray the brief proposed. One chain serves six configurations; the table shows identity, compare, and mode per type, and a text block under it states the unconsumed-types finding as a finding. The brief's heading said five while listing six; the board says six.
18. **The email door is drawn muted** with its trigger tag, since it belongs to Part 2.
19. **Notifier is drawn muted at the rail's end**, as the boundary to Part 3. Its card lists the Part 3 matches (AUGMENT, CANONICALIZE, DISCORD, NO ROUTE) although that is Part 3 material, because it is the only place a reader of this board learns that four data types have no route. Alternative: an empty boundary card.
20. **Muting is reduced opacity on the piece**, not a legend variant. The muted pieces are the email door tag, the Notifier actor, tag, and card, and the three Part 7 record cards. The Build Log records the value read back after the build. Muted has no legend entry yet.
21. **The other doors sit on a branch above the rail** that joins before PUSHES POLL JOB: the Operator as an Internal Human actor with a terminal Code block, and the email rule as a muted trigger. Alternative: parallel rails, or a note on the Scheduler card. All three doors push the same job, so they meet the rail at the push, and a human action needs a visible actor.
22. **Captions instead of phase panels.** The brief listed six phase panels. The board carries small captions under actors and branches (AT DEPLOY, EVERY 60 SECONDS, ON THE BROWSER WORKER, IF THE SESSION IS DEAD, IF A PARSER RAISES, PART 3 · NOTIFICATION DELIVERY) and no panel frames. With the tight cut the rail has fourteen tags; six frames around two or three tags each would add borders without adding information. Reverse: draw the panels and keep the captions as their eyebrows.
23. **The recovery loop is a rectangle below the rail** that leaves after POLLS BEK and rejoins before the diff, because the login returns to the same poll. **The ops ping is a dead-end branch** from PARSES EACH CHANGE to the Discord artifact and does not rejoin, because a parser failure skips one item while the poll continues.
24. **The ops alert text follows the poll's parser-failure message format.** The `trackingStatus` value in it is illustrative. No captured alert was read; unverified against production.
25. **Eleven Data cards, three of them Part 7 records drawn muted** (job_enqueues, workflow_runs, job_executions). Every poll writes them and a reader tracing a poll needs to know. Alternative: leave them to Part 7 entirely.
26. **No ties to workflow_runs or job_executions.** Their WRITTEN BY rows name the writers. Ties from every Piping card that writes them would cross the whole board.
27. **Unique lock and job_enqueues swapped columns after the first screenshot review.** The first layout put job_enqueues under the browser worker and the unique lock under Faktory, which made the scheduler-to-job_enqueues tie cross the Faktory-to-unique-lock tie. Now job_enqueues sits under Faktory (written at push time) and the unique lock under the browser worker (which releases it), with a straight tie from the browser worker card. The Faktory-to-unique-lock tie was removed because Faktory writes nothing to Redis; the Faktory card's DEDUP text keeps the explanation. Verified from the crop after the change; see the Build Log.
28. **The key pattern goes in the field table, not the Eyebrow.** Visual Rules section 5 had proposed the Eyebrow. On the cards the description says what the key is for and the first table row carries the pattern. Section 5 now says so.
29. **ROW badges for keys and the R2 object, TABLE for the stream.** The Change Tag set has only those two variants. Visual Rules open item 9.
30. **Table Components widened at the component level** (FIELD 220, TYPE 130, value text auto height) rather than per instance. Per-instance widths did not stick and 21 cells truncated. The set is the GrocerBot copy on the SYSTEM LEGEND page, so the DRAPER example pages are untouched.
31. **Texts shortened or restructured to fit** the widened columns: the Diff engine mode column, the vendors `name` row, the job_enqueues `jid` row, the graftpunk session `reader` row, the browser login key rows, the events `workflow_run_id` row, and the Faktory queue field names (BROWSER, HTTP, CORE, DEFAULT). Content was rephrased, never dropped.
32. **The Output variant's text binding was fixed in the legend**, not patched per instance. Every Output instance had read `Text` because the variant's text node was not bound to the property. Fixing the component also fixed the Emitter card's FAIL field.
33. **Actor names set by direct override.** The Actor set's nested name pill is not bound to the `Name` property, so the five actors carry a text override. Alternative: rebind in the legend, which is a structural change to the Actor set worth an owner's look first.
34. **The Discord artifact moved right of the publish tie** and the ping branch line was extended to meet it, after the first screenshot showed the tie running through the card.
35. **Four principle pills, as Color Tag Orange instances rebound to the Principles variables**, placed under the tag each governs: P5 under PUSHES POLL JOB (the scheduler fans out from `tenants.yaml`, never from env), P1 under DIFFS AGAINST SNAPSHOT, P2 under SAVES SNAPSHOT, P3 under PINGS OPS. P4, P6, and P7 govern other parts. Ties under a pill start 20 px lower. One example pill with a caption was added to the Principles sheet so the board instances a documented piece. Visual Rules open item 10.
36. **Data card headers re-pointed to the GrocerBot Tools variants.** They had pointed at deleted DRAPER variants with a POSTGRESQL text override, so the Redis and R2 cards read POSTGRESQL. The BEK portal header had the same fault.
37. **The recovery login tie starts under LOGS IN VIA CHROME** rather than beside it, after the crop showed it hanging from the branch line 100 px to the right of the tag.
38. **The word door** appears on the board caption OTHER DOORS and is in the lexicon as a working term. The code's word is the `source` column with values `scheduler`, `cli`, and `email_rule`.
39. **The events stream is a Data card and the Discord ops alert is the only Artifact.** Lexicon queue item 6 is open; this is the stricter reading.

## Findings surfaced, not ruled

Recorded in the Context Record and the source briefs; none has been discussed. They change how the board should draw the pieces they touch.

1. Four of the six poll data types (cart, orders, invoices, delivery) emit events nothing consumes, and each event opens a child workflow run that only the four-hour timeout reaper closes.
2. The notifications poll reads page 0, 50 items, only.
3. The CLI door and the email door carry no unique lock, so they can run alongside a scheduled poll of the same data type.
4. The scheduled login schedule is dead configuration, reconciled with `enabled: false` on every deploy.
5. From the source briefs: the dedup metrics bucket v2 keys under the legacy label, the Gmail ingestion path is dead code, and core's CLAUDE.md and the orchestrator README lag the code.

## Not done

- The SYSTEM REGISTRY page is empty. Nothing was asked of it for Part 1.
- Nothing is committed to git.
- Glyphs for the eight text-only marks; DRAPER phrasing in a few Card Blocks captions; the Actor set's `Name` binding; a KEY or STREAM grain variant; a Principles variant in the Color Tag set.
- The Card Skeletons sheet may carry the same stale header pointer the board's Data cards had. Unverified.
- None of the release checks in Visual Rules section 7 has been run for approval. The board is a working board.
