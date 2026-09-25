# Changelog

Notable changes to Appkin are recorded here. The audience is internal staff.

Add new notes under **Unreleased** as you work. When a set of changes ships, move those notes into a dated section and leave **Unreleased** empty.

Use these headings: `Added`, `Changed`, `Fixed`, `Removed`.

## Unreleased

### Added

- SQLite catalog at `data/appkin.sqlite`, seeded from the hand-written list on first run.
- Admin API and `/admin` page to add, edit, feature, and delete products.
- Accounts, sign-in, and saved scans.
- `POST /api/match` scores ideas on the server.

### Changed

- Restored the nav “Check Your Idea” button to the tilted two-line style.
- Admin catalog groups products by source, with search, source filters, and a labeled edit form.

## 2026-09-22

### Changed

- Renamed the product from Twinly to Appkin.
- Catalog sources are Indie products, Product Hunt, Indie Hackers, and Directories. Cards and copy name products and sites, not individual creators.
- Restyled the interface. The dark, pale-blue theme stays. Version labels, prompt marks, code-style labels, comment lines, tilted buttons, and the graph-paper background are gone.

## 2026-09-21

### Added

- First version of the app: home, explore, results, sources, and about.
- Hand-curated catalog of live products and in-browser idea matching.
