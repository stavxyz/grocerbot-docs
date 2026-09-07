# Map Brief: Part 2, Email Ingestion

Written 2026-09-06 in the format at the end of `02 - Tools/Figma/Instructions.md`, in GrocerBot's four-level vocabulary. The nature pass at the end maps each nature to the piece families in `02 - Tools/Figma/Visual Rules.md`. Under the standing instruction to continue without asking, this brief is recorded and then built; it stays the point where the content was cheapest to change.

Purpose: a reader should see within ten seconds that vendor email forwarded from the store's Gmail lands on a Cloudflare address, is stored before anything else happens, is handed to the orchestrator by a webhook, is checked against a 30-day memory of Message-IDs, is resolved to a tenant, vendor, and type, and then runs whatever rules match: an order confirmation becomes an event on the stream, an invoice notice becomes a poll in Part 1, a PDF is filed, and a Gmail forwarding request is confirmed and reported to ops. Every arrival leaves a row.

Target: file `nBmhDyEDpFPrMq0ztmHDb0`, page VISUAL DOCUMENTATION (`7001:129074`), a new frame below the Part 1 board. Components from SYSTEM LEGEND (`7001:129072`).

Standing: live. Drawn as current. No TBD badges from standing. Two published events with no consumer are drawn muted with a caption, as findings.

## Elements

One per line: name | nature | one-line description | modifiers.

**Actors**

- Vendor | actor, external | BEK's systems, `orders@bekentree.com` and `noreply@benekeith.com`, emailing the store | none
- Store staff | actor, human | sets the Gmail forwarding rule once; their mailbox forwards vendor mail from then on | none
- Email worker | actor, agent | the Cloudflare Worker `grocerbot-email-worker-prod`, invoked by Email Routing | none
- API | actor, agent | the orchestrator's FastAPI service behind the Cloudflare Tunnel at `orch.grocerbot.net` | none
- Worker | actor, agent | the lightweight Faktory worker on queues `core` and `default` | none
- Browser worker | actor, agent | receives the poll the invoice rule pushes; Part 1, shown as the boundary | muted
- Notifier | actor, agent | consumes the stream; Part 3, shown as the boundary | muted

**Interfaces**

- Gmail forwarding rule | interface, external settings | the store's Gmail forwards to `orderconfirmations@freco.grocerbot.net`; drawn as a Code block on the door branch with a GMAIL eyebrow | none

**Artifacts**

- Forwarding Confirmed | artifact, Discord message | green embed, title Forwarding Confirmed, fields Source and Destination, in the ops `email_forwarding_confirmations` channel; red with the link on failure | none

**Operations, the rail in order**

- Sets up forwarding | operation, action | Store staff add a forwarding address in Gmail; Gmail emails a confirmation to that address | door branch above the rail
- Email arrives | operation, trigger | at `{type}@freco.grocerbot.net` through Cloudflare Email Routing | none
- Stores raw email | operation, write | the Worker puts `emails/{date}/{uuid}.eml` in R2; if that fails the message is rejected | P3 pill
- Calls the webhook | operation, route | POST with the R2 key, subject, and tenant and type hints; a non-2xx rejects the message | none
- Pushes email job | operation, write | `process_email` to queue `default`, source `api`, one `job_enqueues` row | none
- Checks for a repeat | operation, route | `SET NX` on `email:dedup:{tenant}:{message_id}` for 30 days | none
- Records the duplicate | operation, write | an `email_arrivals` row with the flag; nothing else runs | branch below, dead end
- Resolves tenant · vendor · type | operation, route | address hints, then domains, then regexes, in that order | P5 pill
- Matches rules | operation, route | every enabled glob rule whose conditions all match runs | P1 pill
- Triggers a poll | operation, write | `vendor.poll bek invoices freco` to `graftpunk-http`, source `email_rule` | branch below, ends at the Browser worker boundary
- Stores attachments | operation, write | PDFs to `attachments/bek/invoices/` | branch below, dead end
- Confirms forwarding | operation, write | GET then POST Google's `vf-` link | branch below
- Posts to ops | operation, output | the Forwarding Confirmed embed | branch below, ends at the artifact
- Publishes event | operation, output | `bek.orderconfirmations.new`, source `email_push`, dedup on `order_confirmed` and the PO | none
- Records the arrival | operation, write | one `email_arrivals` row, resolved or unresolved | none
- Flags unresolved | operation, output | `email.unresolved.new` when no tenant resolved; nothing consumes it | muted, branch below, dead end
- Consumes the stream | operation, trigger | Part 3 | muted

**Piping**

- Gmail | piping, external tool | forwarding rules and the confirmation flow: `forwarding-noreply@google.com`, subject Forwarding Confirmation, link on `mail.google.com` or `mail-settings.google.com`, GET then POST, success marker | none
- Email worker | piping, code on Cloudflare | store to R2, parse recipient, post webhook, reject on failure, tag `.failed` | none
- API webhook | piping, code | `POST /webhooks/email`, Bearer secret, push to Faktory | none
- Faktory | piping, queue | `default` for `process_email`; `graftpunk-http` for the triggered poll; no unique lock on either push | none
- Worker · process_email | piping, code | download, parse, hash, dedup, rules, record, no workflow run | none
- Resolver | piping, code | `tenant.py`: the three resolutions and the five email types with their regexes | none
- Rules engine | piping, code | `email_rules.py` and the action registry: the five rules and their actions | none
- Auto-confirm | piping, code | the `auto_confirm_forwarding` handler | none
- Emitter · email path | piping, code | `emit_domain_event` into the shared emitter: parser, business pair, v2 key, no parent run | none

