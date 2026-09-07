# Context Record: Part 2, Email Ingestion

Working artifact for the second documentation run, assembled 2026-09-06 per `Logic - Protocol.md`. Sam's instruction after Part 1 was committed: "commit this and continue." Continue resolves to the next part in the agreed order, **Part 2, Email ingestion**: vendor email reaches a GrocerBot address, the Cloudflare Worker stores and forwards it, the orchestrator dedups, resolves, classifies, runs rules, records the arrival, and, for an order confirmation, puts a canonical event on the stream. The part ends where Part 1 ends, with an event on the Redis stream, or with a poll job pushed back into Part 1, or with an attachment stored, or with a Gmail forwarding rule confirmed.

Standing per the harness: **live**. The chain is on the orchestrator's `dev` and `main`; the recovery briefing records the first production release on 2026-07-01 and the last email-path commit is dated 2026-07-01. Not verified against the droplets or the Cloudflare dashboard in this session.

## Files opened

All in `~/src/grocerbot-orchestrator` at `dev` `1304813`, the SHA recorded in the source brief and re-checked at the start of this run. Each line says why the file matters to Part 2.

**The edge**

- `email-worker/src/index.js`: the Cloudflare Worker. Generates the email id and the R2 key `emails/{date}/{uuid}.eml`, stores the raw message with `from` and `to` as custom metadata, rejects the message if storage fails, parses the recipient into tenant and type hints, reads the first original recipient from `X-Original-To`, `Delivered-To`, or `X-Forwarded-To`, posts the webhook with a Bearer secret, rejects the message on a non-2xx response, and on any other error writes a `.failed` sibling object so a backfill can find the email.
- `email-worker/wrangler.toml`: two named workers, `grocerbot-email-worker-prod` on `grocerbot.net` with bucket `grocerbot-orchestrator-emails-prod`, and `-dev` on `grocerbot-dev.net`. The webhook URL is `https://orch.grocerbot.net/webhooks/email`. The secret is set per env with `wrangler secret put`.
- `email-worker/package.json`: postal-mime is the only dependency.

**The webhook and the job**

