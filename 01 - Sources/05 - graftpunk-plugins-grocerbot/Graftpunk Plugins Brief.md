# graftpunk-plugins-grocerbot

Site plugins for graftpunk, a browser-session automation framework for web portals without public APIs. The BEK plugin is how the orchestrator reads the BEK portal: the vendor poll and the augment fetch chain call it through `GraftpunkClient`, and the browser worker runs `gp bek login` to recover a session. It is in scope as Piping. The other plugins are not part of GrocerBot's running system today.

| | |
| --- | --- |
| Local path | `~/src/graftpunk-plugins-grocerbot` |
| Remote | `git@github.com:parconditio/graftpunk-plugins-grocerbot` |
| Branch of record | `main` |
| SHA read | `a8b8e99`, 2026-09-06, on `feat/shopkeep-sales-reporting`, zero commits ahead of `main` at `6e6733c`. |
| Working tree at read | `uv.lock` modified. |

The orchestrator depends on this as the private package `graftpunk-plugins-grocerbot`; graftpunk itself comes from PyPI and is outside the system.

## Plugins

- **bek** (`src/graftpunk_bek/`): bekentree.com. Invoice list, detail, transactions; order list, detail; account summary, list, detail; cart get, list, create, add, remove; inventory, lists, search, favorites, delivery dates; notifications. Login is an Akamai-protected browser flow that extracts and caches a CSRF token. `docs/bek.md` documents every command and the request flow. This is the one GrocerBot uses.
- **shopkeep** (`src/graftpunk_shopkeep/`): ShopKeep, now Lightspeed Retail, BackOffice. Export center, reorder report, bulk-manage import. Used by version 1's `gb shopkeep` commands. Version 1 material.
- **unfi** and **unfi_fresh** (`src/graftpunk_unfi/`): myunfi.com. Not wired into the orchestrator.
- **wss** (`src/graftpunk_wss/`): webstaurantstore.com. Not wired into the orchestrator.

## Read order

1. `docs/bek.md`: what the portal exposes and how the plugin calls it.
2. `src/graftpunk_bek/plugin.py`, `_invoice.py`, `_order.py`, `helpers.py`: the commands the orchestrator's `config/pipelines/bek.yaml` names in `diff.command` and `augment[*].fetch[*].command`.
3. `README.md` for the plugin model.

## What it can support

- What each BEK command fetches and returns, and therefore what fields the orchestrator's identity, compare, and parser configs can rely on.
- How a BEK session is established and why it goes stale.

## What it cannot support

- Anything about the BEK portal beyond what the plugin encodes from HAR captures.
- The orchestrator's behaviour. That is `03`.
- Whether UNFI, WSS, or a second vendor is planned for GrocerBot. The orchestrator design named twenty-plus vendors; only BEK is configured.
