# Live Legend Read, 2026-09-06

What the GrocerBot System Docs Figma file held when it was first read through the Figma MCP on 2026-09-06, recorded so the written rules can be re-based on it. The Figma Brief's 8.25 caveat said the live file was ahead of the written rules; this is the first written record of by how much.

File: `https://www.figma.com/design/nBmhDyEDpFPrMq0ztmHDb0/` (file key `nBmhDyEDpFPrMq0ztmHDb0`), a copy of the DRAPER System Docs file, editor type design, owned by Sam's Starter team.

## Pages

| Page | Node | Children | What it is |
| --- | --- | --- | --- |
| SYSTEM LEGEND | `7001:129072` | 0 | GrocerBot's legend. Empty. |
| SYSTEM REGISTRY | `7001:129073` | 0 | GrocerBot's registry. Empty. |
| VISUAL DOCUMENTATION | `7001:129074` | 0 | GrocerBot's boards. Empty. |
| `----` | `2929:1762` | 0 | separator |
| Ex Systrem Legend - DRAPER | `2043:2` | 23 | the live DRAPER legend, the source of everything below |
| Ex System Registry - DRAPER | `2800:440` | 35 | the DRAPER registry: charter, entry format, per-level lists and card rows |
| Ex Outputs - DRAPER | `2667:1647` | 3 | three sections, Phase I, II, III, each holding one frame per leg plus a Global frame |
| `---` | `2929:5476` | 0 | separator |
| `.` | `12:242` | 0 | empty |

The Figma MCP on a Starter plan allows twenty read tool calls per month. This read used them. Every fact below came from that budget: one page listing, page metadata, nine screenshots, and four read-only scripts.

## Local variables

Five collections. The `Colors` collection is the live token set. `Primitives` and `Tokens` are a brand palette for DRAPER's own product, not for documentation, and do not carry over.

**Colors, Core**

| Token | Hex |
| --- | --- |
| Core/Background/White | `#FFFFFF` |
| Core/Background/Container | `#FBFBFB` |
| Core/Text/Headlines | `#1A1A18` |
| Core/Text/General | `#8C8C8B` |
| Core/Border | `#D9D9D5` |

**Colors, Levels.** Each level carries a colour, an outline at 12 percent, and a fill at 4.5 percent. The Color Tokens sheet says: "Piping doubles as Route and Artifacts doubles as Output: a tag or pill takes the colour of what it points at. Process fell into Ink."

| Level | Colour | Outline | Fill |
| --- | --- | --- | --- |
| Piping - Route | `#6F4E27` | `#EEEAE5` | `#F9F7F5` |
| Function | `#2F8278` | `#E6F0EF` | `#F5FAF9` |
| Logic | `#6D35E9` | `#EDE7FC` | `#F8F6FE` |
| Artifacts - Output | `#1764C0` | `#E3ECF7` | `#F5F8FC` |
| Data | `#D83A9A` | `#FAE7F3` | `#FDF6FA` |

No Principles level colour is in the variables; the old Principle sheet in the "old more documented" frame uses orange `#E96B0C`. No Process level colour exists; Process is Ink.

**Colors, Acts.** Each act carries a colour and a fill at 10 percent. "Create is a form of Output and wears the Output blue. Output and Route themselves live with the levels."

| Act | Colour | Fill |
| --- | --- | --- |
| Trigger | `#C47D62` | `#F9F0EE` |
| Action | `#4C9A57` | `#EFF7EA` |
| Write | `#A87716` | `#FCEDCC` |
| Create | `#1764C0` | `#E8EFF9` |
| Read - View | `#7E7E7C` in the variable, `#8C8C8B` on the sheet | `#F4F4F3` |

**Colors, Actors.** Agent `#B0512E`, fill `#F7EEEA`. The terracotta the written rules had as proposed is ruled in the live file. Humans take Ink.

**Colors, Logotypes.** Supabase `#3ECF8E`, Github `#101411`, Draper App `#4C7FE0`. Quoted product colours, never system tokens.

**Layout**

| Token | Value |
| --- | --- |
| Card/Radius | 4 |
| Card/Body Padding | 24 |
| Card/Gap | 12 |
| Card/Header Padding | 16 |
| Panel/Padding | 12 |
| Panel/Gap | 12 |
| Panel/Radius | 4 |

## Local text styles

