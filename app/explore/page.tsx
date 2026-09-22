"use client";

import { AppCard } from "@/components/AppCard";
import { liveApps } from "@/lib/catalog";
import { sources } from "@/lib/sources";
import type { SourceId } from "@/lib/types";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function ExploreInner() {
  const params = useSearchParams();
  const initialSource = params.get("source") as SourceId | null;
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<SourceId | "all">(initialSource ?? "all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setSource(initialSource ?? "all");
  }, [initialSource]);

  const categories = useMemo(() => {
    const pool =
      source === "all" ? liveApps : liveApps.filter((app) => app.sourceId === source);
    return Array.from(new Set(pool.map((app) => app.category))).sort();
  }, [source]);

  useEffect(() => {
    if (category !== "all" && !categories.includes(category)) {
      setCategory("all");
    }
  }, [categories, category]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return liveApps.filter((app) => {
      if (source !== "all" && app.sourceId !== source) return false;
      if (category !== "all" && app.category !== category) return false;
      if (!q) return true;
      const blob = `${app.name} ${app.tagline} ${app.maker} ${app.category} ${app.tags.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query, source, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Catalog</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
        Explore live apps
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
        {`${liveApps.length} products from Product Hunt, Indie Hackers, directories, and indie sites. Curated by hand.`}
      </p>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by name, tag, category…"
          className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none placeholder:text-dim focus:border-faint/40"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <FilterChip active={source === "all"} onClick={() => setSource("all")}>
          All sources
        </FilterChip>
        {sources.map((item) => (
          <FilterChip
            key={item.id}
            active={source === item.id}
            onClick={() => setSource(item.id)}
          >
            {item.short}
          </FilterChip>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
          All categories
        </FilterChip>
        {categories.map((item) => (
          <FilterChip
            key={item}
            active={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </FilterChip>
        ))}
      </div>

      <p className="mt-6 text-xs text-dim">
        {filtered.length} {filtered.length === 1 ? "app" : "apps"}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-faint px-3 py-1.5 text-xs font-medium text-ink"
          : "rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted hover:text-faint"
      }
    >
      {children}
    </button>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <ExploreInner />
    </Suspense>
  );
}

function ExploreFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Catalog</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
        Explore live apps
      </h1>
      <p className="mt-4 text-sm text-muted">Loading catalog…</p>
    </div>
  );
}
