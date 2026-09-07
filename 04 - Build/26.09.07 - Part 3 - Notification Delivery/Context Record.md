# Context Record: Part 3, Notification Delivery

Working artifact for the third documentation run, assembled 2026-09-07 per `Logic - Protocol.md`. Sam's instruction: "ok go", after the recommendation to take Part 3 next. **Part 3, Notification delivery**: a canonical event on the stream becomes a Discord embed in the store's channel, with a thread, the item rows, the invoice PDF when there is one, and a JSON file. The part begins where Parts 1 and 2 end, at the stream, and ends when the terminal `discord.notify` job marks the event's workflow run succeeded, or fails it into Part 7's hands. Part 4, canonicalization, sits inside this chain as one job the notifier dispatches; it is drawn here only as the hand-off and the return.

Standing per the harness: **live**. The three-stage chain (augment, canonicalize, notify) has run in production since 2026-07-01 per the recovery briefing, and the last change to it in the tree, the canonicalize pass-through for degraded augments, landed 2026-07-15. Not verified against the droplets in this session.

## Files opened

All in `~/src/grocerbot-orchestrator` at `dev` `1304813`, re-checked at the start of this run, plus the BEK plugin package inside it. Each line says why the file matters to Part 3.

**The consumer**

- `src/orchestrator/notifier.py`: the whole dispatch. Loads Discord config, pipeline configs with refs resolved, vendor display config, and the two mention maps; flattens routes, augment triggers, and canonicalize triggers; `process_message` checks augment triggers first, then canonicalize triggers, then routes, each by exact event type; suppresses a repeat (`seen` above 1) before augment or canonicalize and marks the loser's child run succeeded; skips a route when `seen` exceeds `max_seen`; resolves mentions; pushes `augment` to `graftpunk-http`, `canonicalize` and `discord.notify` to `core`, each with source `notifier` and the run id prepended.
- `src/orchestrator/consumer.py`: `StreamConsumer`. Batches of 10, blocking reads of 5 seconds, `XAUTOCLAIM` of entries idle over 30 seconds every fifth iteration, ACK on success and on poison (`ValueError`, `TypeError`, `KeyError`), batch abort on infrastructure errors, exponential backoff 1 to 60 seconds, stream length and pending count logged.
- `src/orchestrator/events.py`: `ensure_group`, `read` with `XREADGROUP` on `>`, `ack`, `autoclaim` from `0-0`, the `seen` register, the two key shapes.
- `src/orchestrator/pipelines/config.py`: the per-event-type config with defaults: `max_seen` 1 per route, `on_failure` fail unless set.
- `src/orchestrator/mentions.py`: role rules emit `<@&id>`, field rules look a value up in the user map; unknown names skip with a log.
- `src/orchestrator/workflows/registry.py`: the three workflow-aware job types, `discord.notify`, `augment`, `canonicalize`.

**Augment**

- `src/orchestrator/handlers/augment.py`: the Faktory wrapper, `workflow_handler(cls="vendor", job_type="augment")`, not terminal; registered on the browser worker so it can use Chrome.
- `src/orchestrator/tasks/augment.py`: the fetch chain per trigger, `arg_from` resolved against augmented data, then core, then raw; `find_in` selection; the error classes and what each does under `fail` versus `degrade`; session recovery through `enqueue_browser_login`; cost analysis when both order and invoice detail exist; the invoice PDF cached at `invoice_pdf:{vendor}:{invoice_id}` for 300 seconds; the CSV cached at `invoice_csv:{vendor}:{doc_id}` for 3600 seconds with `csv_kind` invoice or order; the `.augmented` envelope as a copy of the source with `source: augment`, an `augmented` JSON slot, and a `degraded` slot when steps failed.
- `src/orchestrator/tasks/cost_analysis.py`: read for its name and its inputs only; the numbers it produces are embed content, not Process.
- `src/orchestrator/tasks/_browser_login_recovery.py`: re-read for the session-invalid signal augment shares with the poll.

**Canonicalize, the boundary**

