"use client";

import type { WedgeAngle } from "@/lib/types";

type WedgeAnglesProps = {
  angles: WedgeAngle[];
  closestCompetitorName?: string;
  closestCompetitorGap?: string;
};

export function WedgeAngles({
  angles,
  closestCompetitorName,
  closestCompetitorGap,
}: WedgeAnglesProps) {
  return (
    <div className="mt-8 rounded-2xl border border-line bg-card p-6 md:p-7">
      <div className="flex flex-col gap-1 border-b border-line/80 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            Strategic Playbook
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Three Ways to Wedge Open this Market
          </h2>
        </div>
        <p className="text-xs text-muted">
          Existing apps are validation, not stop signs. Build a wedge, not a clone.
        </p>
      </div>

      {closestCompetitorGap && closestCompetitorName ? (
        <div className="mt-5 rounded-xl border border-faint/20 bg-faint/5 p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
            Incumbent Blindspot ({closestCompetitorName})
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground/90">{closestCompetitorGap}</p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {angles.map((angle) => (
          <div
            key={angle.id}
            className="flex flex-col justify-between rounded-xl border border-line/80 bg-background/40 p-5 transition hover:border-faint/30"
          >
            <div>
              <span className="inline-block rounded-full bg-faint/10 px-2.5 py-0.5 text-[11px] font-medium text-faint">
                {angle.badge}
              </span>
              <h3 className="mt-3 text-base font-semibold leading-tight text-foreground">
                {angle.title}
              </h3>
              <p className="mt-2 text-xs font-medium text-faint/90 italic">
                &ldquo;{angle.hook}&rdquo;
              </p>
              <p className="mt-3 text-xs leading-5 text-muted">
                {angle.description}
              </p>
            </div>
            <div className="mt-5 border-t border-line/60 pt-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-dim">
                Actionable Wedge
              </p>
              <p className="mt-1 text-xs font-medium leading-4 text-foreground">
                → {angle.exampleAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