**Data**

- raw emails | data, R2 object | `emails/{date}/{uuid}.eml`, `message/rfc822`, `from` and `to` metadata, a `.failed` sibling on parse or webhook errors; bucket `grocerbot-orchestrator-emails-prod` | none
- job_enqueues | data, table row | the `process_email` push from the API and the `vendor.poll` push from the rule | muted, Part 7
- email dedup keys | data, redis key | `email:dedup:{tenant or _unknown}:{message_id or sha256}`, value `1`, 30 days | none
- email_arrivals | data, table | fifteen columns, four indexes, one row per arrival | none
- attachments | data, R2 object | `{destination}{filename}` per rule; no reader today | none
- dedup keys | data, redis key | `dedup:v2:freco:bek:order_confirmed:{po}`, 24 hours; shared with Part 1's poll of the same confirmation | none
- events stream | data, redis stream | the envelope with `source: email_push`, `occurred_at` the message date, `workflow_run_id` empty | none
- job_executions | data, table row | class `email`, label `email` | muted, Part 7

**Principles**

- P1 · Deterministic | principle | on Matches rules
- P3 · Fail loud | principle | on Stores raw email
- P5 · The SaaS invariant | principle | on Resolves tenant · vendor · type

## Groupings

- Part 2 frame | part frame | everything above
- Door | cluster | Store staff, the Gmail forwarding rule, Sets up forwarding; a branch above the rail joining before Email arrives
- Rule branches | cluster | Triggers a poll, Stores attachments, Confirms forwarding and Posts to ops, three shelves below Matches rules
- Dead ends | cluster | Records the duplicate, Flags unresolved

## Relationships

- Store staff -> Sets up forwarding -> Email arrives | flow | once, then Gmail forwards on its own
- Vendor -> Email arrives | flow | via the store's Gmail
- Email arrives -> Stores raw email -> Calls the webhook -> Pushes email job -> Checks for a repeat -> Resolves -> Matches rules -> Publishes event -> Records the arrival -> Consumes the stream | flow | the rail
- Checks for a repeat -> Records the duplicate | flow | branch, if seen within 30 days
- Matches rules -> Triggers a poll -> Browser worker | flow | branch, Part 1
- Matches rules -> Stores attachments | flow | branch
- Matches rules -> Confirms forwarding -> Posts to ops -> Forwarding Confirmed | flow | branch
- Records the arrival -> Flags unresolved | flow | branch, if no tenant
- Email arrives -> Email worker card | tie
- Calls the webhook -> API webhook card | tie
- Pushes email job -> Faktory card | tie
- Checks for a repeat -> Worker card | tie
- Resolves -> Resolver card | tie
- Matches rules -> Rules engine card | tie
- Confirms forwarding -> Auto-confirm card | tie
- Publishes event -> Emitter card | tie
- Email worker card -> raw emails | tie
- API webhook card -> job_enqueues | tie
- Worker card -> email dedup keys | tie
- Worker card -> email_arrivals | tie, one bend
- Rules engine card -> attachments | tie
- Emitter card -> dedup keys | tie, one bend
- Emitter card -> events stream | tie

Reading order: left to right. The door, the arrival, the Worker's store and call, the API's push, the worker's repeat check, resolution, rules with their three branches hanging below, the event, the arrival row, the boundary to Part 3.

Color semantics beyond the standard planes: none. Muted pieces at opacity 0.55, as on Part 1.

Undecided:

- The Gmail location mark. No Gmail or Google mark exists in the Tools set; a text-only `Tool=Gmail` variant is added, like the eight text-only marks already there. Glyph TBD.
- Whether the Gmail forwarding rule is an Interface at all. It is a setting a human makes once in a third-party product. Drawn as a Code block on the door because that is the closest existing convention.
- The two meanings of dedup. Lexicon queue.
- Whether email-sourced events should open a workflow run. Finding 1; not drawn as a defect, the events card says the run id is empty.

## Nature pass

| Nature used here | Family in Visual Rules | Match |
| --- | --- | --- |
| actor, external | Actor, external ring | match; the Actor set's external variant, designation Vendor |
| actor, human | Actor, Internal Human, designation Store staff | match |
| actor, agent | Actor, Agent | match; designations Email worker, API, Worker exist |
| interface, external settings | Interface, Code block convention | closest match; recorded as open |
| artifact, Discord message | Artifact | match; same shell as Part 1's ops alert |
| operation, all acts | Operation | match |
| piping, external tool | External Tool card | match once the Gmail mark exists |
| piping, code on Cloudflare | Piping Runner card with the Cloudflare mark | match; the Tools set has Cloudflare |
| piping, code / queue | Piping Runner and Router cards | match |
| data, R2 object / redis key / redis stream / table | Data card per section 5 as drawn on Part 1 | match |
| principle | Color Tag rebound to Principles, as on Part 1 | match |

One gap, the Gmail mark, closed with a text-only variant.
