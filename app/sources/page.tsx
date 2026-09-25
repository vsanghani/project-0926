import type { Metadata } from "next";
import Link from "next/link";
import { listApps, listSources } from "@/lib/store";

export const metadata: Metadata = {
  title: "Sources",
};

export const dynamic = "force-dynamic";

export default function SourcesPage() {
  const sources = listSources();
  const liveApps = listApps();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Sources</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
        We don&apos;t invent products. We index live ones.
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
        This catalog is curated by hand. Every twin has a URL you can open today.
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
                <span className="rounded-full bg-faint/10 px-2.5 py-1 text-[11px] text-faint">
                  {count} in catalog
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{source.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/explore?source=${source.id}`}
                  className="text-xs text-faint hover:text-white"
                >
                  Browse this source
                </Link>
                <a
                  href={source.site}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-dim hover:text-muted"
                >
                  {source.site.replace(/^https?:\/\//, "")} ↗
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-16 rounded-2xl border border-line bg-card p-6 md:p-10">
        <h2 className="text-2xl font-semibold">What we&apos;re adding next</h2>
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
