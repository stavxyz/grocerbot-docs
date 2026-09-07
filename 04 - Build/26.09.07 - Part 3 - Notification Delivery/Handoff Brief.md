# Map Brief: Part 3, Notification Delivery

Written 2026-09-07 in the format at the end of `02 - Tools/Figma/Instructions.md`, in GrocerBot's four-level vocabulary. The nature pass at the end maps each nature to the piece families in `02 - Tools/Figma/Visual Rules.md`. Under the standing instruction to continue without asking, this brief is recorded and then built.

Purpose: a reader should see within ten seconds that one notifier reads every event on the stream and sends each through three passes, raw to augmented to canonicalized, dropping repeats before anything runs, that the augment pass fetches the order and invoice from BEK and caches the PDF and CSV, that the canonicalize pass hands the CSV to core and comes back, and that the last pass renders and posts the Discord embed with its thread and closes the event's run, or fails it into Part 7.

Target: file `nBmhDyEDpFPrMq0ztmHDb0`, page VISUAL DOCUMENTATION (`7001:129074`), a new frame below the Part 2 board. Components from SYSTEM LEGEND (`7001:129072`).

Standing: live. Drawn as current. The canonicalize pass is drawn muted as the boundary to Part 4.

## Elements

One per line: name | nature | one-line description | modifiers.

**Actors**

- Notifier | actor, agent | the `notifier` container, consumer group `notifier`, one consumer | none
- Browser worker | actor, agent | runs augment on `graftpunk-http` because BEK calls need Chrome | none
- Worker | actor, agent | runs canonicalize and discord.notify on queue `core` | none
- Store staff | actor, human | read the tenant channel; the design also names buyers | none

**Interfaces**

- The tenant channel | interface, Discord | `#bek` in prod, one channel for notifications and order confirmations; the dev firehose in dev | drawn as the Store staff caption, not a card

**Artifacts**

- The primary embed | artifact, Discord message | Ben E. Keith Foods, headline with emoji and linked order number, issues line, meta line, up to seven item rows, footer, thumbnail, invoice PDF when cached | none
- The thread | artifact, Discord thread | named by the headline, overflow item embeds ten per message, a summary embed, and the JSON file of core plus augmented | none

**Operations, the rail in order**

- Reads the stream | operation, trigger | batches of ten, blocking five seconds, reclaiming entries idle over thirty seconds | P2 pill
- Drops a repeat | operation, route | `seen` above 1 before an augment or canonicalize trigger | none
- Closes the loser's run | operation, write | the suppressed arrival's child run is marked succeeded | branch below, dead end
- Picks the stage | operation, route | augment triggers first, then canonicalize triggers, then routes, each by exact event type | none
- Pushes augment | operation, write | job to `graftpunk-http` with the run id, source notifier | first pass
- Fetches order and invoice | operation, view | order detail, invoice list by sales order id, invoice detail, all optional for notifications; order list, find by PO, order detail for confirmations | none
- Caches PDF and CSV | operation, write | `invoice_pdf` for 300 seconds, `invoice_csv` for 3600 seconds | none
- Publishes .augmented | operation, output | the source envelope plus an `augmented` slot and a `degraded` slot when steps failed | loop back to the stream
- Pushes canonicalize | operation, write | job to `core` with the run id | second pass, P4 pill
- Hands the CSV to core | operation, route | Part 4 | muted
- Publishes .canonicalized | operation, output | the snapshot, or a degraded pass-through, or nothing on a teaching 422 | muted, loop back to the stream
- Pushes discord.notify | operation, write | envelope, channel, colour, builder name, mention text, timezone, logo | third pass
- Renders the embed | operation, route | `bek_canonical` from core, augmented, canonical, raw | none
- Posts to the channel | operation, output | up to ten embeds, the mention text, the PDF | ends at the primary embed
- Opens a thread | operation, write | on the message, named by the headline | none
- Posts details | operation, output | overflow chunks, the summary embed, the JSON file | ends at the thread artifact
- Closes the run | operation, write | the terminal handler marks the child run succeeded | P3 pill
- Reads the channel | operation, action | Store staff | none
- Fails the run | operation, write | on 401, 403, 404, a data-shape error, or a spent budget | branch below
- Releases the dedup key | operation, write | the `release_dedup_ratchet` compensation; Part 7 | branch below, dead end

**Piping**

- Notifier | piping, code | `notifier.py` and `consumer.py`: the loop, the dispatch order, the suppression, the three push helpers | none
- Routes and triggers | piping, config | `pipelines/bek.yaml`: the augment triggers, the canonicalize triggers, the two routes and their fields | none
- Faktory | piping, queue | `graftpunk-http` for augment, `core` for canonicalize and notify; no retry on the job, 25 by default | none
- Augment | piping, code | `tasks/augment.py`: the fetch chain, the error classes, degrade, the caches | none
- BEK portal | piping, external tool | the endpoints augment uses: order detail, invoice list, invoice detail, PDF and CSV export | none
- Canonicalize | piping, code | the hand-off: consumes `csv_key` and `csv_kind`, publishes `.canonicalized`, pass-through, 422 | muted, Part 4
- Discord notify | piping, code | `tasks/discord_notify.py`: the six steps and the status classification | none
- Embed builder | piping, code | `embeds_canonical.py` and the thread builders: framing per data type, rows, footer, limits | none
- Discord | piping, external tool | the REST calls, the limits, the rate-limit retry, the bot token | none
- Workflow wrapper | piping, code | `workflows/wrapper.py` and friends: the attempt counter, the budget, terminal classification, mark succeeded or failed, compensations | none

