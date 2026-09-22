import type { Metadata } from "next";
import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeading } from "@/components/SectionHeading";
import { sources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "About",
};

const journey = [
  {
    year: "2023",
    title: "The duplicate launch",
    body: "A weekend build goes live. On day two someone DMs a product that already does the same thing, better, with customers.",
  },
  {
    year: "2024",
    title: "The 40-tab night",
    body: "Product Hunt, Indie Hackers, AlternativeTo, Twitter lists. Copy-paste into Notion. Repeat for every idea.",
  },
  {
    year: "2025",
    title: "The missing query",
    body: "Directories ask for a name. Google asks for keywords. Nobody lets you paste the idea and see live twins.",
  },
  {
    year: "2026",
    title: "Appkin, first draft",
    body: "A one-stop check: describe the product, scan a real catalog, read the overlap and the remaining gap.",
  },
];

const features = [
  {
    icon: "≈",
    title: "Plain-language matching",
    body: "No need to know the competitor's name. Describe the job-to-be-done and we'll rank live products against it.",
    note: "♡ Built for the blank page",
  },
  {
    icon: "{}",
    title: "Public product catalogs",
    body: "ShipFast, Nomad List, TrustMRR, PhotoAI — live sites with users. Those catalogs are more useful than another idea generator.",
    note: "♡ Ship logs, not mood boards",
  },
  {
    icon: "%",
    title: "Overlap, not vibes",
    body: "Each card says why it matched. Tags, category, language. You can disagree with the score — you can see the work.",
    note: "♡ Receipts on every twin",
  },
  {
    icon: "<>",
    title: "A named gap",
    body: "If ShipFast exists, a dentist-specific boilerplate might still be open. We write that down so 'it exists' isn't the end.",
    note: "♡ Wedges beat freeze",
  },
];

const philosophy = [
  {
    title: "Look before you generate",
    body: "The internet is full of idea machines. Almost none of them check whether the thing already ships.",
  },
  {
    title: "Live products are the dataset",
    body: "A Stripe-verified marketplace, a Next.js kit, an AI headshot mill — those teach more than a hypothetical TAM slide.",
  },
  {
    title: "Closeness is a spectrum",
    body: "92% twin means learn from them. 28% cousin means you might still have a lane. We show the number.",
  },
  {
    title: "Stay honest about coverage",
    body: "This draft is curated. It is not the whole market. We'll add sources. We won't pretend the first 50 apps are everything.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-16 text-center md:px-6 md:pt-24">
        <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-1 font-mono text-[13px] text-faint">
          the_story
        </span>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.08]">
          <span className="text-faint">{">"} </span>
          Built for builders who
          <br />
          <span className="text-zinc-400">check the map first.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-mono text-sm leading-7 text-muted">
          {`// I got tired of shipping twins I didn't know existed. So I started a catalog.`}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <article className="rounded-2xl border border-line bg-card p-6 md:p-10">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-faint/12 font-mono text-2xl text-faint">
              ≈
            </span>
            <div>
              <h2 className="text-2xl font-semibold">Hey, this is Appkin</h2>
              <p className="mt-1 font-mono text-xs text-muted">a look-before-you-ship desk</p>
            </div>
          </div>
          <div className="mt-8 space-y-5 text-[15px] leading-7 text-muted">
            <p>
              Every new project starts with the same question:{" "}
              <span className="text-faint">
                &quot;Does this already exist?&quot;
              </span>
            </p>
            <p>
              The honest answer used to take a night. You&apos;d open Product Hunt,
              skim Indie Hackers, check AlternativeTo, and still miss the obvious
              twin sitting on a live URL.
            </p>
            <p>
              Idea generators make this worse. They hand you a prompt and a TAM
              guess. They don&apos;t show you ShipFast, PhotoAI, or TrustMRR — the
              things already charging money.
            </p>
            <p>
              Appkin is the opposite. You paste the idea. We show similar apps
              that are live in the real world, where we pulled them from, and
              what gap is still sitting next to them.
            </p>
            <p className="border-l-2 border-faint/40 pl-4 text-foreground">
              &quot;I don&apos;t need more ideas. I need to know what already shipped
              mine.&quot;
            </p>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <SectionHeading
          badge="> the_journey"
          title="The Journey"
          comment="From duplicate launches to a single search box."
        />
        <div className="mt-10 space-y-4">
          {journey.map((item) => (
            <article key={item.year} className="flex gap-4">
              <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-card font-mono text-sm text-faint">
                {item.year}
              </div>
              <div className="flex-1 rounded-2xl border border-line bg-card p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          badge="> the_sources"
          title="Where the twins come from"
          comment="Public products. Public URLs. No fake startups."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <a
              key={source.id}
              href={source.site}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-line bg-card p-6 transition hover:border-faint/30"
            >
              <p className="font-mono text-[11px] text-faint">{source.countLabel}</p>
              <h3 className="mt-3 text-lg font-semibold">{source.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{source.blurb}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          badge="> what_we_built"
          title="What I built"
          comment="Every feature solves a night I already wasted."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading badge="> philosophy" title="My philosophy" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {philosophy.map((item) => (
            <article key={item.title} className="rounded-2xl border border-line bg-card p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to find your twins?
        </h2>
        <p className="mt-3 font-mono text-sm text-muted">{`// Stop guessing. Start comparing.`}</p>
        <Link
          href="/"
          className="mt-8 inline-flex rotate-1 rounded-2xl bg-faint px-6 py-3 text-sm font-semibold text-ink transition hover:rotate-0 hover:bg-white"
        >
          Check Your Idea{" "}
          <span className="font-mono" aria-hidden>
            {">"}
          </span>
        </Link>
      </section>
    </div>
  );
}
