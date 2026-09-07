# Visual Documentation of a Phase

## Description

Takes a spoken request for one part of the system being documented, gathers everything in Sources that bears on it, reconciles that material against the current standard, and produces the visual documentation for it in Figma. The request is the only thing that changes between runs. Everything else in this document stays the same.

**Invocation:** the user says the part they want, in whatever words come out. *"Let's do the onboarding flow"* or *"phase two, leg three."* A transcript may be attached to give clear context on what the specific part is and contains.

A worked example of this Function, filled in with real names, real conflicts, and a real board, sits in `03 - Example/Function - Visual Documentation (DRAPER).md`. Read it once to see what a mature version of this document looks like; do not copy its specifics.

---

## Function Instructions

### 1. Resolve the request before doing anything else

State the resolution back in one line and continue. Only stop and ask if it is genuinely ambiguous.

**The current naming.** Use whatever names the system's owner currently uses for its parts. As naming decisions land, record them here and in the lexicon, so a spoken request resolves the same way every run. Take the name as authoritative over any number whenever the two conflict; the name is what identifies the work.

**Resolve the part to its sources.** A part of the system is a grouping, and the underlying material sits in `01 - Sources`. Establish which documents in there belong to the requested part, state that list in one line, and document that whole set. Never assume one file is the whole part.

**The target board.** Confirm the Figma file and the page before drawing anything. Get the URL or node id from the task. If the task does not carry one, ask; do not guess from a board name, and do not draw into a board found by searching.

**Conflicts with recorded language.** When the lexicon or an older document carries a name or structure that a later decision replaced, do not follow the old entry, do not quietly rewrite it, and do not let it stall the run. Flag it in the delivery report as a correction for the owner to make.

### 2. Load the standard

Read `Logic - Harness.md`, the called Logic for what the system is now, what it replaced if it replaced something, and what sits outside it. If that document points at a fuller architecture reference, read that too; the standard summarises, the reference is the source.

### 3. Run the called Logics

`Logic - Protocol.md` and `Logic - Reasoning.md` are called Logics of this Function. Reading briefs alone does not satisfy the protocol's reading rules. The reasoning governs how everything below gets weighed: all of it considered together, with no single piece serving as the anchor.

### 4. Gather everything on the requested part

Not just the past documentation. Everything that touches it. Go through `01 - Sources` and open what bears on the part, following each source brief to the actual files. Old code, old notes, call transcripts, prompts, and past documentation all count, each at the strength it actually has.

Then follow the source trail per the protocol, until no unread pointer could reasonably change the understanding.

**Read every source at the strength it had**, per the reasoning: the specific claim, at the standing it actually has, and disagreements named by kind, never blended into a generic middle.

### 5. Synthesise, then reconcile against the standard

Assemble the Context Record required by the protocol: the task, every file opened, why each matters, what is current, what is historical, what was decided, what is still open, conflicts, and anything that belongs in another document.

Then run it against the Logic. Much of what the sources describe may be how the system used to work, or how someone once said it should work, rather than how it works or should work now. Documenting old material faithfully would draw the old shape back onto the board.

For every element about to be drawn, weigh it per the reasoning. Draw as how the system works only what can be defended as true under the standard, and draw everything genuinely unsettled in brackets or marked TBD, never as if it were decided.

### 6. Produce the documentation

The documentation is built under the strict formatting in `02 - Tools/Figma/Visual Rules.md`.

1. Write the **handoff brief** in the format at the end of `02 - Tools/Figma/Instructions.md`: elements with their natures, groupings, relationships, reading order, color semantics, and an explicit Undecided list. This is the handover from thinking to drawing, and it is the last point where the content is cheap to change.
2. Run the **nature pass**: classify every element against the levels and piece families in `02 - Tools/Figma/Visual Rules.md` sections 1 and 4, and show the mapping table. Anything with no match is a gap to flag, not a look to invent.
3. Build into the target board, one section per call, screenshot each, fix what the screenshot shows, then continue. Never the whole board in one call.
4. Finish with the visual release checks and flow checks in `02 - Tools/Figma/Visual Rules.md` section 10, including per-section screenshots at readable zoom and the truncation scan.

A fix does not exist until a fresh screenshot shows it. Report only what you actually inspected.

### 7. Close out

- Any rule that changed lands in `02 - Tools/Figma/Visual Rules.md` in the same step, or the step is not done.
- List the exact files read, so the source work can be checked.
- Report unresolved naming issues, unclear boundaries, source conflicts, and files that could not be opened.
- Do not update the lexicon, another document, or the board beyond the task. Those are the owner's decisions.

---

## Logic called

- `Logic - Protocol.md` holds the hard rules: reading, the Context Record, findings versus decisions, and reporting.
- `Logic - Reasoning.md` is how thinking gets done: everything considered with nothing as the anchor, how to weigh sources, and how old material meets the current aim.
- `Logic - Harness.md` is what the system is now and the standard the documentation reconciles against.

## Inputs

| Input | Required |
| --- | --- |
| The spoken request for one part of the system | Required |
| `Logic - Harness.md` and whatever architecture reference it names | Required |
| `02 - Tools/Figma/Instructions.md` and `02 - Tools/Figma/Visual Rules.md` | Required |
| `01 - Sources`, every folder bearing on the requested part | Required |
| The target Figma file, read live at task start | Required |
| The lexicon, once one exists | Required once it exists |

## Outputs

| Output | Where it lands |
| --- | --- |
| Resolved designation, stated back in one line | The chat, before work starts |
| Context Record | Working artifact, not permanent unless the task says so |
| Handoff brief | The chat, for approval |
| Built documentation | The target Figma file |
| Rule changes | `02 - Tools/Figma/Visual Rules.md`, same step |
| Delivery report | Files read, deviations, unresolved consequences |

---