| Style | Font | Size | Line | Tracking | Case | Job, per the Typography sheet |
| --- | --- | --- | --- | --- | --- | --- |
| Sheet Title | Inter Medium | 32 | 44 | -2% | Title | the name of a documentation sheet, once per sheet. The sheet text says 40 px Inter 600; the style says 32 Medium. |
| Section Title | Inter Medium | 20 | 26 | -2% | Title | a major group inside a sheet. Sheet text says 24 px Inter 600. |
| Piece Shell | Inter Semi Bold | 16 | 20 | -1% | Title | one documented token, rule, or construction |
| Piece Title | Inter Semi Bold | 14 | 20 | -1% | Title | the name of a piece on its shell on a board, in Ink |
| Body | Inter Regular | 12 | 16 | 0 | sentence | all prose; muted when secondary. Sheet text says 18 line. |
| Tag | Inter Semi Bold | 12 | 16 | +8% | UPPER | a short label that classifies rather than names |
| Name | Source Code Pro Medium | 12 | 16 | +8% | UPPER | anything the system owns as a name |
| value | Source Code Pro Medium | 12 | 16 | -2% | literal | anything the system owns as a value |
| Eyebrow | Source Code Pro Medium | 10 | 14 | +8% | lower | the caps id line at the top of cards and sections |

The sheet text and the styles disagree on the two title sizes and on body line height. The styles are what instances bind to; the sheet text is prose. Record both, build with the styles.

## The legend's inventory

The 23 top-level nodes of the DRAPER legend page, what each defines, and whether it carries over to GrocerBot.

| Frame | Node | Defines | Carries over |
| --- | --- | --- | --- |
| Layout Tokens | `4398:2176` | the seven layout variables above | yes, unchanged |
| Colors | `4021:3170` | the token sheet above | yes, re-cut for four levels |
| Typography | `3112:635` | the nine styles above | yes, unchanged |
| Locations | `4254:1768` | a Location is a platform the system runs on; its mark is a logo and a name, no box; a source list of variants; Transfer Mark (two marks, one arrow, data crossing a boundary); Multi-Tool (marks joined with a plus) | the mechanism yes; the marks are DRAPER's (Supabase, GitHub, Draper app, WhatsApp, Notion, Gmail, HyperAgent, Cloudflare, Calendly, Zoom, ReadAI, Mercury, Pinterest, PandaDoc, Resend, Midjourney, Figma, Nano Banana) and GrocerBot needs its own |
| Operations | `4264:1005` | an Operation is a square tag: something the system does, stated as a verb; colour is the act; seven tags: ACTION a human acts, TRIGGER an event fires machinery, WRITE a record is being written, VIEW read only display, ROUTE a no-run piping write (dashed brown), OUTPUT a run delivers its result (blue), VOICE the user gives commentary; the label is one short active statement | yes; this is the live word for the links inside Process |
| Records | `4265:1885` | a Record is a round pill: a registry row by name, wearing the colour and icon of the level it points at; a pill carries `table › key` and nothing else; in an INPUTS panel records are numbered in read order | yes; GrocerBot's records point at Data, Piping, and Artifact rows |
| Card Blocks | `4276:1981` | the parts a card is assembled from: Container Title, Description Container, Text Container, Closed Container (a state outside the current route), Operation Reference, Container Fields (six value types), Table Components (header, row, changed row with dot, description) | yes, unchanged |
| Icons | `4279:8814` | one icon per family in two shells, Square for Operations and card title rows, Rounded for Records; icons for Audience Planes, Mr Draper, Harness, Router, Logic, Data, Action, Trigger, Create, View, Piping, Voice, External | the mechanism yes; the set needs GrocerBot's members |
| Tags | `4279:9060` | a tag is a small filled fact: Change Tag, Data Action Tag WRITE and READ, Data Grain Tag ROW and TABLE, Code block, Color Tag | yes, unchanged |
| Actor | `4295:9771` | Type Human or Agent; Organizational Boundary Internal solid ring or External dotted ring; Designation as a tag under the ring; an Actor Source of three variants: internal human blue ring, external human grey dotted, agent terracotta | yes; GrocerBot's designations are its own |
| Card Skeletons | `4164:5904` | one skeleton per card type, chrome only: tool mark top right on a header band, icon and title, description; types Function, Mr Draper, Draper Harness, Router, Logic, Data, External Tool; Data and Logic have a with-tag variant | the skeleton yes; GrocerBot's card types are Piping, Data, External Tool, and possibly Agent |
| Card - Function | `4315:12217` | a registry row that runs | no; no Functions level |
| Card - Logic | `4331:1380` | a registry row a Function reads | no; no Logic level |
| Card - Data | `4331:1513` | a registry row of stored data; ROW or TABLE grain; a TABLE card fills its body with the Table Components block | yes |
| Card - Mr Draper | `4331:1654` | the agent's card, not a registry row, lives in the Draper App | the shape yes, for a named agent process if one is drawn as a card |
| Card - Draper Harness | `4331:1745` | the runner's card: code, not a registry row, lives in GitHub | yes, as the Piping card for a code runner |
| Card - Router | `4331:1837` | the code that hears a trigger and picks what fires, lives in GitHub | yes, as a Piping card; GrocerBot's notifier and scheduler are routers |
| Card - External Tool | `4341:1283` | a platform outside the system: the mark alone states what it is, dotted shell | yes |
| old more documented | `4196:6750` | the 8.12-era piece sheets, one frame per level: Principle Level, Process Level (Actor, Interface, Artifact, and the connection types Action, Trigger, Output, View), Piping Level ("Execution layer that moves, transforms, or synchronizes information between pieces"), Function Level, Logic Level, Data Level; each with Anatomy, Properties, Mockup | the Principle, Process, Piping, and Data sheets are the shape for GrocerBot's level sheets |
| Output, two stray text nodes, a vector | `4021:3780`, `4335:12863`, `4335:12864`, `4219:7366` | leftovers | no |

