# Context Record: Part 4, Document Canonicalization

Working artifact for the fourth documentation run, assembled 2026-09-07 per `Logic - Protocol.md`. Sam's instruction: "next", after the Part 3 report named Part 4 as the next part. **Part 4, Document canonicalization**: the CSV that augment cached becomes a canonical document in grocerbot-core, and the snapshot comes back onto the stream as `.canonicalized`. The part begins when the worker picks up the `canonicalize` job that Part 3's notifier pushed, and ends when the task publishes `.canonicalized`, or passes the event through degraded, or stops on a teaching 422 with an ops ping. The human side of the teaching loop, an operator fixing a vendor's mappings, is drawn here because the stop exists to reach them.

Standing per the harness: **live**. Per the recovery briefing read for Part 3, the augment, canonicalize, notify chain has run in production since 2026-07-01, and the orchestrator's canonicalize task last changed on 2026-07-15 (the degraded pass-through). Core is read at `dd74fe9` on `fix/zero-cost-unplannable`, whose `dev` merge `4b5afac` has no file changes; whether that tip is what runs is unverified (Core Brief). Nothing in this run was checked against a running environment.

## Files opened

Orchestrator at `dev` `1304813`, core at `dd74fe9`, both re-checked at the start of this run. Each line says why the file matters to Part 4.

**The orchestrator side**

- `src/orchestrator/tasks/canonicalize.py`: the whole task. Reads `csv_key` and `csv_kind` from the `augmented` slot; publishes a degraded pass-through with `canonical: {}` and a `canonicalize_skipped` reason (`no_csv_key`, `redis_url_unset`, `csv_expired`); resolves `document_type` from `csv_kind` (`invoice`, or `order` to `order_confirmation`) or, for envelopes that predate the stamp, from a business-event table where every notification type maps to `invoice` and `order_confirmed` to `order_confirmation`; resolves the core tenant UUID from `tenants.yaml` by `APP_ENV`; requires `CORE_BASE_URL`; uploads, and on a fresh 201 drives parse, assimilate, and canonicalize; on a 409 skips straight to the GET; on an assimilate 422 enqueues the ops ping and raises `NonRetryableError` without publishing; GETs the document and publishes `.canonicalized` with `canonical_snapshot or {}` in the `canonical` slot.
- `src/orchestrator/handlers/canonicalize.py`: the Faktory wrapper, `workflow_handler(cls="core", job_type="canonicalize")`, not terminal, on the lightweight worker's `core` queue.
- `src/orchestrator/clients/core.py`: the hand-written client over httpx. `upload` routes by `document_type` to `/v1/tenants/{tenant}/invoices/upload` or `/order-confirmations/upload`, multipart `file` plus `vendor_id`; 201 gives `invoice_id`, 409 gives `existing_invoice_id` or `existing_document_id` as `deduped`; a 422 on upload raises `ValueError`. `parse`, `assimilate`, `canonicalize`, and `get` call the bare `/v1/invoices/{id}` routes; `assimilate` turns a 422 into `AssimilateOutcome(teaching=True, unmapped_columns)`; the other three raise `ValueError` on 422 and propagate 5xx.
- `src/orchestrator/ops_ping.py` and `unique_jobs.py`: `enqueue_ops_ping` with `unique_for` and `unique_until="expiry"`, keyed on the job type and the full message text; an enqueue failure is logged and swallowed.
- `src/orchestrator/config.py` (`load_tenants`, `resolve_core_tenant_id`) and `config/tenants.yaml`: `core_tenant_id` per environment under the tenant; a missing value is a `NonRetryableError`.
- `config/required-env.txt`: fifteen names; `CORE_BASE_URL` is not among them.
- `docker-compose.yml` lines 17 to 19 and `justfile` line 215: `CORE_BASE_URL=https://api.${PUBLIC_DOMAIN}` as a compose anchor, and a dev-only patch of `/srv/app/.env` because the CI-written compose predates the anchor.
- `docs/superpowers/specs/2026-06-18-invoice-canonicalization-design.md` and `docs/research/2026-06-18-core-api-spike-findings.md`: the design and the spike that found the customer-number cross-check and the state name `underivative`.

