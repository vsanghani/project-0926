import { currentUser, getUserById, setStripeCustomerId } from "@/lib/auth";
import { appUrl, getStripe, stripeConfigured, stripePriceId } from "@/lib/billing";

export async function POST() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (user.plan === "pro") return Response.json({ error: "You already have Pro." }, { status: 400 });
  if (!stripeConfigured()) {
    return Response.json({ error: "Billing is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID." }, { status: 503 });
  }

  const stripe = getStripe();
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    setStripeCustomerId(user.id, customerId);
  } else {
    const fresh = getUserById(user.id);
    customerId = fresh?.stripeCustomerId ?? customerId;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: stripePriceId(), quantity: 1 }],
    success_url: appUrl("/account?checkout=success"),
    cancel_url: appUrl("/pricing?checkout=canceled"),
    client_reference_id: user.id,
    metadata: { userId: user.id },
    subscription_data: { metadata: { userId: user.id } },
    allow_promotion_codes: true,
  });

  if (!session.url) return Response.json({ error: "Could not start checkout." }, { status: 500 });
  return Response.json({ url: session.url });
}
