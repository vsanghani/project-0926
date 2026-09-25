import { currentUser } from "@/lib/auth";
import { parseAppInput } from "@/lib/app-input";
import { deleteApp, getApp, listSources, updateApp } from "@/lib/store";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ app });
}

export async function PATCH(request: Request, { params }: Context) {
  const user = await currentUser();
  if (!user?.isAdmin) return Response.json({ error: "Admin only." }, { status: 401 });
  const { id } = await params;
  const parsed = parseAppInput(await request.json(), listSources().map((source) => source.id));
  if (typeof parsed === "string") return Response.json({ error: parsed }, { status: 400 });
  const app = updateApp(id, parsed);
  if (!app) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ app });
}

export async function DELETE(_request: Request, { params }: Context) {
  const user = await currentUser();
  if (!user?.isAdmin) return Response.json({ error: "Admin only." }, { status: 401 });
  const { id } = await params;
  if (!deleteApp(id)) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ ok: true });
}
