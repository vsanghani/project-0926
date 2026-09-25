import { currentUser } from "@/lib/auth";
import { listScans } from "@/lib/store";

export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  return Response.json({ scans: listScans(user.id) });
}
