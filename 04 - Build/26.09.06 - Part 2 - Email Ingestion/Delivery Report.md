# Delivery Report: Part 2, Email Ingestion

Dated 2026-09-07. Written per step 7 of the Function.

## Request and resolution

"Commit this and continue" resolved to committing Part 1 and running the next part in the agreed order: Part 2, email ingestion, from a vendor email reaching a GrocerBot address to an event on the stream, a poll pushed into Part 1, an attachment filed, or a Gmail forwarding rule confirmed. Standing per the harness: live.

## Sources read

Orchestrator at `dev` `1304813`, unchanged since the Part 1 run and re-checked at the start of this one. The Context Record lists every file opened and why. No failure to open a file is recorded there.

## Produced

- Part 2 board on VISUAL DOCUMENTATION, node `9058:72874`: seven actors, one interface, one artifact, seventeen operations, three principle pills, nine Piping cards, eight Data cards, nineteen tie segments.
- Legend changes: a text-only GMAIL mark; the Card Skeletons headers re-pointed; the Plain Text field value made to wrap.
- In this folder: Context Record, Handoff Brief with its nature pass, Build Log, this report, and the behind-the-scenes audit.

## Deviations from the brief and the visual rules

- Tags are centred on their cards' ties, where Part 1 dropped ties beside the tag. Both boards are consistent with the rules; they differ from each other.
- The Gmail forwarding rule is drawn as a Code block interface, a convention meant for terminals. Recorded as open.
- Table cells were set by direct override after the property route failed for headers and type cells.
- The Plain Text value change is a legend component change and reaches Part 1's cards.

## Corrections for the owner

- `docs/email-processing.md` in the orchestrator describes an `email.unresolved` route in a `config/pipelines.yaml` that does not exist, names the tenant domain `frenchgrocer.com` where the config says `frenchcogrocer.com`, and is otherwise current. `docs/ops/secrets.md` calls the webhook secret an HMAC key; the code compares a Bearer token.
- `config/tenants.yaml` names parsers per email type that no code reads, including `bek_invoice`, which does not exist.
- The Part 2 handoff brief and this board say "the five email types" and "the five rules"; both counts are from the config at the SHA read.

## Unresolved naming and boundaries

- `dedup` names both the 30-day email key on Message-ID and the 24-hour canonical key on the business event. Added to the lexicon queue as item 7. The board says email dedup keys and dedup keys.
- `door`, working term from Part 1, is used again here for the forwarding set-up.
- The Gmail forwarding rule's level: an Interface, or configuration outside the system. Drawn as an Interface.

## Source conflicts

As recorded in the Context Record: documentation lagging code on the unresolved route, the tenant domain, and the secret's nature; designed features not built (the `email_attachment` fetch rule, the `.failed` tag on webhook failure, Cloudflare retry); a documented rule option no code reads; a configured rule for a vendor that does not exist; one word for two dedup keys.

## Findings for the owner

Nine, listed in the audit and the Context Record. The two that most change how the system should be read: email-sourced events open no workflow run, and a failure after the dedup key is set turns the retry into a duplicate.

## Verification

Two full-board screenshots at native scale, cropped and inspected: the rail in four crops, every Piping card, every Data card, the tie band, and the changed regions after each fix. A geometry scan of the 479 text nodes found no overflow; it did not catch the clipped Plain Text values, which the screenshots did. Part 1 was re-screenshotted after the component change. Nothing on the board was checked against production; everything is read from the code at the SHA above.

## Next

Sam's three approvals on each board. Then Part 3, notification delivery, which both boards lead into, or the SYSTEM REGISTRY page.

## Issues filed, 2026-09-07

Sam authorised filing on `parconditio/grocerbot-orchestrator` for findings verified against the code. Filed, each with file and line at `dev` `1304813`:

- #263 vendor_poll: cart, orders, invoices, and delivery events open child runs that only the timeout reaper closes (Part 1 finding 1)
- #264 emit_domain_event: email-sourced canonical events open no workflow run and register no dedup_ratchet (Part 2 finding 1)
- #265 process_email: dedup SET NX runs before processing, so a failure afterwards turns every Faktory retry into a duplicate (Part 2 finding 7)
- #266 system_metrics_dedup: parse_dedup_key mis-buckets dedup:v2 keys under tenant v2 (orchestrator brief)
- #267 email-worker: a webhook non-2xx rejects the message without the .failed marker, and nothing reads .failed (Part 2 finding 2)
- #268 docs and config describe shapes the code no longer has: README, email-processing.md, secrets.md, tenants.yaml parsers, email_rules.yaml (Part 2 conflicts 1, 3, 4 and finding 8)
- #269 vendor_poll: the notifications poll reads page 0 of 50 only (Part 1 finding 2)

Not filed: the undeduped CLI and email doors, already #60; the email dedup key scoped by the Worker's hint, certain in mechanics but only material with a second tenant; the unread attachments and the unbuilt `email_attachment` fetch rule, a design gap rather than a defect; the dead login schedule, harmless; the three unconsumed events, which the handler's own comment already records and #268 covers on the documentation side.
