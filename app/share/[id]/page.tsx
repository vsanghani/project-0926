import { AppCard } from "@/components/AppCard";
import { ShareScanButton } from "@/components/ShareScanButton";
import { ViabilityRadar } from "@/components/ViabilityRadar";
import { WedgeAngles } from "@/components/WedgeAngles";
import { getSharedScan } from "@/lib/store";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const scan = getSharedScan(id);
  if (!scan) return { title: "Scan Not Found | Appkin" };

  const truncated = scan.idea.length > 60 ? `${scan.idea.slice(0, 57)}…` : scan.idea;
  return {
    title: `Idea Validation: "${truncated}" | Appkin`,
    description: `Market saturation and competitor validation report for: "${truncated}". Discovered ${scan.matches.length} live twins.`,
    openGraph: {
      title: `Idea Validation: "${truncated}" | Appkin`,
      description: `Market saturation: ${scan.intelligence.saturationScore}%. Discovered ${scan.matches.length} live twins and 3 strategic wedges.`,
    },
  };
}

export default async function SharedScanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scan = getSharedScan(id);
  if (!scan) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
            Public Validation Report
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {scan.matches.length ? `${scan.matches.length} live twins found` : "No close twins found"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            {scan.viewCount} {scan.viewCount === 1 ? "view" : "views"}
          </span>
          <ShareScanButton
            idea={scan.idea}
            summary={scan.summary}
            matches={scan.matches}
            intelligence={scan.intelligence}
            existingShareId={scan.id}
          />
        </div>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{scan.summary}</p>

      {/* Idea Box */}
      <div className="mt-8 rounded-2xl border border-line bg-card p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-dim">
          Analyzed Idea
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground">{scan.idea}</p>
      </div>

      {/* Viability Radar */}
      <div className="mt-8">
        <ViabilityRadar data={scan.intelligence} />
      </div>

      {/* Strategic Wedge Angles */}
      <WedgeAngles
        angles={scan.intelligence.angles}
        closestCompetitorName={scan.intelligence.closestCompetitorName}
        closestCompetitorGap={scan.intelligence.closestCompetitorGap}
      />

      {/* Live Twins */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
              Market Incumbents
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              Live Product Twins
            </h2>
          </div>
          <p className="text-xs text-muted">
            {scan.matches.length} {scan.matches.length === 1 ? "product" : "products"}
          </p>
        </div>

        {scan.matches.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scan.matches.map((match) => (
              <AppCard key={match.app.id} app={match.app} match={match} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-card p-8 text-sm leading-6 text-muted">
            No direct twins in this catalog scored high enough. This could signify an open market gap.
          </div>
        )}
      </div>

      {/* CTA Box */}
      <div className="mt-16 rounded-2xl border border-line bg-gradient-to-br from-card to-card/50 p-8 text-center md:p-12">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Have an idea of your own?
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
          Check whether your next SaaS, mobile app, or indie product already exists before writing code.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex rounded-full bg-faint px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Scan Your Idea on Appkin
          </Link>
        </div>
      </div>
    </div>
  );
}
