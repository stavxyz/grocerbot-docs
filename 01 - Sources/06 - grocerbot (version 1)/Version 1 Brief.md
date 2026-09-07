# grocerbot (version 1)

The legacy CLI, `gb`. Processes vendor invoice spreadsheets through supplier modules, prices them, and writes a ShopKeep bulk-manage import CSV. Still maintained, still used for the ShopKeep path. It is version 1. Version 2 is grocerbot-orchestrator plus grocerbot-core. Sam's ruling on 2026-09-06: document version 1 only as a contrast to version 2.

| | |
| --- | --- |
| Local path | `~/src/grocerbot` |
| Remote | `git@github.com:stavxyz/grocerbot` |
| Branch of record | `main` |
| SHA read | `9537159`, 2026-09-06, two commits ahead of origin, dated 2026-09-01. |
| Working tree at read | Clean. |

## What is here

- `grocerbot/suppliers/*.py`: UNFI, Alberts, BEK, Glazers, Affiliated active; Fintech and McLane in progress. Each outputs Lightspeed-specific columns. `suppliers/utils.py` holds `parse_eaches`, which core ported.
- `grocerbot/invoice/items.py`: the order processing pipeline and the canonical to ShopKeep template merge.
- `grocerbot/backends/shopkeep/`: the first concrete POS backend, read-path only, driving the graftpunk shopkeep plugin in process. `backends/clover/` is a stub.
- `grocerbot/utils.py`: the normalisation system, locked by 35 tests.
- `docs/`: `ARCHITECTURE.md`, `PRESENT_DAY_INTERNALS.md`, `CANONICAL_FORMAT_ANALYSIS.md`, `POS_BACKENDS.md`, `POS_INVENTORY_DATA_MODELS.md`, `GLOSSARY.md`, research. The POS spec in core cites this corpus as prior art.

## Read order

1. `README.md` and `docs/ARCHITECTURE.md`: the shape of version 1 in its own words.
2. `grocerbot/suppliers/{bek,alberts,glazers,unfi}.py`: the proven supplier mappings. Core's `CLAUDE.md` says core's seeded mappings should be cross-referenced against these.
3. `docs/GLOSSARY.md` and `docs/POS_INVENTORY_DATA_MODELS.md`: version 1's vocabulary and its POS item model, which the version 2 POS spec grew from.

## What it can support

- What version 1 is, so old material is recognised on sight. `Logic - Harness.md` section 3 lists the markers.
- The proven supplier mapping logic, as evidence when checking core's seeded mappings.
- The problem statements that motivated version 2: N by M vendor to POS coupling, Lightspeed column contamination, no API.

## What it cannot support

- Anything about how version 2 works or should work.
- Current terminology. Version 1 says supplier where version 2 says vendor, and its canonical format uses floats and different field names.
- Anything about tenancy, events, or the POS subsystem beyond the prior-art data models.