**Data**

- events stream | data, redis stream | read side: group `notifier`, consumer `notifier-1`, PEL, autoclaim; three event types per lifecycle | none
- job_enqueues | data, table row | source `notifier` for the three job types | muted, Part 7
- invoice blob cache | data, redis key | `invoice_pdf:{vendor}:{invoice}` 300 s, `invoice_csv:{vendor}:{doc}` 3600 s | none
- workflow_side_effects | data, table row | the `dedup_ratchet` row the compensation reads | muted, Part 7
- attempt counters | data, redis key | `workflow:attempts:{jid}`, 24 hours | none
- dedup keys | data, redis key | read as `seen` on the envelope; deleted by the winner's release | none
- workflow_runs | data, table row | the child run: running, succeeded, failed, compensating, compensated | none
- job_executions | data, table row | classes vendor and core; reference carries message and thread ids | muted, Part 7

**Principles**

- P2 · Publish before save | principle | on Reads the stream, for producers decoupled from consumers
- P4 · The orchestrator drives, core executes | principle | on Pushes canonicalize
- P3 · Fail loud | principle | on Closes the run, for the terminal classification beside it

## Groupings

- Part 3 frame | part frame | everything above
- Three passes | cluster | chapter captions above the rail; two loop lines above the rail returning to its start
- Dead ends | cluster | Closes the loser's run; Fails the run and Releases the dedup key
- Artifacts | cluster | the primary embed with the thread hanging from it, below Posts to the channel

## Relationships

- Reads the stream -> Drops a repeat -> Picks the stage -> Pushes augment -> Fetches -> Caches -> Publishes .augmented | flow | the first pass
- Publishes .augmented -> Reads the stream | feedback | loop above the rail
- Pushes canonicalize -> Hands the CSV to core -> Publishes .canonicalized | flow | the second pass, muted
- Publishes .canonicalized -> Reads the stream | feedback | loop above the rail
- Pushes discord.notify -> Renders -> Posts -> Opens a thread -> Posts details -> Closes the run -> Reads the channel | flow | the third pass
- Drops a repeat -> Closes the loser's run | flow | branch
- Closes the run -> Fails the run -> Releases the dedup key | flow | branch, the failure path
- Reads the stream -> Notifier card; Picks the stage -> Routes card; Pushes augment -> Faktory card; Fetches -> Augment card; Pushes canonicalize -> Canonicalize card; Pushes discord.notify -> Discord notify card; Renders -> Embed builder card; Posts to the channel -> Discord card; Closes the run -> Workflow wrapper card | tie
- Augment card -> BEK portal card | tie, horizontal
- Notifier card -> events stream; Notifier card -> job_enqueues (one bend); Augment card -> invoice blob cache; Workflow wrapper card -> attempt counters (one bend); Workflow wrapper card -> dedup keys (one bend); Workflow wrapper card -> workflow_runs | tie

Reading order: left to right. The notifier and its two checks, then the three passes in sequence with the two loops above showing the return to the stream, then the artifacts below the post, the close, the reader, and the failure path below.

Color semantics beyond the standard planes: none. Muted pieces at opacity 0.55.

Undecided:

- Whether the loops back to the stream should be drawn at all, or whether three notifier actors in sequence would read faster. Drawn as loops; the audit records the reason.
- The Store staff designation for who reads the channel; the design says two operators and buyers. Lexicon queue item 5.
- The route's `retry` versus Faktory's retry. Drawn as the code behaves: the wrapper reads -1, the job carries 25.

## Nature pass

| Nature used here | Family in Visual Rules | Match |
| --- | --- | --- |
| actor, agent | Actor, Agent | match; Notifier, Browser worker, Worker designations exist |
| actor, human | Actor, Internal Human, designation Store staff | match |
| interface, Discord channel | Interface | drawn as a caption on the reader, not a card; the channel has no mockup on this board |
| artifact, Discord message and thread | Artifact | match; the Part 1 artifact shell, two instances |
| operation, all acts | Operation | match; View is used for the BEK fetch |
| piping, code / config / queue | Piping Runner and Router cards | match |
| piping, external tool | External Tool card | match; BEK and Discord marks exist |
| data, redis stream / redis key / table row | Data card per section 5 | match |
| principle | Color Tag rebound to Principles | match |
| feedback loop | a line above the rail returning to its start | no family; drawn like the door branch on Parts 1 and 2, recorded as open |

One gap, the feedback loop, drawn with the branch-line convention.
