import { sources } from "@/lib/sources";
import type { LiveApp, MatchResult } from "@/lib/types";

function sourceName(id: LiveApp["sourceId"]) {
  return sources.find((source) => source.id === id)?.name ?? id;
}

function initial(name: string) {
  return name.replace(/[^A-Za-z0-9]/g, "").slice(0, 1).toUpperCase() || "≈";
}

type AppCardProps = {
  app: LiveApp;
  match?: MatchResult;
};

export function AppCard({ app, match }: AppCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition hover:border-faint/25">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-faint/12 font-mono text-lg font-semibold text-faint">
            {initial(app.name)}
          </span>
          <div>
            <h3 className="text-[15px] font-semibold leading-tight">{app.name}</h3>
            <p className="mt-0.5 font-mono text-[11px] text-muted">
              {app.maker === sourceName(app.sourceId)
                ? app.maker
                : `${app.maker} · ${sourceName(app.sourceId)}`}
            </p>
          </div>
        </div>
        {match ? (
          <span className="rounded-lg bg-faint/10 px-2 py-1 font-mono text-xs text-faint">
            {match.score}%
          </span>
        ) : (
          <span className="rounded-lg border border-line px-2 py-1 font-mono text-[11px] text-dim">
            {app.category}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">{app.tagline}</p>

      {match?.reasons?.length ? (
        <ul className="mt-4 space-y-1.5">
          {match.reasons.map((reason) => (
            <li key={reason} className="font-mono text-[11px] leading-5 text-faint-2">
              {`// ${reason}`}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-dim">{app.gap}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {app.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-line px-2 py-0.5 font-mono text-[10px] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={app.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-faint hover:text-white"
      >
        {app.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        <span aria-hidden>↗</span>
      </a>
    </article>
  );
}
