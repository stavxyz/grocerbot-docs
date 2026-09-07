# System Lexicon

The dated record of GrocerBot's language as used in this documentation. Newest section on top. Each term carries its strength: **settled** when the code, the specs, or the owner fixed it; **working** when it is in use and not ruled; **open** when a name is needed or two are in conflict. Older sections are preserved at the strength they had. Nothing here is silently rewritten; a change gets a new dated entry above.

Started 2026-09-06 at the first naming decisions. Shape follows `03 - Example/System Lexicon (DRAPER).md`.

---

## 2026-09-06, method setup

### Levels and pieces

- **Principles**, **Process**, **Data**, **Piping**: the four documentation levels. Settled by Sam 2026-09-06. There is no Function or Logic level; GrocerBot has no AI calls.
- **Actor**, **Interface**, **Artifact**: pieces within Process, carried over from the method. Working; Sam listed them and did not object.
- **Operation**: the square tag stating what happens at a step, in the colour of its act, on the rail between two pieces or standing alone inside a card panel. Settled by Sam 2026-09-06 ("operation it is") after weighing Connection, the method's word and the live component set's name, and Action, his spoken word and one of the seven act types. The acts are Action, Trigger, Write, Create, View, Route, Output. The rail line itself is just a line.
- **Piping**: the plain code and infrastructure between Process steps that carries no business meaning of its own. Settled as a level name; its boundary with Process is open and will be settled on the first board.
- **part**: the unit a spoken request resolves to. Seven parts, agreed "for now". Working.
- **standing**: one of live, dev only, designed not wired, version 1. Method term from this session. Working. Standings live in the harness text, never on boards.
- **version 1**, **version 2**: the legacy `grocerbot` CLI and the orchestrator plus core system. Sam's words 2026-09-06. Settled for this documentation.

### The seven parts

Vendor portal monitoring; email ingestion; notification delivery; document canonicalization; POS sync; inventory ledger; reliability and operations. Working names, agreed "for now".

### System nouns, from the code

- **tenant**: a store. Settled in code. The orchestrator uses a slug (`freco`) and core uses a UUID; `tenants.yaml` maps one to the other per environment. Replaced **retailer**, which survived only as an `email_arrivals` column until migration 008 renamed it.
- **vendor**: a supplier of goods, `bek` today. Settled in code in both repos. Version 1 says **supplier**.
- **document**: core's unit, of type `invoice` or `order_confirmation`. Settled in core since the `d1e2f3a4b5c6` migration renamed `invoices` to `documents`. The stage endpoints are still named `/invoices/`, a known inconsistency in the API paths, not a naming conflict in the model.
- **canonical**, **canonicalize**: the format and the stage that produces it. Settled in both repos.
- **snapshot**: in the orchestrator, the last polled collection per vendor and data type; in core, the three JSONB copies of a document's stages. One word, two things. Open whether documentation distinguishes them.
- **data type**: one of the things a vendor is polled for. BEK has six configured: notifications, orderconfirmations, orders, invoices, cart, delivery. Settled in code as the second segment of an event type and the `task` column of `schedules`.
- **pipeline**: one vendor and data type's configuration in `config/pipelines/{vendor}.yaml`. Settled in code. Older documents use it for the whole chain.
- **poll**, **diff**, **emit**: the three steps of Part 1 as the code names them. Settled in code.
- **init**: both the migration-runner compose service and s6-overlay's PID 1 inside the browser worker. One word, two things; the compose file says so. Documentation says "the init container" for the first and does not name the second.
- **event**, **canonical event**, **envelope**: one observation on the Redis stream, in the shape `emit_canonical_event` produces. Settled in code.
- **business_event** and **entity_id**: what happened and to whom, derived by a parser, the basis of the v2 dedup key. Settled in code and spec.
- **augment**: the step that fetches portal detail after an event. Settled in code.
- **workflow run**, **side effect**, **compensation**: the durable record of one poll or one event's journey, its compensable actions, and their reversal. Settled in code and spec.
- **plan**, **apply**, **reap**: the POS subsystem's primitives. Settled in code and spec.
- **witness**, **projection**, **family**, **tier**, **composition**: the ledger's vocabulary. Settled in code and spec.
- **connection** (POS): a `pos_connections` row, a tenant's link to one Clover merchant. Settled in code. Collides with the Process piece word Connection; documentation qualifies it as **POS connection**.
- **adapter**: used for both vendor document adapters (`core/adapters/`) and POS write adapters (`core/pos/adapters/`). The POS spec rules that prose always qualifies: **document adapter** versus **POS adapter**.
- **pass**: one trip of an event through the notifier. A notification makes three: raw, augmented, canonicalized. Working term from the Part 3 board's captions; the code has no word for it. Not settled.
- **door**: one of the ways a `vendor.poll` job gets pushed: the scheduler tick, `gbo trigger`, or the Part 2 email rule action. Working term from the Part 1 board caption `OTHER DOORS`; the code's word is the `source` column of `job_enqueues`, with values `scheduler`, `cli`, and `email_rule`. Not settled.
- **harness**: DRAPER's word for its AI-call runner and for the root logic block describing it. In GrocerBot the word does not name any component; `Logic - Harness.md` keeps the file name only because the Function calls it.

### Proper names

- **freco**: the tenant slug. Display name `French Grocer` in `tenants.yaml`; the Clover merchant is `FRENCH CO GROCER`; the email domain is `frenchcogrocer.com`. Two spellings of the store name in the sources. Open which the documentation uses.
- **BEK**: Ben E. Keith. `BEK Entree` in `tenants.yaml`, `Ben E. Keith` in the schedules seed, `BEK` as display name in `vendors.yaml`. Open which the documentation uses.
- **gbo**, **gbc**, **gb**: the orchestrator CLI, the core CLI, and the version 1 CLI.
- **graftpunk**: the browser-session framework; **the BEK plugin** is `graftpunk_bek`.

## Naming queue

Things that need a name or whose name is in question. A row leaves when the owner rules and the term moves up.

| # | Raised by | What it is | Working labels | Why it needs work | Source |
| --- | --- | --- | --- | --- | --- |
| 1 | review | The links inside Process | Operation; Connection; action | Ruled 2026-09-06: Operation. Moved to the current set above; kept here as history. | 2026-09-06 walkthrough; Live Legend Read |
| 2 | review | The store's name | French Grocer; French Co Grocer | Two spellings across config and Clover | `tenants.yaml`, POS spec |
| 3 | review | The vendor's display name | BEK; BEK Entree; Ben E. Keith | Three forms across config | `tenants.yaml`, `schedules.seed.yaml`, `vendors.yaml` |
| 4 | review | The orchestrator's polled collection versus core's stage copies | snapshot (both) | One word, two things | code |
| 5 | review | The human roles reading Discord | buyers (role key); operators; staff | Only `buyers` is named in code | `pipelines/bek.yaml` |
| 6 | review | The canonical event envelope's level | Artifact (Part 3 renders it); Data (a record on a stream no human reads) | Decides which lane it sits in on every board | Part 1 handoff brief |
| 7 | Part 2 build | The 30-day email key on Message-ID and the 24-hour canonical key on the business event | dedup (both); email dedup keys; dedup keys | One word, two keys with different scopes and lifetimes; the Part 2 board uses the two-word forms | `email_dedup.py`, `events.py` |