- `src/orchestrator/api.py`: `POST /webhooks/email`. Compares the Authorization header to `WEBHOOK_SECRET` when set, then pushes a `process_email` job to queue `default` with args `[r2_key, parsed]`, label `email/{r2_key}`, source `api`, through `enqueue_job`, which writes the `job_enqueues` row. No `unique_for`. The same app serves the health probes and the monitoring endpoints, which are Part 7.
- `src/orchestrator/main.py`: `ProcessEmailHandler`, registered on the worker that consumes `core` and `default`. Downloads the raw email, parses it, hashes it, loads `tenants.yaml`, computes the dedup key from the worker's tenant hint, checks Redis, records duplicates and stops, otherwise loads `email_rules.yaml`, resolves `${discord.*}` refs, runs the processing function, records the arrival, and publishes `email.unresolved.new` when no tenant resolved. Wrapped in `record_execution`, not `workflow_handler`: no workflow run is opened for an email.
- `src/orchestrator/worker.py`: the consumer loop; unknown job types are drained rather than crashing the worker.
- `src/orchestrator/tasks/process_email.py`: resolution, rule evaluation, attachment upload for destination rules, and action dispatch for action rules. Attachment references are built for every attachment before dispatch, prefixed with the email's R2 folder, whether or not anything uploads them.
- `src/orchestrator/email_parser.py`: stdlib parsing into sender, subject, attachments with content, original recipients from four headers, Message-ID, Date, plain body, HTML body, the forwarded sender from a Gmail-style forwarded block, and the To, Cc, and Bcc lists.
- `src/orchestrator/email_dedup.py`: the key `email:dedup:{tenant or _unknown}:{message_id or sha256(sender, subject, date, body)}`, `SET NX` with a 30-day TTL, the content hash for audit, and the `email_arrivals` insert.
- `src/orchestrator/tenant.py`: tenant from the subdomain hint, then original recipient domains, then the sender domain; vendor from the sender domain, then the forwarded sender; email type from the local-part hint, then classification regexes in config order, then the fallback type when the vendor is known; the tier `explicit`, `tenant_only`, or `inferred`. `PUBLIC_DOMAIN` must be set or the process fails.
- `src/orchestrator/email_rules.py`: glob rules, all conditions within a rule AND-ed, every matching rule returned, exact-match context fields `email_type`, `tenant`, `vendor`.
- `src/orchestrator/actions/__init__.py`: the handler protocol, the context, and the dispatch loop that isolates one failing handler from the rest.
- `src/orchestrator/actions/trigger_vendor_poll.py`: pushes `vendor.poll [vendor, data_type, tenant]` to `graftpunk-http` with label `{vendor}/{data_type}` and source `email_rule`. No `unique_for`. Requires a resolved tenant.
- `src/orchestrator/actions/emit_domain_event.py`: resolves the `{vendor}.{email_type}.new` template, loads the pipeline config, requires an `email_push` parser for the event type, runs it on the parsed email with attachment content stripped, splits out `business_event` and `entity_id`, requires a tenant, and calls the shared `emit_canonical_event` with source `email_push` and the message date as `occurred_at`. It passes no parent run id.
- `src/orchestrator/actions/auto_confirm_forwarding.py`: finds the `mail.google.com` or `mail-settings.google.com` `vf-` link in the plain or HTML body, GETs it for the cookie, POSTs the final URL, looks for "Confirmation Success", extracts source and destination, and posts a green or red embed to the channel in the action, resolved from `discord.{env}.yaml`.
- `src/orchestrator/parsers/email/__init__.py` and `bek_order_confirmation.py`: the one email parser. The PO number is the 7 to 12 digit block after `#` or `;` in the subject; `business_event` is `order_confirmed`; `entity_id` is the PO. No PO means a `ValueError` and a failed action.
- `src/orchestrator/pipelines/emit.py`: the shared emitter read again for the email path: v2 dedup key when the business pair is present, `register_event` with a 24-hour TTL, a child workflow run only when a parent run id is given, publish, rollback on failure.
- `src/orchestrator/events.py`: the two dedup key shapes and `register_event`.
- `src/orchestrator/storage.py`: the R2 client; bucket from `R2_EMAIL_BUCKET`, default `grocerbot-orchestrator-emails`, which is the legacy prod bucket name per `wrangler.toml`.
- `src/orchestrator/config.py`: `load_tenants` with `${PUBLIC_DOMAIN}` expansion, `resolve_discord_refs`, `TenantsConfig`.
- `src/orchestrator/types.py`: `ParsedEmail`, `EmailMeta`, `AttachmentRef`, the tenants config types, and a docstring describing an `email_attachment` fetch rule.
- `src/orchestrator/gmail.py` and `tasks/poll_email.py`: the Gmail polling path. Registered by no worker, enqueued by nothing. Read to confirm it is dead, as the harness says.
- `src/orchestrator/notifier.py` lines 89 to 93: a terminal notify skips the run bookkeeping when the envelope carries no `workflow_run_id`.

**Configuration**

- `config/tenants.yaml`: tenant `freco` with domain `frenchcogrocer.com`, vendor `bek` with three sender domains, five email types with their regexes and parsers, the `uncategorized` fallback, and the inferred intake block with `connect@${PUBLIC_DOMAIN}`.
- `config/email_rules.yaml`: five rules. `bek-invoices` and `sysco-confirmations` store PDFs at a destination; `bek-invoice-notification` triggers a poll; `order-confirmation-event` emits a domain event; `gmail-forwarding-confirmation` auto-confirms and pings ops.
- `config/pipelines/bek.yaml` lines 60 to 130 and `config/pipelines/README.md`: the `orderconfirmations` event type with `parsers.email_push: bek_order_confirmation`, `sources.email_push: {augment: always}`, and the augment and route that Part 3 runs.
- `config/discord.prod.yaml`: `ops.email_forwarding_confirmations` and the tenant channels.
- `config/vendors.yaml`: display metadata.
- `config/required-env.txt`: `WEBHOOK_SECRET`, the three R2 values, and `DISCORD_BOT_TOKEN` are Part 2's credentials.
- `docker-compose.yml`: the `api` service on port 8000 bound to localhost, reached through the Cloudflare Tunnel; the `worker` service with `R2_EMAIL_BUCKET` and the public domain.
- `justfile`: `email-worker-deploy` runs `wrangler deploy`; `PUBLIC_DOMAIN` is injected at deploy.

