*Example material from the original DRAPER repo, kept verbatim below this line. File paths it names refer to that repo's layout, not this one. See Example Brief.md.*

# Sources

Sources are the material used to understand DRAPER, document what exists, and work out what should change. They include finished brand work, records of earlier and live working sessions, current implementation, current prompts, earlier documentation attempts, outside research, and detailed records of Exploration and Production.

A source is not documentation simply because it is in this folder. It can contain facts, decisions, working theories, rejected ideas, old names, mistakes, and unresolved questions in the same file. The specific claim being used has to be read at the strength it had in its source.

## Folder map

The folders are numbered in read order. Lower numbers are, in general, closer to the current direction and carry more weight for what the system is becoming. The detail folders are opened when the task reaches into them, not by default.

- **01 - Live Working Sessions** holds the ongoing records of live working sessions with the team, July 29 onward. These sessions carry the most recent working direction and the reasoning closest to final decisions. Read the relevant sessions early and in chronological order.
- **02 - System Thinking** holds the dated written thinking on the system itself: the layer briefs, the principles reviews, the frameworks, the process walks, and the format decisions, late July through August. This is recent, weighted material, not old drafts. Every file carries its date. Its own brief maps the set.
- **03 - Controls** holds the controls stack: the craft logic for composition, photography, graphics, typography, prompt writing, variation, and the craft dimensions list. It is its own body of work and one of the largest unresolved parts of the system. Its own brief is on top.
- **04 - Recent Calls** holds the working-session transcripts from June 26 through July 18. Thinking, corrections, decisions, and rejected directions as they happened.
- **05 - Deep Research** holds outside research. It can challenge, extend, or clarify the work, but it is not DRAPER's method until worked through and adopted.
- **06 - Exploration Detail** holds the high-volume Exploration records: the Hotel Paisano rounds, the Ref Hunt Test, the Meseta concept-package run, and Boulders.
- **07 - Concepting Detail** holds detailed records of concept formation, where the concept was being built while reference exploration ran.
- **08 - Production Detail** holds detailed records of real Production runs, including their inputs, chats, outputs, iterations, and problems.
- **09 - Brand Builds** holds finished brand work, build records, and the study drawn from them. Used to test whether a framework can explain what happened in real work.
- **10 - First AI Concept** holds early AI-assisted concepting records. Read for the work and movement of ideas, not as settled method.
- **11 - Current System Prompts** holds the exported live prompt set. Evidence of what the system was instructed to do at export time. Re-export with `02 - Tools/Pull Prompts` when currency matters.
- **12 - Current Codebase** holds the July 4 code snapshot and the pointer to the live repository. Evidence of implementation at a point in time.
- **13 - Past Documentation Attempts** holds earlier written and visual attempts to explain the system. They show what was tried and may contain useful fragments, but they establish nothing about current structure or terminology.

Each subfolder has its own brief. The subfolder brief explains what is present, how to read it, what it can support, and what it cannot support. File-level detail belongs there rather than in this brief.

## Source standing

Source standing depends on the question.

- For what the system did at a particular time, use the code, database findings recorded in the working documents, and the prompt export from that time.
- For what the system is currently instructed to do, use a fresh export from **11 - Current System Prompts**. The files in that folder are a snapshot of the live database at the time they were exported.
- For what happened during the creative work, use finished brand work and verbatim work records.
- For what Buck decided should change, use the working session where the decision was made and any later document that records or revises it.
- For the latest working direction, read the relevant records in **01 - Live Working Sessions** in chronological order. A recent session can be the strongest evidence of the current direction without making every statement in it a final decision.
- For what the system is now, `Logic - Harness.md` and `Before-After - How Draper Runs.html` at the repo root are the standard. Nearly everything in these source folders describes the system the harness replaced. That material is evidence of what was, and no evidence of what should be.
- For what DRAPER's method should become, no source decides by itself. The sources are compared, tested against real work, and worked through with Buck.

Do not treat an entire file or folder as uniformly authoritative. Read each source for the specific thing you are using it to support. One transcript can contain a decided name, an open theory, a mistaken description, and unrelated conversation. One old brand build can be strong evidence for a creative method while being irrelevant to the current software.

Age does not set standing by itself. Older finished work can carry more weight than a recent AI draft because it records real work rather than an attempt to instruct the work before it was understood. Recency does matter when the question is current implementation, current prompts, or the latest state of a decision.

The current codebase and prompt folders are snapshots. They establish what was present when captured. They do not establish that the implementation is right, and they should not be described as current beyond their capture dates without checking the live system again.

When sources disagree, do not blend them into a generic middle. Identify what kind of disagreement it is:

- a later decision replacing an earlier one;
- intended design differing from current implementation;
- two people using different names for the same thing;
- one term being used for different things;
- a real unresolved disagreement; or
- an error in one source.
