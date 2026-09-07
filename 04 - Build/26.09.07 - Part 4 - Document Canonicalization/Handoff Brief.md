# Map Brief: Part 4, Document Canonicalization

Written 2026-09-07 in the format at the end of `02 - Tools/Figma/Instructions.md`, in GrocerBot's four-level vocabulary. The nature pass at the end maps each nature to the piece families in `02 - Tools/Figma/Visual Rules.md`. Under the standing instruction to continue without asking, this brief is recorded and then built.

Purpose: a reader should see within ten seconds that the worker takes the CSV augment cached, resolves which document it is and which tenant it belongs to, hands it to grocerbot-core, and drives three stages there in order; that core dedups the upload on the document's own identity, stores the file in R2, maps the columns through the vendor's mappings, and turns the rows into one canonical shape in cents with structured pack sizes and exploded sellable SKUs; that the worker reads the snapshot back and publishes `.canonicalized` for Part 3 to render; and that an unmapped column stops the chain and pings an operator to fix the mapping, while a missing CSV passes through degraded and any other 422 fails the document.

Target: file `nBmhDyEDpFPrMq0ztmHDb0`, page VISUAL DOCUMENTATION (`7001:129074`), a new frame below the Part 3 board. Components from SYSTEM LEGEND (`7001:129072`).

Standing: live. Drawn as current.

## Elements

One per line: name | nature | one-line description | modifiers.

**Actors**

- Worker | actor, agent | the lightweight worker, queue `core`, the `canonicalize` job with the run id first | none
- Core API | actor, agent | grocerbot-core at `api.{domain}`, FastAPI, trusted caller | none
- Operator | actor, human | reads `#ops` and fixes the vendor's mappings | on the teaching shelf

**Interfaces**

- Operator HTTP | interface, code block | `PUT /v1/vendors/{vendor}/mappings` with the whole mapping; no `gbc` command exists | Code block convention, under FIXES THE MAPPINGS

**Artifacts**

- The teaching ping | artifact, Discord message | the `ops.ping` text: the vendor and document id, the unmapped columns, and the instruction to add mappings and re-enqueue | under PINGS OPS

**Operations, the rail in order**

