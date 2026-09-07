# Figma

This folder is the tooling for building the visual documentation in the GrocerBot System Docs Figma file. The mechanics and the build discipline were built and hardened on the DRAPER documentation effort and carry over as the working standard. The visual standard was re-based onto GrocerBot's four levels on 2026-09-06.

The target file: `https://www.figma.com/design/nBmhDyEDpFPrMq0ztmHDb0/`, file key `nBmhDyEDpFPrMq0ztmHDb0`, a copy of the DRAPER System Docs file. It has three GrocerBot pages, SYSTEM LEGEND (built 2026-09-06), SYSTEM REGISTRY (built 2026-09-07 from the seven boards), VISUAL DOCUMENTATION (seven boards, built 2026-09-06 and 2026-09-07), and three DRAPER example pages, Ex Systrem Legend, Ex System Registry, Ex Outputs, which are example material and never a source about GrocerBot. Its local variables and text styles are DRAPER's and are the tokens GrocerBot builds with.

- **Visual Rules.md**: the GrocerBot visual standard: four levels, tokens, typography, layout, piece treatments, the new Data conventions, board composition, release checks, open items.
- **Live Legend Read 26.09.06.md**: what the file held on first read: pages, variables, styles, the legend's inventory, the example board's structure, and every place the live file disagreed with DRAPER's written rules. The record behind the re-base.
- **Instructions.md**: the load order, the non-negotiable build discipline, the workflow, and the handoff brief format.
- **Lessons.md**: hard-won lessons from real board sessions. Many are FigJam-specific; the working-note and questioning lessons at the top are general.
- **prelude.js**: DRAPER's FigJam-era script prelude. Its helpers use FigJam node types that do not exist in a design file, and its token values predate the live legend. Kept for the mechanics it records; not to be pasted into a design-file script.

The Figma MCP tool-call budget depends on the plan. The first read on 2026-09-06 exhausted the Starter plan's twenty reads per month; Sam upgraded to Professional the same day, which Figma's rate-limit page gives as 200 calls per day and 10 per minute on a Full or Dev seat. Reads include metadata, screenshots, and read-only scripts. Every build step in `Instructions.md` needs a screenshot to verify, so budget two calls per section and stay under ten a minute.

DRAPER's 8.12 written standard, which this folder previously carried as `Visual Rules.md`, is preserved at `03 - Example/Visual Rules (DRAPER 8.12).md`. The July 2026 register and the old piece documentation standard live in the original DRAPER repo's archive and are not in this duplicate.
