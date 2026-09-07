# Visual Rules

The written version of the visual rules for DRAPER documentation, mirroring the Visual Rules stack in the System Legend on the DRAPER DOCUMENTATION FigJam board. This document and the board are meant to say the same thing; where they disagree, one of them is wrong and the difference gets recorded, not papered over. As of the 8.12 decision session this document is ahead of the board: Buck's 8.12 decisions are recorded here first, and the board changes they require are listed in Board sync at the end.

Sources: the 8.12 verbatim transcription of the ten Visual Rules sheets (nodes recorded per section), Sal's consolidated rulebook notes received 8.12, the decisions carried from the archived piece documentation standard, and Buck's 8.12 decision session in chat. Rules that exist only in Sal's notes are tagged (Sal). This document replaces the archived piece documentation standard (06.1.6) and the July board-map register (the old 06.1.2 design language, 06.1.3 components, and 06.1.4 palette); those archived files live in the original DRAPER repo, not in this duplicate. Sal's private, Git-ignored local workflow files govern his machine, not this repo.

The ten numbered sections follow the ten board sheets in board order. Modifiers, Board sync, and Open items close the document.

## 1. Color Tokens

Board frame 1609:1996 (was section 1308:1932). Every color on a documentation sheet comes from this card. Nothing else ships. Rebuilt 8.12 evening from a fill-and-stroke audit of the six live piece sheets; the sheet carries five groups: Base, Level tints, Level colors, Ink & lines, Connection types. The word on this sheet is level, never layer.

Base, shared across every level:

| Token | Use | Hex |
|---|---|---|
| White | Sheet canvas; card and capsule bodies | `#FFFFFF` |
| Interior surface | Strips, input fields, location bars | `#F5F5F2` |
| Tile | Placeholder and icon tiles | `#F1F1EF` |

Removed 8.12 evening by the audit: General sheet `#FFFDFB` had zero uses anywhere (the sheet canvases are plain white), and the old Interior surface value `#FAFAF8` had one use while the live sheets use `#F5F5F2` twelve times. Both were doc fiction; the de facto values are pinned.

Level tints, one per level. A level's boxes sit on its own tint, never on bare white:

| Level | Hex |
|---|---|
| Principles | `#FFFBF6` |
| Logic | `#FDFCFF` |
| Functions | `#FBFEFD` |
| Process | `#FCFCFB` |
| Artifacts | `#FCFDFF` |
| Data | `#FFFCFE` |

The level colors, confirmed by Buck 8.12. The Color Tokens sheet carries hexes for the tints only; the level hexes below are pinned from the live piece sheets' own spec lines (each sheet's mono anatomy rule states its outline hex), read from Buck's 8.12 screenshots:

| Layer | Color | Hex |
|---|---|---|
| Principles | Orange | `#E96B0C` |
| Logic | Purple | `#6D35E9` |
| Functions | Teal | `#2F8278` (Buck 8.12; the word is teal, not green) |
| Process | Largely black, with nuance: it is the level with multiple pieces and many subparts, so its pieces carry their own internal colors | per piece |
| Artifacts | Blue | `#1764C0` |
| Data | Pink | `#D83A9A` |

Ink and lines, pinned 8.12 evening from the audit of what the live sheets actually use (the old `#73726E` caption value and `#E4E4E0` hairline value were doc-only; the sheets had drifted, and the de facto winners were pinned):

| Token | Use | Hex |
|---|---|---|
| Ink | Titles, names, body text | `#1A1A18` |
| Caption gray | Explainers and captions | `#8A8A85` |
| Annotation gray | Mono annotations and specs | `#9C9C96` |
| Lines | Hairline dividers 1px; header rules 7px | `#D9D9D5` |

Connection type colors, pinned 8.12 evening. The value colors the capsule's outline, icon, and text. The interior fill is a paler blend of the same color, never the layer band tint:

| Type | Hex | Note |
|---|---|---|
| Action | `#4C9A57` | Shared with Interface controls; Buck 8.12 evening: this green, because it reads most different from Function teal |
| Trigger | `#A87716` | |
| Create | `#1764C0` | Matches the Artifacts level color exactly (Buck 8.12 evening: outline matches the level; only the interior blend is its own) |
| Output | `#D83A9A` | Matches the Data level color exactly, same ruling |
| View | `#5F6875` | |

