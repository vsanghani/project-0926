"use client";

import { AppCard } from "@/components/AppCard";
import { IdeaComposer } from "@/components/IdeaComposer";
import { matchIdea, matchSummary } from "@/lib/match";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const stages = [
  "Parsing your idea",
  "Scanning indie product catalogs",
  "Checking Product Hunt & directories",
  "Ranking overlaps",
];

function ResultsInner() {
  const params = useSearchParams();
  const idea = params.get("q")?.trim() ?? "";
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);

  const matches = useMemo(() => (idea ? matchIdea(idea) : []), [idea]);
  const summary = matchSummary(matches);

  useEffect(() => {
    setReady(false);
    setStage(0);
    if (!idea) {
      setReady(true);
      return;
    }

    const timers: number[] = [];
    stages.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setStage(index);
        }, index * 320),
      );
    });
    timers.push(
      window.setTimeout(() => {
        setReady(true);
      }, stages.length * 320 + 180),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [idea]);

  if (!idea) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 md:px-6">
        <h1 className="text-3xl font-semibold">
          <span className="text-faint">{">"} </span>No idea yet
        </h1>
        <p className="mt-3 font-mono text-sm text-muted">
          {`// Paste something below to scan the catalog.`}
        </p>
        <div className="mt-8">
          <IdeaComposer />
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 md:px-6">
        <p className="font-mono text-xs text-faint pulse-faint">scanning_catalog</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Finding live twins…</h1>
        <div className="relative mt-8 h-1 overflow-hidden rounded-full bg-line">
          <div className="scan-bar absolute inset-y-0 w-1/3 bg-faint" />
        </div>
        <ul className="mt-8 space-y-3">
          {stages.map((label, index) => (
            <li
              key={label}
              className={`font-mono text-sm ${index <= stage ? "text-faint" : "text-dim"}`}
            >
              {index <= stage ? "> " : "  "}
              {label}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="font-mono text-xs text-faint">scan_complete</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
        <span className="text-faint">{">"} </span>
        {matches.length ? `${matches.length} live twins` : "No close twins"}
      </h1>
      <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-muted">{`// ${summary}`}</p>

      <div className="mt-8 rounded-2xl border border-line bg-card p-5">
        <p className="font-mono text-[11px] text-dim">your_idea</p>
        <p className="mt-2 text-sm leading-6 text-foreground">{idea}</p>
      </div>

      <div className="mt-8 max-w-3xl">
        <IdeaComposer initialValue={idea} compact />
      </div>

      {matches.length ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <AppCard key={match.app.id} app={match.app} match={match} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-line bg-card p-8 text-sm leading-6 text-muted">
          Nothing in this first catalog scored high enough. Try adding the
          category, who it&apos;s for, or a comparable product. Or treat the empty
          result as a possible gap.
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-24 font-mono text-sm text-muted">
          Loading scan…
        </div>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}
