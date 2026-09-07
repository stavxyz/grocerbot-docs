# Figma Instructions

How GrocerBot visual documentation gets built in the GrocerBot System Docs Figma design file, file key `nBmhDyEDpFPrMq0ztmHDb0`. What any piece of content says is decided in the task or the handoff brief, and never invented here.

These rules were earned on DRAPER's earlier FigJam board; each one counters a real defect from the July and August 2026 sessions. The board surface changed, the discipline did not. The FigJam-era API mechanics were cut 8.25 and live in this file's git history; design-file mechanics get recorded here and in `Lessons.md` as the work relearns them on the new surface.

Design-file mechanics learned 2026-09-06: writes go through the Figma MCP `use_figma` tool with the `figma-use` skill loaded first; pages switch only with `setCurrentPageAsync`; every script returns the ids it created; reads and screenshots count against the Figma plan's tool-call budget, writes may too; the Professional plan allows 200 a day and 10 a minute, so build one section, screenshot it, and pace calls rather than bursting them.

## Load order, every task

1. Read the target area live before writing anything: probe the file's pages, then pull the metadata and a screenshot of the target page or node. Never work from a node id, position, or structure remembered from an earlier session.
2. The official Figma MCP references for the tools the task touches, batched in one message.
3. This folder: `Visual Rules.md` for the current standard, `prelude.js` for the script prelude where scripting applies, `Lessons.md` for the accumulated traps.

## Non-negotiables

1. Slugs go in node names and never in visible text. Name every frame, shape, text node, and connector with a stable slug, such as `chip:st-messaging`, so later tasks can find and edit instead of redraw. Connector and label text is human prose or empty.
2. Section and frame names are not titles. Visible titles are text nodes styled per the visual rules; container names exist for navigation and get cleared when they would render as clutter.
3. Draw only content that has been decided and handed over. Never modify or delete nodes you did not create in the current task unless the task says to. Undecided names render in [brackets] and undecided states get a TBD badge, so nothing gets drawn as settled when the brief marks it open.
4. Never trust geometry from an earlier session, dump, or brief, because the file moves under you. Re-read the target area at task start, and before continuing work on nodes you created earlier, re-read their current position. If a briefed location is occupied, pick clear canvas per the visual rules and report the deviation.
5. Verify the page every top-level node lands on. Test content has silently landed on working pages before.
6. Build one section per call, screenshot it, fix what the screenshot shows, then continue. Never the whole board in one call.
7. A fix does not exist until a fresh screenshot shows it. Calls that return cleanly have proven nothing more than once.
8. Sequence reads horizontally at every level. A vertical chain of sequential steps is a defect.
9. Build inline, with no background drawing agents, and never trust any agent's report of what it drew. If a subagent must draw, the orchestrator verifies the work itself with fresh reads and screenshots before reporting anything.

## Workflow

For new layouts:

1. If the content arrives as a handoff brief, run a nature pass first: classify every element in the brief against the piece treatments in `Visual Rules.md` section 4 and 5 and show the mapping table with the element, its nature, the treatment, and modifiers. Anything with no matching treatment is a gap you flag. Do not improvise a new look for it. If the brief contains styling instructions, push back: content comes from the brief, and style comes from these docs.
2. Draft and show for approval before the Figma file is touched, when the task allows a draft stage.
3. Build section by section per the non-negotiables, verifying each section with a screenshot.
4. Finish with the release checks and flow checks in `Visual Rules.md` section 10, including per-section screenshots at readable zoom and the truncation scan. Report only what you actually inspected.

For edits to existing content, skip drafting: read the live area, edit, and verify.

## The handoff brief format

Content arrives from an analysis or working chat in this shape. If one arrives malformed, ask for the missing fields instead of inferring them.

```
# Map Brief: <name>

Purpose: <what a reader should understand within ten seconds>
Target: <page, or "ask">

Elements (one per line):
<name> | <nature: actor human / actor agent / actor external / interface / operation (action, trigger, write, create, view, route, output) / artifact / piping (code, config, queue, library) / data (table, row, redis key, redis stream, r2 object) / principle> | <one-line description> | <modifiers: TBD, bracketed, muted, load-bearing, attention, or none>

Groupings:
<container name> | <container nature: part frame / global frame / cluster / tray> | <members>

Relationships (one per line):
<A> -> <B> | <role: flow (along the rail) / feedback (a loop back) / tie (dotted vertical to a card) / pull (a read) / load-bearing> | <label prose or none>

Reading order: <left-to-right sequence>
Color semantics beyond the standard planes: <assignments for the legend, or none>
Undecided: <everything still open, drawn bracketed or TBD>
```

Briefs arrive in rounds as thinking evolves. Provisional content is normal, and later briefs revise the same map. Update existing sections in place by their slugs, and redraw only what a brief actually changes. When a brief is ambiguous or incomplete, ask. Never fill a gap with a guess.
