# Visual Rules

The visual standard for GrocerBot's documentation in the GrocerBot System Docs Figma file. Written 2026-09-06 by re-basing DRAPER's rules onto GrocerBot's four levels. Two sources: the live DRAPER legend as read that day, recorded in `Live Legend Read 26.09.06.md`, and DRAPER's 8.12 written standard, now at `03 - Example/Visual Rules (DRAPER 8.12).md`. Where the two disagreed the live file won. Where GrocerBot differs from DRAPER, this document says so and the reason.

This document and the GrocerBot System Legend page are meant to say the same thing. The legend page was built on 2026-09-06 from this document; node ids are in `04 - Build/26.09.06 - Part 1 - Vendor Portal Monitoring/Build Log.md`. Where they disagree one of them is wrong and the difference gets recorded, not papered over.

The levels are **Principles**, **Process**, **Piping**, and **Data**. There is no Functions or Logic level. Artifact is a piece within Process.

## 1. Color tokens

Every colour on a board or sheet comes from the `Colors` variable collection. Nothing is picked by eye. Levels carry three values: the colour, an outline tint at 12 percent for container edges and badge fills, and a fill tint at 4.5 percent. Acts carry two: the colour, which tag outlines take directly, and a fill at 10 percent. A badge fills with its colour's outline-tier value and sets its text in the colour.

**Core**

| Token | Use | Hex |
| --- | --- | --- |
| Core/Background/White | sheet canvas, card bodies | `#FFFFFF` |
| Core/Background/Container | tinted panels, tiles | `#FBFBFB` |
| Core/Text/Headlines | titles, names, Ink | `#1A1A18` |
| Core/Text/General | body, captions, muted | `#8C8C8B` |
| Core/Border | hairlines, card edges | `#D9D9D5` |

**Levels**

| Level | Colour | Outline | Fill | Note |
| --- | --- | --- | --- | --- |
| Principles | `#E96B0C` | `#FBE9DC` | `#FEF8F3` | carried from DRAPER's Principle sheet; tints computed at 12 and 4.5 percent and not yet a variable |
| Process | Ink | none | none | Process has no hue; its pieces carry their own colours |
| Piping | `#6F4E27` | `#EEEAE5` | `#F9F7F5` | doubles as Route |
| Data | `#D83A9A` | `#FAE7F3` | `#FDF6FA` | |

Retired from DRAPER: Functions teal `#2F8278`, Logic purple `#6D35E9`. Nothing in GrocerBot wears them. The Artifacts blue `#1764C0` survives as the Artifact piece colour within Process and as the Output and Create acts.

**Pieces within Process**

| Piece | Colour | Fill | Note |
| --- | --- | --- | --- |
| Actor, human | Ink | none | internal solid ring, external dotted ring |
| Actor, agent | `#B0512E` | `#F7EEEA` | ruled in the live file |
| Interface | Ink | none | the mockup carries the platform's own look; the Location mark says where |
| Artifact | `#1764C0` | `#F5F8FC` | the old Artifacts level colour, kept for the piece |

**Acts** (the Operation tag colours)

| Act | Meaning | Colour | Fill |
| --- | --- | --- | --- |
| Action | a human acts | `#4C9A57` | `#EFF7EA` |
| Trigger | an event fires machinery | `#C47D62` | `#F9F0EE` |
| Write | a record is being written | `#A87716` | `#FCEDCC` |
| Create | something comes into being | `#1764C0` | `#E8EFF9` |
| View | read only display | `#8C8C8B` | `#F4F4F3` |
| Route | a no-run piping hop, dashed | Piping `#6F4E27` | `#F9F7F5` |
| Output | a run delivers its result | Artifact `#1764C0` | `#F5F8FC` |

DRAPER's eighth act, Voice, the user giving commentary, has no GrocerBot equivalent and is dropped.

**Logotypes.** Product colours, quoted, never system tokens. GrocerBot's set is built when the Locations sheet is built: Discord, Cloudflare, Faktory, Redis, PostgreSQL, GitHub `#101411`, Clover, Ben E. Keith, OpenObserve, DigitalOcean. Each mark is the platform's own vector at its own colour; never redrawn from memory.

