# Appkin

Appkin is an internal product for checking whether an app idea already exists. A person pastes a description. The app ranks live products from a hand-curated catalog and shows why each one matched, plus the gap still open around it.

There is no database and no API. Matching runs in the browser against the catalog in `lib/catalog.ts`.

Work happens on the `development` branch. `main` is the slower line and can lag behind.

## Setup

You need Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is taken, Next prints the port it used instead.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

Imports use the `@/` alias, which points at the repo root. `@/lib/catalog` is `lib/catalog.ts`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home. Idea box, featured products, and product explanation. |
| `/results?q=` | Scan results for the pasted idea. |
| `/explore` | Full catalog, with source and category filters. `?source=` preselects a source. |
| `/sources` | Where catalog entries come from. |
| `/about` | Product story. |

## File structure

```text
app/                      Routes and global styles
  layout.tsx              Header, footer, and page metadata
  page.tsx                Home
  globals.css             Dark theme tokens and the scan animation
  icon.svg                Favicon
  about/page.tsx
  explore/page.tsx        Catalog browser (client component)
  explore/layout.tsx      Page title
  results/page.tsx        Idea scan (client component)
  results/layout.tsx      Page title
  sources/page.tsx
components/               Shared UI
  Header.tsx              Nav and mobile menu
  Footer.tsx
  IdeaComposer.tsx        Idea box. Sends the text to /results
  AppCard.tsx             One live product
  FeatureCard.tsx
  SectionHeading.tsx
lib/                      Catalog and matching. No React here.
  catalog.ts              The 50 live products and the example ideas
  sources.ts              Source labels shown in filters and cards
  types.ts                LiveApp, Source, and SourceId
  match.ts                Scoring for a pasted idea
public/                   Unused create-next-app SVGs. Not part of the brand.
```

Config at the root: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`.

## Common changes

### Add a product

Add one object to `liveApps` in `lib/catalog.ts`.

- `id` is a short unique slug.
- `name` and `url` are the product, not a person.
- `maker` is the product or company name. If it is the same as `name`, the card shows only the source.
- `sourceId` must be one of `indie-products`, `product-hunt`, `indie-hackers`, `directories`.
- `tags` and `category` are what matching uses. Write the words a person would use to describe the product.
- `gap` is the remaining opening next to that product.
- `featured: true` puts it on the home page.

Do not add founder names, personal portfolios, or "built by" copy. The catalog lists sites and projects.

### Add an example idea

Add a `{ label, text }` entry to `ideaExamples` in `lib/catalog.ts`. Those chips sit under the idea box on the home page.

### Add a source

1. Add the id to `SourceId` in `lib/types.ts`.
2. Add the source object in `lib/sources.ts`.
3. Point catalog entries at the new `sourceId`.
4. Add a footer link in `components/Footer.tsx` if staff should be able to jump to it.

### Change how matching works

`matchIdea` in `lib/match.ts` scores every catalog entry and returns up to nine results with a score of at least 14. Ideas shorter than 8 characters return nothing. `matchSummary` writes the sentence above the results.

Scores come from a direct name mention, shared tags, category, and overlapping words. Keep changes small and try a few known ideas on `/` before you ship a scoring change.

### Change the look

Theme tokens live in `app/globals.css` (`--background`, `--faint`, `--card`, and the rest). Shared chrome is `components/Header.tsx` and `components/Footer.tsx`.

Keep the dark background and pale blue accent. Do not bring back the terminal costume from the reference site: version chips, `>` prompts, `//` comments, snake_case labels, or tilted buttons.

## Working in the repo

- Branch from `development`.
- Record the change in `CHANGELOG.md` under `Unreleased` before you open a pull request. Use `Added`, `Changed`, `Fixed`, or `Removed`.
- Run `npm run lint` before you hand the branch over.
- Do not commit `.env` files, credentials, or anything under `.next/`.
- Do not force-push `main` or `development`.
