*Example material from the original DRAPER repo, kept verbatim below this line. File paths it names refer to that repo's layout, not this one. See Example Brief.md.*

# System Lexicon

**Correction note, 8.25, recorded from Buck's current runbooks.** Two entries below are superseded by later decisions carried in `Function - Visual Documentation.md`: the Phases are renumbered with Onboarding as Phase 1 and Strategy as Phase 2, and **leg** is current again as the word for the parts inside a Phase, reversing the 8.12 rejection. The six legs of Strategy are customers, competitors, offering, positioning, messaging, content. The Phases section below and the Process Brief's phase list are history on those points. The working surface is also no longer FigJam; the work happens in the DRAPER System Docs Figma design file. The level set has also evolved on the live boards, confirmed by Buck 8.25: a **Piping** level exists (the plumbing layer from the 8.13 session, promoted to a level), and **Artifact** now sits as a piece within Process rather than as its own layer. The sessions where these reversals were spoken are not yet in `01 - Sources/01 - Live Working Sessions`; when their records land, this note gets replaced by proper dated entries.

The evolving glossary of DRAPER's terms and what each means. Six sections are kept newest on top: the live evolving set, the naming queue, the 7.14–7.17 working state, the 7.11 pre-effort theory, the 7.10 post-rounds changelog, and the original 7.4 codebase survey. **Current — Evolving** records the current working language. **Naming Queue** records the things that still need names. The dated sections below it preserve earlier states at the strength they had at the time.

---

## Current — Evolving
*The current working language. A term can be current while its exact boundary or place in the hierarchy is still being worked.*

### Documentation layers

- **Principles**: foundational beliefs and philosophies that set the frame and direction for the rest of the system.
- **Logic**: reusable thinking and frameworks called by agents and skills.
- **Functions**: AI-powered actions and capabilities. A function records what triggers it, what it reads, what logic it applies, what runs, and what it returns.
- **Process**: the steps taken by people, AI, or both. A process step names the function it calls without repeating the function's full mechanics.
- **Artifacts**: substantive data manifested in a form that people or agents can read, use, or edit, including the documents, records, groupings, and attached items presented on the front end.
- **Data**: stored data and its format on the back end, including tables, fields, relations, and the ERD. Renamed from Storage by Buck in the 8.9 - 2 chat ("Storage is now data"), confirming the rename he had hedged on the Eric call.

The six names are current. Their exact stacking and all boundaries between them are still being worked.

### Pieces within Process

*Connections and Relationships were decided by Buck 8.9; Actor and Interface carry their 8.7 approvals. Process is currently the only layer with multiple distinct pieces. The category word is **piece**: Buck decided 8.9 to change Element to piece, stated with an "I think". The 8.5 taxonomy table's Element is history.*

- **Actor**: a participant in a Process. The confirmed semantic tree from the 8.7 approvals runs Actor Type (Human, Agent), Organizational Boundary (Internal, External), Role for Internal Humans, Stage for External Humans, and Title as Agent identity.
- **Designation**: the Actor property holding the one word in the flag under the actor mark, whatever its source: Stage for External Humans, Role for Internal Humans, Title for Agents. Coined in the 8.8 legend session as the one word covering all three, carried bracketed as [Designation] on the board key; Buck used it as the property name in the same session ("Actors have a designation property") and confirmed it settled 8.13.
- **Interface**: a human-facing place where a person can see information or interact with something. Its two properties are Surface (with View nested inside) and Purpose (with Control nested inside), per the 8.7 correction.
- **Connections**: the links between pieces within the Process layer. Decided by Buck 8.9, replacing the earlier working labels for those links, actions and relationships. Connections set up the flow through the Process; flow stays descriptive language (inferred reading of the 8.9 note, pending Buck). The 8.8 board work carried this piece as bracketed [Flow] with Action as the one settled type and [Trigger] [Create] [Output] [View] as dashed working types. Action is a Connection type, not a standalone piece; Buck confirmed 8.9 by removing the 8.8 Action bridge specimen. The Connection visual treatment was decided 8.12 (rectangles with a registered icon per type, per-type colors) and is recorded in `02 - Tools/Figma/Visual Rules.md`.

### Modifiers

*The third grouping beside levels and pieces, named modifiers by Buck 8.12, promoting the working label from the Eric call. It holds Relationships and Location: the only properties that span levels. Each gets deep visual and substance specification at the modifiers home; in every piece document they appear as ordinary rows under Properties, always present, empty when empty (Buck 8.12). The visual treatment is recorded in `02 - Tools/Figma/Visual Rules.md`.*