## 2. Typography

The nine local text styles in the file. Build with the styles, never with raw sizes. Reading face Inter, technical face Source Code Pro.

| Style | Font | Size | Line | Tracking | Case | Job |
| --- | --- | --- | --- | --- | --- | --- |
| Sheet Title | Inter Medium | 32 | 44 | -2% | Title | the name of a documentation sheet, once per sheet |
| Section Title | Inter Medium | 20 | 26 | -2% | Title | a major group inside a sheet |
| Piece Shell | Inter Semi Bold | 16 | 20 | -1% | Title | one documented token, rule, or construction |
| Piece Title | Inter Semi Bold | 14 | 20 | -1% | Title | the name of a piece on its shell on a board, in Ink |
| Body | Inter Regular | 12 | 16 | 0 | sentence | all prose; muted General grey when secondary |
| Tag | Inter Semi Bold | 12 | 16 | +8% | UPPER | a short label that classifies rather than names: column headers, the location on a piece, a designation |
| Name | Source Code Pro Medium | 12 | 16 | +8% | UPPER | anything the system owns as a name: panel names, eyebrows, reference labels |
| value | Source Code Pro Medium | 12 | 16 | -2% | literal | anything the system owns as a value: capsule labels, field names, types, formats |
| Eyebrow | Source Code Pro Medium | 10 | 14 | +8% | lower | the caps id line at the top of cards and sections; never for reading text |

The DRAPER Typography sheet's prose gives Sheet Title as 40 and Section Title as 24; the bound styles say 32 and 20. The styles win because instances bind to them.

## 3. Layout tokens

The spacing rhythm of every card, as number variables in the `Layout` collection. Bind paddings, gaps, and radii; never type raw numbers.

| Token | Value | Where |
| --- | --- | --- |
| Card/Radius | 4 | the card shell corner |
| Card/Body Padding | 24 | shell edge to body blocks |
| Card/Gap | 12 | between blocks in a card body |
| Card/Header Padding | 16 | inside the header band, around the tool mark |
| Panel/Padding | 12 | inside every tinted panel |
| Panel/Gap | 12 | between rows inside a panel |
| Panel/Radius | 4 | the panel corner |

Hairlines are 1 px in Core/Border. Sharp corners at radius 4; nothing rounder except the Record pill and the Actor ring.

## 4. Pieces and their treatments

What each kind of thing looks like. The legend page holds one source list per family; boards use instances and never redraw.

**Actor.** A ring with a figure inside and a designation tag under it. Type Human or Agent: humans take Ink, the agent takes terracotta with a robot glyph. Organizational boundary: a solid ring for inside GrocerBot, a dotted ring for outside. Designation is one tag with the role, stage, or title, referenced from a set. GrocerBot's designations so far: Operator, Store staff, Buyer for internal humans; Vendor for external; Scheduler, Worker, Browser worker, Notifier, API, Init, Email worker, Core for agents. External systems that act, the BEK portal, Clover, Discord, are External Tool cards, not actors, unless they initiate something, in which case they get an external ring.

**Operation.** A square tag: something the system does, stated as a verb, in the colour of its act. The label is one short active statement in the Name style, such as POLLS NOTIFICATIONS, DIFFS AGAINST SNAPSHOT, PUBLISHES ENVELOPE. Operations ride the Process rail on a line, one per step, and sit in card panels to state what a step does. The seven acts are in section 1. Ruled by Sam 2026-09-06 over Connection and Action; the rail line itself is a line, not a piece.

**Interface.** A card on the rail where a human sees or does something. The Location mark top right says the platform; the body is a concrete abstracted view of the surface: real region names, quiet bars for content, real media only where media is the point. GrocerBot's interfaces are Discord channels and embeds, the two CLIs, the Faktory web UI, the OpenObserve dashboards. A terminal surface is drawn as a dark panel with a prompt line and the command; that convention is new here and marked open.

**Artifact.** A card on the rail for something a step produced, in Artifact blue: a Discord message with its thread, a PDF, a CSV, a canonical document, a plan report. Fresh one per run. It wears the Location mark of where it lands.

