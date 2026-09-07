*Example material from the original DRAPER repo, kept verbatim below this line. File paths it names refer to that repo's layout, not this one. See Example Brief.md.*

# Harness

What the DRAPER system is now, what it replaced, and what sits outside it.

---

## 1. What the system is now

DRAPER has a set of **Functions**: records that Buck and Erik edit in the admin. Every Function has at least one **trigger**, and often more than one. When a trigger is recognized, the **harness**, which is code, kicks in: it searches the Functions Registry for the Function that trigger belongs to, and that Function's record tells it what to pull from the Logic Registry and the Input Registry, which model to call, and which Output Registry entry the result lands through.

**The Function record** is one form, and every line of it is editable:

| Field | What it holds |
| --- | --- |
| trigger | What fires it |
| prompt | The directive. The prompt leads; its slots pull from the Registries |
| inputs | What it may read, from the Input Registry |
| logic | Shared thinking it carries, from the Logic Registry |
| model | The model used |
| output | One entry from the Output Registry |
| host | Where it runs: the Draper harness, or an external runner |

**The trigger kinds** are: a `/command` typed, a button clicked, a row landing (an upload, a save, a plug-in capture), data changing (approved, denied, a status flipped), words in a message that the record names, or a schedule. The app only says what happened; the Functions Registry is searched by trigger, and the matched row is handed to the harness.

**The four Registries.** A Registry is the list of all of one kind of thing, each entry with its name, some detail about it, and the key it gets searched by. Code owns what is in the Registries; a Function record only picks.

- **Functions Registry**: every Function, one row each, with its name, description, and its trigger or triggers. Searched by trigger.
- **Logic Registry**: shared thinking, written once: Competitor Selection Logic, Research Standard, Needs and Wants Gap Read, Draper Voice, Grounding Rules, Five Layer Logic, Audience Translation Rules. Searched by the Function that names its rows.
- **Input Registry**: what a Function may read: source material (intake, first read, call transcripts), Atlas docs (Audience Planes, Customers, Competitors, any approved doc), knowledge entries, media, references, tray modules. Searched by the Function.
- **Output Registry**: each entry is a format and a place it lands: Chat message (prose, the thread), Strategy doc (markdown with named sections, a draft row in the Atlas shown as a card with Edit / Approve / Deny), Record fields (named fields, onto the row the Function ran for), Generation or file (image or html, into canvas or storage). Searched by the Function.

**The harness runs the same sequence every call.** It never knows ahead of time which Function it is running; it reads everything from the matched record and the Registries. The trigger fires. The Functions Registry is searched by that trigger and the matched Function row loads. The Logic rows the Function names get pulled. The input rows the Function names get pulled, in order. The model call runs. The result is checked against the output format the Function picked. The result is written where that output entry lands. The harness logs the run.

**The run log.** Every run records which Function ran, exactly what it read, which logic it carried, and what it wrote.

Calling the model is not what makes something a Function. Model calls happen outside Functions too: the ongoing chat with Mr. Draper runs on the model, before and after any trigger, and other non-Function model calls can exist. What makes something a Function is its record: a row in the Functions Registry with a trigger. The record is the single home of the definition, and a runner executes it. The Draper harness is the main runner. Some Functions run on external runners instead, such as a Notion agent on the CMS board or HyperAgent for WhatsApp, because building those runners ourselves is not worth it. The definition syncs out from the registry to wherever it runs, automatically where the runner allows it and by manual paste where it does not. External runners write to the run log too. Whether the ongoing chat becomes a Function with its own record is not settled yet.

## 2. Outside the harness

Not everything runs through the harness. Functions can run on external runners, with their records still in the Functions Registry and their definitions synced out, as section 1 says. Beside those sits plain code, each piece with one job: a click or an event happens, and one write follows. **The plain-code pieces are not Functions.** They get no record and they do not appear in the Functions Registry. The plain-code pieces:

- **Approve, Deny, Edit** on a doc card. Approve flips the row to approved and bumps its version; Deny drops the draft; Edit opens it. Approve is also what the next Function's trigger can listen for.
- **Tray add** — confirmed search results become a list of ids in a table.
- **Save, upload** — a row plus a stored file. That row landing can trigger a Function, such as Reference Read. The save itself is just storage.
- **Syncs from outside** — Read.ai transcript to a Notion record, PandaDoc signature and Mercury wire to status fields, Notion status to app stage. Field-for-field copies.
- **Export, download** — tray download, Atlas folder export, file handoff.

## 3. What it replaced

The old implementation was not a near miss. It was wrong at the level of structure and has to be recognised as wrong on sight.

**Five kinds of prompt thing**, each wired its own way: native commands hard-coded in the app; `/commands` as table rows that also carried a "response mode" deciding which code path would run them; Mr. Draper rules living in code *and* a table, attached to every chat call whether or not it needed them; instruction blocks pulled in by slug and pasted into many prompts; and a separate sub-agent per command type, each with its own plumbing.

**Three ways of assembling a call.** The main chat loop read the Draper rules plus the tray plus extra rules a "turn policy" picked plus around thirty tools — *nobody could say exactly what entered the context*. The sub-agent path fetched prompt text by slug and filled template variables in code. The direct writer read an input list declared in a code file per document type, where nobody could edit it.

**Three separate call sites** built requests three different ways.

**A separate piece of code for every place a result could land**: a message, an artifact card whose approval ran a second handler that copied the doc into the Atlas leaving two copies of one doc, tray modules with per-module code, canvas generations with their own table and save flow, and library records each with their own pipeline.

Why it hurt: to change what a call did you first had to work out which of the five kinds it was, which of the three paths ran it, and where its text and inputs lived — then change code and deploy. Shared standards like the research standard, the voice, and the evidence rules were pasted into many prompts, so a fix in one never reached the others. And nothing recorded what entered a call or where the result went, so bad output had no single place to look.

Which one you got depended on which feature you were using. That is the whole indictment.

## 4. Where the correction came from

Three moves carry the correction.

**One place for Function and Logic.** Buck, 8.13: *"I want to have all our function and logic in one place."* Not scattered across the surfaces that happen to call them. One home you can go to, view, and edit.

**A Function that cannot run is not a Function.** He killed the first flow's opening Function because *"the function can't work without the fucking data."* An action whose inputs are not declared and resolvable is not a unit of anything. This is why inputs are a declared list read from a Registry, and not whatever the assembling code happened to include.

**Plumbing is its own level and it is code.** The arrow that points down and says *this is the code that we write*. That is section 2 above.

Where earlier call transcripts show Buck reaching toward this and not being followed, those passages were right and the work went the other way. Read them as the signal, not as one more competing opinion.

---

## Sources

The architecture in full, both sides: `Before-After - How Draper Runs.html`. Buck's one-place direction, the Function-without-data correction, and the plumbing level: `01 - Sources/01 - Live Working Sessions/26.08.13 - Change Up A Lot Of Shit.md`. The scattered-behaviour condition as documented: `01 - Sources/02 - System Thinking/26.07.19 - Functions Brief.md`. Visual standard, stated once and not repeated here: `02 - Tools/Figma/Visual Rules.md`.