**The core side, the request path**

- `src/core/main.py`: the app factory; required env `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_INVOICES_BUCKET`, `POS_CREDENTIALS_KEY`; every `StageError` renders as one 422 `StageErrorResponse`; `CustomerNumberMismatchError` has its own handler.
- `src/core/api/invoices.py`: `_do_upload` behind both upload routes; `_parse_impl`, `_assimilate_impl`, `_canonicalize_impl`; the bare router at `/v1/invoices` and the tenant-scoped router at `/v1/tenants/{tenant_id}/invoices`; `_check_state` and its 409; `MAX_UPLOAD_BYTES` of 25 MB.
- `src/core/api/_scoping.py`: `TrustedCaller` as the only principal shipped; `get_scoped_tenant` takes the tenant from the URL; `get_scoped_invoice` is the spec's named `TenantFromRow` strategy, the tenant from the row and not the URL; 404 and never 403.
- `src/core/api/errors.py` and `schemas.py`: `StageError`, `StageErrorResponse` with `unmapped_columns` and `sample_values`, `InvoiceResponse`.
- `src/core/api/vendors.py`: `GET /v1/vendors`, `PUT /v1/vendors/{id}/mappings`, `PUT /v1/vendors/{id}/metadata-mappings`; each PUT replaces the whole dict; no scoping and no principal.
- `src/core/api/tenants.py` and `tenant_vendor_settings.py`: tenant create and list; the per-pair `customer_number`, lazily created on PUT, 404 on a missing GET.
- `src/core/storage.py`: `S3Storage` on R2, `put_bytes`, `get_bytes`, `StorageNotFound`.
- `src/core/seed.py`: four vendors, `alberts`, `bek`, `glazers`, `unfi`; only `bek` carries `metadata_mappings`; `alberts` maps no `quantity_ordered` and its comment says assimilate will 422; `_UPDATABLE_FIELDS` re-applies `column_mappings` and `metadata_mappings` on every run.
- `.github/workflows/ci-cd.yml` lines 324 to 328 and 453 to 457: every deploy runs `alembic upgrade head` and then `python -m core.seed`.
- `src/core/cli/main.py`: `gbc` mounts only `pos`; there is no command for mappings.

**The core side, the stages**

- `src/core/domain/models.py`: `DocumentState` (`created`, `parsed`, `underivative`, `assimilated`, `canonicalized`, `failed`); `DocumentType`; `ParsedDocument` with `header_rows`; `AssimilatedDocument`; `PackSize`; `DocumentMetadata`; `CanonicalLineItem` in cents with `quantity_uom`, the flat adjustment fields, and the typed `adjustments` list; `SellableSKU` with `SkuRelationship`; `Document` with `related_documents`, `Transactional` with `total_is_final`, `Financial`; `CanonicalDocument`.
- `src/core/domain/format_detection.py`: magic bytes, then extension, then content type; `csv`, `xlsx`, `pdf`.
- `src/core/domain/stages/parse.py` and `parse_pdf.py`: the header-row heuristic, the footer markers, `utf-8` then `latin-1` then `cp1252`; pdfplumber for PDF, which yields no header rows.
- `src/core/domain/stages/assimilate.py`: `REQUIRED_FIELDS` (`vendor_item_code`, `short_description`, `quantity_ordered`, `quantity_shipped`) plus one of `case_price`, `each_price`, `unit_cost`, `extended_price`; `AssimilationError` with `unmapped_columns` and `sample_values`.
- `src/core/domain/stages/canonicalize.py`: dollars to cents, GTIN-14, the pack size through `parse_eaches`, `quantity_uom` (weight, case, each), the line items, the SKU explosion, the metadata extraction with the configured customer number, and the three facets.
- `src/core/canonicalize/policy.py`: `INVOICE_POLICY` (identity `invoice_number`; required `invoice_number`, `customer_name`, `customer_number`, `invoice_date`, `total`; carries Financial) and `ORDER_CONFIRMATION_POLICY` (identity `sales_order`; required `sales_order`, `customer_name`, `customer_number`; no Financial; total not final).
- `src/core/canonicalize/identity.py`, `metadata.py`, `upc.py`, `sku_explosion.py`, and `src/core/lib/parse_eaches.py`: identity from the header rows by `metadata_mappings`; `MetadataExtractionError` and `CustomerNumberMismatchError`; `normalize_to_gtin14`; the slash-count explosion into case, pack, and single with `units_per_parent`; the eaches regex and its bulk assumptions.
- `src/core/adapters/`: `GenericAdapter` only.
- `src/core/db/models.py` and migrations `87d7b5008ecc`, `7d85ce532005`, `bc89d9b4341e`, `d1e2f3a4b5c6`: `vendors`, `tenants`, `tenant_vendor_settings`, `documents`, `audit_log`.
- `openapi.yaml`: the path list; `packages/client` for the contract only.

