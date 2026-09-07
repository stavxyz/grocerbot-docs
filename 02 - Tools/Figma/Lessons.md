# Lessons

- When the user identifies separate system conclusions, record each as its own note. Do not collapse a category, taxonomy, or decision into a broader principle or use one to explain another.
- Start working notes with the specific decision or rule. Delete framing phrases, abstract claims, and marketing-style language that do not add information.
- In visual-system work, do not default to text hierarchy (changes in weight, case, size, or color) as the main way to identify and differentiate pieces. Treat text as one layer inside a broader set of consistent visual mechanisms.
- Do not use abstract concepts, classification language, or shorthand in place of a direct explanation. State what the thing is, what has been decided, how it works, and why it matters.
- Write system decisions as descriptions of the system, not as instructions telling the reader what to call or do with the system.
- Keep living reference sections separate from flat notes. A note should point to the reference section without repeating the section's current contents.
- Treat the Visual System as the visual treatment applied across DRAPER, not as an item inside the Taxonomy it visualizes.
- Prefer the established one-word modeling term **Element** over the invented phrase **System Piece**.

## 8.9 - FigJam rectangles are not user-editable
Plugin-created RECTANGLE nodes render in FigJam but the FigJam toolbar gives the user no fill controls on them; Buck could not recolor the piece-doc boxes. Any box, pill, or chip a user will restyle must be created as a ShapeWithText (SQUARE, cornerRadius set after resize). Rectangles are acceptable only for decorative furniture the user will never touch: hairline dividers and placeholder text bars.

## 8.9 - Placeholders and stale coordinates
Gray boxes labeled "graphic" and bracket-copy mockups read as unfinished; Buck compared them against a version with real drawn graphics and real brand images and called ours shitty. Mockups get worked content and real materials; graphics get actually drawn. Separately: the board moves mid-task while Buck works. Never place new nodes at coordinates captured earlier in the session; re-read the anchor node's live position in the same call that places the new work. Also: FigJam connectors render above shapes, so a tag riding a line must use a plain line rect behind it, not a connector.

## 8.9 - Ambiguous complaint is a question, not a removal order
Buck asked "what is it now? a white bg rectangle" and the background got stripped in response; he wanted it kept (and asked why it was not put back). When a message could be a question or a complaint, answer what the thing is first, or make the change trivially reversible and say exactly what was changed. Backgrounds on the piece-doc sections are #FFFDFB per the sheet-background rule.

## 8.9 - An errored use_figma call rolls back completely
A crash anywhere in a use_figma call voids every mutation in that call, including ones that ran before the crash. The Logic mockup rebuild "landed" only as a no-op and the follow-up call polished the old content; only the screenshot double-check caught it. After any errored call, re-read the board and re-run the whole unit; never patch on top of assumed state.

## 8.9 - Mockup altitude, settled after four swings
A Mockups-section mockup is an ABSTRACTED rendering of the thing: real region names, content as quiet bars, real media only where media is the point, styled in the current piece-doc system (sharp corners, hairline strokes, layer-color sidebar and faded fill, gray eyebrows, mono meta). It is not a documentation sheet, not a full-text replica of the app, not a copy of Buck's rough sketches, and it never borrows section colors. Sketches give the altitude and regions; the established system gives the style.

## 8.9 - A lingering temp group hid deleted-looking nodes
Old mockup versions survived a "deletion" because they sat inside an undissolved tmp audit group: page-level filters do not see group children, so the stale cards stacked under the new build. Every temp screenshot group must be dissolved in the same step that follows the screenshot, and any delete-by-prefix must walk the full tree, not page children only. Before finishing board work, sweep for tmp: groups and leftover same-prefix nodes at every depth.

## 8.9 - Do not strip a piece's internal colors in the name of the layer rule
Color-means-layer governs the board grain: pills, tags, chips, doc frames. Inside a piece's own anatomy, color is one of Buck's decided differentiation axes and pieces within a level need clear distinction from each other. A pass that grayed out Actor and Interface internals flattened that distinction and got reverted; a rebuilt copy drawn cruder than the original got deleted. Never redraw over an original that is already the quality bar; edit the original surgically or leave it.

## Exploding a frame deletes whatever the frame itself painted (8.10)
The fn-qual card explosion lost the pill capsules and the trigger flag body because those visuals WERE the frames: an auto-layout frame's white fill, colored stroke, and corner radius are the pill. Deleting the wrapper deleted the pill body, leaving naked chips and text. Procedure now: before removing any container, check its fills/strokes/radius; if it paints anything, create an equivalent shape at its exact geometry FIRST, insert it at the bottom of the released stack, then release children and remove the wrapper.

## "Bottom of the section" is not "behind my card" in a shared section (8.10)
insertChild(0) on a shared section pushed the card background below the full-width level-row shading bands that live at the bottom of Buck's section, hiding the white card behind the green band. Z-fixes inside shared containers must target the piece's own stack: insert the background at (index of the piece's lowest content layer), never at index 0.

## A verify screenshot aimed with stale coordinates verifies nothing (8.10)
The first "verified" crop of the exploded card used the frame position captured at the start of the task; the card actually sat 650px lower, so the crop showed a different doc and the real breakage went unseen until Buck caught it. Verification crops must be located from a live read taken in the same action as the screenshot.
