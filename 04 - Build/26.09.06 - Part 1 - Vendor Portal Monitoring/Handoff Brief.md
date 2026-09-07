# Map Brief: Part 1, Vendor Portal Monitoring

Written 2026-09-06 in the format at the end of `02 - Tools/Figma/Instructions.md`, with natures in GrocerBot's four-level vocabulary rather than DRAPER's. The nature pass at the end maps each nature to the piece families the visual rules already define and flags the gaps. This is the handover from thinking to drawing and the last point where the content is cheap to change. Nothing below is drawn until the brief is approved and the target is confirmed.

Purpose: a reader should see within ten seconds that a clock in the orchestrator asks the BEK portal for five kinds of data every half hour through a browser session, compares each answer with what it saw last time, and puts one event on a stream for every new or changed item, saving what it saw only after the events are out.

Target: file `nBmhDyEDpFPrMq0ztmHDb0`, page VISUAL DOCUMENTATION (`7001:129074`), named by Sam 2026-09-06. The legend is built first on SYSTEM LEGEND (`7001:129072`); the board uses its components.

Standing: live. Drawn as current. No TBD badges from standing.

## Elements

One per line: name | nature | one-line description | modifiers.

**Actors**

- Operator | actor, human | one of the two people who run `gbo`, read the ops channel, and log in to BEK by hand when recovery fails | none
- BEK portal | actor, external system | bekentree.com, Akamai-protected, reached only through an authenticated browser session | none
- Init | actor, agent | one-shot container that reconciles seed YAML into the database before anything else starts | none
- Scheduler | actor, agent | 60-second tick that turns due schedules into jobs | none
- Browser worker | actor, agent | Chromium plus Xvfb under s6-overlay; the only process that talks to BEK | none
- Notifier | actor, agent | consumes the stream; Part 3, shown here as the boundary | muted

**Interfaces**

- gbo trigger | interface, CLI | pushes one poll job by hand, optionally to a dev Discord channel | none
- gbo reset and status | interface, CLI | clears or seeds the snapshot baseline; shows checksum and fetch time per data type | none
- Faktory web UI | interface, web | queues, retries, dead set; every job labelled `bek/{data_type}/{tenant}` with its source | none
- Ops alert | interface, Discord | the amber ping on a poll parser failure, into the ops summary channel | none

**Operations, the steps in order**

- Reconcile seed | operation, action | Init reads `schedules.seed.yaml`, diffs against `vendors` and `schedules`, inserts, updates, deletes within a 10 percent cap | none
- Tick | operation, trigger | every 60 seconds the scheduler selects schedules with `next_run_at` in the past and an enabled vendor | none
- Fan out per tenant | operation, action | for each subscribing tenant in `tenants.yaml`, one `vendor.poll` job with `[vendor, data_type, tenant]` | none
- Take unique lock | operation, action | `SET NX` on `unique:vendor.poll:{hash}` for 1800 seconds; a lost race suppresses the push | none
- Push to graftpunk-http | operation, create | Faktory job created with label and source; `job_enqueues` row written | none
- Advance next run | operation, action | `next_run_at` recomputed from the cron | none
- Consume with strict priority | operation, trigger | browser worker drains `graftpunk-browser` before `graftpunk-http`, concurrency one | none
- Open parent run | operation, create | `workflow_runs` row named `vendor.poll` | none
- Call the plugin | operation, action | `GraftpunkClient("bek").execute(*command)`; session from R2, CSRF token from a Chrome page on cache miss | load-bearing
- Detect dead session | operation, action | typed graftpunk errors, a timeout, a Chrome error, or a `ValueError` matching four known phrasings | none
- Take pending slot | operation, action | `SET NX` on `browser_login:pending:bek` for 600 seconds | none
- Enqueue browser.login | operation, create | job on `graftpunk-browser`, source `worker`; the poll then raises and Faktory retries it | none
- Skip if fresh | operation, action | a login within 300 seconds makes the login job a no-op | none
- Run gp bek login | operation, action | subprocess, 120-second timeout; Chrome fills the SSO form with `BEK_USERNAME` and `BEK_PASSWORD`, extracts `ACC.config.CSRFToken`, persists the session to R2 | load-bearing
- Extract collection | operation, action | JMESPath path over the response; a dict is wrapped as a one-item list | none
- Filter | operation, action | order confirmations keep only subjects containing "is ready for delivery" | none
- Sort | operation, action | notifications by `creationtime` ascending, year injected because BEK's format has none | none
- Load previous snapshot | operation, view | the `snapshots` row for vendor and data type; a corrupt row is treated as a fresh baseline | none
- Diff per item | operation, action | identity key from the configured fields, checksum over the compare fields; absent key is `new`, changed checksum is `changed` | none
- Diff whole collection | operation, action | one checksum over the list; any difference is a single `changed` | none
- Baseline | operation, action | first poll saves the snapshot and emits nothing | none
- Parse item | operation, action | `bek_notification`, `bek_order_confirmation`, or passthrough; derives identity fields plus business event and entity id; raises on anything unmapped | none
- Ping on parser failure | operation, output | deduped `ops.ping` to the ops channel; the item is skipped and the snapshot still advances | none
- Register dedup key | operation, action | `SET NX` then `INCR` on the v2 or legacy key, 24-hour TTL; the count is `seen` | none
- Open child run | operation, create | `workflow_runs` row named `canonical_event` under the parent, with a `dedup_ratchet` side effect | none
- Publish envelope | operation, output | `XADD` to the `events` stream; a failed publish rolls the dedup registration back | load-bearing
- Save snapshot | operation, action | upsert of `snapshots`, only after every event is published | load-bearing
- Close parent run | operation, action | `workflow_runs` marked succeeded; `job_executions` row written; unique lock released | none