**Record.** A round pill: a registry row by name, wearing the colour and icon of the level it points at. Pink for a Data table, brown for a Piping unit, blue for an Artifact. A pill carries `table › key` or `unit name` and nothing else. In an INPUTS or OUTPUTS panel, records are numbered in read order. The pill and the card are the same row at two zoom levels.

**Card.** The expanded piece. One skeleton, chrome only: a header band with the tool mark top right, an icon and title row, a description container. The body is assembled from Card Blocks and nothing else. GrocerBot's card types:

- **Piping card.** A runner, a router, a config unit, a queue, a plugin, a bootstrap. Brown outline, GitHub mark for code, the platform mark for a hosted piece such as Faktory or the Cloudflare Worker. Body: SPEC paragraph, then INPUTS, OUTPUTS, or READS and WRITES panels of records. DRAPER's Draper Harness and Router cards are the shape.
- **Data card.** A table or a row. Pink outline, the store's mark (PostgreSQL, Redis, R2). A ROW or TABLE tag right of the title states the grain. A TABLE card fills its body with the Table Components block: a header row, one row per field with FIELD, TYPE, THIS ROW, a changed row wearing the dot, and a WRITE or READ tag naming who touches it. A ROW card shows the row's id in the Eyebrow and nothing else there.
- **External Tool card.** A platform outside GrocerBot: dotted shell, the platform's own mark, no type icon. BEK portal, Clover, Discord, Cloudflare.
- **Agent card.** A named process when it needs a body, such as the notifier with its routes. DRAPER's Mr Draper card is the shape; GrocerBot may not need it if Piping cards carry the processes. Open.

**Tags.** A tag is a small filled fact: no outline, no pointer. Change Tag (a change within a data field), Data Action Tag WRITE and READ, Data Grain Tag ROW and TABLE, Code block (a code excerpt inside a card), Color Tag (designations, ids, states). Outline only for neutral notes on routes.

**Location.** A platform the system runs on: its mark is a logo and a name, no box, stating a fact about the piece it sits on, one mark per piece, top right. Transfer Mark: two marks and one arrow for data crossing a platform boundary. Multi-Tool: marks joined with a plus when one piece runs on more than one platform.

**Icons.** One icon per family, in two shells: Square for Operation tags and card title rows, Rounded for Record pills. Same picture, two shells. One controlled family, never Unicode, never mixed.

**Principle.** A sheet on the legend page: name, one plain statement, a divider, then prose that teaches the rule, then a divider and a real example from the code. On boards a principle appears as an orange Record pill on the piece it governs.

## 5. Data conventions new to GrocerBot

DRAPER's Data level was tables in Supabase. GrocerBot has three stores. The Data card covers all three with the store's mark; the grain tag and the field table adapt:

- **Postgres table.** TABLE or ROW card, PostgreSQL mark, field table as above.
- **Redis key.** A ROW card with the Redis mark. The key pattern is the first row of the field table, typed `string`, with the placeholder segments in braces, such as `unique:vendor.poll:{sha256(args)}`. Further rows carry the value, the TTL in seconds, any companion key, and how the key is released. WRITTEN BY and READ BY name the code paths.
- **Redis stream.** A TABLE card with the Redis mark. The description names the stream and its consumer group; the field table lists the envelope fields.
- **R2 object.** A ROW card with the Cloudflare R2 mark. The field table carries the object, the bucket, the cipher, the writer, and the reader.

Drawn this way on the Part 1 board on 2026-09-06, which moved the key pattern out of the Eyebrow and into the table so the description could say what the key is for. Pending Sam's approval with the rest of the board.

## 6. Board composition

A board is one frame per part on the VISUAL DOCUMENTATION page. Frames sit inside a section per part group if grouping is needed; Part 1 alone needs no section. A Global frame at the left of a section holds machinery every part shares.

Lanes, top to bottom, per the live DRAPER boards:

