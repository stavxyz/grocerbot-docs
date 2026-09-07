# Delivery Report: Part 4, Document Canonicalization

Dated 2026-09-07. Written per step 7 of the Function.

## Request and resolution

"Next", after the Part 3 report named Part 4, resolved to Part 4, document canonicalization: from the worker picking up the `canonicalize` job to the `.canonicalized` publish, through core's upload, dedup, storage, and three stages, with the teaching stop and its operator, the degraded pass-through, and the failure path. Standing per the harness: live.

## Sources read

Orchestrator at `dev` `1304813` and core at `dd74fe9`. The Context Record lists every file opened and why. No failure to open a file is recorded there.

## Produced

- Part 4 board on VISUAL DOCUMENTATION, node `9084:4121`: three actors, one artifact, one interface, nineteen operations, four principle pills, ten Piping cards, nine Data cards, twenty-one tie segments, one door, three shelves.
- Legend change: none.
- In this folder: Context Record, Handoff Brief with its nature pass, Build Log, this report, and the behind-the-scenes audit.
- Lexicon: `teaching stop` and `identity` added; naming queue row 8 for core's third meaning of dedup.
- Visual Rules open item 4 extended to the HTTP request line.
- Core Brief: an "Issues filed" pointer.

## Deviations from the brief and the visual rules

- The failure shelf branches after PROJECTS THE FACETS rather than after CROSS-CHECKS, to keep a tie uncrossed; its caption names the 422s.
- The Worker is drawn once and acts three times, marked by captions.
- The Code block interface carries an HTTP line, not a CLI command.

## Corrections for the owner

- The orchestrator's 2026-06-18 canonicalization design describes the flat snapshot; core returns nested facets. Added to #268.
- `required-env.txt` omits `CORE_BASE_URL`. Filed as #272.
- The ops ping's remedy, "re-enqueue the canonicalize job", cannot work as the code stands. Filed as #271.

## Unresolved naming and boundaries

- Which mechanism teaches a mapping, the PUT route or `seed.py`. Filed on core as #44; the board draws both.
- Who the operator is who reads `#ops`. Drawn as Operator, the Part 1 designation.
- Whether `audit_log` stays. Drawn muted with no writer.
- Row 8 in the lexicon's naming queue: three things called dedup.

## Source conflicts

As recorded in the Context Record: the design's teaching loop versus the orchestrator's 409 handling; the seed versus the PUT route; the flat versus nested snapshot in the documents; the required-env list versus the task; a table with no writer.

## Findings for the owner

Six, listed in the audit and the Context Record. Three were verified end to end in the code this session and filed; see the note at the end.

## Verification

Two full-board screenshots at native scale, cropped and inspected: the rail in four crops, every Piping card, every Data card, and the tie band, then the three rail regions that changed after the fixes. A geometry scan of the 514 text nodes found one 2 px overflow, corrected, and no other. Nothing on the board was checked against production.

## Next

Sam's three approvals. Then Part 5, POS sync, which reads the `documents` row and the canonical snapshot this board ends on, or the SYSTEM REGISTRY page.

## Issues filed, 2026-09-07

- `parconditio/grocerbot-orchestrator` #271: canonicalize treats a 409 as canonicalized, so a failed document is never re-driven and its retry publishes `canonical: {}` (finding 1). Verified in `tasks/canonicalize.py`, `clients/core.py`, core's `api/invoices.py`, and `workflows/wrapper.py` before filing.
- `parconditio/grocerbot-orchestrator` #272: `CORE_BASE_URL` is required by canonicalize but absent from `required-env.txt` (finding 2). Verified in the list, the task, the compose anchor, and the justfile.
- `parconditio/grocerbot-core` #44: `seed.py` re-applies mappings on every deploy, overwriting what `PUT /v1/vendors/{id}/mappings` taught (finding 3). Verified in `seed.py`, `ci-cd.yml`, `api/vendors.py`, and the 2026-03-19 core design.
- A comment on #268 for the stale snapshot shape in the 2026-06-18 design.

Not filed: the seeded vendors that cannot canonicalize (the seed says so itself), the unwritten `audit_log` (a design gap), and the unguarded mapping routes (trusted caller is the v0.3.x design).
