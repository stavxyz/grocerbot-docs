# Visual Documentation

The working home of a visual documentation effort: a system gets documented one part at a time into a Figma file, and this repo holds everything a run needs. The method came from the DRAPER documentation effort; this duplicate carries the method and the tooling, with DRAPER's own material reduced to a worked example.

Four documents run the work:

- **[Function - Visual Documentation.md](<Function - Visual Documentation.md>)** is the runbook: how a request for one part of the system becomes finished visual documentation.
- **[Logic - Protocol.md](<Logic - Protocol.md>)** holds the hard rules: reading, the Context Record, findings versus decisions.
- **[Logic - Reasoning.md](<Logic - Reasoning.md>)** is how thinking gets done: everything considered with nothing as the anchor, how to weigh sources, and how old material meets the current aim.
- **[Logic - Harness.md](<Logic - Harness.md>)** is the standard: what GrocerBot is now, written 2026-09-06 from a full read of the code at recorded SHAs. It is the aim, not proven fact.

The folders:

- `01 - Sources/` holds the map of GrocerBot's input material. The code lives in its own checkouts under `~/src/`; each subfolder here is a brief that records the path, the branch of record, the SHA last read, the read order, and what the source can and cannot support. [Sources Brief.md](<01 - Sources/Sources Brief.md>) is the map. `System Lexicon.md` at the root tracks the names and how settled each is.
- `02 - Tools/` holds the Figma tooling and the visual standard the boards are built under.
- `03 - Example/` holds the DRAPER example: the filled-in harness, the full architecture reference, the lexicon, the sources map, and a real review pass on finished boards. [Example Brief.md](<03 - Example/Example Brief.md>) is the guide. Example material, never a source.
- `04 - Build/` holds build session records. Also starts empty.
