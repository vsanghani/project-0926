import { signIn } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const user = await signIn(body.email?.trim() ?? "", body.password ?? "");
  if (!user) return Response.json({ error: "Email or password is wrong." }, { status: 401 });
  return Response.json({ user });
}