**Migrations**

- `migrations/007_create_email_arrivals.sql`, `008_rename_retailer_to_vendor.sql`, `019_drop_orphaned_ingest_schema.sql`: the table as it stands, fifteen columns and four indexes, with the reverted auto-ingest columns dropped.

**Design records**

- `docs/plans/2025-02-05-milestone-2-email-monitoring.md`: the founding plan. Push and pull paths converging on `process_email`; attachments routed to R2; `attachment.received` published. The pull path is history.
- `docs/superpowers/specs/2026-03-19-email-as-events-design.md`: email as an event source; the address schema `{type}@{tenant}.grocerbot.net`; three resolution tiers; the Worker kept thin; provenance tracked, provenance-agnostic dedup; Gmail polling optional.
- `docs/superpowers/specs/2026-03-19-email-dedup-actions-parsers-design.md`: the dedup gate, `email_arrivals`, the uncertainty path through the notifier, the action registry, `emit_domain_event`, and an `email_attachment` augment fetch rule. Gmail polling dropped from scope.
- `docs/superpowers/specs/2026-04-15-auto-confirm-forwarding-design.md`: the Gmail confirmation flow from a HAR capture.
- `docs/email-processing.md`: the operational guide. Current on the pipeline shape; stale on the unresolved route, the tenant domain, and the pipelines file location.
- `docs/ops/secrets.md`: where the Worker secrets live. Calls the webhook secret an HMAC key.
- `RECOVERY_BRIEFING.md` (untracked): the production release record.
- `tests/fixtures/bek_order_confirmation_email.json`: a real subject shape, `Ben E. Keith : Order Confirmation for FAM889004-French Co Grocer;0001575090`, from `orders@bekentree.com`.

## What is current

The chain as it runs at the SHA read, in order.

