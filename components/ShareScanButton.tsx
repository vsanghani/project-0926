"use client";

import type { MatchResult, ViabilityRadar } from "@/lib/types";
import { useState } from "react";

type ShareScanButtonProps = {
  idea: string;
  summary: string;
  matches: MatchResult[];
  intelligence: ViabilityRadar;
  scanId?: string | null;
  existingShareId?: string;
};

export function ShareScanButton({
  idea,
  summary,
  matches,
  intelligence,
  scanId,
  existingShareId,
}: ShareScanButtonProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(
    existingShareId ? `/share/${existingShareId}` : null,
  );

  async function handleShare() {
    if (loading) return;

    if (shareUrl) {
      const fullUrl = `${window.location.origin}${shareUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/scans/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          summary,
          matches,
          intelligence,
          scanId: scanId || undefined,
        }),
      });

      if (!res.ok) throw new Error("Share link failed");
      const data = (await res.json()) as { shareId: string; shareUrl: string };
      setShareUrl(data.shareUrl);

      const fullUrl = `${window.location.origin}${data.shareUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to share scan:", err);
    } finally {
      setLoading(false);
    }
  }

  const tweetText = `Just scanned an app idea on Appkin. ${matches.length ? `Found ${matches.length} live twins and the open market wedge:` : "Zero direct twins found in the catalog:"}`;
  const tweetHref = shareUrl
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(
        typeof window !== "undefined" ? `${window.location.origin}${shareUrl}` : shareUrl,
      )}`
    : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition hover:border-faint/40 hover:text-faint disabled:opacity-50"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {copied ? "Link Copied!" : loading ? "Generating…" : "Share Report"}
      </button>

      {shareUrl && tweetHref && (
        <a
          href={tweetHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-card px-3 py-2 text-xs text-muted transition hover:border-faint/30 hover:text-foreground"
        >
          <span>Share to</span>
          <span className="font-semibold text-foreground">𝕏</span>
        </a>
      )}
    </div>
  );
}
