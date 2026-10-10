import { AppCard } from "@/components/AppCard";
import { ShareScanButton } from "@/components/ShareScanButton";
import { ViabilityRadar } from "@/components/ViabilityRadar";
import { WedgeAngles } from "@/components/WedgeAngles";
import { currentUser } from "@/lib/auth";
import { formatScanWhen } from "@/lib/format-scan";
import { getScan } from "@/lib/store";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ScanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const { id } = await params;
  const scan = getScan(user.id, id);
  if (!scan) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/scans" className="text-xs text-muted hover:text-faint">
            ← All scans
          </Link>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Saved scan</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            {scan.matches.length ? `${scan.matches.length} live twins` : "No close twins"}
          </h1>
          <p className="mt-2 text-sm text-dim">{formatScanWhen(scan.createdAt)}</p>
        </div>

        {scan.intelligence && (
          <ShareScanButton
            idea={scan.idea}
            summary={scan.summary}
            matches={scan.matches}
            intelligence={scan.intelligence}
            scanId={scan.id}
          />
        )}
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{scan.summary}</p>

      {/* Idea Box */}
      <div className="mt-8 rounded-2xl border border-line bg-card p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-dim">Your idea</p>
        <p className="mt-2 text-sm leading-6">{scan.idea}</p>
      </div>

      <Link
        href={`/results?q=${encodeURIComponent(scan.idea)}`}
        className="mt-4 inline-block text-sm text-faint"
      >
        Scan this idea again
      </Link>

      {/* Market Saturation & Viability Radar */}
      {scan.intelligence && (
        <div className="mt-10">
          <ViabilityRadar data={scan.intelligence} />
        </div>
      )}

      {/* 3 Strategic Differentiation Wedges */}
      {scan.intelligence && (
        <WedgeAngles
          angles={scan.intelligence.angles}
          closestCompetitorName={scan.intelligence.closestCompetitorName}
          closestCompetitorGap={scan.intelligence.closestCompetitorGap}
        />
      )}

      {scan.missing ? (
        <p className="mt-6 text-xs text-dim">
          {scan.missing} {scan.missing === 1 ? "product from this scan is" : "products from this scan are"} no longer in the catalog.
        </p>
      ) : null}

      {/* Matched Products */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Captured Products in This Space
        </h2>

        {scan.matches.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scan.matches.map((match) => (
              <AppCard key={match.app.id} app={match.app} match={match} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-card p-8 text-sm leading-6 text-muted">
            Nothing in the catalog scored high enough when this idea was checked.
          </div>
        )}
      </div>
    </div>
  );
}