- `src/orchestrator/handlers/canonicalize.py`: the wrapper, `cls="core"`, on the lightweight worker.
- `src/orchestrator/tasks/canonicalize.py`: read for the boundary only: what it consumes (`csv_key`, `csv_kind`), what it publishes (`{vendor}.{data_type}.canonicalized` with a `canonical` snapshot), the degraded pass-through when the CSV is missing or expired (issue #259, fixed 2026-07-15), and the 422 teaching stop that pings ops and publishes nothing. The inside of it is Part 4.

**Notify**

- `src/orchestrator/main.py` lines 326 to 356: `DiscordNotifyHandler`, `workflow_handler(cls="vendor", job_type="discord.notify", terminal=True)`, seven positional args after the run id.
- `src/orchestrator/tasks/discord_notify.py`: fetch the PDF from Redis by key; send the primary message with up to ten embeds, the mention text, and the PDF; create the thread named by the builder; post overflow embeds in chunks of ten; build the combined JSON of core plus augmented; post the thread summary embed with the JSON file; Discord 401, 403, and 404 become `NonRetryableError`, everything else propagates.
- `src/orchestrator/discord_client.py`: httpx, bot token, 10-second timeout, up to three attempts on 429 honouring `Retry-After`, error bodies logged, multipart for files. `notifications/discord/client.py` is an older twin without the file attachment type; the task imports the root one.
- `src/orchestrator/notifications/discord/builders.py` and `embeds.py`: the name-keyed primary builder registry and two helpers; `PRIMARY_ITEM_LIMIT` 7.
- `src/orchestrator/discord_embeds.py`: the thread name, thread summary, and thread embed registries keyed by vendor and data type; BEK registered for notifications, orderconfirmations, and invoices; the `email_unresolved` primary builder and its thread builders, routed by nothing.
- `src/orchestrator/discord_embeds_bek.py`: the BEK thread summary embed and thread name; registers `bek_canonical` plus two aliases, `bek_notification` and `bek_order_confirmation`, kept for in-flight jobs.
- `plugins/bek/src/grocerbot_bek/embeds_canonical.py`: the primary embed. Title Ben E. Keith Foods; headline from notification type and tracking status with emoji, linked to the order; the issues line (out of stock, shorted, substituted); body; a meta line with notification name, a clickable PO number, item count and total from the canonical snapshot, and Submitted by; up to seven item rows as Item, Qty, Cost inline fields sourced from the canonical line items correlated to augmented entries by item code; footer with account and time in the vendor's timezone; thumbnail from the vendor logo; overflow rows as extra embeds of eight items. Order confirmations take their framing from `order_detail` and two constants, so an emailed and a polled confirmation render identically.
- `plugins/bek/src/grocerbot_bek/embed_helpers.py`: titles, footer, issue classification, and the priority order.
- `src/orchestrator/startup.py` `validate_embed_routes`: every routed embed name must resolve at init.
- `src/orchestrator/plugin.py`: the plugin discovery that loads the BEK package.

**The workflow wrapper, the part of Part 7 that runs inside every job here**

- `src/orchestrator/workflows/decorators.py`, `wrapper.py`, `classification.py`, `budgets.py`, `attempts.py`, `errors.py`: the composite decorator; the per-jid attempt counter in Redis with a 24-hour TTL; the retry budget read once from the route's `retry` value at import, default -1; `classify_terminal`, which is true for `NonRetryableError`, for any failure when the budget is -1 or 0, and for attempts beyond a positive budget; on terminal failure `mark_workflow_failed` with reason `non_retryable_error` or `retry_exhausted` and `enqueue_compensations`; on success of a terminal handler `mark_workflow_succeeded`; a None run id logs and re-raises.
- `src/orchestrator/dedup.py` and `workflows/compensation/handlers/dedup_ratchet.py`: the winner's release deletes the key, a loser's release decrements.
- `src/orchestrator/jobs.py`: `create_job` sets no `retry`, so every job carries pyfaktory's default of 25.

**Configuration**

- `config/pipelines/bek.yaml`: augment triggers for `bek.notifications.new` and `.changed` (order detail, invoice list, invoice detail, all optional) and `bek.orderconfirmations.new` (order list, find by PO, order detail); `on_failure` fail for notifications, degrade for order confirmations; canonicalize on `.augmented`; one route per type on `.canonicalized` to `discord.notify`, channel from `discord.{env}.yaml`, colour `0x2ecc71`, embed `bek_canonical`, `max_seen` 1, `retry` -1; mentions on notifications only: `submittedBy` from order detail and the `buyers` role.
- `config/discord.prod.yaml` and `discord.dev.yaml`: one tenant channel for both types in prod, the dev firehose in dev, and empty user and role maps in both.
- `config/vendors.yaml`: BEK's display name, timezone America/Chicago, logo URL.
- `config/pipelines/README.md`: the schema and the dedup note.
- `docker-compose.yml`: the `notifier` service, 192 MB, no Faktory queues of its own; the browser worker consumes `graftpunk-http` for augment; the worker consumes `core` for canonicalize and notify.
- `config/required-env.txt`: `DISCORD_BOT_TOKEN`.

**Design records**

- `docs/plans/2026-02-06-discord-notifications-design.md`: the founding shape, one embed plus a thread plus details, a notifier container, exact-match routes.
- `docs/plans/2026-02-13-thread-embeds-redesign.md`: chunked item embeds, eight items per embed, ten embeds per message, brand and manufacturer lines.
- `docs/plans/2026-02-19-notifier-reliability-design.md`: the PEL orphan problem, `XAUTOCLAIM`, the `StreamConsumer`, the persistent Faktory connection.
- `docs/plans/2026-02-19-invoice-correlation-design.md`: order to invoice correlation, the PDF in Redis for five minutes, cost analysis.
- `docs/plans/2026-02-25-notification-ordering-design.md`: sort before iterating so Delivered follows Out for Delivery; best-effort only.
- `docs/plans/2026-02-26-discord-mentions-design.md`: field and role mention rules and the identity maps.
- `docs/superpowers/specs/2026-05-12-workflow-framework-design.md`: the child run per emit, the terminal job, the three detection mechanisms, the retry budget table.
- `docs/superpowers/specs/2026-06-21-provenance-agnostic-dedup-design.md`: suppression at the first post-emit consumer, first arrival wins, identical rendering regardless of winner.
- Issue #259 (closed 2026-07-15): a degraded augment used to make canonicalize skip silently and the embed never rendered; the pass-through is the fix.

## What is current

The chain as it runs at the SHA read, for a BEK notification.

1. **The notifier reads the stream** as consumer group `notifier`, one consumer, ten at a time, blocking five seconds, reclaiming entries idle more than thirty seconds. Every event on the stream passes through it, including the ones this chain itself publishes.
2. **A repeat is dropped before anything runs.** If the envelope's `seen` is above 1 and the event type has an augment or canonicalize trigger, the notifier logs the suppression, marks the losing child run succeeded so the reaper never sees it, and acknowledges. Routes keep a second check against `max_seen`.
3. **First pass: raw event.** `bek.notifications.new` and `.changed` and `bek.orderconfirmations.new` match augment triggers. The notifier pushes `augment` to `graftpunk-http` with the run id.
4. **Augment on the browser worker.** With a graftpunk client for the vendor it runs the chain: for a notification, order detail by order number, then invoice list searched by the order's sales order id, then invoice detail; for an order confirmation, order list, the order whose sales order equals the PO, then its detail. Optional steps that find no data skip; transient errors raise so Faktory retries; a dead session enqueues `browser.login` and raises; a data-shape error on a required step becomes `NonRetryableError` under `fail` or a degraded slot under `degrade`. With both order and invoice detail it computes the cost analysis, exports the invoice PDF into Redis for five minutes, and exports the invoice CSV (or the order CSV when there is no invoice) into Redis for an hour. It publishes `.augmented`: the source envelope with `source` augment, an `augmented` slot, and a `degraded` slot when anything failed.
5. **Second pass: augmented event.** The notifier matches the canonicalize trigger and pushes `canonicalize` to `core`. Part 4 uploads the CSV to grocerbot-core and drives it to a canonical snapshot; it publishes `.canonicalized` with the snapshot, or a degraded pass-through when there was no CSV, or nothing at all on a 422 teaching stop.
6. **Third pass: canonicalized event.** The route matches. `seen` is checked against `max_seen` 1. Mentions resolve to nothing because both maps are empty. The notifier pushes `discord.notify` to `core` with the envelope, the channel (an override from the event wins, else the route's), the colour, the builder name, the empty mention text, the vendor's timezone and logo.
7. **Render.** `bek_canonical` builds the primary embed and any overflow item embeds from `core`, `augmented`, `canonical`, and `raw`. Order confirmations frame from the fetched order detail and two fixed strings so both sources render the same.
8. **Post.** The PDF is fetched from Redis by key; a missing key logs and continues. The primary message goes to the channel with up to ten embeds and the PDF; the thread is created on it with the headline as its name; overflow embeds go into the thread ten at a time; the combined JSON of core plus augmented is posted in the thread with the summary embed. Discord 429 is retried three times with the server's delay; 401, 403, and 404 are terminal; anything else propagates.
9. **Close.** The terminal handler marks the child run succeeded. `job_executions` records the message and thread ids.
10. **Failure.** The wrapper counts the attempt, reads the route's budget of -1, and treats the first failure as terminal: the run is marked failed, `release_dedup_ratchet` is enqueued, and for the winner that deletes the dedup key. The job itself, carrying no `retry` of its own, is retried by Faktory up to 25 times; a later attempt that succeeds posts the embed while the run stays failed.
11. **Reading.** Store staff read the tenant channel `#bek`. The design names two operators and the buyers role; the code names only the `buyers` role key, mapped to nothing.

## What is historical

- `config/notifications.yaml` with glob routes and per-type colours, from the founding design; replaced by per-vendor pipeline files with exact-match routes and one colour.
- A single embed plus a text thread post; replaced by chunked item embeds, a summary embed, and the JSON file.
- The `invoice_correlation` fetch rule type from the correlation design; the shipped augment expresses the same chain as three ordinary steps.
- `config/mentions.yaml`; the maps moved into `discord.{env}.yaml`.
- Routes on `.augmented` with the `bek_notification` embed; since the canonicalize go-live routes match `.canonicalized` and the embed is `bek_canonical`, with the old names kept as aliases.
- The per-batch Faktory connection and the `>`-only read; replaced by the persistent connection and `XAUTOCLAIM`.
- Canonicalize's silent skip on a missing CSV; replaced by the degraded pass-through on 2026-07-15.
- `notifications/discord/client.py`, an older copy of the Discord client without file attachments, still in the tree and imported by nothing in the notify path.

## What was decided, and where

- Duplicates are suppressed at the first post-emit consumer, and a losing arrival does nothing downstream. Provenance-agnostic dedup spec, 2026-06-21, revised 2026-07-01.
- The same business event renders identically whichever source won. Same spec, and the constants in `embeds_canonical.py`.
- Augment runs on the browser worker because every BEK call needs Chrome. Comment in `push_augment_job`.
- Notifications fail on augment errors; order confirmations degrade. `augment_config.on_failure` per type in `bek.yaml`.
- Poll-driven jobs get a retry budget of -1: the next tick is the retry. Workflow framework spec, retry budget table.
- A degraded augment must still reach the staff channel. Issue #259 and `_publish_skip_passthrough`.
- Every routed embed name is validated at init. `validate_embed_routes`.
- All snowflakes come from `discord.{env}.yaml`. Discord config spec, 2026-04-20.

## What is still open

- Who is meant to be mentioned. Both maps are empty in both environments, so the configured rules never fire.
- Whether `retry` on a route is meant to reach Faktory. The wrapper reads it; the job never carries it.
- Whether an item that never re-observes, a `.new` notification, should have any recovery beyond the dead set when its notify fails.
- Whether the dev and prod notifier should share one tenant channel per environment or split by type; the config says "until split".

## Conflicts found, by kind

1. **Intended design differing from implementation.** The workflow spec says the framework sets Faktory `retry` to -1 for poll-driven jobs; `create_job` sets no retry and pyfaktory's default is 25. The wrapper's budget and Faktory's retries disagree on every job in this part.
2. **Documentation lagging code.** The founding notifications design and the invoice-correlation design describe shapes since replaced; the pipelines README's route example still shows `.augmented`.
3. **Dead registration.** BEK thread builders are registered for `invoices`, which has no route; the `email_unresolved` primary builder has no route.
4. **Two copies of one client.** `discord_client.py` and `notifications/discord/client.py`.

## Findings for the owner

Findings are not decisions. Each is inferred from the code at the SHA read and none has been observed in production in this session.

1. **The route's `retry: -1` never reaches Faktory.** `create_job` sets no retry, so `discord.notify`, `augment`, and `canonicalize` jobs carry pyfaktory's default of 25. The wrapper, reading -1, marks the run failed and releases the dedup key on the first failure; Faktory then retries the same job up to 25 times. A later attempt that succeeds posts the embed while the run reads failed and the key is gone, so a second observation of the same event, say the emailed confirmation after the polled one, becomes a fresh winner and posts again.
2. **A transient Discord or BEK error on a one-shot event has no natural retry.** The budget rationale, "the next cron tick is the retry", holds for a `.changed` item that will be observed again. A `.new` notification is emitted once; its snapshot is already saved. If notify fails terminally the only recovery is a hand retry from Faktory's dead set, and finding 1 means the framework has already given up on it.
3. **Both mention maps are empty**, so the `submittedBy` and `buyers` rules on the notifications route never produce a ping. Config, not code.
4. **The PDF lives in Redis for five minutes.** The attachment depends on augment, canonicalize, and notify all completing inside that window; a backlog on either queue silently drops the PDF with a warning. The CSV has an hour.
5. **Thread builders are registered for `invoices`**, an event type with no route and no augment; the registration is dead.
6. **`WorkflowAlreadyFailedError` is defined and never raised.** The spec has retries of an already-failed workflow short-circuit; the code re-runs the handler body in full on every Faktory retry. This is what lets a late retry post the embed after the run was failed and compensated (finding 1).

## Belongs in another document

- Findings 1 and 2 belong to Part 7 as much as here; the retry mismatch is a framework property.
- The two Discord client copies are a code hygiene note for the orchestrator brief.
- Part 4's Context Record will own canonicalize's inside: upload, parse, assimilate, canonicalize, the 422 teaching signal, the tenant UUID resolution.

## Reconciled against the harness

Everything in Part 3 is drawn as how the system works today because the part is live and the code is the source. Nothing is designed but not wired. Mentions are drawn as configured and captioned as empty. The principles the board cites: P2 event-driven with producers decoupled from consumers (the same notifier serves three passes), P4 the orchestrator drives and core executes (the canonicalize hand-off), P3 fail loud (401, 403, 404 and data-shape errors end the run rather than retrying forever).
