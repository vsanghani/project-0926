import { signUp } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  try {
    const user = await signUp(body.email ?? "", body.password ?? "");
    return Response.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create the account.";
    return Response.json({ error: message }, { status: 400 });
  }
}