1. **Forwarding is set up once.** A tenant forwards vendor mail from the store's Gmail to `{type}@freco.grocerbot.net`. Gmail sends a confirmation email to that address; the chain below confirms it automatically and tells ops. The design also allows a vendor to email the intake address directly.
2. **An email arrives** at a `grocerbot.net` subdomain address through Cloudflare Email Routing and invokes the Worker.
3. **The Worker stores first.** Raw bytes go to R2 at `emails/{date}/{uuid}.eml` with `from` and `to` as metadata. If R2 fails the message is rejected and nothing else happens. Then it parses the recipient into a tenant hint (the subdomain) and a type hint (the local part), reads one original recipient header, and POSTs `{email_id, r2_key, subject, parsed{tenant, type, original_to, from}}` to the orchestrator with `Authorization: Bearer {WEBHOOK_SECRET}`. A non-2xx response rejects the message. Any other error writes `{r2_key}.failed`.
4. **The API enqueues.** `POST /webhooks/email` checks the secret, pushes `process_email [r2_key, parsed]` to Faktory queue `default` with source `api`, and writes the `job_enqueues` row. It returns `accepted` with the email id.
5. **The worker dedups.** It downloads the `.eml`, parses it, hashes it, loads `tenants.yaml`, and builds `email:dedup:{tenant_hint or _unknown}:{Message-ID or fallback hash}`. `SET NX` for 30 days. A repeat records an `email_arrivals` row with `is_duplicate`, publishes `email.is_duplicate`, and returns. A Redis failure raises out of the handler.
6. **Resolution.** Tenant from the hint if it is a configured tenant, else the original recipients' domains against `tenants[].domains`, else the sender's domain against the same list. Vendor from the sender domain, then the forwarded sender parsed from the body. Type from the hint if it is a configured type, else the first type whose regex rules match subject, sender, attachment names or types, or body, walking the config in order, else `uncategorized` when the vendor is known. Tier from what resolved.
7. **Rules.** Every enabled rule whose glob conditions all match runs. A rule with `actions` dispatches each action through the registry; a failing handler is recorded and the rest still run. A rule with a `destination` uploads every attachment matching its pattern to R2 at `{destination}{filename}` and publishes `attachment.received`.
8. **The three actions.** `trigger_vendor_poll` pushes `vendor.poll [bek, invoices, freco]` to `graftpunk-http` with source `email_rule`, which is Part 1's third door. `emit_domain_event` turns `{vendor}.{email_type}.new` into `bek.orderconfirmations.new`, runs `bek_order_confirmation` on the subject, and calls the shared emitter with source `email_push`, the message date, `business_event` `order_confirmed`, and the PO as `entity_id`; the emitter registers `dedup:v2:freco:bek:order_confirmed:{po}` for 24 hours, publishes the envelope, and rolls back on failure. `auto_confirm_forwarding` GETs then POSTs Google's confirmation link and posts a green "Forwarding Confirmed" embed with source and destination, or a red one with the link for manual confirmation, to the `email_forwarding_confirmations` ops channel.
9. **The arrival is recorded.** One `email_arrivals` row: message id, content hash, dedup key, tenant, R2 key, source `email_push`, duplicate flag, resolution status `resolved` or `unresolved`, sender, subject, recipients, original recipients, vendor, email type. A database failure is logged and does not fail the job.
10. **No tenant** publishes `email.unresolved.new` with a synthetic vendor `email`. No pipeline file routes it, so nothing consumes it. The handler's own comment says so.
11. **Close.** `record_execution` writes `job_executions` with class `email`. No workflow run was opened, so nothing in Part 7's run tracking sees an email-sourced event; the notifier skips the run bookkeeping when the envelope has no run id.

## What is historical

- The Gmail pull path (`gmail.py`, `poll_email.py`) from the founding plan. Deferred indefinitely by the 2026-03-19 dedup spec; still in the tree; registered by no worker.
- The single Worker on `orchestrator-email-worker` writing `emails/{uuid}/raw.eml` with a `metadata.json` sidecar. Replaced by date-partitioned keys and inline metadata per the email-as-events spec, then split into per-env workers.
- `ezmode` and `retailer`. Renamed to `inferred_intake`, `inferred`, and `vendor`; migration 008 renamed the column.
- The auto-ingest path (`ingest_to_core` action, `invoice_polls`, seven columns on `email_arrivals`, `tenant_id`). Merged 2026-06-01, reverted 2026-06-13, schema dropped by migration 019 on 2026-07-15. Order confirmations now reach core through Part 3's augment and canonicalize chain, not from the email job.
- `tenants.{dev,prod}.yaml` as two files. Now one file with env-keyed `core_tenant_id`.
- The design's `resolution_tier` in the webhook payload. The Worker sends hints only; the orchestrator computes the tier.

## What was decided, and where

- Store first, then notify; the R2 object is the durable record and the webhook is best-effort. Email-as-events spec, 2026-03-19, and the Worker's two-phase structure.
- Dedup on Message-ID per tenant with a 30-day window; a duplicate is recorded, never silently dropped. Dedup spec, 2026-03-19.
- Provenance is metadata, not identity: an email-sourced order confirmation and a polled one share `dedup:v2:{tenant}:{vendor}:order_confirmed:{po}`. Email-as-events spec and the 2026-06-21 provenance-agnostic dedup spec; the parser threads the pair since 2026-07-01.
- Actions are a protocol with a registry; one failing action does not block the others. Dedup spec, 2026-03-19.
- Gmail forwarding confirmations are clicked by the system and reported to ops. Auto-confirm spec, 2026-04-15.
- All Discord snowflakes come from `discord.{env}.yaml` through `${discord.*}` refs, resolved before rules are matched. Discord config spec, 2026-04-20.
- `PUBLIC_DOMAIN` is injected per env and required; a missing value fails the process.

