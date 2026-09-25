import { redirect } from "next/navigation";
import { AdminEditor } from "@/components/AdminEditor";
import { currentUser } from "@/lib/auth";
import { listApps, listSources } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await currentUser();
  if (!user?.isAdmin) redirect("/sign-in");
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Catalog</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Edit live products</h1>
      <AdminEditor apps={listApps()} sources={listSources()} />
    </div>
  );
}
