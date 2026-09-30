"use client";

import { useState } from "react";

type BillingButtonProps = {
  action: "checkout" | "portal";
  label: string;
  className?: string;
};

export function BillingButton({ action, label, className }: BillingButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/billing/${action}`, { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error ?? "Could not open billing.");
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not open billing.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" disabled={busy} onClick={run} className={className}>
        {busy ? "Opening…" : label}
      </button>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
