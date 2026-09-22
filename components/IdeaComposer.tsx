"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ideaExamples } from "@/lib/catalog";

type IdeaComposerProps = {
  initialValue?: string;
  compact?: boolean;
};

export function IdeaComposer({ initialValue = "", compact = false }: IdeaComposerProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function submit(text: string) {
    const idea = text.trim();
    if (idea.length < 8) return;
    router.push(`/results?q=${encodeURIComponent(idea)}`);
  }

  return (
    <div className="w-full">
      <form
        className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_0_0_1px_rgba(206,213,217,0.04)]"
        onSubmit={(event) => {
          event.preventDefault();
          submit(value);
        }}
      >
        <label className="sr-only" htmlFor="idea">
          Describe your idea
        </label>
        <textarea
          id="idea"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={compact ? 4 : 6}
          placeholder="Describe the app you want to build. Be specific: who it's for, what it does, how it makes money."
          className="w-full resize-none bg-transparent px-4 py-4 text-sm leading-6 text-foreground outline-none placeholder:text-dim md:px-5 md:text-[15px]"
        />
        <div className="flex flex-col gap-3 border-t border-line px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p className="text-xs text-dim">
            {value.trim().length < 8
              ? "At least 8 characters"
              : `${value.trim().split(/\s+/).length} words`}
          </p>
          <button
            type="submit"
            disabled={value.trim().length < 8}
            className="rounded-full bg-faint px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Find live twins
          </button>
        </div>
      </form>

      {!compact ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {ideaExamples.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => {
                setValue(example.text);
              }}
              className="rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted transition hover:border-faint/40 hover:text-faint"
            >
              {example.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