## What is still open

- Whether the intake address should support `{tenant}-{type}@grocerbot.net` to avoid subdomain routing. A TODO in the Worker names the plan upgrade it would avoid.
- `notify_sender` on unresolvable emails. Configured as a comment; raises if enabled.
- What reads the attachments the destination rules store. The `email_attachment` fetch rule from the dedup spec exists only as a docstring.
- Whether the dedup key should use the resolved tenant rather than the Worker's hint. Today a forwarded email without a subdomain hint is keyed under `_unknown`.

## Conflicts found, by kind

1. **Documentation lagging code.** `docs/email-processing.md` says `email.unresolved.new` routes to a Discord channel through an `email.unresolved` entry in `config/pipelines.yaml`; no such file or entry exists and the handler's comment says nothing consumes the event. The same guide gives the tenant domain as `frenchgrocer.com`; the config says `frenchcogrocer.com`. `docs/ops/secrets.md` calls `WEBHOOK_SECRET` an HMAC signing key; the code compares a Bearer token.
2. **Intended design differing from implementation.** The dedup spec's `email_attachment` augment fetch rule and its `email_arrivals` fallback query were not built. The email-as-events spec's Cloudflare retry on non-2xx is not what the Worker does; it rejects the message. Whether Cloudflare retries a rejected message was not checked: unverified.
3. **A documented option no code reads.** `include_attachments: true` on the order confirmation rule. The handler reads only `event_type`.
4. **A configured rule for a vendor that does not exist.** `sysco-confirmations` names `sysco`, which is in no vendor list. It can only ever store PDFs under a Sysco path.
5. **One name for two things.** `dedup` is both the 30-day email key on Message-ID and the 24-hour canonical key on the business event. The board names them email dedup keys and dedup keys.

## Findings for the owner

Findings are not decisions. Each is inferred from the code at the SHA read and none has been observed in production in this session.

1. **Email-sourced events open no workflow run.** `emit_domain_event` passes no parent run id, so the emitter opens no child run and registers no `dedup_ratchet` side effect. Part 7's timeout reaper, DLQ compensation, and terminal success marking do not cover an order confirmation that arrived by email. The `seen` counter still suppresses duplicates.
2. **A webhook failure leaves an untagged email in R2 and bounces the sender.** On a non-2xx the Worker rejects the message and returns without writing the `.failed` sibling; only the exception path writes it. A backfill that looks for `.failed` objects would miss these.
3. **Three published events have no consumer.** `email.unresolved.new`, `email.is_duplicate`, and `attachment.received`. The unresolved case is the one the guide says alerts ops.
4. **The dedup key is scoped by the Worker's hint, not the resolved tenant.** Two tenants forwarding the same vendor email to a hint-less address would collide under `_unknown`. One tenant today.
5. **Stored attachments have no reader.** The `bek-invoices` rule uploads invoice PDFs to `attachments/bek/invoices/`; nothing in the tree reads that prefix.
6. **The email door into Part 1 carries no unique lock**, so an invoice-notification email during a scheduled poll runs two polls of the same data type. Also finding 3 of Part 1.

## Belongs in another document

- Findings 1 and 3 belong to Part 7 as well.
- The two meanings of `dedup` belong in the lexicon's naming queue.
- The `{tenant}-{type}@` address idea is a design question for the owner, not a documentation matter.

## Reconciled against the harness

Everything in Part 2 is drawn as how the system works today because the part is live and the code is the source. Nothing is designed but not wired. The Gmail pull path is dead code and is not drawn. The unconsumed events are drawn where they are published, muted, with a caption saying nothing consumes them, because they are real behaviour and a finding, not a design gap. The principles the board cites: P1 deterministic (glob and regex rules, no inference), P3 fail loud (the Worker rejects mail it cannot store; a broken tenants file fails the job), P5 the SaaS invariant (tenant from the address and config, never from env).