1. **Process rail.** A horizontal line. Actor rings where someone acts, Operation tags riding the line for each step, Interface and Artifact cards standing on the rail where a human sees something. Sequence reads left to right at every altitude; a vertical chain of sequential steps is a defect. Branches drop below the rail and rejoin.
2. **Piping cards.** Under the rail, one card per code unit the steps above run through, aligned under the step it serves.
3. **Data cards.** At the bottom, one card per table, key, stream, or object the part reads or writes, aligned under the step that touches it.
4. **Dotted vertical ties** from a rail piece down to its card, and from a Piping card down to the Data it writes. Arrowless. Direct vertical when centres align.

Principles appear as pills on the pieces they govern, not as a lane.

Route only on the orthogonal grid: horizontal and vertical shafts, hard corners, midpoint ports, no crossings, open line of sight. Whitespace marks chapters and branches, never random gaps. Do not spread items evenly across a large canvas; widen only where a dense cluster needs it.

## 7. Working versus final, and release checks

A working board may show explanations, open decisions, bracketed names, and TBD badges. A final board shows only the approved encoding and the minimum text to identify each real piece. Nothing working becomes final until Sam has approved semantics, visuals, and the checks below, as three separate decisions.

Release checks, all inspected from fresh screenshots:

| Check | What it covers |
| --- | --- |
| Geometry | dimensions, radius 4, hairlines 1 px, paddings from the Layout tokens, midpoint ports |
| Fidelity | current piece treatments, registered marks, real content in mockups |
| Legibility | readable at native and at review scale; no clipped or truncated text |
| Semantics | every label has a job; no invented properties or unsupported relationships |
| Routing | orthogonal, no crossings, no hidden segments, ties start from the right piece |
| Editability | every text, shape, line, and mark is directly selectable; no flattened imports; no sealed frames |

Flow checks before approval: the whole part is understandable in about ten seconds; start, clusters, and end are obvious; no unexplained gap between cause and result; every human action has an actor; every visible source and target is clear.

## 8. Open items

1. Ruled 2026-09-06: the tag is an **Operation**. Kept for history.
2. **Principles level tints** as variables, and whether Principles get a legend sheet each or one sheet listing seven.
3. Drawn without one on the Part 1 board, 2026-09-06: the running processes are Agent actors on the rail and Piping Runner or Router cards below it; no Agent card exists. Open until Sam approves the board.
4. Drawn on the Part 1 board, 2026-09-06: a CLI interface is a dark Code block with an Eyebrow naming the surface, such as `OPERATOR TERMINAL · GBO`, and one command line. Open until Sam approves the board.
5. Drawn on the Part 1 board, 2026-09-06, as section 5 now describes. Open until Sam approves the board.
6. **GrocerBot's Locations source list** and logotype colours.
7. Ruled 2026-09-06 on the Part 1 board: the rail carries only the steps that change what the store knows; bookkeeping steps (locks, audit rows, workflow runs, dedup registration) are Operation fields inside the Piping or Data card that performs them. That is the Process versus Piping boundary for machinery steps. Kept for history.
8. **Whether the canonical event envelope is an Artifact or Data.** Lexicon queue item 6. On the Part 1 board the events stream is a Data card and the Discord ops alert is the only Artifact.
9. **Grain badges for keys, streams, and objects.** The Change Tag set has only ROW and TABLE, so Redis keys and the R2 object carry ROW and the stream carries TABLE. A KEY, STREAM, or OBJECT variant would need a new component.
10. **The principle pill has no variant of its own.** On the Part 1 board and the Principles sheet it is a Color Tag, Orange variant, with its fill rebound to `Levels/Principles/Outline` and its text to `Levels/Principles/Color`. A dedicated Principles variant in the Color Tag set would remove the per-instance rebinding.

## 9. What this document replaced

DRAPER's 8.12 written standard, now at `03 - Example/Visual Rules (DRAPER 8.12).md`. Its ten sections were written for the FigJam board and a six-level system. Its type ladder (48, 28, 17, 14, 12), its geometry (radius 2 to 3, 64 px margins, 1744 px sheets), its pill shape with level-code badges, its Connections with five types, and its Board sync and Open items lists are history. Its build discipline survives unchanged in `Instructions.md`.