## The legend's components

The source lists are component sets, so GrocerBot's legend can start by cloning them and pruning DRAPER-only variants rather than redrawing.

| Component set | Node | In | Variants | Properties |
| --- | --- | --- | --- | --- |
| Tools | `4021:1869` | Locations | 19 | Tool: Supabase, Github, Draper, WhatsApp, Notion, Gmail, Hyperagent, Cloudflare R2, Calendly, Zoom, ReadAI, Mercury, Pinterest, PandaDoc, Website, Resend, Midjourney, Figma, Nano Banana |
| Connections | `4021:3673` | Operations | 9 | Text; Connection: Write, Action, Trigger, View, Output, Route, External, Voice, Secondary |
| Function (the Records pill) | `4021:3951` | Records | 5 | Text; Type: Function, Output Data, Data, Logic, Output General |
| Icons | `4021:3852` | Icons | 28 | Type: Audience Planes, Draper, Harness, Router, Logic, Data, Action, Create, Trigger, View, Pipe, Voice, Function, External Tool; Style: Square, Rounded |
| Actor | `4301:10662` | Actor | 3 | Name; Actor: Internal Human, External Human, Agent |
| Color Tag | `4164:5197` | Tags | 9 | Text; Color: Blue, Purple, Brown, Grey, Green, Pink, Yellow, Orange, Outline |
| Change Tag | `4126:5164` | Tags | 2 | Type: Write, Read |
| Change Tag (grain) | `4164:5176` | Tags | 2 | Type: Table, Row |
| Container Field | `4021:4043` | Card Blocks | 7 | Name, Notes, Number, Value; Type: Plain Text, Operation, Secondary Operation, Number, Tool, Record, Record and Tag |
| Table Components | `4335:13326` | Card Blocks | 4 | Field, Type, This row, Description; Type: Row, Header, Changed Row, Description |

Standalone components: Multi-Tool Location `4335:12959`, Change Tag `4126:5152`, Code block `4279:9769`, Container Title `4021:2485`, Description Container `4021:2477`, Text Container `4114:4213`, Closed Container `4164:6378`, Operation Reference `4307:10931`. The card skeletons are frames, not components.

Note the split inside the live file itself: the sheet is titled Operations, the component set is named Connections with a property named Connection, and its nine variants include two, External and Secondary, that the sheet does not list.

## The example boards

`Ex Outputs - DRAPER` holds three sections named Phase I, II, III. Each section holds one frame per leg (`PI - Leg I` through `PI - Leg VIII`, `PII - Leg I` through `PII - Leg VII · Packaging`, `PIII - Leg I · Reference Query` through `PIII - Leg VI · Knowledge`) plus a `Global` frame at the left for machinery every leg shares. Frames run 6,000 to 38,000 px wide.

`PI - Leg I` (`7001:95297`, 6240 by 4895) reads like this, top to bottom:

