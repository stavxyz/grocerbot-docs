*Example material from the original DRAPER repo, kept verbatim below this line. File paths it names refer to that repo's layout, not this one. See Example Brief.md.*

# Visual Documentation of a Phase

## Description

Takes a spoken request for one part of the Process walk, gathers everything in Sources that bears on it, reconciles that material against the current standard, and produces the visual documentation for it in Figma. The request is the only thing that changes between runs. Everything else in this document stays the same.

**Invocation:** the user says the part they want, in whatever words come out. *"Let's do phase two, strategy, leg three, which is offering."* A transcript may be attached to give you clear context on what the specific leg is and contains.
---

## Function Instructions

### 1. Resolve the request before doing anything else

State the resolution back in one line and continue. Only stop and ask if it is genuinely ambiguous.

**The current naming.** Phases are numbered with **Strategy as Phase 2**, and the parts inside a Phase are **legs**. Both are current and both are what the user says. The six legs of Strategy are customers, competitors, **offering**, positioning, messaging, content. The rest of the Phases are the names of the pages in the figma.

So *"phase two, strategy, leg three, which is offering"* resolves to **Phase 2 · Strategy · Leg 3 · Offering**, and needs no correction.

**Take the name as authoritative over the number** whenever the two conflict. The leg name is what identifies the work. The user might also provide you with the name of the leg he's working on.

**Resolve the leg to its sources.** A leg is a grouping, and the underlying material sits in `01 - Sources/11 - Current System Prompts`. Establish which of the documents in there belong to the requested leg from the sources, state that list in one line, and document that whole set — never assume one file is the whole leg.

**The target board.** Confirm the board and the page before drawing anything. Get the URL or node id from the task. If the task does not carry one, ask — do not guess from a board name, and do not draw into a board you found by searching. No live document currently records the board id.

**A conflict you will hit.** `System Lexicon.md` still carries the 8.12 entry putting Strategy at Phase 4 in an eleven-Phase list and recording "leg" as a rejected label. That entry is superseded by the current decision above. Do not follow it, do not quietly rewrite it, and do not let it stall the run — flag it in the delivery report as a Lexicon correction for Buck. The same goes for the eight-Phase list in `01 - Sources/02 - System Thinking/26.07.19 - Process Brief.md`.

### 2. Load the standard

Read, in this order:

1. `Logic - Harness.md` — the called Logic for what the system is now and what it replaced.
2. `Before-After - How Draper Runs.html` — the architecture in full, both sides, with every field, trigger kind, and output entry named. The Harness summarises it; this is the source.

### 3. Run the called Logics

`Logic - Protocol.md` and `Logic - Reasoning.md` are called Logics of this Function. Reading briefs alone does not satisfy the protocol's reading rules. The reasoning governs how everything below gets weighed: all of it considered together, with no single piece serving as the anchor.

### 4. Gather everything on the requested part

Not just the past documentation. Everything that touches it. Go through `Sources` and open what bears on the part, following each source brief to the actual files:

| Where | What you are after |
| --- | --- |
| `01 - Sources/01 - Live Working Sessions` | The latest working direction. Read chronologically. Closest to final. |
| `01 - Sources/04 - Recent Calls` | The thinking, corrections, and rejected directions as they happened. |
| `01 - Sources/13 - Past Documentation Attempts` | What was tried before. Fragments and names only — establishes nothing. |
| `01 - Sources/12 - Current Codebase` | What the implementation actually does. Evidence of its capture date only. |
| `01 - Sources/11 - Current System Prompts` | What the system was instructed to do at export time. |
| `01 - Sources/09 - Brand Builds` | Whether a framework can explain real finished work. |
| `06 - Exploration Detail` / `07 - Concepting Detail` / `08 - Production Detail` | Exploration, Concepting, and Production detail where the part reaches into them. |

Then follow the source trail per the protocol, until no unread pointer could reasonably change the understanding.

