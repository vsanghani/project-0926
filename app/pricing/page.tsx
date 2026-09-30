import Link from "next/link";
import { BillingButton } from "@/components/BillingButton";
import { currentUser } from "@/lib/auth";
import { FREE_SCAN_LIMIT, PRO_PRICE_LABEL, stripeConfigured } from "@/lib/billing";

export const dynamic = "force-dynamic";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await currentUser();
  const params = await searchParams;
  const configured = stripeConfigured();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Pricing</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Look first. Then decide.</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
        Matching stays free. Sign in to keep a short history. Pro removes the save limit and keeps every scan.
      </p>
      {params.checkout === "canceled" ? (
        <p className="mt-4 text-sm text-muted">Checkout was canceled. Nothing was charged.</p>
      ) : null}
      {!configured ? (
        <p className="mt-4 rounded-2xl border border-line bg-card px-4 py-3 text-sm text-muted">
          Stripe keys are not set yet. Staff can still use Free locally; checkout needs `STRIPE_SECRET_KEY` and
          `STRIPE_PRICE_ID`.
        </p>
      ) : null}

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-line bg-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-dim">Free</p>
          <h2 className="mt-2 text-2xl font-semibold">$0</h2>
          <ul className="mt-5 space-y-2 text-sm leading-6 text-muted">
            <li>Unlimited idea matching</li>
            <li>Browse the full catalog</li>
            <li>{FREE_SCAN_LIMIT} saved scans with an account</li>
          </ul>
          <Link
            href={user ? "/scans" : "/sign-in"}
            className="mt-8 inline-flex rounded-full border border-line px-4 py-2.5 text-sm font-medium text-foreground"
          >
            {user ? "Open your scans" : "Create a free account"}
          </Link>
        </article>

        <article className="rounded-2xl border border-faint/30 bg-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Pro</p>
          <h2 className="mt-2 text-2xl font-semibold">{PRO_PRICE_LABEL}</h2>
          <ul className="mt-5 space-y-2 text-sm leading-6 text-muted">
            <li>Everything in Free</li>
            <li>Unlimited saved scans</li>
            <li>Manage billing in Stripe</li>
          </ul>
          <div className="mt-8">
            {user?.plan === "pro" ? (
              <Link href="/account" className="inline-flex rounded-full bg-faint px-4 py-2.5 text-sm font-semibold text-ink">
                You are on Pro
              </Link>
            ) : user ? (
              <BillingButton
                action="checkout"
                label="Upgrade to Pro"
                className="rounded-full bg-faint px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-50"
              />
            ) : (
              <Link href="/sign-in" className="inline-flex rounded-full bg-faint px-4 py-2.5 text-sm font-semibold text-ink">
                Sign in to upgrade
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