Piece-internal color, decided by Buck 8.12:

- Within a piece, color remains a differentiation axis (Buck 8.9: line type, color, shading, text, shape).
- Interface controls and the Action connection share one green, `#4C9A57` (Buck 8.12 evening). The live sheets still carry the older `#2B8A57` in places; sweeping them is flow-sweep work.
- The Agent color under Actor is changing to something that is not green; terracotta `#B0512E` is on the sheet marked proposed, awaiting Buck's eye. The current olive `#557447` on the Actor sheet is stale once ruled.
- Level chips: white blended 1.5 percent toward the layer color.
- Dividers and hairlines: `#D9D9D5` (pinned 8.12 evening; `#E4E4E0` was the doc value but the sheets never used it).
- Light canvas only. No dark mode for explanatory documentation, no transparent label backgrounds (Sal).
- Color pairs with shape, icon, position, stroke, or text. Color is never the only meaning cue (Sal; consistent with the differentiation-axes rule Buck set 8.9).

## 2. FigJam Formatting

Board node 1433:7483. What FigJam element types, tools, and settings to use across the system.

How we build, no exceptions per piece:

1. A box is a shape. Square, radius 2 to 3, stroke 1 to 1.5. Sharp corners, never soft. Fill and stroke edit straight from the toolbar, and every fill comes off the Color Tokens card.
2. Words are their own layer. Every visible word is a text layer sitting above its box. Nothing is typed into a shape.
3. A doc lives in a Section. White fill, name cleared so no label shows. The Section organizes the full documentation card and moves its editable children together.
4. Dividers and connections are lines. Hairline rules between doc sections, and connection lines in flows, so tags and flags can sit on top of them.
5. Rectangles are furniture only: placeholder bars and tag flags, pieces nobody will ever recolor by hand. Anything a person might restyle is a shape instead.

Never ships. If one of these appears, it gets fixed before anything else is built:

