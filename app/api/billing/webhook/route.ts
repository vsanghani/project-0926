import { getUserByCustomerId, getUserById, setStripeCustomerId, setUserPlan } from "@/lib/auth";
import { getStripe } from "@/lib/billing";
import type Stripe from "stripe";

export const runtime = "nodejs";

function planFromSubscription(subscription: Stripe.Subscription): { plan: "free" | "pro"; status: string } {
  const active = subscription.status === "active" || subscription.status === "trialing";
  return { plan: active ? "pro" : "free", status: subscription.status };
}

async function applySubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  let user = userId ? getUserById(userId) : null;
  if (!user) user = getUserByCustomerId(customerId);
  if (!user) return;

  if (!user.stripeCustomerId) setStripeCustomerId(user.id, customerId);
  const { plan, status } = planFromSubscription(subscription);
  setUserPlan(user.id, plan, status, plan === "pro" ? subscription.id : null);
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature failed.", error);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        if (session.client_reference_id && !subscription.metadata.userId) {
          await stripe.subscriptions.update(subscriptionId, {
            metadata: { ...subscription.metadata, userId: session.client_reference_id },
          });
          subscription.metadata.userId = session.client_reference_id;
        }
        if (session.customer && typeof session.customer === "string" && session.client_reference_id) {
          setStripeCustomerId(session.client_reference_id, session.customer);
        }
        await applySubscription(subscription);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await applySubscription(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handler failed.", error);
    return Response.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
