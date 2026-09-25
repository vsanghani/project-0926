import { currentUser } from "@/lib/auth";
import { deleteScan, getScan } from "@/lib/store";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params;
  const scan = getScan(user.id, id);
  if (!scan) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ scan });
}

export async function DELETE(_request: Request, { params }: Context) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params;
  if (!deleteScan(user.id, id)) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json({ ok: true });
}
