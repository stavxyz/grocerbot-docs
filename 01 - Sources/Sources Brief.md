# Sources

Sources are the material used to understand GrocerBot, document what exists, and work out what should change. This folder holds pointers, not copies. GrocerBot's material lives in git, checked out under `~/src/`, and copying it here would put the documentation on the same treadmill as the code. Each subfolder carries a brief that records where the source is, which branch is the branch of record, which commit was read and when, the read order within it, what it can support, and what it cannot. Runs open the live checkouts and record the SHA they read. Anything that does not live in git, such as call notes or transcripts, gets copied in when it exists.

A source is not documentation simply because it is pointed at from here. It can contain facts, decisions, working theories, rejected ideas, old names, mistakes, and unresolved questions in the same file. The specific claim being used has to be read at the strength it had in its source.

## Folder map

Numbered in read order. Lower numbers are closer to the current direction and carry more weight for what the system is becoming.

- **01 - Working Decisions** holds the dated records of decisions made while setting up and running this documentation effort, starting with the 2026-09-06 walkthrough that fixed the boundary, the levels, the parts, and the source model. Closest to final on method questions. Read first.
- **02 - Design Specs** maps the dated design documents inside both repos: the original orchestrator design, the core design, and the validated `docs/superpowers/specs/` documents for convergent events, the workflow framework, provenance-agnostic dedup, multi-tenant scoping, the POS subsystem, and the inventory ledger. These are the rulings behind `Logic - Harness.md` section 4. Read second, in date order.
- **03 - grocerbot-orchestrator** points at the driving service. Code, configs, migrations, and its README and CLAUDE.md. The code and config are current; the README and CLAUDE.md carry older shapes.
- **04 - grocerbot-core** points at the executing service. Code, Alembic migrations, the OpenAPI spec and generated client, and its CLAUDE.md, which is stale in twenty-two places against the code.
- **05 - graftpunk-plugins-grocerbot** points at the BEK portal plugin the orchestrator polls through, plus the UNFI, WSS, and ShopKeep plugins that are not part of GrocerBot's running system today.
- **06 - grocerbot (version 1)** points at the legacy CLI. Read only to recognise version 1 on sight and to check supplier mappings against proven logic. It establishes nothing about version 2.

## Source standing

Source standing depends on the question.

- For what the system does at the SHA read, use the code, the configs, and the migrations. Not the README, not the CLAUDE.md.
- For what the system is instructed to be, use the dated design specs, in date order. A later spec that says it re-brainstormed an earlier decision replaces it; the POS spec's section 5 note of 2026-07-20 is the clearest case.
- For what is deployed, the repos alone do not say. `grocerbot-orchestrator/RECOVERY_BRIEFING.md` records a first production release on 2026-07-01 with the canonical chain live; anything more recent is unverified until checked against the droplets or CI. Say "unverified" rather than infer.
- For what Sam decided about this documentation, use `01 - Working Decisions`.
- For what GrocerBot should become, no source decides by itself. The specs state the aim; the harness restates it; the owner rules.
- For version 1, use `06 - grocerbot (version 1)` and read it as history.

Do not treat an entire repo as uniformly current. Both repos carry a README or CLAUDE.md that describes an earlier shape confidently, and both carry dead code that is real in the tree and not part of how the system works. `Logic - Harness.md` section 3 lists what to recognise.

When sources disagree, name the kind of disagreement: a later decision replacing an earlier one; intended design differing from current implementation; two names for one thing; one name used for two things; a genuine unresolved disagreement; or a plain mistake. The orchestrator and core disagree on names in a few places, and the lexicon at the repo root tracks them.