**Design records**

- `docs/plans/2026-03-19-grocerbot-core-design.md`: one stage per endpoint so the orchestrator can react between stages; the teaching flow as notify a human, collect the mapping, PUT it back, retry assimilate.
- `docs/superpowers/specs/2026-05-28-r2-invoice-storage-design.md`: the bytes out of Postgres and into R2.
- `docs/superpowers/specs/2026-06-09-multi-tenant-scoping-design.md`: the two strategies, `TenantFromURL` and `TenantFromRow`.
- `docs/superpowers/specs/2026-06-20-order-confirmation-canonicalization-finish-design.md`: `Sales Order` as the identity, `quantity_shipped` null before shipment.
- `docs/superpowers/specs/2026-06-25-document-type-system-design.md`: the nested snapshot, `total_is_final`, the typed `Adjustment`, `related_documents`, and which facets were deferred.

## What is current

The chain as it runs at the SHAs read, for a BEK notification whose augment cached an invoice CSV.

1. **The worker picks up `canonicalize`** from queue `core` with the run id first. The wrapper counts the attempt and reads the route's budget of -1.
2. **The task reads the CSV.** `csv_key` and `csv_kind` come from the `augmented` slot, the bytes from Redis. No key, no `REDIS_URL`, or an expired key publishes `.canonicalized` at once with `canonical: {}` and a `canonicalize_skipped` reason in the `degraded` slot, so the embed still renders.
3. **It resolves the document type and the tenant.** `csv_kind` decides: `invoice`, or `order` to `order_confirmation`; the business-event table is the fallback for old envelopes. The core tenant UUID comes from `tenants.yaml` for the running `APP_ENV`. Either unresolved is a `NonRetryableError`, and so is an empty `CORE_BASE_URL`.
4. **It uploads.** Multipart to `/v1/tenants/{uuid}/invoices/upload` or `/order-confirmations/upload` with `vendor_id`. Core checks the vendor (404), caps the body at 25 MB, detects the format, parses inline, extracts the identity from the header rows through the vendor's `metadata_mappings` (a configured mapping that yields nothing is a 422 `{field}_extraction_failed`; no mapping at all is a NULL identity and no dedup), looks for `(tenant, vendor, document_type, identity)` and answers 409 with the existing id, else inserts the `documents` row in state `underivative`, writes the bytes to R2 at `{tenant}/{vendor}/{doc_id}/{file}`, and commits; a concurrent insert of the same identity is caught as an `IntegrityError` and answered 409 too.
5. **On 201 it drives the stages** by POST on `/v1/invoices/{id}/parse`, `/assimilate`, and `/canonicalize`. Parse returns at once for a row uploaded with a parsed snapshot. Assimilate maps the columns through `vendors.column_mappings`, requires the four fields and one cost field, and stores the assimilated snapshot; anything unmapped is a 422 with the unmapped columns and sample values, and the row goes to `failed` at `assimilate`. Canonicalize turns money into cents and UPCs into GTIN-14, parses the pack description with `parse_eaches`, sets `quantity_uom`, explodes each line into case, pack, and single by slash count, extracts the metadata the policy requires, cross-checks the extracted customer number against `tenant_vendor_settings.customer_number` when both exist, projects the Document, Transactional, and (for invoices) Financial facets, and stores the canonical snapshot in state `canonicalized`.
6. **On a teaching 422** the task enqueues `ops.ping` to `#ops` with the vendor, the document id, and the unmapped columns, unique for 600 seconds on the message text, then raises `NonRetryableError`. Nothing is published. The message tells the operator to add column mappings to grocerbot-core and re-enqueue.
7. **On 409 it skips the stages** and goes to the GET.
8. **It reads the document** at `/v1/invoices/{id}` and publishes `{vendor}.{data_type}.canonicalized`: the envelope copied through, `source` canonicalize, the snapshot in `canonical`. Part 3's route picks it up.
9. **The operator fixes a mapping** by `PUT /v1/vendors/{id}/mappings` with the whole mapping dict, or by editing `seed.py`, which every deploy re-applies. `gbc` has no command for it.
10. **Failure.** A 422 from parse, canonicalize, or the GET is a `ValueError`; with budget -1 the wrapper marks the run failed, enqueues the dedup release, and re-raises, and Faktory retries the job on its default of 25 (issue #270).

## What is historical

- The `invoices` table and `InvoiceRecord`, `raw_bytes` in Postgres, `InvoiceMetadata`, `CanonicalInvoice`; renamed and moved by the R2 storage spec (2026-05-28) and the document-type spec (2026-06-25).
- The flat `{metadata, line_items, sellable_skus}` snapshot; nested facets since core#19. The orchestrator's 2026-06-18 design and the OC finish spec still describe the flat shape; the client's `get` docstring describes the nested one.
- `invoice_total`; now `Transactional.total` with `total_is_final`.
- `Promotion` and `AllowanceType`; the typed `Adjustment` exists, and the flat cents fields (`discount_amount`, `deposit_amount`, `extended_deposit`, `total_adjustments`) remain on the line item beside the empty `adjustments` list.
- The silent skip on a missing CSV; the pass-through since 2026-07-15.

## What was decided, and where

- One stage per endpoint so the orchestrator can react between stages. Core design, 2026-03-19.
- Stages are pure functions on dataclasses; the API layer injects what they need (mappings, the configured customer number, the policy). Comment in `_canonicalize_impl`.
- The tenant is in the URL for upload and in the row for the stages. Multi-tenant scoping spec, 2026-06-09.
- 404, never 403, across tenants. Same spec.
- Identity is per document type: `invoice_number` or `sales_order`. OC finish spec, 2026-06-20.
- An order confirmation has no Financial facet and its total is not final. Document-type spec, 2026-06-25.
- Money is integer cents, UPCs are GTIN-14, pack sizes are structured. Core `CLAUDE.md` and the models.
- A degraded augment still reaches the channel. Issue #259.
- The 422 at assimilate is a teaching signal, not a failure to retry. `clients/core.py` and the task.

## What is still open

- Whether mappings are meant to be taught through the API or through `seed.py`. The design says PUT; the seed overwrites on every deploy.
- Who the operator is who receives the teaching ping, and how they re-enqueue. The message says "re-enqueue the canonicalize job"; no command does that.
- Whether PDF uploads are on any path. Format detection and `parse_pdf` exist; the orchestrator uploads only CSV.
- Whether `audit_log` should be written or dropped.

## Conflicts found, by kind

1. **Intended design differing from implementation.** The design's teaching loop (notify, collect, PUT, retry assimilate) has no working retry in the orchestrator: a re-enqueue 409s and skips the stages. The seed overwrites what the PUT taught.
2. **Documentation lagging code.** The orchestrator's canonicalization design and the OC finish spec describe the flat snapshot; core returns facets.
3. **Config lagging code.** `required-env.txt` calls itself the single source of truth for env the orchestrator needs and omits `CORE_BASE_URL`, which the task requires.
4. **A table with no writer.** `audit_log` has a model, a migration, and a relationship, and nothing inserts into it.

## Findings for the owner

Findings are not decisions. Each is inferred from the code at the SHAs read and none has been observed in production in this session.

1. **A failed document is never driven again, and its retry publishes an empty canonical.** Core dedups an upload on identity regardless of the row's state, so a re-upload of a document that failed at assimilate or canonicalize answers 409. The task treats every 409 as already processed, skips the stages, GETs the row, takes `canonical_snapshot or {}`, and publishes `.canonicalized` with `canonical: {}` and no degraded marker. Two consequences. First, the teaching stop's "no publish" holds only for the first attempt: the wrapper re-raises, Faktory retries the job (#270), and the retry publishes the empty canonical, so the embed renders without item rows. Second, the remedy in the ping, add mappings and re-enqueue, cannot work: the re-enqueue 409s and never calls assimilate. Core would allow the re-drive; parse, assimilate, and canonicalize all accept state `failed`. Verified in `tasks/canonicalize.py`, `clients/core.py`, `api/invoices.py` (`_do_upload`, `_check_state`), and `workflows/wrapper.py`.
2. **`CORE_BASE_URL` is not in `required-env.txt`.** The file says it is the single source of truth for env that must be non-empty for the orchestrator to function, asserted at init. The task raises `NonRetryableError` per job when the variable is empty, so a missing value surfaces as a failed run on the first canonicalize instead of a failed init. The compose anchor sets it from `PUBLIC_DOMAIN`; the justfile patches dev's `.env` by hand because the CI-written compose predates the anchor.
3. **Every deploy re-applies the seeded mappings.** `seed.py` overwrites `column_mappings` and `metadata_mappings` for the four vendors on every run, and CI runs the seed after every migration. A mapping taught through `PUT /v1/vendors/{id}/mappings`, the route the core design names for the teaching flow, lasts until the next deploy unless it is also written into `seed.py`.
4. **Three of the four seeded vendors cannot canonicalize as seeded.** `alberts` maps no `quantity_ordered`, which `REQUIRED_FIELDS` demands; the seed comment says so and the e2e suite xfails it. `glazers` and `unfi` have no `metadata_mappings`, so their documents get a NULL identity and no dedup, and canonicalize fails on the required metadata.
5. **`audit_log` is never written.**
6. **The mapping routes have no principal.** `PUT /v1/vendors/{id}/mappings` and `/metadata-mappings` take no tenant, no scoping, and no auth, so the trusted-caller stub is the only guard, as for every route in v0.3.x.

## Belongs in another document

- Finding 1's retry half is #270's mechanism seen from this part; Part 7 owns the wrapper.
- The `documents` row and the canonical snapshot are Part 5's input; Part 5's Context Record will own the read side.
- The typed `Adjustment` and the deferred facets belong to a canonical-format reference page on SYSTEM REGISTRY, not to a board.

## Reconciled against the harness

Everything in Part 4 is drawn as it runs, because the part is live and the code is the source. The principles the board cites: P4 the orchestrator drives, core executes (the task drives three POSTs; core holds every rule); P6 one canonical format is the contract (cents, GTIN-14, pack sizes, facets); P3 fail loud (the teaching stop and the `NonRetryableError`s on misconfig); P5 the SaaS invariant (the customer number lives in core's database, not in process env). Where the harness says core touches no job queue, the code agrees: the ops ping is enqueued by the orchestrator's task, not by core.