- Picks up canonicalize | operation, trigger | from queue `core`; the wrapper counts the attempt, budget -1 | none
- Reads the cached CSV | operation, view | `invoice_csv:{vendor}:{doc}` from Redis; `csv_kind` from the augmented slot | none
- Passes through | operation, output | `canonical: {}` with `canonicalize_skipped` on no key, no Redis URL, or an expired key | shelf below, dead end
- Resolves type and tenant | operation, route | `csv_kind` to `document_type`; `core_tenant_id` from `tenants.yaml` by `APP_ENV`; `NonRetryableError` on either, or on an empty `CORE_BASE_URL` | none
- Uploads the CSV | operation, write | multipart to the tenant-scoped upload route for the type, with `vendor_id` | none
- Detects and parses | operation, write | magic bytes, extension, content type; header rows and item rows; row inserted `underivative` | Core
- Extracts the identity | operation, route | `invoice_number` or `sales_order` from the header rows through `metadata_mappings` | none
- Answers 409 if seen | operation, route | `(tenant, vendor, type, identity)` already present, the existing id returned | door above the rail to READS THE SNAPSHOT
- Stores the file | operation, write | R2 `{tenant}/{vendor}/{doc_id}/{file}` before the commit | none
- Drives the stages | operation, write | three POSTs on `/v1/invoices/{id}`: parse, assimilate, canonicalize | Worker again; P4 pill
- Assimilates | operation, write | columns through `column_mappings`; four required fields and one cost field; the assimilated snapshot | none
- Pings ops | operation, output | teaching 422: `ops.ping` to `#ops`, unique 600 s on the message; `NonRetryableError`, no publish | shelf below; P3 pill
- Fixes the mappings | operation, action | PUT the mapping, or edit `seed.py` and deploy; the re-enqueue 409s (finding 1) | shelf, ends at the Operator
- Canonicalizes | operation, write | cents, GTIN-14, pack size by `parse_eaches`, `quantity_uom`, case, pack, and single by slash count; metadata by policy | P6 pill
- Cross-checks the customer number | operation, route | against `tenant_vendor_settings.customer_number` when both exist | P5 pill
- Fails the document | operation, write | any other 422: row `failed` with stage and detail; `ValueError`; run failed; Faktory retries (#270) | shelf below, dead end
- Projects the facets | operation, write | Document and Transactional; Financial for invoices; `total_is_final` false for confirmations; the canonical snapshot | none
- Reads the snapshot | operation, view | GET `/v1/invoices/{id}`; `canonical_snapshot or {}` | Worker again
- Publishes .canonicalized | operation, output | the envelope copied through, `source` canonicalize, the `canonical` slot; Part 3 reads it | ends the rail

**Piping**

- Canonicalize task | piping, code | `tasks/canonicalize.py`: the slot read, the three skip reasons, the type and tenant tables, the drive, the teaching stop, the publish | none
- Core client | piping, code | `clients/core.py`: the two upload paths, 409 as deduped, the bare stage routes, 422 per call | none
- Format and parse | piping, code | `format_detection.py`, `stages/parse.py`, `parse_pdf.py`: the order of detection, the header-row heuristic, the encodings | none
- Upload and scoping | piping, code | `api/invoices.py` `_do_upload`, `_scoping.py`: vendor 404, 25 MB, tenant from the URL then from the row, 404 never 403, the `IntegrityError` net, the state gates | none
- Cloudflare R2 | piping, external tool | bucket `R2_INVOICES_BUCKET`, `S3Storage`; written before commit, read by parse; `StorageNotFound` is a 422 | tied horizontally from Upload and scoping
- Assimilate | piping, code | `stages/assimilate.py`: `REQUIRED_FIELDS`, the cost fields, the 422 body with unmapped columns and samples | none
- Ops ping | piping, code | `ops_ping.py`, `unique_jobs.py`: label `canonicalize_422/{vendor}`, unique 600 s on the message, `#ops` from `discord.{env}.yaml`, an enqueue failure swallowed | none
- Seed and mappings | piping, config | `seed.py`, `api/vendors.py`: four vendors, `bek` alone with metadata mappings, the two PUT routes, re-applied on every deploy | none
- Canonicalize stage | piping, code | `stages/canonicalize.py` with `upc.py`, `parse_eaches.py`, `sku_explosion.py`, `metadata.py`, `identity.py` | none
- Policies | piping, config | `policy.py`: the invoice and order-confirmation policies side by side | table

**Data**

- invoice blob cache | data, redis key | read side: `invoice_csv:{vendor}:{doc}`, 3600 s, with `csv_kind` in the augmented slot | none
- events stream | data, redis stream | write side: `.canonicalized`, the `canonical` slot, the `degraded` pass-through | none
- tenants | data, table | `id`, `display_name`; the UUID the task resolves from `tenants.yaml` | none
- documents | data, table | eighteen columns: identity, type, state, the three snapshots, the failure detail, the storage key | none
- document object | data, R2 object | `{tenant}/{vendor}/{doc_id}/{file}` in `R2_INVOICES_BUCKET`; written by upload, read by parse | none
- audit_log | data, table | `document_id`, `stage`, `status`, `duration_ms`, `error_detail`; written by nothing | muted, no writer
- unique locks | data, redis key | the ops ping's lock, `unique:ops.ping:{sha256(args)}`, 600 s | muted, Part 1
- vendors | data, table | `id`, `display_name`, `adapter_type`, `column_mappings`, `metadata_mappings`, `settings` | none
- tenant_vendor_settings | data, table | `tenant_id`, `vendor_id`, `customer_number`, `settings`; written only by the PUT route | none

**Principles**

- P4 · The orchestrator drives, core executes | principle | on Drives the stages
- P3 · Fail loud | principle | on Pings ops
- P6 · One canonical format is the contract | principle | on Canonicalizes
- P5 · The SaaS invariant | principle | on Cross-checks the customer number

## Groupings

- Part 4 frame | part frame | everything above
- In the orchestrator, in core | cluster | chapter captions above the rail; a caption where the worker acts again mid-chain
- The 409 door | cluster | a line above the rail from ANSWERS 409 IF SEEN to READS THE SNAPSHOT
- Shelves | cluster | the pass-through under READS THE CACHED CSV; the teaching shelf under ASSIMILATES with the Operator, the ping artifact, and the code block; the failure shelf under CROSS-CHECKS

## Relationships

- Picks up -> Reads the cached CSV -> Resolves -> Uploads -> Detects and parses -> Extracts the identity -> Answers 409 if seen -> Stores the file -> Drives the stages -> Assimilates -> Canonicalizes -> Cross-checks -> Projects the facets -> Reads the snapshot -> Publishes .canonicalized | flow | the rail
- Reads the cached CSV -> Passes through | flow | branch, dead end
- Answers 409 if seen -> Reads the snapshot | flow | door above the rail
- Assimilates -> Pings ops -> Operator -> Fixes the mappings | flow | branch, the teaching shelf
- Cross-checks -> Fails the document | flow | branch, dead end
- Picks up -> Canonicalize task card; Uploads -> Core client card; Detects and parses -> Format and parse card; Answers 409 -> Upload and scoping card; Assimilates -> Assimilate card; Pings ops -> Ops ping card (from the shelf); Fixes the mappings -> Seed and mappings card (from the shelf); Canonicalizes -> Canonicalize stage card; Projects the facets -> Policies card | tie
- Upload and scoping card -> Cloudflare R2 card | tie, horizontal
- Canonicalize task card -> invoice blob cache; Canonicalize task card -> events stream (one bend); Upload and scoping card -> documents; Upload and scoping card -> document object (one bend); Ops ping card -> unique locks; Seed and mappings card -> vendors; Canonicalize stage card -> tenant_vendor_settings | tie

Reading order: left to right. The worker's three steps, then core's upload with its door, then the three stages the worker drives, with the teaching shelf under assimilate and the failure shelf under the cross-check, then the read-back and the publish.

Color semantics beyond the standard planes: none. Muted pieces at opacity 0.55.

Undecided:

- Whether the worker should appear twice on the rail, since it acts before and after core. Drawn once, with captions where it acts again.
- Whether the Operator belongs on this board or on Part 7's. Drawn here because the ping exists for them.
- Whether `audit_log` should be drawn at all. Drawn muted with its no-writer caption because a reader of the schema will look for it.

## Nature pass

| Nature used here | Family in Visual Rules | Match |
| --- | --- | --- |
| actor, agent | Actor, Agent | match; Worker exists, Core API is a new designation |
| actor, human | Actor, Internal Human, designation Operator | match; Part 1 used it |
| interface, code block | Interface, Code block convention (open item 4) | match as drawn on Part 1 |
| artifact, Discord message | Artifact | match; the Part 1 ops alert shell |
| operation, all acts | Operation | match; View for the cache read and the snapshot read |
| piping, code / config | Piping Runner and Router cards | match |
| piping, external tool | External Tool card | match; the Cloudflare R2 mark exists |
| data, redis key / redis stream / table / R2 object | Data card per section 5 | match |
| principle | Color Tag rebound to Principles | match |
| door | a line above the rail, the Part 1 convention | match |

No gap.