**Artifacts**

- Canonical event envelope | artifact, record | vendor, data type, tenant, source, occurred at, received at, dedup key, seen, core, raw, business event, entity id, workflow run id, trace | none
- Ops alert message | artifact, message | plain text embed naming the vendor, data type, and parser error | none

**Data**

- vendors | data, table | name, display name, requires browser, session name, plugin module, enabled | none
- schedules | data, table | vendor, task, cron, queue, enabled, next run at, jobtype, args template, unique for | none
- snapshots | data, table | vendor, data type, snapshot JSONB keyed by identity, checksum, fetched at | none
- job_enqueues | data, table | jid, jobtype, queue, source, label, trace id, enqueued at | muted
- job_executions | data, table | jid, job type, class, label, status, duration, metrics, reference, error, workflow run id | muted
- workflow_runs | data, table | id, parent, name, tenant, vendor, data type, dedup key, state, timestamps | muted
- workflow_side_effects | data, table | run id, type, compensate, payload, compensated | muted
- unique lock keys | data, Redis key | `unique:vendor.poll:{hash}` with companion `unique_jid:{jid}` | none
- dedup keys | data, Redis key | `dedup:v2:{tenant}:{vendor}:{business_event}:{entity_id}` or `dedup:{tenant}:{vendor}:{data_type}:{identity}` | none
- browser login keys | data, Redis key | `browser_login:pending:bek`, `browser_login:last_success:bek` | none
- events stream | data, Redis stream | the single stream every source publishes to | none
- graftpunk session | data, R2 object | the encrypted session pickle graftpunk's S3 backend reads and writes | none

**Piping**

- schedules.seed.yaml | piping, config | the declared vendors and schedules | none
- pipelines/bek.yaml | piping, config | per data type: command, path, identity, compare, sort, filter, parser, consumers | none
- tenants.yaml | piping, config | which tenants subscribe to which vendor | none
- Faktory queues | piping, queue | `graftpunk-browser`, `graftpunk-http` | none
- graftpunk BEK plugin | piping, library | `GraftpunkClient` and the `gp` CLI, the nodriver backend, the token extractor | none
- Session key bootstrap | piping, code | `GRAFTPUNK_SESSION_KEY` written to the key file at boot so every container shares one Fernet key | none

**Principles cited**