1. No sealed or auto-layout Frames. Frames are allowed only as unlocked fixed-size piece shells or scaled editable references. Their children stay selectable, and dragging an edge resizes the shell without scaling or reflowing the contents. Logic and Function cards use exactly this: a fixed-size unlocked outer Frame, prose areas at fixed width and auto height, resizable without ungrouping (Sal, matching the board's Frame allowance).
2. No resizing groups. Scaling a group stretches everything in it, text included. A group exists for one drag, then it is dissolved.
3. No flattened imports. Nothing that selects as one merged object: no pasted SVGs, no baked images of text or shapes. Every element stays individually clickable and editable.
4. No off-token color. Every fill and stroke comes from the Color Tokens card or the level color registry. No new colors invented mid-build.

The test: click any single element on a doc. If you cannot select it, recolor it, or move it alone, the build is wrong.

General visual language (Sal):

- Every visual element has a semantic or structural job. No decorative eyebrow labels, generic left rails, or unnecessary accent stripes. The gray relation group labels in section 5 have a job and stay; the ban is on decoration.
- Layers stay visually distinct from item labels and attached tags.
- Avoid repeating the same rounded box treatment for every kind of object. Keep the visual grammar simple, calm, and readable.
- Use a table when exact repeated-field comparison is the main purpose.

Local SVG mirrors of board work use live text, stable IDs, editable elements, no unnecessary compound paths, and no private font files, @font-face, remote fonts, or external font URLs (Sal).

## 3. Type & Rhythm

Board node 1449:1947. The text sizes and the fixed distances every doc follows; nothing between the steps ships. Technical rules are Source Code Pro (board); the reading face is Inter with its fallback stack (carried from the archived July register and Sal's notes; the ladder sheet itself does not name the family).

The ladder:

| Role | Spec |
|---|---|
| Piece name | 48 Semi Bold |
| Subtitle, one line on what the piece is | 16 Regular `#73726E` |
| Section title | 28 Semi Bold |
| Property title | 17 Semi Bold |
| Explainer | 14 Regular, 150 percent line height, `#73726E` |
| Mono annotation | 12 Source Code Pro `#9C9C96` |

Helper sentences live at the piece level only: the 16 subtitle under the piece name. Section titles (Anatomy, Properties, Mockup) carry no helper sentence (Buck 8.12, resolving the conflict between the board's 13-size section helper and Sal's no-helper rule; the board's Type & Rhythm sheet still shows the section helper and needs the fix, see Board sync).

Rhythm, fixed distances in px. Eyeballing is how drift starts:

| Rule | Value |
|---|---|
| Content margin, section edge to content | 64 |
| Between property blocks | 56 |
| Hairline divider: above a section title, then down to it | 56 / 32 |
| Section title to its first block | 28 |
| Property title to its explainer | 8 |
| Explainer to mono annotation | 12 |
| Caption block to spec line | 20 to 22 (8.9 evening record) |
| Spec line to the next section title | 44 (8.9 evening record) |
| Sidebar bar: full box, anatomy mini | 2.5 / 1.5 |
| Corner radius, stroke weight | 2-3 / 1-1.5 |

Captions are sentence case. Section meta text never repeats per piece.

## 4. Piece Sheets

Board node 1462:2136. The fixed documentation shell for defining one reusable DRAPER piece family in full. The live reference is the Principle sheet, embedded on the board at review scale with every source element editable.

The shell:

| Rule | Value |
|---|---|
| Sheet content width | 1744 px |
| Header | 48 px name, 16 px description, one full-width divider (7 px) |
| Columns | 720 left documentation column, 160 fixed gutter, 680 right Mockup column |
| Property row | 340 definition, 40 gap, 340 visual representation |
| Order | Anatomy, then Properties on the left; Mockup on the right (Attributes retired by Buck 8.12) |

- Both sides of a property row align at the top; row height follows the taller side (Sal).
- Sheets end in whitespace. No bottom dividers or closing furniture on a piece sheet (Sal).
- No eyebrow, status pill, or piece ID above the title (Sal).
- Use the live family grammar and real examples. Never replace a defined piece with anonymous rectangles or placeholder lines.

**Anatomy.** Start with the smallest common core and add one meaningful required layer at each stage, repeating the previous construction as the next stage grows. Plus signs between stages. Every stage gets its own independently editable caption. Real labels where the meaning is known; anonymous gray placeholder lines only for unknown generic texture (Sal, matching the board's Principle anatomy). Anatomy describes how the piece is built, not every possible instance (Sal).

**Properties.** Every meaningful property gets the same treatment: exact semantic label, plain-language explanation, its visual convention shown, separately bounded values or honestly labeled examples, and a technical mono rule describing the visual encoding. Controlled values appear separately, never as comma-separated prose (Sal). Do not invent Type, Kind, Format, or similar properties to fill a section, and a visual mechanism such as a ring, color, or pill is not automatically a semantic property (Sal). The depth bar is the Actor and Interface documentation; no piece goes shallower (Buck 8.9).

Two properties appear on every piece document, always, even when empty: Relationship and Location (Buck 8.12). They get the standard property row with its subtitle; when the piece has none, the row stays and its value area stays empty. Principles carry no Location, so the Principle sheet shows the empty row (Buck 8.12). Format is an ordinary property of Data and of nothing else; an Artifact's equivalent is its type, carried by the artifact-type icon (Buck 8.12). The Attributes section and the Attributes category are retired (Buck 8.12); Relationship and Location get their deep specification under Modifiers, below.

**Mockup.** One singular Mockup heading. One family-colored container on the pale family tint, restrained corners, roughly 24 px internal padding (Sal). The family bar is a family cue only, never a decorative rail (Sal). One complete real or working example with actual evidence: real content, real materials, as many as the example requires. Generic placeholders never ship where real content exists.

**Graphics are drawn for real.** Inline and demo graphics are actual mini charts, flows, or infographics built from editable shapes in the layer color plus neutral. A gray box labeled "graphic" never ships (Buck 8.9 evening, from the Sal comparison; migrated from 06.1.6).

**The Process level.** Process is the first level with multiple pieces, and its fidelity is its pieces: Actor, Interface, and Connections each carry the full piece treatment side by side under one level header. Nothing composite gets layered over them; an assembled flow band was built and rejected by Buck 8.9 late. The level adds only its header: name, subtitle, and the heavy rule spanning all its pieces' columns (migrated from 06.1.6). The pieces keep their internal colors as differentiation inside their own anatomy, under the 8.12 color rulings in section 1: the Interface and Action greens stay but read clearly distinct from Function teal, and Agent gets a new color.

Current family directions for the sheet bodies:

- **Principle**: orange container. Written explanation with graphics plugged in where they help, then a divider and a real applied brand example. The full format lives in the original DRAPER repo's sources (26.08.09 - Principle Documentation Format), not in this duplicate.
- **Logic**: purple container. Name, description, divider, then ordinary full-width prose written as it would read plugged inline into a calling Function's prompt (Buck 8.9).
- **Function**: teal container. Prose that gets right into the work, then vertically stacked Triggered By, Inputs, Related Logic, and Outputs reference rows (synthesized 8.9 late; teal per Buck 8.12).
- **Data**: pink container. Table or file structure with concrete fields and content.
- **Artifact**: blue container. Type-specific low-fidelity representation such as a document, record, email, message, or application view.
- **Connection**: the type-based system in section 7.

## 5. References & Marks

Board node 1468:2158. Compact references, Location encoding, and exact icon and brand-mark use.

**The pill shape** (named by Buck 8.12; previously the canonical pill). One pill shape represents one referenced piece, everywhere a piece is referred to by name: in a flow, in a Function's footer, in a Logic's Related Function.

- The construction: a white capsule, stroke 1.3 in the referenced level's color, fully rounded ends, the name in mono (Buck 8.9 evening).
- The pill begins with a badge: the two-letter level code (FN, LG, DT, AR) in a chip tinted pale toward the level color, or a registered icon. The two-letter convention encodes levels only. Artifact types never get letter codes: a Saved Reference or an Expression is a type of Artifact, and type is carried by the artifact-type icon, such as a media icon for a saved reference and a doc icon for an expression (Buck 8.12; the RF and EX badges currently on the board are stale, see Board sync).
- The pill outline and text take the referenced level color. The board sheets say family where the older records say layer; both point at the level color registry in section 1.
- Then the exact name. No description.
- Location and Format ride inside the pill, never outside it, as a small trailing tag at the right end (Buck 8.10). The tag's contents per Buck 8.12: Location appears as its registered mark icon only, no location text; Format appears as text only, no icon, because formats are many and icons would heavy the pill up. The board's current tags spell the location as text (SUPABASE · JSONB) and are stale, see Board sync.
- The tag is omitted when the piece has no Location or Format value.
- Width hugs the content. No equalized fixed widths, no trailing whitespace (Sal).
- Repeated pill shapes stack vertically, never side by side, with roughly 10 to 12 px vertical gaps (Sal).
- Relation group labels (the gray eyebrows such as Inputs or Outputs) sit outside the pills, gray, never the level color of what they introduce.
- These are real system references, not neutral pills or invented tags.
- A pill shape names a piece at another level. An Action is a Connection inside Process, so a Function's Triggered By never uses a pill: it shows the Action as it appears in the flow, the neutral line with its tag riding it (Buck 8.9 evening).

**Location rendering on a piece.** Show the contained bar only when Location has a real value: the registered mark plus the exact location name, sitting at the top right, contained within the piece outline (Buck 8.12, confirming the board's Artifact mockups: DRAPER APP, NOTION, WHATSAPP). No floating badge, fake logo, or company-name sticker. If Location is empty, omit the bar entirely and let the piece keep its family-native anatomy. This is the rendering rule for instances and mockups; on documentation sheets the Location property row always appears, per section 4.

**The icon registries.** Four registered sets live side by side (Buck 8.12), and none replaces another:

1. Connection type icons: the five in section 7.
2. Actor iconography: the human figure, the agent variant, the boundary rings.
3. Location marks: the registered platform marks (Draper App, Notion, WhatsApp, Gmail, GitHub, Supabase, Cloudflare and kin).
4. Artifact type icons: one icon per artifact type (saved reference, expression doc, kanban card, strategy doc, email, and so on). This set needs building out.

Within a set: reuse the live vector, never substitute Unicode. One controlled Lucide icon family, 24-unit grid, 2 px stroke, round caps and joins; one icon means one stable meaning, and families never mix (Sal).

**Row card eyebrows** (Buck 8.27). On a data ROW card, the gray mono eyebrow above a row's field table carries the row's id and nothing else: sm_i01, as_0101, cm_2011, run_2101. A row's label, kind, section, or any other field value never rides up into the eyebrow; the fields below carry the data. A card showing several rows of one table stacks one full field block per row, each under its own id eyebrow, never a specimen row standing in for the set.

**Brand marks.** Use a verified vector from the shared registry, preserve its proportions, and place it in the approved tile or Location bar. Never redraw a mark from memory, never invent, recolor, or distort a vendor logo, and never add a company-name sticker when the recognizable logo is already present (Sal, matching the board). For Process visuals, the Cloudflare mark ships without an R2 label (Sal). A real mark is context; a guessed glyph is misinformation.

## 6. System Views

Board node 1471:2001. How complete DRAPER flows are composed across levels without losing causal clarity. The live reference is the approved Full System construction, reduced intact, never redrawn as a proxy, with every source element still editable.

Composition rules:

1. Build compact causal clusters. Keep the source, connection, and target close enough to read as one event. Clusters, not evenly spaced timeline columns (Sal).
2. Route only on the orthogonal grid. Horizontal and vertical shafts only, hard 90 degree turns, open lanes.
3. Center every port and connection piece. Enter or leave at the midpoint of an allowed edge; the connection piece sits over the shaft midpoint.
4. Separate cross-level Relationships. Dotted, arrowless lines from a pill shape to its expanded piece in another level.

Lane structure (Sal):

- Broad pale semantic lanes, stacking only the lanes the flow actually uses, lane label in the upper left.
- Expanded Logic and Function pieces sit above Process; expanded Artifact and Data pieces sit below it.
- Every human action shows its responsible Actor.
- A handoff reads as source, then connection statement, then target.
- Whitespace marks chapters, branches, or level changes, never random gaps. Do not spread items evenly across a large canvas; widen the composition only when a dense cluster genuinely needs the space.
- One axis carries flow; the other carries hierarchy, decomposition, support, or cross-level relationships.
- Prefer progressive disclosure: overview first, detail in a separate sheet or mockup.
- Baseline geometry: the layered reference is about 4662 px wide, inter-lane gap about 50 px, overview pieces start at roughly 72 to 76 percent of their sheet scale.

Do not invent a simplified stand-in when an approved live component or system cluster already exists.

## 7. Connections & Routing

Board node 1472:2037. How one piece affects another: exact statement, visible direction, centered ports, orthogonal routes. The connection piece is part of the route, not a floating caption.

**The connection piece.** A rectangle, not a pill (Buck 8.12). It carries the type's fixed icon, then the text, in the type's color. In a flow the text is only the exact present-tense statement of what is happening (the board's worked examples: SUBMITS WEB FORM, CREATES NOTIFICATION, NORMALIZED ANSWERS, STATUS SET, OPENS THE MESSAGE). In the legend inventory the text is the type word. The rectangle has an opaque pale fill and masks the line beneath it (Sal).

**The five types**, each with its registered icon and color (colors and icons confirmed by Buck 8.12 from the live board set; the old rule that in-Process types stay charcoal is retired):

| Type | Meaning | Icon | Color |
|---|---|---|---|
| Action | Intentional activity such as sending, reviewing, or approving | Pointer | Green, clearly distinct from Function teal |
| Trigger | An event that starts something | Lightning bolt | Yellow |
| Create | Writing or assembling a visible artifact | Pencil in square | Blue, aligning with Artifacts |
| Output | A resulting data or artifact item. Not used merely because something appears downstream | Barred arrow | Pink, aligning with Data |
| View | Opening, reading, or observing something | Aperture eye | Gray |

**Ports and route geometry:**

- Midpoint ports only. Enter or leave at the middle of the chosen edge: left or right midpoint for horizontal connections, top or bottom midpoint for vertical ones. Never attach to a corner (Sal).
- All routes horizontal or vertical with exact 90 degree corners. No diagonal, slanted, curved, freehand, or rounded-elbow lines. Prefer no more than two bends (Sal).
- Draw the shaft first, then center the connection piece over the longest clear straight segment, never on a corner.
- Open line of sight. Route around pieces, never through or behind a piece, a pill shape, or unrelated text. Keep the full route visible.
- Keep at least 24 px of visible shaft to the next piece and at least 20 px from unrelated geometry (Sal).
- Prefer right-side midpoint or bottom-center midpoint for outgoing routes.
- Shared trunks branch only at a clear 90 degree junction (Sal).

**Cross-level Relationships.** Dotted and arrowless. Run directly from the pill shape to the expanded piece; never branch from a solid Process shaft. Use direct vertical routes when centers align. No giant diagonal dashed lines (Sal).

## 8. Process Steps

Board node 1473:2095. One bounded moment, composed with the approved reusable pieces and only the detail that matters in that step. Process Steps are a different register from System Views. The live reference is the Step 01 construction, which is also the native-scale comparison baseline (Sal).

- Horizontal flow only, left to right. No separate vertical or narrow version.
- Use only the relevant layers (Sal).
- Customize the Interface: render the actual Surface, View, Purpose, and relevant Controls for this step. Purpose stays visible (Sal; the board names View, Purpose, Controls).
- Same-level lines stay quiet: no horizontal relationship labels, no terminal arrowheads.
- Cross-level labels stay explicit, naming only the vertical relationship that connects different levels, and appearing only when genuinely useful (Sal).
- Use the approved pieces. A Step assembles library components; it does not redesign them.
- Fixed native pixel tokens. Never shrink text to fit; widen the canvas instead (Sal).
- The Step visual is the event. Piece-sheet anatomy, property explanations, and visual-decision scaffolding stay out of it.

Step typography (Sal, not yet on a board sheet; Inter fallback stack, interiors Medium or Regular, nothing overly heavy):

| Role | Spec |
|---|---|
| Layer label | 30 uppercase |
| Step label | 24 uppercase |
| Piece or action statement | 25 |
| View | 21 |
| Surface and Purpose labels | 19 uppercase |
| Actor Stage, Role, Title | 19 Title Case |
| Purpose value | 19 sentence case |
| Cross-layer label | 17 uppercase |
| Body and detail | 15 |

## 9. Working → Final

Board node 1474:2119. The working sheet teaches and tests the system. Final use removes scaffolding and applies the approved component. The two artifacts have different jobs; working explanations never get crammed into a final system view.

- **Working** may show explanations, open decisions, measurements, representative permutations, technical metadata, relationship names, proposed labels, and dashed open states (board plus Sal).
- **Final** shows only the approved visual encoding and the minimum text needed to identify the real piece: recognizable shapes, icons, colors, and placement, no loose inspection text, no tiny explanatory text, same components, bands, and connector rules (board plus Sal).
- **Promotion gate**: nothing working is treated as final until semantics, visual choices, and QA are explicitly approved by Buck. Semantic approval, visual approval, and promotion are three separate decisions (Sal). Historical candidates are preserved; new proposed versions are created instead of silently overwriting history (Sal, matching the repo's own drafts convention).

## 10. Workflow & QA

Board node 1476:2143. The production gates that keep semantics, visual encoding, and final delivery from drifting apart.

The gated sequence:

1. Read current context: routing, current record, directly relevant sources, and the latest approved visual baseline.
2. Classify meaning: separate identity, family-specific properties, the modifier properties (Relationship and Location), included children, connections, and fixed visual rules.
3. Confirm the tree: present the bounded semantic structure before claiming the piece is understood.
4. Build the working visual: real content, current components, governed icons, separately editable layers.
5. Review at real scale: inspect native, grayscale, and review-size renders; check spacing, clipping, and causal reading order.
6. Approve and promote: only the approved package moves into final documentation and becomes a future baseline.

Visual release checks:

| Check | What it covers |
|---|---|
| Geometry | Exact dimensions, corner treatment, stroke weight, padding, allowed ports |
| Fidelity | Current piece anatomy, connection icons, registered marks, actual low-fidelity source form |
| Legibility | Full color, grayscale, native scale, and review scale all remain readable |
| Semantics | Every visible label has a job; no invented properties, values, or unsupported relationships |
| Routing | Orthogonal paths, midpoint ports, centered connection pieces, no hidden line segments |
| Editability | Every text, icon, shaft, shape, divider, and mockup element remains directly selectable |

Additional flow checks before approval (Sal): the complete flow is understandable in about ten seconds; start, local clusters, and endpoint are obvious; no unexplained gap between cause and result; no crossings or hidden connectors; every human action has an Actor; every visible source and target is clear; cross-level dotted connections start from the correct piece; lane structure is consistent; current pieces are used, never stale historical variants; SVG and PNG exports match the board.

If an approved live component exists, clone it. A schematic substitute is a failed fidelity check, not a harmless shortcut.

## Modifiers

The third grouping beside levels and pieces, named modifiers by Buck 8.12 (promoting the working label from the Eric call). It has no board sheet yet; its home on the board still needs building.

Modifiers holds Relationships and Location: the only properties that span levels. That span is why they get their own home with deep visual and substance specification, instead of being defined over and over inside each piece. In each piece's own documentation they are ordinary rows under Properties, always present, empty when empty, per section 4. The Attributes category is retired (Buck 8.12); nothing else moves into modifiers to fill it.

**Location.** One property with controlled values: Draper Website, Draper App, Notion, WhatsApp, GitHub, Supabase, and kin. Where a piece lives. Documented as a property row on the piece sheet; rendered on instances as the top-right mark-plus-name bar per section 5; carried on pill shapes as the mark icon in the trailing tag. Principles carry no Location (Buck 8.12). Whether one piece can carry two locations at once is open.

**Relationships.** Working definition, drafted 8.12 for Buck to flesh out: a Relationship is a cross-level link. It points from a reference to the real thing at its own level: a pill shape in a flow up to the Function it names, a Function's Related Logic row up to that Logic, a Process piece down to the Data or Artifact it touches. It carries no event. A Connection makes something happen inside Process; a Relationship says where the full definition of a named thing lives, and documentation never duplicates down the line (8.9 transcript). Drawn as the dotted, arrowless line of section 7, vertical when centers align. The 8.8 working types Containment, Reference, and Association remain unverified working labels.

## Board sync

The 8.12 decisions recorded above that the board does not show yet. Each is a bounded fix, not a rework.

1. Add the level color hexes to the Color Tokens sheet: `#E96B0C`, `#6D35E9`, `#2F8278`, `#1764C0`, `#D83A9A`, plus the Process treatment note.
2. Type & Rhythm sheet: remove the 13 section-helper row and the footer sentence about the helper riding the baseline.
3. Piece Sheets rules card: the fixed-order row drops Attributes. Live piece sheets: Attributes sections come off, Relationship and Location rows go in under Properties (empty allowed), and the Principle sheet's dashed Location box becomes an empty Location row.
4. Pill shape trailing tags: location text becomes the registered mark icon (SUPABASE as text goes away); format text stays (JSONB, COLUMNS).
5. The RF and EX badges on the Artifact references become artifact-type icons.
6. Workflow & QA sheet: the classify step's wording updates off attributes.
7. The distinct-green pass: separate the Interface and Action greens from Function teal, and recolor Agent once its color is decided.
8. The green sweep of stale Function-green out of the old Connections and Interface material (standing since 8.9).
9. Build the modifiers home: the Relationships and Location specification sheets.
10. Fix the run-on helper on Connections & Routing: the "LIVE SOURCE → STATEMENT → TARGET" label and its helper sentence render merged ("TARGEThe connection pill is part of the route").
11. Retitle the two Phase boards to the 8.12 names: Qualification and Intake, boundary text moving to the subtitle (Buck 8.12: "sure, relabel them").

## Open items

1. The Agent color under Actor. Buck 8.12: not green. Proposed 8.12, pending his eye: terracotta `#B0512E` with a pale fill near `#F9EFEA`, warm for maximum separation from the neighboring External gray and Internal blue.
2. The Interface and Action green. Proposed 8.12, pending Buck's eye: one shared `#4C9A57` for both (the July kit's control green), reading clearly apart from Function teal `#2F8278`. The old 8.9 green-sweep item dissolves with Functions on teal; what remains is applying the pinned green and Agent color in the board pass and confirming nothing outside Functions wears teal.
3. The Process treatment value (largely neutral, per piece).
4. Whether one piece can carry two locations at once.
5. The Relationships definition above is a working draft; Buck fleshes it out when the full system work resumes.
6. The modifiers deep specification (visual and substance) beyond the definitions here.
