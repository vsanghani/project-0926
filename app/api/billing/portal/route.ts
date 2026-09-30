import { currentUser } from "@/lib/auth";
import { appUrl, getStripe, stripeConfigured } from "@/lib/billing";

export async function POST() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!user.stripeCustomerId) {
    return Response.json({ error: "No billing account yet. Upgrade to Pro first." }, { status: 400 });
  }
  if (!stripeConfigured()) {
    return Response.json({ error: "Billing is not configured." }, { status: 503 });
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: appUrl("/account"),
  });
  return Response.json({ url: session.url });
}
