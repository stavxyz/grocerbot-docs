# Sources

Sources are the material used to understand the system being documented, document what exists, and work out what should change. This folder starts empty on purpose: it gets filled with the app's own material. Old documentation, the codebase or a snapshot of it, working notes, call transcripts, exported prompts, research, and past documentation attempts all belong here.

A source is not documentation simply because it is in this folder. It can contain facts, decisions, working theories, rejected ideas, old names, mistakes, and unresolved questions in the same file. The specific claim being used has to be read at the strength it had in its source.

## How to organise it

Number the subfolders in read order, lower numbers closer to the current direction and carrying more weight for what the system is becoming. Give every subfolder a short brief on top explaining what is present, how to read it, what it can support, and what it cannot support. Update this brief as folders land, so it stays the map: a run starts here and follows it to the actual files.

A suggested starting split, adapted from the DRAPER version of this brief at `03 - Example/Sources Brief (DRAPER).md`:

- Recent working sessions and decisions, read chronologically. Closest to final.
- Written thinking on the system itself: briefs, frameworks, format decisions.
- Call transcripts: thinking, corrections, and rejected directions as they happened.
- The current codebase, or a dated snapshot with a pointer to the live repo. Evidence of implementation at a point in time, nothing more.
- Current prompts or configuration exports, if the app has them. Evidence of what the system was instructed to do at export time.
- Past documentation attempts. They show what was tried and may contain useful fragments, but they establish nothing about current structure or terminology.

## Source standing

Source standing depends on the question.

- For what the system did at a particular time, use the code snapshot and records from that time.
- For what the system is currently doing, use fresh material, and do not describe a snapshot as current beyond its capture date without checking the live system again.
- For what the owner decided should change, use the session where the decision was made and any later document that records or revises it.
- For the latest working direction, read the recent sessions in chronological order. A recent session can be the strongest evidence of the current direction without making every statement in it a final decision.
- For what the system is now, `Logic - Harness.md` at the repo root is the standard once it is written. Material in this folder that describes an older shape is evidence of what was, and no evidence of what should be.
- For what the method should become, no source decides by itself. The sources are compared, tested against real work, and worked through with the owner.

Do not treat an entire file or folder as uniformly authoritative. Age does not set standing by itself: older finished work can carry more weight than a recent AI draft because it records real work rather than an attempt to instruct the work before it was understood. Recency does matter when the question is current implementation or the latest state of a decision.

When sources disagree, do not blend them into a generic middle. Identify what kind of disagreement it is: a later decision replacing an earlier one; intended design differing from current implementation; two people using different names for the same thing; one term being used for different things; a real unresolved disagreement; or an error in one source.
