"use client";

import { formatScanWhen } from "@/lib/format-scan";
import type { ScanRecord } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ScanList({ scans }: { scans: ScanRecord[] }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function remove(id: string) {
    setMessage("");
    const response = await fetch(`/api/scans/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Could not remove that scan.");
      return;
    }
    setConfirming(null);
    router.refresh();
  }

  return (
    <div className="mt-8">
      {message ? <p className="mb-3 text-sm text-red-300">{message}</p> : null}
      <ul className="overflow-hidden rounded-2xl border border-line bg-card">
        {scans.map((scan) => (
          <li key={scan.id} className="border-b border-line last:border-b-0">
            <div className="flex items-start gap-4 px-5 py-4">
              <Link href={`/scans/${scan.id}`} className="min-w-0 flex-1">
                <p className="text-[11px] text-dim">{formatScanWhen(scan.createdAt)}</p>
                <p className="mt-1 text-sm leading-6">{scan.idea}</p>
                <p className="mt-2 text-xs text-muted">{scan.summary}</p>
                <p className="mt-2 text-xs text-faint">
                  {scan.matchCount === 0
                    ? "No twins saved"
                    : scan.nearestName
                      ? `${scan.matchCount} ${scan.matchCount === 1 ? "twin" : "twins"} · nearest ${scan.nearestName}${scan.nearestScore != null ? ` ${scan.nearestScore}%` : ""}`
                      : `${scan.matchCount} ${scan.matchCount === 1 ? "twin" : "twins"}`}
                </p>
              </Link>
              {confirming === scan.id ? (
                <div className="flex shrink-0 items-center gap-2 pt-1">
                  <button type="button" onClick={() => remove(scan.id)} className="text-xs font-medium text-red-300">
                    Confirm
                  </button>
                  <button type="button" onClick={() => setConfirming(null)} className="text-xs text-muted">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(scan.id)}
                  className="shrink-0 pt-1 text-xs text-dim hover:text-foreground"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
