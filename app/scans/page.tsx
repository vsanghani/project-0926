import Link from "next/link";
import { redirect } from "next/navigation";
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
      <p className="mt-3 text-sm text-muted">{user.email}</p>
      {scans.length ? (
        <ul className="mt-8 space-y-3">
          {scans.map((scan) => (
            <li key={scan.id}>
              <Link href={`/results?q=${encodeURIComponent(scan.idea)}`} className="block rounded-2xl border border-line bg-card p-5">
                <p className="text-sm leading-6">{scan.idea}</p>
                <p className="mt-2 text-xs text-muted">{scan.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-muted">No scans yet. Check an idea and it will show up here.</p>
      )}
    </div>
  );
}