- P1 Deterministic | principle | no AI in the loop | none
- P2 Publish before save | principle | a failed publish is rediscovered, never lost | none
- P3 Fail loud | principle | unknown tracking status, unknown notification type, missing identity field all raise | none
- P5 SaaS invariant | principle | tenants come from config, fanned out per tenant, never from env | none

## Groupings

Container name | container nature | members.

- Setup | phase panel | Init, Reconcile seed, schedules.seed.yaml, vendors, schedules
- Schedule | phase panel | Scheduler, Tick, Fan out per tenant, Take unique lock, Push to graftpunk-http, Advance next run, tenants.yaml, unique lock keys, job_enqueues
- Poll | phase panel | Browser worker, Consume with strict priority, Open parent run, Call the plugin, BEK portal, graftpunk BEK plugin, graftpunk session, Session key bootstrap
- Recover | cluster, hanging off Poll | Detect dead session, Take pending slot, Enqueue browser.login, Skip if fresh, Run gp bek login, browser login keys
- Diff | phase panel | Extract collection, Filter, Sort, Load previous snapshot, Diff per item, Diff whole collection, Baseline, snapshots
- Emit | phase panel | Parse item, Ping on parser failure, Register dedup key, Open child run, Publish envelope, dedup keys, events stream, Canonical event envelope, Ops alert
- Close | phase panel | Save snapshot, Close parent run, job_executions, workflow_runs
- Five data types | tray, across Poll and Diff | notifications (per item, four identity fields, sorted), orderconfirmations (notifications command filtered, per item on `po_number`), orders (per item on `order`), invoices (per item on `invoice`), cart (whole collection), delivery (whole collection)
- Other doors | cluster, beside Schedule | gbo trigger, trigger_vendor_poll from Part 2

## Relationships

A -> B | role | label prose or none.

- Init -> vendors, schedules | flow | reconciles on every deploy
- Tick -> Fan out per tenant | flow | none
- Fan out per tenant -> Take unique lock -> Push to graftpunk-http | flow | none
- gbo trigger -> Push to graftpunk-http | flow | no dedup
- trigger_vendor_poll -> Push to graftpunk-http | flow | no dedup, from Part 2
- Push to graftpunk-http -> Consume with strict priority | flow | via Faktory
- Consume with strict priority -> Open parent run -> Call the plugin | flow | none
- Call the plugin -> BEK portal | flow | one of five commands
- Call the plugin -> graftpunk session | pull | session read from R2
- Call the plugin -> Detect dead session | feedback | on any session signal
- Detect dead session -> Take pending slot -> Enqueue browser.login | flow | none
- Enqueue browser.login -> Consume with strict priority | feedback | login runs before the retried poll
- Skip if fresh -> Run gp bek login | flow | when no login in 300 seconds
- Run gp bek login -> BEK portal | flow | SSO form
- Run gp bek login -> graftpunk session | flow | session written to R2
- Call the plugin -> Extract collection -> Filter -> Sort -> Load previous snapshot | flow | none
- Load previous snapshot -> snapshots | pull | none
- Sort -> Diff per item | flow | notifications, orderconfirmations, orders, invoices
- Sort -> Diff whole collection | flow | cart, delivery
- Diff per item -> Parse item | flow | one per new or changed item
- Parse item -> Ping on parser failure | feedback | on raise; item skipped
- Parse item -> Register dedup key -> Open child run -> Publish envelope | flow | none
- Publish envelope -> events stream | flow | none
- Publish envelope -> Register dedup key | feedback | rollback on failure
- Publish envelope -> Save snapshot | flow | only after the last event
- Save snapshot -> snapshots | flow | none
- Save snapshot -> Close parent run | flow | none
- events stream -> Notifier | flow | Part 3; only notifications and orderconfirmations are matched there
- P2 -> Save snapshot | tie | the ordering rule
- P3 -> Parse item | tie | raise on unknown
- P5 -> Fan out per tenant | tie | tenants from config

## Reading order

