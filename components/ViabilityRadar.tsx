"use client";

import type { ViabilityRadar as ViabilityRadarType } from "@/lib/types";

type ViabilityRadarProps = {
  data: ViabilityRadarType;
};

export function ViabilityRadar({ data }: ViabilityRadarProps) {
  const saturationColor =
    data.saturationScore >= 75
      ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
      : data.saturationScore >= 40
        ? "text-sky-300 bg-sky-300/10 border-sky-300/20"
        : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";

  const wedgeColor =
    data.wedgePotentialScore >= 75
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : data.wedgePotentialScore >= 50
        ? "text-sky-300 bg-sky-300/10 border-sky-300/20"
        : "text-amber-400 bg-amber-400/10 border-amber-400/20";

  return (
    <div className="rounded-2xl border border-line bg-card p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/80 pb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            Validation Intelligence
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Market Saturation & Wedge Radar
          </h2>
        </div>
        {data.closestCompetitorName && (
          <div className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            Nearest Incumbent:{" "}
            <span className="font-medium text-foreground">{data.closestCompetitorName}</span>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Saturation Card */}
        <div className="flex flex-col justify-between rounded-xl border border-line/70 bg-background/50 p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-dim">Saturation</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${saturationColor}`}>
                {data.saturationLevel}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {data.saturationScore}%
              </span>
              <span className="text-xs text-muted">crowded</span>
            </div>
            <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-faint transition-all duration-700"
                style={{ width: `${data.saturationScore}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">{data.saturationComment}</p>
        </div>

        {/* Wedge Opportunity Card */}
        <div className="flex flex-col justify-between rounded-xl border border-line/70 bg-background/50 p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-dim">Wedge Opportunity</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${wedgeColor}`}>
                {data.wedgePotentialLevel}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-foreground">
                {data.wedgePotentialScore}%
              </span>
              <span className="text-xs text-muted">whitespace</span>
            </div>
            <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${data.wedgePotentialScore}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            {data.wedgePotentialScore >= 70
              ? "Significant whitespace open to capture early market share."
              : "Defensible angle required; focus on specific unbundled features."}
          </p>
        </div>

        {/* Speed to MVP */}
        <div className="flex flex-col justify-between rounded-xl border border-line/70 bg-background/50 p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-dim">Build Scope</span>
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-muted">
                Est. MVP
              </span>
            </div>
            <p className="mt-3 text-base font-semibold leading-tight text-foreground">
              {data.speedToMvp}
            </p>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            Estimated timeline for an agile solo-founder to ship an operational proof-of-concept.
          </p>
        </div>

        {/* Recommended Monetization */}
        <div className="flex flex-col justify-between rounded-xl border border-line/70 bg-background/50 p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-dim">Monetization Wedge</span>
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-muted">
                Pricing
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug text-foreground">
              {data.monetizationModel}
            </p>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            Counter prevailing subscription fatigue with transparent pricing models.
          </p>
        </div>
      </div>
    </div>
  );
}
