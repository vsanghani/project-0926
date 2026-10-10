# Changelog

Notable changes to Appkin are recorded here. The audience is internal staff.

Add new notes under **Unreleased** as you work. When a set of changes ships, move those notes into a dated section and leave **Unreleased** empty.

Use these headings: `Added`, `Changed`, `Fixed`, `Removed`.

## Unreleased

### Added

- Market Saturation and Viability Radar engine (`lib/intelligence.ts`) calculating saturation score, whitespace potential, speed-to-MVP, and monetization models.
- Strategic Wedge Playbook (`components/WedgeAngles.tsx`) generating three actionable differentiation angles per scan.
- Public shareable validation reports (`/share/[id]`) with dynamic OpenGraph metadata and view counts.
- `POST /api/scans/share` endpoint and one-click share button with clipboard copy and X/Twitter share intent.
- SQLite catalog at `data/appkin.sqlite`, seeded from the hand-written list on first run.
- Admin API and `/admin` page to add, edit, feature, and delete products.
- Accounts, sign-in, and saved scans.
- A saved scan keeps its matched products and opens at `/scans/[id]`.
- Free and Pro billing through Stripe. Matching stays free. Free accounts keep 5 scans; Pro keeps unlimited.
- `POST /api/match` scores ideas on the server.

### Changed

- Updated idea scan results (`/results`) and saved scan detail (`/scans/[id]`) to display interactive Viability Radar and Strategic Wedge Playbooks.
- Restored the nav “Check Your Idea” button to the tilted two-line style.
- Admin catalog groups products by source, with search, source filters, and a labeled edit form.
- Idea matching reads the database catalog on the server. The seed list in `lib/catalog.ts` is no longer sent to the browser.
- Idea matching blends word overlap with local embeddings (`all-MiniLM-L6-v2`). Vectors are stored on each product and refreshed when that product changes.

### Fixed

- Resolved React 19 compiler `setState` in effect warnings in `/explore` and `/results` to ensure clean ESLint builds.

## 2026-09-22

### Changed

- Renamed the product from Twinly to Appkin.
- Catalog sources are Indie products, Product Hunt, Indie Hackers, and Directories. Cards and copy name products and sites, not individual creators.
- Restyled the interface. The dark, pale-blue theme stays. Version labels, prompt marks, code-style labels, comment lines, tilted buttons, and the graph-paper background are gone.

## 2026-09-21

### Added

- First version of the app: home, explore, results, sources, and about.
- Hand-curated catalog of live products and in-browser idea matching.