**Read every source at the strength it had**, per the reasoning: the specific claim, at the standing it actually has, and disagreements named by kind, never blended into a generic middle.

### 5. Synthesise, then reconcile against the harness

Assemble the Context Record required by the protocol: the task, every file opened, why each matters, what is current, what is historical, what was decided, what is still open, conflicts, and anything that belongs in another document.

Then run it against the Logic. **Nearly everything you just read describes the system the harness replaced** — five kinds of prompt thing, three assembly paths, a separate piece of code for every place a result could land. The prompts, the code snapshot, and the past documentation all describe it accurately and confidently. Documenting them faithfully would draw the old architecture back onto the board.

For every element you are about to draw, weigh it per the reasoning. Draw as how the system works only what you can defend as true under the harness, and draw everything genuinely unsettled in brackets or marked TBD, never as if it were decided.

Where the leg involves a model call, it is a **Function record** (trigger, prompt, inputs, logic, model, output, host), found in the Functions Registry by its trigger and run by the harness. Where it is a click or an event and one write, it is **plain code outside the harness** and is not a Function. Getting that split right is the substance of the work; section 2 of the Logic is the test.

### 6. Produce the documentation

The documentation is built at six levels, in a horizontal flow that reads left to right, under the strict formatting in `02 - Tools/Figma/Visual Rules.md`.

1. Write the **handoff brief** in the format at the end of `02 - Tools/Figma/Instructions.md` — elements with their natures, groupings, relationships, reading order, color semantics, and an explicit Undecided list. This is the handover from thinking to drawing, and it is the last point where the content is cheap to change.
2. Run the **nature pass**: classify every element against the levels and piece families in `02 - Tools/Figma/Visual Rules.md` sections 1 and 4, and show the mapping table. Anything with no match is a gap you flag, not a look you invent.
3. Build into the target board, one section per call, screenshot each, fix what the screenshot shows, then continue. Never the whole board in one call.
4. Finish with the visual release checks and flow checks in `02 - Tools/Figma/Visual Rules.md` section 10, including per-section screenshots at readable zoom and the truncation scan.

A fix does not exist until a fresh screenshot shows it. Report only what you actually inspected.

### 7. Close out

- Any rule that changed lands in `02 - Tools/Figma/Visual Rules.md` in the same step, or the step is not done.
- List the exact files read, so the source work can be checked.
- Report unresolved naming issues, missing Functions, unclear level boundaries, source conflicts, and files that could not be opened.
- Do not update the Lexicon, another document, or the board beyond the task. Those are Buck's decisions.

---

## Logic called

- `Logic - Protocol.md` — the hard rules: reading, the Context Record, findings versus decisions, and reporting.
- `Logic - Reasoning.md` — how thinking gets done: everything considered with nothing as the anchor, how to weigh sources, and how old material meets the current aim.
- `Logic - Harness.md` — what the system is now, what it replaced, and what sits outside it.

## Inputs

| Input | Required |
| --- | --- |
| The spoken Phase and leg request | Required |
| `Before-After - How Draper Runs.html` | Required |
| `02 - Tools/Figma/Instructions.md` and `02 - Tools/Figma/Visual Rules.md` | Required |
| `Sources`, every folder bearing on the requested leg | Required |
| The layer briefs in `01 - Sources/02 - System Thinking` for the levels the leg touches | Required |
| The target Figma file, read live at task start | Required |
| `System Lexicon.md` | Required — current names, but its 8.12 Phase entry is superseded |
| `01 - Sources/02 - System Thinking/26.07.19 - Process Brief.md` | Optional — superseded phase list, read for history only |

## Outputs

| Output | Where it lands |
| --- | --- |
| Resolved designation, stated back in one line | The chat, before work starts |
| Context Record | Working artifact, not permanent unless the task says so |
| Handoff brief | The chat, for approval |
| Built documentation | Figma · DRAPER · System Docs |
| Rule changes | `02 - Tools/Figma/Visual Rules.md`, same step |
| Delivery report | Files read, deviations, unresolved consequences |

---

