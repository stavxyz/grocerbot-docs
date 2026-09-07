# Design Specs

The dated design documents inside the two repos. These are the rulings behind `Logic - Harness.md` section 4. They live in their repos and are read there; this brief is the map and the read order.

Most were produced by the brainstorm, spec, validate, plan, implement cycle recorded in each repo's CLAUDE.md. A spec with a `validated:` block in its front matter was fact-checked against the code at the SHA it names; treat those as the strongest statement of intent at that date. A spec is intent. Whether the code matches it at the current SHA is checked against the code, not assumed.

## Read order

Date order. Each entry gives the repo-relative path, what it decided, and what it does not settle.

1. `grocerbot-orchestrator/docs/plans/2025-02-04-orchestrator-design.md`. The founding design: event-driven, deterministic, Discord as the staff interface, Faktory plus Redis Streams, Docker Compose, Postgres. Names eleven use cases, several never built (SMS, Discord slash commands, customer data sync, web dashboard). Names technology choices later changed (Supabase, discord.py). Read for principles and intent; do not read its architecture diagram as current.
2. `grocerbot-core/docs/plans/2026-03-19-grocerbot-core-design.md` and `grocerbot-core/docs/CANONICAL_FORMAT_ANALYSIS.md`. Why core exists: the N by M coupling of vendor to POS in version 1, and the canonical format as the contract. `docs/POS_BACKENDS.md` beside them was written for version 1's backend model.
3. `grocerbot-orchestrator/docs/superpowers/specs/2026-03-19-email-as-events-design.md` and `2026-03-19-email-dedup-actions-parsers-design.md`. Email becomes an event source with dedup, rule actions, and parsers.
4. `grocerbot-orchestrator/docs/superpowers/specs/2026-04-18-convergent-events-design.md`. The canonical event envelope, raw and augmented forms, per-vendor pipeline files under `config/pipelines/`, identity-driven dedup. Its dedup key shape is the legacy one; see item 8.
5. `grocerbot-orchestrator/docs/superpowers/specs/2026-04-20-discord-config-design.md`. All Discord snowflakes in `discord.{env}.yaml`, `${discord.*}` substitution, `APP_ENV` isolation.
6. `grocerbot-orchestrator/docs/superpowers/specs/2026-05-12-workflow-framework-design.md`. Workflow runs, side effects, compensation, three failure detection mechanisms. Fixes the seen-counter ratchet.
7. `grocerbot-core/docs/superpowers/specs/2026-06-09-multi-tenant-scoping-design.md`. Tenants as rows, the single scoping chokepoint, 404 over 403.
8. `grocerbot-orchestrator/docs/superpowers/specs/2026-06-21-provenance-agnostic-dedup-design.md`. `business_event` and `entity_id`; the `dedup:v2:` key shape; suppression at the first post-emit consumer.
9. `grocerbot-core/docs/superpowers/specs/2026-06-18-order-confirmation-canonicalization-design.md`, `2026-06-20-...-finish-design.md`, and `2026-06-25-document-type-system-design.md`. Order confirmations as a second document type; `documents` replaces `invoices`; identity per document type.
10. `grocerbot-orchestrator/docs/superpowers/specs/2026-07-10-app-side-unique-jobs-design.md`. Unique-job locks app-side because Faktory OSS does not dedup.
11. `grocerbot-core/docs/superpowers/specs/2026-07-18-clover-pos-subsystem-design.md`. The POS subsystem. Section 5 was re-brainstormed 2026-07-20 and carries the ruling that the orchestrator drives and core executes bounded steps. Section 12 names the orchestrator job chain that has not been built. Section 13 is the out-of-scope register.
12. `grocerbot-core/docs/superpowers/specs/2026-07-23-inventory-ledger-unitization-design.md`. One ledger number per family; tiers as projections; the witness loop. Companion: `grocerbot-core/docs/design/consumption-dag-inventory-engine.md` for the engine model behind it.

## The plan documents

Each spec usually has a sibling under `docs/superpowers/plans/` or `docs/plans/` with the same date. Plans record how the work was sequenced and are useful for finding where in the code a decision landed. They are weaker than specs on intent and weaker than code on behaviour.

## What this folder cannot support

- Current behaviour. A spec describes what was meant at its date. Check the code.
- Deployment state. No spec says what is on the droplets.
- Anything about version 1 beyond the problem statements that motivated version 2.
