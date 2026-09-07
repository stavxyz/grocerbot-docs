# grocerbot-orchestrator

The driving service. Schedules, polls the BEK portal, ingests vendor email, diffs snapshots into events, augments them with portal detail, hands documents to core, and delivers Discord embeds to staff.

| | |
| --- | --- |
| Local path | `~/src/grocerbot-orchestrator` |
| Remote | `git@github.com:parconditio/grocerbot-orchestrator` |
| Branch of record | `dev` (default branch; auto-deploys to the dev droplet; promoted to `main` by promote PRs) |
| SHA read | `1304813`, 2026-09-06, dev tip dated 2026-07-15. `main` at `c530f51` carries the same content. |
| Working tree at read | Six untracked files (`RECOVERY_BRIEFING.md`, four `ops-dev-*.yml` and `bek-channel-snap.yml` snapshots, `.playwright-mcp/`). Not part of the tree. |

## Read order

1. `docker-compose.yml`: the twelve services and what each reads and writes. This is the process inventory.
2. `config/`: `schedules.seed.yaml`, `tenants.yaml`, `vendors.yaml`, `discord.{dev,prod}.yaml`, `email_rules.yaml`, `pipelines/bek.yaml` with `pipelines/README.md` as its schema reference, `required-env.txt`. Configuration is the single source of truth for what runs and where it lands.
3. `migrations/*.sql`: the nine tables and one view, in order. Headers document partial-failure recovery and the double-booked 015 and 016 numbers.
4. `src/orchestrator/main.py` (worker registry), `browser_worker.py`, `scheduler.py`, `notifier.py`, `api.py`, `startup.py`, `jobs.py`, `enqueue.py`, `worker.py`. The backbone.
5. `src/orchestrator/tasks/`: `vendor_poll.py`, `augment.py`, `canonicalize.py`, `discord_notify.py`, `process_email.py`, `_browser_login_recovery.py`, `browser_login.py`, `ops_summary.py`, `ops_ping.py`. The business logic per job type.
6. `src/orchestrator/pipelines/` (`emit.py`, `config.py`), `parsers/`, `actions/`, `events.py`, `dedup.py`, `unique_jobs.py`. The event contract and dedup.
7. `src/orchestrator/workflows/`: runs, side effects, decorators, wrapper, classification, compensation, the two backstops.
8. `src/orchestrator/notifications/discord/` and `plugins/bek/`: embed builders and BEK rendering.
9. `email-worker/src/index.js` and `wrangler.toml`: the Cloudflare Worker.
10. `docs/email-processing.md`, `docs/observability.md`, `docs/ops/*`: operational guides. Current on the parts they cover except where noted below.
11. `README.md` and `CLAUDE.md`: read last. `CLAUDE.md` was reconstructed 2026-07-08 and is largely accurate on conventions. `README.md` describes an older shape in many places.

## What it can support

- What each process does at the SHA read, what job types exist, which queue each uses, who enqueues it, what it reads and writes and emits.
- Every event type published and consumed, the envelope shape, the dedup key shapes.
- Every table, column, and index in the orchestrator database.
- Every Discord channel, embed, CLI command, API endpoint, and OpenObserve alert.
- The engineering rules the code enforces by name.

## What it cannot support

- What is deployed. `RECOVERY_BRIEFING.md` records the first production release on 2026-07-01. Anything after that is unverified from the repo.
- Who the human actors are by role. Only the `buyers` Discord role key is named; both mention maps are empty.
- Anything about core's behaviour beyond what `clients/core.py` calls.

## Known stale material inside the repo

Found on the 2026-09-06 read. Each is a contradiction between a document and the code at the SHA above.

- `README.md` names a single `config/pipelines.yaml` with `pipelines:` and `notify:` blocks; the loader globs `config/pipelines/*.yaml` and the schema is `{vendor}: {data_type}:` with `routes:`.
- `README.md` puts `identity` inside `diff:`; the loader requires it at the event-type top level.
- `README.md` routes `bek.notifications.augmented` with embed `bek_notification`; live config routes `.canonicalized` with `bek_canonical`.
- `README.md` says seven tables and lists six; migrations create nine plus a view. It says migrations run 001 to 009; the tree runs to 019.
- `README.md` lists a `notifications.py` module that does not exist, and describes a six-process system with no canonicalize stage, no workflow framework, and no `business_event`.
- `README.md` lists Gmail polling as a live ingress. The only consumer, `tasks/poll_email.py`, is registered by no worker and enqueued by nothing.
- `config/pipelines/README.md` documents a `sources: {augment: always|never|if_missing}` policy that no code reads, and an `on_failure: retry` value that the code treats identically to `fail`.
- `config/email_rules.yaml` sets `include_attachments: true` on a rule; the action handler reads only `event_type`.
- `docs/observability.md` states OpenObserve env values the local compose does not set; the deploy compose is written inline by CI and was not checked.

## Findings in the code itself

Not documentation drift. Things the code does that look wrong or unfinished, surfaced for the owner and not yet discussed.

- `tasks/system_metrics_dedup.py` parses only the legacy `dedup:{tenant}:...` key shape. Every `dedup:v2:` key is bucketed under tenant `v2`, so the two dedup alerts in OpenObserve compute over mislabeled buckets.
- `email.unresolved.new` and `email.is_duplicate` are published and consumed by nothing. The code comment on the first says so and warns the envelope shape would be wrong if a route were added.
- `attachment.received` and `pong` are published and consumed by nothing.
- Both mention maps in `discord.{dev,prod}.yaml` are empty, so the configured `submittedBy` and `buyers` mentions never render.
- `scheduler.py` skips a `vendor.poll` schedule silently, with a warning, when no tenant subscribes to the vendor.

## Issues filed

On 2026-09-07, with Sam's authorisation, seven of the findings above and from the Part 1 and Part 2 runs were filed on the repository as issues #263 to #269. The list and the reasons some were not filed are in each part's Delivery Report under `04 - Build/`.

## Full inventory

A read-only sweep on 2026-09-06 produced a per-item inventory with `file:line` citations covering processes, job types, events, human touchpoints, external systems, the workflow framework, parsers and pipelines, and stale material. Its claims about registration, key shapes, dead code, and empty mention maps were spot-checked against the source and held. The inventory itself was a working artifact of that session and is not stored here; the citations above point at the same places.
