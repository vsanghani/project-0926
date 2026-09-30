import Link from "next/link";
import { redirect } from "next/navigation";
import { BillingButton } from "@/components/BillingButton";
import { currentUser } from "@/lib/auth";
import { FREE_SCAN_LIMIT, PRO_PRICE_LABEL, stripeConfigured } from "@/lib/billing";
import { countScans } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const params = await searchParams;
  const used = countScans(user.id);
  const configured = stripeConfigured();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Account</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your plan</h1>
      <p className="mt-3 text-sm text-muted">{user.email}</p>
      {params.checkout === "success" ? (
        <p className="mt-4 text-sm text-faint">
          Checkout finished. If Pro is not showing yet, wait a moment for Stripe to confirm, then refresh.
        </p>
      ) : null}

      <div className="mt-8 rounded-2xl border border-line bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-dim">Current plan</p>
            <p className="mt-2 text-xl font-semibold capitalize">{user.plan}</p>
            {user.planStatus ? <p className="mt-1 text-xs text-dim">Status: {user.planStatus}</p> : null}
          </div>
          {user.plan === "pro" ? (
            <span className="rounded-full bg-faint/12 px-3 py-1 text-xs font-medium text-faint">{PRO_PRICE_LABEL}</span>
          ) : (
            <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              {used} / {FREE_SCAN_LIMIT} saved scans
            </span>
          )}
        </div>

        <p className="mt-5 text-sm leading-6 text-muted">
          {user.plan === "pro"
            ? "Pro keeps every scan you run while signed in."
            : `Free accounts keep up to ${FREE_SCAN_LIMIT} scans. Matching itself is still unlimited.`}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {user.plan === "pro" ? (
            user.stripeCustomerId && configured ? (
              <BillingButton
                action="portal"
                label="Manage billing"
                className="rounded-full border border-line px-4 py-2.5 text-sm font-medium text-foreground disabled:opacity-50"
              />
            ) : (
              <p className="text-sm text-dim">Admin accounts have Pro without Stripe.</p>
            )
          ) : (
            <>
              <BillingButton
                action="checkout"
                label="Upgrade to Pro"
                className="rounded-full bg-faint px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-50"
              />
              <Link href="/pricing" className="rounded-full px-4 py-2.5 text-sm text-muted">
                Compare plans
              </Link>
            </>
          )}
          <Link href="/scans" className="rounded-full px-4 py-2.5 text-sm text-muted">
            View scans
          </Link>
        </div>
      </div>
    </div>
  );
}
