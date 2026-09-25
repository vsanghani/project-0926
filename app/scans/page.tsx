import Link from "next/link";
import { redirect } from "next/navigation";
import { ScanList } from "@/components/ScanList";
import { currentUser } from "@/lib/auth";
import { listScans } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ScansPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const scans = listScans(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Scans</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Ideas you already checked</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        {scans.length
          ? `${scans.length} ${scans.length === 1 ? "scan" : "scans"} for ${user.email}. Open one to see the twins saved at that time.`
          : `${user.email}. A signed-in search is kept here with the products it matched.`}
      </p>
      {scans.length ? (
        <ScanList scans={scans} />
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-card p-8">
          <p className="text-sm leading-6 text-muted">No scans yet.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-faint">
            Check an idea
          </Link>
        </div>
      )}
    </div>
  );
}
