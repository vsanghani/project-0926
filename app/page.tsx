import Link from "next/link";
import { AppCard } from "@/components/AppCard";
import { FeatureCard } from "@/components/FeatureCard";
import { IdeaComposer } from "@/components/IdeaComposer";
import { SectionHeading } from "@/components/SectionHeading";
import { listFeaturedApps, listIdeaExamples, listSources } from "@/lib/store";

const steps = [
  {
    n: "01",
    title: "Paste the idea",
    body: "A sentence is enough. A paragraph is better. Who it's for, what it does, how it charges.",
  },
  {
    n: "02",
    title: "We scan what's live",
    body: "The first catalog pulls from Product Hunt, Indie Hackers, directories, and indie products already charging users.",
  },
  {
    n: "03",
    title: "See the twins",
    body: "Match score, overlap reasons, and the gap still open — so you build a wedge, not a clone.",
  },
];

const features = [
  {
    title: "Idea-to-twin search",
    body: "Describe a product in plain language. Appkin ranks live apps by overlap instead of making you browse directories.",
    note: "Skip the 40-tab research night",
  },
  {
    title: "Live product catalogs",
    body: "ShipFast, Nomad List, HeadshotPro, Chatbase, Cal.com — products that already have users, not pitch decks.",
    note: "Real products, public URLs",
  },
  {
    title: "Overlap scoring",
    body: "Every result shows why it matched: shared tags, category, language. You can see the twin, not just a logo grid.",
    note: "Know how close you are",
  },
  {
    title: "The remaining gap",
    body: "Each live app includes a wedge note — what's still open around that product so you don't freeze at 'it exists'.",
    note: "Existing does not mean unavailable",
  },
  {
    title: "Source-aware",
    body: "Filter by where a product came from. Indie products, launch sites, and marketplaces are different kinds of signal.",
    note: "Provenance on every card",
  },
  {
    title: "Built for the blank page",
    body: "Use Appkin before you open Cursor. If a twin is already live, you'll know in one screen.",
    note: "Look, then ship",
  },
];

const principles = [
  {
    title: "Existence is data",
    body: "A live twin is not a veto. It's a map of pricing, positioning, and what's already been tried.",
  },
  {
    title: "Source the real world",
    body: "We'd rather show ShipFast than a generated 'SaaS boilerplate idea'. Live products beat hypotheticals.",
  },
  {
    title: "Name the gap",
    body: "If something exists, say what's still open. Builders don't need more fear. They need a wedge.",
  },
  {
    title: "Stay small, stay honest",
    body: "This first draft is a curated catalog plus matching — not a claim that we've scraped the whole internet.",
  },
];

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featured = listFeaturedApps();
  const sources = listSources();
  const examples = listIdeaExamples();

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-16 text-center md:px-6 md:pt-24">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
          Find twins
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.08]">
          Don&apos;t build a twin
          <br />
          <span className="text-zinc-400">you didn&apos;t know existed.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted md:text-[15px]">
          Paste your idea. We&apos;ll show similar apps already live — Product Hunt,
          Indie Hackers, directories, and more.
        </p>
        <div className="mt-10 text-left">
          <IdeaComposer examples={examples} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-dim">
          Sourced from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {sources.map((source) => (
            <Link
              key={source.id}
              href={`/explore?source=${source.id}`}
              className="rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted transition hover:border-faint/35 hover:text-faint"
            >
              {source.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          badge="How it works"
          title="Three steps. Then you know."
          comment="No account. No 40-minute research rabbit hole."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.n} className="rounded-2xl border border-line bg-card p-6">
              <p className="text-sm font-medium text-faint">{step.n}</p>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          badge="Live now"
          title="A slice of what's already shipping"
          comment="Featured from the first catalog. Explore the rest."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/explore"
            className="inline-flex rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-faint transition hover:border-faint/40"
          >
            Browse the catalog
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          badge="The product"
          title="What Appkin does"
          comment="Every feature is a step we used to do by hand."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          badge="Philosophy"
          title="How we think about twins"
          comment="Existing products are teachers, not stop signs."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {principles.map((item) => (
            <article key={item.title} className="rounded-2xl border border-line bg-card p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to check your idea?
        </h2>
        <p className="mt-3 text-sm text-muted">Look first. Then ship.</p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-full bg-faint px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Find live twins
          </Link>
        </div>
      </section>
    </div>
  );
}