Left to right: Setup, Schedule (with Other doors above it), Poll (with Recover hanging below it as a loop back into Poll), Diff, Emit, Close, then the boundary to Notifier at the far right. The Five data types tray runs as a thin band under Poll and Diff so the reader sees that one chain serves five configurations. Lanes top to bottom, per the live DRAPER boards read on 2026-09-06: the Process rail on top, Piping cards under it, Data cards at the bottom, dotted ties between. Principles are pills on the elements they govern, not a lane. (An earlier draft of this brief put Piping above Process; the live boards ruled otherwise.)

## Color semantics beyond the standard planes

None proposed. Level colors for the four GrocerBot levels are not yet set; see the undecided list. Within the Process lane, the DRAPER connection type colors (action, trigger, create, output, view) carry over unchanged if the visual rules re-base keeps them.

## Undecided

Everything below is drawn bracketed or TBD, or is not drawn until ruled.

- Ruled 2026-09-06: the tag is an **Operation**, with the seven acts from the live legend. The natures above say so.
- **Where Process ends and Piping begins.** This brief puts every step a human could describe as "the system did X" in Process, including Tick, Take unique lock, and Register dedup key, and puts only the standing machinery in Piping: queues, config, the plugin, the key bootstrap. A tighter cut would move Take unique lock, Open parent run, Open child run, Register dedup key, and Close parent run into Piping as bookkeeping, leaving Process with the steps that change what the store knows. Both are defensible. Sam decides on this board.
- **The four unconsumed data types.** Drawn in the tray with a bracketed note "[no consumer today; child runs close by timeout]" until the finding is discussed. If they are vestigial, they leave the tray.
- **Lane order.** Piping above and Data below Process is proposed by analogy with DRAPER, which put Logic and Functions above and Artifacts and Data below. Not ruled.
- **Level colors.** DRAPER's Process (largely black, per piece), Data (pink) and the connection type colors can carry over. Principles and Piping need colors; DRAPER's live file has a Piping level whose color is not in the written rules. Set during the visual rules re-base after reading the live legend.
- **Human actor names.** The design says two operators. Only the `buyers` Discord role is named in code. The Operator element stays generic until Sam names the roles.
- **Whether the envelope is an Artifact.** It is a record on a stream that no human reads directly. This brief lists it as an Artifact because Part 3 renders it; a stricter reading makes it Data. Ruling needed for the legend.

## Nature pass

Each nature above against the piece families in `02 - Tools/Figma/Visual Rules.md` sections 1 and 4, which are DRAPER's. A match means the family's sheet applies as written. A gap means the visual rules re-base has to define it before this board is built.

| Nature used here | DRAPER family | Match |
| --- | --- | --- |
| actor, human | Actor, Human, with Role or Stage | match |
| actor, agent | Actor, Agent, with Title | match; DRAPER's Agent color is still open in its own rules |
| actor, external system | Actor, External | match; DRAPER's boundary ring encodes Internal versus External |
| interface, CLI | Interface, with Surface and Purpose | match in structure; a terminal surface has no mockup convention yet | 
| interface, web | Interface | match |
| interface, Discord | Interface | match; DRAPER drew WhatsApp and Notion mockups the same way |
| operation, action / trigger / create / output / view | Operation, seven acts (live legend) | match |
| artifact, record | Artifact | gap: DRAPER's artifact types are documents, cards, emails, messages; a stream record has no type icon |
| artifact, message | Artifact, message | match |
| data, table | Data, table with fields | match; DRAPER's row card eyebrow rule applies |
| data, Redis key | Data | gap: no convention for a key-value entry or a TTL |
| data, Redis stream | Data | gap: no convention for a stream |
| data, R2 object | Data | gap: no convention for an object in a bucket |
| piping, config | none | gap: DRAPER's written rules have no Piping level; its live file does |
| piping, queue | none | gap, same |
| piping, library | none | gap, same |
| piping, code | none | gap, same |
| principle | Principle, sheet and pill | match |
| phase panel, cluster, tray | System Views lanes and clusters | match in structure; the lane set changes to four levels |

Seven gaps, all in Data and Piping, and one open family color. The re-base of the visual rules has to close them before section 6 of the Function can start. None of them is a content gap; the content above is complete against the code.
