import type { Metadata } from "next";
import Link from "next/link";
import { liveApps } from "@/lib/catalog";
import { sources } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Sources",
};

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="font-mono text-xs text-faint">the_sources</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
        <span className="text-faint">{">"} </span>
        We don&apos;t invent products. We index live ones.
      </h1>
      <p className="mt-5 max-w-2xl font-mono text-sm leading-7 text-muted">
        {`// This first draft is curated by hand. The point is provenance: every twin has a URL you can open today.`}
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {sources.map((source) => {
          const count = liveApps.filter((app) => app.sourceId === source.id).length;
          return (
            <article
              key={source.id}
              className="rounded-2xl border border-line bg-card p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold">{source.name}</h2>
                <span className="rounded-lg bg-faint/10 px-2 py-1 font-mono text-[11px] text-faint">
                  {count} in catalog
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{source.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/explore?source=${source.id}`}
                  className="font-mono text-xs text-faint hover:text-white"
                >
                  Browse this source {">"}
                </Link>
                <a
                  href={source.site}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-dim hover:text-muted"
                >
                  {source.site.replace(/^https?:\/\//, "")} ↗
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-16 rounded-2xl border border-line bg-card p-6 md:p-10">
        <h2 className="text-2xl font-semibold">
          <span className="text-faint">{">"} </span>
          What we&apos;re adding next
        </h2>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
          <li>
            <span className="text-faint">Show HN / Hacker News</span> — launches
            that never hit Product Hunt.
          </li>
          <li>
            <span className="text-faint">GitHub trending</span> — OSS that is
            already a product.
          </li>
          <li>
            <span className="text-faint">There&apos;s An AI For That</span> — the
            AI-tool haystack, ranked as twins not a dump.
          </li>
          <li>
            <span className="text-faint">TrustMRR + Acquire.com</span> — deeper
            marketplace coverage with public revenue signals.
          </li>
        </ul>
      </section>
    </div>
  );
}