- **Relationships**: the links across layers only, not within Process. Decided by Buck 8.9. Shown as a pill shape in the process flow naming the thing at the other layer, with a dotted, arrowless line running to that thing's full documentation at its own layer (8.9 transcript). The 8.8 working types [Containment] [Reference] [Association] remain unverified. The substance definition is a working draft in 02 - Tools/Figma/Visual Rules.md, pending Buck's flesh-out.
- **Location**: where a piece lives. One property with controlled values (Draper Website, Draper App, Notion, WhatsApp, GitHub, Supabase). Spans levels, so it sits under modifiers; documented per piece as a Properties row. Principles carry no Location (Buck 8.12).
- **Attributes**: retired as a category by Buck 8.12. The 8.9 identification of Location and Format as attributes resolves as: Location moves under modifiers as above, and Format becomes an ordinary property of Data and nothing else (an Artifact's equivalent is its type, carried by the artifact-type icon). The Attributes section comes off piece sheets. Kept here as history.

### Phases

*The bounded stretches of the full Process walk, each drawn as one flow board with event boundaries. The category word Phases and the eleven names were decided by Buck 8.12, replacing the Process brief's earlier eight-phase list and rejecting his earlier spoken label leg: Qualification, Intake, Onboarding, Strategy, Sourcing, Exploration, Direction, Production, Documentation, Delivery, Post-Delivery. Onboarding narrowed from its earlier wider use; Direction replaces Review; Sourcing is references, knowledge, and media; Post-Delivery enters the walk as its own Phase. Full definitions in `01 - Sources/02 - System Thinking/26.07.19 - Process Brief.md`.*

### Controls and craft -- **NO THESE NEED TO BE APART OF CONTROLS YOU IDIOT 

- **[Craft dimensions]**: the working name for the eight-dimension list, recorded 7.19, of the craft judgments that matter most and that AI reliably gets wrong when producing explorations: typography, spacing, colors, composition & layout, graphic elements & detailing, hierarchy & emphasis, content-to-form fit, and craft finishing. Part of Controls logic, and specifically the review layer for high-volume exploration output. The name and its exact boundary with Controls are not settled. The list lives in `01 - Sources/03 - Controls/26.07.19 - Craft Dimensions - What AI Gets Wrong in Explorations.md`.

### Expressions

- **Expression**: one idea for something the brand does or could do, separated out, named, and written up in plain human language — at whatever level the idea lives, from a sensibility or conceptual frame down to a single compositional move. The write-up covers whatever the idea is made of, conceptual, visual, or both. References and explorations attach when they exist; none are required. What makes it an expression is the isolation: one thing made workable on its own, so it can be developed, tested, and built from.

### Documentation workspace

- **System Lexicon**: the dated record of DRAPER's language. The current set sits at the top, and older naming states remain below as history.
- **Legend**: the visual key for the shapes and colors used to represent system layers, components, records, and processes.
- **Figma**: the active visual working surface, the DRAPER System Docs Figma design file, where the system is mapped, questioned, and worked out. Replaced FigJam as the surface (recorded 8.25); written system outputs get drafted after the Figma documentation is done. The earlier FigJam entries below are history.

---

## Naming Queue
*Things in the system that need a name, or whose current name is in question. Kept as a running list, newest session on top, and appended to as sessions surface more. Working labels are recorded at the strength they had in the session. None is promoted by appearing here. A row leaves this queue when Buck decides the name in a working session, at which point the decided term moves up into the current evolving set at the top of this lexicon and the queue row becomes history.*

*The Raised by column separates what Buck opened himself from what was found by cross-referencing this lexicon during review. The distinction matters for triage: his own flags are known-live questions, the review catches are collisions he has not yet seen.*

### From 8.12 Visual Rules and Process Walk Session

The 8.12 chat decided the visual rules consolidation, modifiers, the Process walk names, and opened this.

| # | Raised by | What it actually is | Working labels in use | Why it needs work | Source |
|---|---|---|---|---|---|
| 1 | Buck | The category word for one bounded stretch of the Process walk, drawn as one flow board with event boundaries (Qualification, Intake, and the rest). | leg (Buck 7.11, hedged at coinage, adopted by doc voice including the 06.2 raw-doc instructions; rejected by Buck 8.12: "I called them legs before, but I think that's fucking retarded"); stretch and span (floated by AI 8.12, not taken) | Decided later on 8.12: Phases. Moved to the current set above; kept here as history. The 06.2 instructions still run on leg as their operating noun and need reworking to Phases. | 8.12 chat; 7.11 call; 8.9 map |

### From 8.9 Principles Format Session

The 8.9 chat and voice memo decided Connections and Relationships (now in the current set above), set the principle documentation format, and opened these.

| # | Raised by | What it actually is | Working labels in use | Why it needs work | Source |
|---|---|---|---|---|---|
| 1 | Buck | The middle part of a principle document: the written explanation and its inline graphics together, between the header divider and the example divider. | none; Buck: "what would you call this part, that's like the write up and the fucking graphics all together?" | Buck asked for the name directly while setting the format. | 8.9 chat |
| 2 | review | The category word for the named recurring things in the system, such as Actor, Interface, Connections, or a Principle. | piece (8.8 session, 8.9 memo, throughout speech); Element (8.5 taxonomy notes, synced 8.9) | Decided later on 8.9: piece, stated with an "I think". Moved to the current set above; kept here as history. | 8.9 memo and chat; 26.08.05 - Process Group Review 2 - Specific Notes |
| 3 | Buck | The third top grouping beside levels and pieces, holding Relationships and Attributes as two types of one thing. | modifiers (Buck on the Eric call: "levels, pieces, and who knows, maybe it's modifiers"; also "let's just say for now modifiers") | Decided 8.12: modifiers, holding Relationships and Location; Attributes retired as a category in the same session. Moved to the current set above; kept here as history. | 8.9 chat; 8.9 transcript; 8.12 chat |
| 4 | Buck | The sixth layer, stored data on the back end. | Storage (current set); data ("artifacts, storage, which is just data. We've changed it to I think") | Decided in the 8.9 - 2 chat: "Storage is now data." Moved to the current set above as Data; kept here as history. | 8.9 transcript; 8.9 - 2 chat |
| 5 | Buck | Whether Interfaces becomes its own layer. | none | "We may add one for interfaces here. I don't know." Interface is currently a piece within Process. | 8.9 transcript |
| 6 | Buck | The naming style for Functions. | web qualification form submission; process web form submission | "This is the time to get good on naming. I don't think it's good to name functions like this long." Length and pattern undecided. The 8.9 - 2 process map adds four more long working names: WhatsApp Prospect Notification, Auto Email Draft, Auto Email Draft WhatsApp Check, Auto Email Send. | 8.9 transcript; 7.30 transcript |
| 7 | Buck | The Logic the Ops Manager judges a prospect against: budget target, ICP, timeline fit, brand identity as the core engagement. | none; rubric rejected in passing ("Not rubric, but something") | Buck reached for a name at 7.30 and did not land one. Surfaced into the queue by the 8.9 - 2 process map. | 7.30 transcript |
| 8 | review | The fifth layer's name and definition. | Artifacts (current set, live board chip text); Sources with the definition "Stored data in its front-end format that users see, experience, and use" (8.9 evening board screenshot) | Buck's 8.9 evening screenshot shows the chip as Sources with a front-end-data definition while the live board text and the current set say Artifacts; the sixth layer's chip likewise reads Storage in that screenshot and Data on the live board. Needs his word before either moves. | 8.9 evening screenshot; board state |

### From 7.30 Principles Review 3

The second session of 7.30, later the same day. It restated the principles tighter, opened the foundational-against-applied division, and worked the straight line from sources to output. The raw doc is at `01 - Sources/02 - System Thinking/26.07.30 - Principles Review 3 - Raw Doc.md`.

| # | Raised by | What it actually is | Working labels in use | Why it needs work | Source |
|---|---|---|---|---|---|
| 1 | Buck | The five things over the cards, as against the controls proper. | vectors of output (now the board title, bracket-open); vectors of control / vectors of controls (floated, doubted, then "maybe it is"); mediums (informal use with outsiders) | "They're not controls, right? We have something else called controls." His standing ask for this one: have AI "think like a philosopher, like what in their essence are all of these things? How are they related?" | 7.30 PR3; FigJam board 7.30 evening |
| 2 | Buck | A division inside the Principles layer. | foundational principles; applied principles | Applied principles "could just become logic," and later "are they really even applied principles? They're like a blend of logic and process." Affects where several current principle candidates live. | 7.30 PR3 |
| 3 | Sal | The felt side of the structure built in a person's mind. | resonance, resonate | "It's like familiarity, like feeling something when you see all of this." Buck parked it: "We'll come back to that." | 7.30 PR3 |
| 4 | Buck | The organizing units a brand communicates across the journey, formerly topics and themes. | emotions and messages (replacing topics, themes) | Deliberate verbiage alignment with the five things: "It would be nice that we are using verbiage that is starting to come out of the woodwork of our base principles." The board summary now reads [emotions and messages] in brackets. | 7.30 PR3; FigJam board 7.30 evening |
| 5 | Buck | The logic that translates sources into controls. | control set logic, creative variables logic, "a certain logic that we call control set or creative variables or something" | The bridge named in both 7.30 sessions; its inputs got sketched (strategy docs, knowledge base, media repo, reference bank with commentary and analysis, expression docs, explorations and feedback) but the logic itself is unwritten and unnamed. | 7.30 PR3 |

**Open structural questions from the same session.** Where awareness and recognition sit, since they move people but may not be emotions ("I don't know where that comes in"). Whether structure-in-mind stands alone or combines with brand-lives-as-content. Whether brand-lives-as-content sits before or after brand as a relationship. Context now bracketed on the board by Buck's hand: part of the five in practice, underived from the principles above, "how context works in, we don't know."

### From 7.30 Principles Review 2

The 7.30 session worked the middle of the Principles run: the five-part content anatomy, language controls, and the split of brand-lives-as-content into its own principle. Buck reviewed the 7.29 queue capture in-session and said to keep capturing. The full critical review, including the order reversals and the board findings, is at `01 - Sources/02 - System Thinking/26.07.30 - Principles Review 2 - Critical Review.md`.

| # | Raised by | What it actually is | Working labels in use | Why it needs work | Source |
|---|---|---|---|---|---|
| 1 | Buck | The five-part anatomy of any output (visual, effect/emotion, explicit message, implicit message, context), claimed in-session as a principle that is also part of logic. | content building blocks; pentagram (placeholder); five vectors (rejected) | Buck: "I have no fucking clue what to call this." Sal's "building blocks of a content piece" got "Fucking exactly, Sal" but was not adopted. The board shell that holds the five cards sits unfinished at "[ Vectors of". | 7.30 lines 9, 113, 167, 185; FigJam board 7.30 |
| 2 | Buck | The theory that words now do the work of camera settings, software settings, and art director decisions, as against the levers themselves. | creative variables (theory lean); controls (levers lean); language controls (board pairing); categories, parameters, values (retired: "I really want to move away from that") | Continues the 7.11 Controls-vs-Control-Set open item in the same direction, still not closed. The board title still pairs "Creative Variables / Language Controls". | 7.30 lines 39-51; Theorized 7.11 section; FigJam board 7.30 |
| 3 | Buck | The token set that fills controls. | keywords, terms, phrases, snippets | "I think we want to stay away from snippets" said, then the four-word set used in the same passage. The Control Set entry carries keywords, terms, and phrases; the Expression document entry carries snippets; the code carries reference_prompt_snippet. | 7.30 lines 21-23; 7.14–7.17 section; Codebase 7.4 section |
| 4 | Buck | The second variable, formerly emotion. | effect; emotional effect; "effect slash emotion" | "I started calling it not emotion but effect. Because it doesn't necessarily always have to be emotional." Board card reads Effect / Emotion with sublabel Emotional Effect. | 7.30 lines 157, 509; FigJam board 7.30 |
| 5 | Buck | The message split and its concept end. | explicit message; implicit message; concept; meaning (board sublabel Implicit Meaning) | Buck asked for AI help articulating explicit against implicit, and floated "maybe these all have to be two words." The board's two-word card set is the current best articulation. | 7.30 lines 61-63, 97-103; FigJam board 7.30 |
| 6 | Buck | The fifth variable, context: its name and its level. | context; application context | Three placements taken in one session: a peer among the five, the frame that dictates the other four, and "could literally come in at the very, very end." Structural more than lexical. | 7.30 lines 61, 187-191, 845-847; FigJam board 7.30 |
| 7 | Buck | The content creation framework doc. | content creation framework | "this content creation framework doc, which we need a different name, is a principle." Both the name and the move from Logic to Principles are open. | 7.30 line 227; Theorized 7.11 section |
| 8 | Buck | The people side of the relationship. | people; audience; customers; world | Audience is reserved "later in content"; customers stays in the first strategy doc for sales reasons; "That's one of the naming things." The DRAPER word for the serviceable set (7.29 item 9) is still missing. ICP said in passing. | 7.30 lines 259-281 |
| 9 | review | The verb of the new brand-lives-as-content principle. | lives as; forms from; comes from | All three verbs are kept in the board title "Brand Lives/Forms/Comes From The Content That Reaches People"; the sentence has not been chosen. | 7.30 line 499; FigJam board 7.30 |
| 10 | Buck | The organizing step before visual representations. | communicating across time and organizing; the board list-title "People / Goal / Move / Emotional / Messages" | Buck named it only descriptively and said "Organize it. TBD" aloud; the board summary reads "TBD...." and the title is a list, not a name. | 7.30 lines 503-509; FigJam board 7.30 |
| 11 | Buck | The chosen combination that becomes the brand. | unique mix; unique emphasis; "UNIQUE, selected, weighted blend of messages and emotions (via visual representations)" | Continues 7.29 item 5 (the mood board level), restated brand-wide this session. | 7.30 line 811; FigJam board 7.30 |
| 12 | Buck | The former thematic visual representations principle. | none | "Which is not the name we're fucking sticking with." The rejection is now explicit where 7.29 item 4 recorded it as unsettled; no replacement has been started. | 7.30 line 7 |

**Open structural questions from the same session.** These are not naming items and do not resolve by naming.

- The order of the principles overall. The end-of-session run-through is the current working order, but language controls was placed first, then immediately before the pentagram, then ninth, all within one session, and Buck said "I'm not worried too much about the order for now."
- Whether the pentagram and the content creation framework come together in one logic block. Sal asked; Buck: "is that in logic?"
- Which direction emotion runs against messages and visuals. Both directions were stated and neither was withdrawn.
- Whether Core formally splits out of quality and consistency. The run-through gives consistency the step and moves core into the implicit/concept principle without stating the split as a decision.

**Related notes from the same session.** Buck asked twice for AI help: the explicit/implicit articulation, and the emotion-against-implicit crossing in the Hotel Perle example. Proposals for both are in the critical review in the Principles drafts folder. The board mock spells the brand "the HOTEL PERLE" while the transcript audio renders it Pearl; the designed mock is the stronger source, so Perle is the working spelling pending Buck. The run-through planes list is experiential, practical, social, emotional, values, identity, fear and risk (seven, per the board panel); the 7.9 record below carries four planes, and neither has been verified against the audience_planes foundational doc.

### From 7.29 Principles Review 1

The board section titled Thematic Visual Representations holds at least five separate things. Buck named the naming problem himself twice in the session: "I don't know what to call these" and "this is where lexicon becomes important."

| # | Raised by | What it actually is | Working labels in use | Why it needs work | Source |
|---|---|---|---|---|---|
| 1 | review | The pool of needs and wants read out of analyzing people across "these planes," before any choice about which ones the brand will lean on. | needs and wants for the pool; nothing for the selection step | Buck describes choosing from the pool without naming the act: "it almost gives you the set from which to choose from what you're going to emphasize, which comes later in communication." He said "these planes" in this session, not "audience planes"; the link to the recorded term audience planes is an inference. | 7.29 lines 111-121; Theorized 7.11 section |
| 2 | Buck | One thing the brand has to get across to move a person toward the objective. Can be information-based, which sends you to gather knowledge, or emotional and thematic, which sends you to hunt references. | topic, theme, emotion, idea, message, messaging pillar, individual message, subject matter | `message` and `effect` are two of the five Translation distinctions in the 7.15 shorthand. The 7.4 codebase survey records `visual_effect` and `emotional_effect` as Control Set fields. `theme` is used both in creative direction and in concept types, where one candidate is "a theme-led system." | 7.29 lines 133-147; 7.14–7.17 and Theorized 7.11 sections; Codebase 7.4 section |
| 3 | Buck | Those units gathered by like kind, so a knowledge gather or a reference hunt can be pointed at a group instead of at each unit. | grouping, cluster, theme, domain, narrative domain, thematic, topical | `domain` is in use elsewhere, and this lexicon carries two versions of where: the Theorized 7.11 section runs nuggets, entries, domains, while the Codebase 7.4 section runs nuggets, entries, kb_entry, Knowledge Base and flags these unit names as known breakage. The Sky Drift panel on the board reads "organized into the narrative domains." Buck's own bracketed note on the board doubts the fit: "do domains really map to the visuals well enough, i doubt it." | 7.29 lines 135-143; FigJam board 7.30; Theorized 7.11 and Codebase 7.4 sections |
| 4 | Buck | The set of representations that carries one communication item, across web, photo, graphics and the rest. | visual representation, thematic visual representation, visual representation set | The principle itself is currently titled with this unsettled term. Whether the set attaches to a single unit or to a group is unresolved; the referent at line 145 works either way. | 7.29 lines 129, 139, 145; FigJam board 7.30 |
| 5 | Buck | The combination chosen across all of a brand's groups, one scope up from item 4, which is what later gets built out into the brand. | unique mix, the mood board, moodboard level, chosen blend | Buck hedges it: "the mood board so to speak." Unresolved whether this is the same artifact as a concept package or a stage before one. | 7.29 lines 147-149; FigJam board 7.30 |
| 6 | Buck | The fifth of the six divisions: formatted saved artifacts and units of data as people and agents meet them on the front end. | Source, Structure, Source/Structure, Structure/Source | At the time, three names were live in three places. The lexicon said Structure, the project brief said Structure/Source, and Buck said Source/Structure in the session and asked "what do we call it?" His recitation of the six contained seven words: principles, logic, function, process, source, structure, storage. The current name is Artifacts. | 7.29 lines 3, 9; current set above; project brief |
| 7 | Buck | The single thing every brand decision traces back to, which keeps the team consistent and makes the brand's impression in a person coherent. | core, center core, center core creative direction, nut, insight, core concept | Already an open cluster from 7.9 and 7.10. The session adds "center core creative direction." Buck also put its placement in play: "maybe this should even be its own idea." | 7.29 lines 65, 77, 85; Theorized 7.11 section |
| 8 | review | The conversion a brand wants, the intermediate states on the way, and the subset said to apply to every brand. | overarching goal, objective, sub-goal, universal sub-goal | `overarching goal` and `objective` are both used for the top item inside one passage. For the universal subset he named awareness, liking, trusting, and knowing, then trailed off with "blah, blah, blah," so the list is open rather than four. Unresolved whether "universal sub-goals" names a fixed list or describes a pattern. | 7.29 lines 67, 95-99 |
| 9 | Buck | The slice of people a brand can realistically serve, as against everyone in the market. | none yet | Buck asked for a DRAPER word and has not got one: "It would be great to have like our word for this." On the finance vocabulary the group supplied (TAM, SAM, SOM) he said only that those are "more like revenue-y, business-y," so they are neither adopted nor ruled out. | 7.29 lines 101-105 |
| 10 | Buck | Three different kinds of node in the Process layer that currently share one representation. | step in a process, human action, AI action | Process is defined in this lexicon as steps taken by people, AI, or both, but the three kinds have no names and no distinct visual treatment. Buck: "These are different things." | 7.29 line 19; current set above |
| 11 | review | The fixed look assigned to each recurring system element so the same thing reads the same on every board. | design standards, Legend, design language | Three names across three documents for overlapping scope. The session says design standards, this lexicon says Legend, the project brief lists design language inside the FigJam tooling. Buck's assessment of the current state: "not good enough." | 7.29 lines 5, 19; current set above; project brief |

**Open structural questions from the same session.** These are not naming items and do not resolve by naming.

- Where the item 2 and item 3 machinery enters the process. Buck: "does that visual emotion context thing start as early as this in the process?" He is asking whether the thing carried here as `[Translation theory / Translation logic]` is the same machinery, entering far earlier than Logic currently places it.
- Whether the principles hold their current count and division. Buck: "what are principles? what their names are, how many of them they are, how we split them up. That's all up for debate." Two specific questions came up: whether Core splits out of the quality and consistency principle, and whether Brand As A Relationship should run second or first. The board titles and the spoken titles already differ on all four.

**Related notes from the same session.** The session used "controls focus filled cycled" as working shorthand; the 7.14–7.17 section records that name and those three state names as open. "Concept package" is in use, including in the project brief's reference to the Meseta concept-package run, and has no entry anywhere in this lexicon. The session said "the six levels" while this lexicon heads its list "Documentation layers" and the project brief says "six layers"; the two written documents agree with each other, so this is most likely speech rather than a position.

---

## Updated 7.14–7.17
*Latest working state from the Brand Concept, Brand Translation, Visual System, and System Documentation sessions. Items in brackets remain unsettled.*

**Source standing for this section:** The 7.14–7.17 calls record the current working discussion. `26.07.14 - Framework & Process` was worked with Buck driving and is not final. The additional 7.15 research and R&D documents have not been reviewed or approved by Buck, so they do not establish terminology or add entries here. They remain source material for later Logic sessions.

### Translation and controls

- **[Translation theory / Translation logic]**: a proposed five-part mapping that appears across reference commentary, reference analysis, grouping, concepting, art direction, and control-set writing. The five distinctions are real enough to keep working, but their names are not settled. The current questions are: what is visibly present; what it makes someone feel; what it directly says or is about; what else it communicates through association; and where or how it applies. The 7.15 shorthand `visual / effect / message / concept / context` records the working distinction only. None of those five words is current terminology.
- **Controls**: named levers of control that influence photography, compositions, graphics, and their subtypes through human language. Controls are separate from the logic that explains the available settings and what those settings tend to do.
- **[AD logic]**: the current name is considered wrong or incomplete. The thing itself runs from production type to control, from control to its axes or subcontrols, and from those to specific settings. Each setting needs documentation of what it is, what it looks like, and the effects, associations, and uses commonly tied to it.
- **Control Set**: the written application artifact. It is human-language direction containing keywords, terms, and phrases, plus the context needed to apply them. It is not a list of keywords.
- **[Control-set variation]**: the working model for completing a control set when recreating or developing a reference or expression. Controls may be **focused** by the user's commentary, **filled** from the brand's knowledge and media, or **cycled** from other references and expressions in the bank. The name and the three state names remain open.

### References, expressions, and exploration

- **Reference bank**: the gathered references. It is not the umbrella for expressions, generated outputs, and snippets.
- **Reference mapping**: one reference can produce one takeaway or several. Each takeaway can place the same reference under a different grouping.
- **Grouping tiles**: the current working groups for references and expressions. Identity uses logo marks, color palette, typography, photography, graphics, and layouts. Additional direction groupings are being tested around what something says, what else it communicates, and where it applies. Their names and boundaries are not settled.
- **Expression document**: a document that groups multiple references, and where useful explorations, into clearer direction on their source, interpretation, and use. Its working format includes a human-language write-up and the relevant keywords, terms, phrases, and snippets. The former names pottery doc and reference doc remain part of the naming history.
- **[Exploration as the umbrella]**: a 7.15 working theory that the larger area may contain references, expressions, mock-ups or other generated outputs, and snippets. This would leave reference bank as the references only. The umbrella name and the name for generated outputs remain unsettled.
- **High-volume exploration**: a distinct process step being documented through the Hotel Paisano case. The first round is materially different from later rounds. The first round tests references one idea at a time through controlled variation. Later rounds work from developed expressions and content concepts, test combinations, and move toward slower, more intentional production.
- **Round 1 / Round 2+**: working process distinction, not settled final names. Round 1 is reference-led. Round 2 and later are expression-led and content-concept-led.

### Concepting and creative direction

- **Concept type** and **concepting method** are separate questions. A concept type describes what kind of central creative construct the brand uses. A concepting method describes the actions used to find, test, and develop it. The 7.11 list mixed the two and should not be treated as a settled methods list.
- **[Concept type candidates]**: brand as an object, brand as a place, brand as a person, tension between two worlds, and a theme-led system. The list is incomplete and the names are not settled.
- **[Concepting methods]**: moving top down from an early seed and bottom up from produced work, testing one reference or idea at a time, producing at volume while holding directions open, identifying what keeps developing across rounds, and returning between the emerging concept and the work to test each against the other. This remains framework work, not a final process.
- **Device**: a design decision that carries meaning and can recur across the brand. A device can be one element, such as one kind of line used in one way, or an assembly of several elements. Not every retained design decision is a device, and not every decision needs to carry conceptual meaning.
- **Expression**: a formed direction, meaning a specific and named thing the brand does, synthesized from grouped references, any attached explorations, and the user's commentary on why. It exists before as well as during exploration: the 7.11 calls place expressions docs upfront after the reference gather and throughout the rounds, so exploration tests, develops, and sometimes finds expressions rather than originating them. Partial control coverage is part of the definition; per 7.11, a document that speaks to every control has become a brief for a specific implementation. Something earns the name when it recurs and the commentary on it is dense enough to name it specifically (7.15). The stated why behind each expression is what later concepting pulls up from (7.9, Skydrift). Still unsettled as a name and as an umbrella.

---

## Theorized 7.11
*Zoomed out over the whole system and pre-theorized it, before the big documentation effort. Not surveyed against code — this is the intended shape, and bracketed names are unsettled.*

One system, cut three ways and stacked: **Logic** on top, **Process** on the bottom, **Function** in the middle. A vertical tie links a process stage to the logic it pulls and the function that runs it. It is not a grid — a logic block can be pulled at several process points, or none.

### Process — the journey, in order
- **[Onboarding]** — prospect → intake → won → brand setup (the front already legged; "onboarding" is a loose placeholder).
- **Strategy** — customers, competitors, offering, positioning, messaging, content.
- **Sourcing** — gathering references, knowledge, and media.
- **Exploration** — high-volume exploration rounds.
- **Review** — feedback and selection passes.
- **Production** — the actual building of pieces.
- **Documentation** — the documentation agents.
- **Delivery** — handing the brand over.
- **Distribution** — putting content out.

### Logic — the block library
Little blocks pulled in by the skills and agents based on where you are in the process. Flat peers, no process-stage umbrellas — which is why there is no "Production" node here; that word is a Process stage only.
- **[Philosophy]** — the foundational beliefs: why consistency, how a brand forms in a person. The soapbox, dialed-in and usable. Not controls or keywords. *(src: Brand Principles Framework, pres slides 1–11, Adchitects, Core Principles, Michelle capture)*
- **[Methodology]** — the connective logic of the process: how each stage bleeds into the next. *(src: Full Process Runthrough, Tasha ×2, Michelle Citework, pres slides 12–17, Adchitects)*
- **[Controls]** *(was "creative variables")* — the idea that words are the levers; language is what makes the output. Genuinely unsettled whether "Controls" names this *whole* word-lever idea/philosophy or only *one part* of the framework; Buck floated going back to "creative variables." Held loosely — see the Controls-vs-Control-Set callout.
- **[Translation]** — the pentagram: the mapping between visual output ↔ words ↔ implicit message ↔ emotional effect. Exists because Controls do. Separate from Controls.
- **[Creative Direction]** — the conceptual layer: concept, themes, motifs, devices.
- **[Art Direction]** — how the direction executes per production type through the controls/Translation mapping: overview, controls, prod types, logic combos. Separate from Creative Direction.
- **[Content Concepting]** *(was "content ideation")* — deciding what content to make; the content-creation framework.
- **[Message Flow — name unsettled]** — building one piece: editorial outline → visual direction → copywriting → applied direction. Outline = the message/info + rough order, no application. Visual direction = what media, how/where + soft implementation ideas, not directives. Copywriting = copy. Applied direction = the dialed final pass, copy+message matched to direction piece-by-piece (web: section by section; slides: slide by slide).
- **[Production Prompting]** *(was "prompt writing")* — writing the generation prompts. Qualified "production" because prompting happens all over the system.

### Function — how it runs
The runners and the data — and, for every one, what it pulls in. That last part is the whole reason the Function effort exists: for every action in the system (agent, skill, command, back-end function), determine exactly what it should read and in what order, instead of every agent reading everything. So "what gets pulled in" is **not a peer node** — it's the through-line documented on each runner below.
- **Database (ERD)** — the data tables and fields.
- **Actions / commands** — every action the system takes: slash commands, API calls, back-end functions. The core unit; each is documented with what it pulls and in what order.
- **Skills** — [TBD].
- **Agents** — the main agent and sub-agents.
- **Context tray** — the surface where context for a production or exploration chat is assembled: modules = the tray-source keys (strategy, knowledge, media, references, components, identity, notes, explorations + the item-level keys), split into core context on top (strategy, knowledge, media, references) and production material below. It's one of the main things actions pull from. The *act* of building it up is a Process activity (Sourcing / Production) — the same Process↔Function tie as everywhere else.

*(Former "Context Selection" is dissolved — it was never a component, it was the question "what does this pull in?" asked of every runner above. That question is the point of the whole Function map.)*

### Flags from the 7.11 call (work items, not structure)
- The reference-capture analyzer may not use the AD logic; direction is to lock only the controls Buck calls out and leave the rest as variation space. Not verified against code.
- Controls and AD logic have gaps; the lower controls (styling, action, emotion) may never have been filled for at least one route. Not verified.

### Naming callouts from the recent calls (7.9–7.11)
Terms Buck floated, questioned, or flagged across the calls — recorded with the tension, not resolved. Dated by source; verify against the transcripts before relying on detail.
- **The concepting-term cluster (Buck's explicit "define that shit" list).** concept · anchor · content concept · thematic concept · visual device · brand device. He wants a concept principles/manifesto doc for these the way content creation got one. This cluster is the heart of the unsettled naming. (7.10 Erik–Buck)
- **The center — nut / core / insight / core concept / center core.** The central thing a brand traces back to (Skydrift = observation/documentation, a living ranch ledger). Buck: "nut," "core." Michelle/Tasha: "insight" (the school word); "nugget" floated and rejected. (7.9, 7.10)
- **Anchor / anchor device / core anchor.** A strong device or implementation you "plant" and build the brand out from (Skydrift: specimen label was the first anchor, then flat-lay, ledger, layout; map was surface-level; watercolor cut). Two open distinctions: (a) anchor devices vs supporting devices you don't anchor on but must stay compatible with (e.g. a gradient); (b) "core anchor" also used for a core *content type* you'll produce a lot of. Buck: "there's more to the schema, anchor versus whatever versus whatever." (7.9, 7.10)
- **Expressions (and their types) / expressions docs.** "Expressions" as the umbrella for what coalesces, with ≥3 types floated: brand expressions (logo, color, type, photography, layout, graphics — "what we used to call channels"), content-concept expressions (subject-matter, recurring important content), and conceptual expressions ("conceptual something — I don't know what to call it"). The doc that holds one = expressions doc (was pottery / reference doc); Buck: "maybe we just start calling them expressions docs again." Also floated: anchor / implementation / anchor visualization for the same territory. (7.10, 7.11)
- **The identity sections — channels / building blocks / blocks / tiles.** logo, color, type, photography, graphics, layout. "Channels" hated (crosses with communication channels); "building blocks" / "blocks" / "tiles" floated (the tile metaphor: any piece of content = an amalgamation of these tiles/layers). Must work across the whole system. Code: guideline sections, 9 keys. (7.9, 7.10)
- **Reference types / categories.** Whether references split into distinct types (a tiny-specific reference vs a broad one; a literal color-palette reference you wouldn't "recreate"), and whether references and expressions cross over. Undecided. (7.11)
- **Controls vs Control Set.** Two different things (Buck still working it out). **Controls** = the *idea* of word-levers — that keywords/terms/phrases are what make the output — though it's genuinely open whether "Controls" is the right name for that *whole* idea/philosophy or only for *one part* of the word-lever framework; "creative variables" (the earlier name) may come back. **Control Set** = the actual *written* artifact, and the documentation of how one gets written: a written control set that varies by production type and subtype, with a format nuance (human-language documentation filled with keywords/terms/phrases). How it ties together, one way: Translation logic → AD logic → the keywords/terms/phrases → that fill the written Control Set. (Separate point: the ~16-controls / only-4-6-called-out bit is about *filling* controls during reference recreation, not the Controls-vs-Control-Set distinction.) (7.11)
- **The reusable blocks — prompt library / skills / instruction blocks / principle blocks / sync blocks.** Modular blocks pulled into multiple prompts. Same idea as Logic-as-blocks. (7.11, echoing the 7.4 Paisano sync-block open question)
- **The design brief — expression brief / reference doc.** Buck: "I called it expression briefs, but it should be more." The packaged brief (media CDNs, knowledge chunks, outline, expression directives) handed to the coding agents. (7.11)
- **The concepting methods.** metaphor (Petty Ranch = family archive/ledger; Hotel Pearl = engineer's blueprint; Draper = phone exploding into brand-part chips) · tension (two juxtaposing sides — DealPage 80s-meets-new-tech) · amalgamation · theme-based · intention-led. Need naming and a home under Concepting. (7.9, 7.11)
- **The rounds — high-volume exploration / rounds / runs.** Two-to-four rounds trimming toward the concept; round one behaves differently (recreate references → expressions docs) than later rounds. Also called "production efforts or runs." (7.10, 7.11)
- **content concepts / content ideation / content creation.** Near-terms for the content-level concept work; the first auto-generated content concepts "are so whack they never get used." (7.11)
- **The strategy front — audience planes · process docs · nuggets/entries · narrative domains.** "audience planes" (audiences seen through emotional/social/values/identity planes) opens strategy; "process docs" are intermediate docs reached before each strategy doc; knowledge units run nuggets → entries (300–1000 words) → domains — reinforces the 7.4 nugget/entry/chunk breakage. (7.9)
- **Atlas grouping — section / directions section / layer / chapters.** "the directions section of the Atlas — I don't know if section is the right word." Ties to the 7.10 `layer`→chapters decision. (7.11)

---

## Updated 7.10
*Where we got to after the first couple documentation rounds (prospects & intake, won-transition) — the changelog off the 7.4 codebase. Decided by Buck in-session; not yet executed in code.*

- `clients` → **prospects** (the record is never a client during its active life).
- `client_intake_*` tables → **`intake_*`** (only prospects have intake).
- `status` + `intake_status` → a single **`stage`**: invited, in_progress, completed, won, lost.
- Intake synthesis + synthesis QC + full foundational-doc generation at intake → **First Read** (one doc, six sections: customers, competitors, offering, positioning, messaging, content).
- New table **`source_material`** on the brand (kind: intake / first_read / call) — what a brand is built from.
- `brand strategy` → **positioning**; `communications` → **messaging**; character/tensions/voice → moved out of strategy into **creative direction**.
- Brand Atlas grouping `layer` → **chapters** (strategy, direction, identity; libraries loosely a fourth).
- Owner concept **dead** — the creator becomes first admin; only the last-admin protection remains.
- The approve button dies; brand creation gets an optional **from-prospect picker** that sets brand_id + stage=won.
- Removed: qualification_answers, qualification_score, company, scheduled_call_date, the cleaned `transcript` copy, intake-link abuse fields (max_uses, use_count, revoked_at), client_intake_synthesis, client_foundational_docs, client_doc_chat_messages.

---

## Codebase 7.4
*What was in our system — in the codebase — as of 7.4. The system's own names, surveyed. Not a taxonomy; the layers are not parallel in size or kind, and layers may be missing. Enumerate from the cited file when working a layer.*

### The named layers
- **Native commands** (native-commands.ts): 16 slash values — strat-brief, know-search, media-search, ref-search, comp-search, id-search, photo-upper, photo-lower, graphic-upper, graphic-lower, comp-upper, comp-lower, control-prompt, production-log-round, plus the two turned-off legacy ones (control-set-upper, control-set-lower).
- **DB-authored slash commands** (draper_slash_commands): the Brand Atlas doc commands, the composition chain, copy, midjourney, the reference-doc commands, and the research commands. Each row carries response_mode (agent_integrated / send_to_main_agent / direct_response), handler_type, model, artifact_kind, is_active.
- **Runners**: the main agent, a stateless sub-agent via run_slash_command, a direct-writer path (direct-slash-command.ts, direct-response-stream.ts), and local app actions that never touch a model.
- **Tools** (*-tools.ts): ~32 registered tool names — tray, search, guideline, canvas, prompt, control-set, and pottery tools. Full enumeration is Survey work.
- **Tray source keys** (tray-source-types.ts): 21 keys, mixing module-level (strategy, knowledge, media, references, components, identity, notes, explorations) with item-level (kb_entry, media_entry, reference_entry, pottery_doc, guideline_item, atlas_section, canvas_generation, canvas_exploration, reference_component, reference_exploration, reference_prompt_snippet, custom_media, text_note).
- **Control Set** (control-sets/types.ts): levels (upper, lower), routes (photography, graphics, composition), controls whose fields are active_direction, what_to_do, visual_effect, emotional_effect, plus confidence, ad_logic_refs, tested_snippets, status, schema_version, render_mode.
- **Production Log** (production-log/types.ts): rounds, with round_number. No run or branching container exists in code.
- **Editable instruction prompts** (prompts.ts, EDITABLE_INSTRUCTION_PROMPT_SLUGS): 21 slugs — core identity/rules blocks, control-set agents, compilers, production-log agent. Text blocks in ai_prompts, fetched by slug at runtime; multiple commands pull the same block. Not commands.
- **Turn policy** (turn-policy.ts): a large set of per-turn context classifications (canvas_prompt_only, control_set_revision, copy_only, direct_visual_answer, and many more). No agreed human name yet.
- **Guideline sections** (092_guidelines.sql): nine keys — logo_mark, color_palette, typography, photography, graphics, layouts, devices, directions, components.
- **Foundational docs** (foundational-docs.ts): 14 doc types from audience_planes through core_media, each with a prompt slug, a slash value, and declared input dependencies.
- **Knowledge pipeline** (prompt export group 02, worker code): nugget extraction through entry drafting; the unit names are inconsistent across stages (see naming breakage).

### Known naming breakage
1. **Pottery vs Reference Docs** — code says pottery (search_pottery_studio, read_pottery_doc, pottery_doc, /api/pottery/upload); UI says Reference Docs (three capitalizations). One thing, two vocabularies.
2. **Guidelines vs Identity** — data layer says guidelines; product surface says Identity; identity is also a tray key and id-search a command. One word at three levels.
3. **The foundational doc set** has carried three names: foundational docs (code), Brand Atlas docs (product), Build Agents (retired admin grouping); admin now files them under Strategy.
4. **Exploration** means at least three things: explorations, canvas_exploration, reference_exploration (distinct tray keys), plus "Production Explorations" in Buck's language. One concept at different levels, or different concepts sharing a word — undecided.
5. **Knowledge units** change name across the pipeline: nuggets (extraction) → entries (planning/drafting) → kb_entry (tray) → Knowledge Base (product). The Notion lesson (nugget rejected, chunk chosen) not applied here.
6. **Strategic Brief** exists as two live texts — the slash-command card (edited 7/3) and the ai_prompts row the runtime executes (edited 6/21). Drift inside one name; can recur wherever a command card and its backing prompt are edited separately.
7. **Control-set commands exist twice** — the turned-off control-set-upper/lower (backing draper_control_set_agent prompt) and the current per-route commands (photo-upper, etc.). The legacy pair still sits in code and DB.

### Buck's flagged separations (7.4)
Distinctions noted while walking the Sal-Blend map. Not proposals for where lines sit.
- Brand Build vs Production (a.k.a. Content Creation).
- Strategy vs Direction.
- Client Intake vs Asset Intake vs Knowledge Intake (media and reference assets under the intake area).
- Context Build vs Prod Flow.
- Output format — proposal card, prompt card, HTML under it; draper_visual_prompt_output_contract governs output shape, not prompt writing. Flagged candidate, not a named category.
- The reference/analysis commands: ref-doc-edit, ref-doc-write, ref-anal, AD anal.
- Rule blocks.
- Open, undecided: whether common shared blocks should be broken out and pulled in via sync blocks (multiple commands already pull the same ai_prompts blocks by slug). Raised again on 7.11 as a possible prompt library — skills / instruction blocks / principle blocks called into multiple prompts.
