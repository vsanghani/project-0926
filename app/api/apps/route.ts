import { currentUser } from "@/lib/auth";
import { parseAppInput } from "@/lib/app-input";
import { createApp, listApps, listSources } from "@/lib/store";

export async function GET() {
  return Response.json({ apps: listApps(), sources: listSources() });
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user?.isAdmin) return Response.json({ error: "Admin only." }, { status: 401 });
  const parsed = parseAppInput(await request.json(), listSources().map((source) => source.id));
  if (typeof parsed === "string") return Response.json({ error: parsed }, { status: 400 });
  if (listApps().some((app) => app.id === parsed.id)) {
    return Response.json({ error: "That id is already in the catalog." }, { status: 409 });
  }
  return Response.json({ app: createApp(parsed) }, { status: 201 });
}