1. **Process rail at the top.** A human actor circle at the far left, then operation tags riding a horizontal line (VISITS WEBSITE, SUBMITS WEB FORM, ADDS LEAD TO EMAIL LIST, WRITES FORM SUBMISSION TABLE, WRITES FORM ANSWERS TABLE, CREATES NOTION DATABASE ITEM, ITEM CREATED, WRITES SCORE TO RECORD, RECORD UPDATED), with interface and artifact mockup cards standing on the rail where a human sees something (the Lead Qualification Form on withdraper.com, the CMS Record in Notion, the Lead Notification WhatsApp message) and agent actor circles where an agent acts. A side branch below the rail carries PARTIAL SUBMIT and WRITES EMAIL TO LIST.
2. **Piping cards in the second row.** Small cards with tool marks: Email List (Resend), Qualification Form Writes (GitHub), Notion CMS Record Create (GitHub), Lead Scoring Runner (Notion), Lead Notification Runner (HyperAgent). Each has a SPEC paragraph and OUTPUTS records.
3. **Function and Logic cards in the third and fourth rows.** Lead Scoring and Lead Notification function cards with TRIGGER, INPUTS, LOGIC, PROMPT, OUTPUTS panels; the Lead Qualification Judgment logic card. GrocerBot has no rows like these.
4. **Data cards along the bottom.** Pink TABLE and ROW cards with tool marks (Resend, Supabase, Notion): Email List, Qualification Form Submissions, Qualification Form Answers, CMS Records twice. Each has a field table with FIELD, TYPE, THIS ROW columns and a WRITE tag naming the writer.
5. **Dotted vertical lines** run from the rail down to the cards they expand, and between rows.

So the live lane order is Process on top, Piping below it, then the model levels, then Data at the bottom. This overrides the lane order proposed in the Part 1 handoff brief.

## The registry

`Ex System Registry - DRAPER` holds a Registry Charter, a Registry Entry format, and for each level a list frame at the left and a cards frame to its right: Functions, Logic, Actors, Actions, Interfaces, Artifacts, Piping, Data, Inputs, Outputs. Each level has a one-line definition as a text node:

- Actors: "Who participates: humans and agents. One entry per role, not per person."
- Actions: "What actors do on interfaces: the verbs, green on the boards. The action happens on an interface, writes data, and leaves artifacts."
- Interfaces: "Places: one surface everyone passes through. Never produced by a step, never landing anywhere."
- Artifacts: "Things a step produced: each prospect gets their own. Fresh one per run = artifact."
- Piping: "Code that moves things without a model call: runners, syncs and the global machines."
- Data: "The tables: what calls read and write. The Registry entry is the one place a table gets its full story."

A frame named `DECISIONS · pieces without components` sits at the left; Buck's first review transcript is about it.

## Where the live file and the written rules disagree

Recorded per the Figma Brief. The file is newer.

1. The links inside Process are **Operations**, square tags with seven act types, not Connections with five types. The word Connection survives only in the Operations source list's property name.
2. **Write** is an act; the written **Output** type became a level-coloured act ("a run delivers its result", blue), and **Route** joined it ("a no-run piping write", dashed brown). **Voice** was added.
3. **Trigger** is `#C47D62`, not the written `#A87716`; that yellow-brown is now Write. **View** is grey `#8C8C8B` on the sheet, not `#5F6875`.
4. A **Piping** level exists, brown `#6F4E27`. The written rules have none.
5. **Artifact** is a piece within Process on the boards and its blue is the Output colour. The written rules have Artifacts as a level.
6. **Agent** colour is ruled: terracotta `#B0512E`.
7. The type scale is smaller: Sheet Title 32 or 40, Section Title 20 or 24, Piece Title 14, Body 12, against the written 48, 28, 17, 14. Line heights are fixed pixels.
8. Card geometry is variable-bound: radius 4, body padding 24, gap 12, header 16. The written rules' 2 to 3 radius and 64 margin describe the FigJam sheets.
9. **Records** (round pills carrying `table › key`) and **Cards** (the same row at two zoom levels) replace the written pill shape and piece sheet.
10. Level tints are computed, 12 percent outline and 4.5 percent fill, not hand-picked.
11. The board composition is Process rail on top, Piping cards under it, model cards under those, Data cards at the bottom, dotted vertical ties. The written System Views section has Logic and Functions above Process.
