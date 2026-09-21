import { liveApps } from "./catalog";
import { sources } from "./sources";
import type { LiveApp, MatchResult } from "./types";

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "for",
  "to",
  "of",
  "in",
  "on",
  "with",
  "that",
  "this",
  "from",
  "is",
  "it",
  "be",
  "by",
  "as",
  "at",
  "so",
  "can",
  "will",
  "just",
  "like",
  "you",
  "your",
  "we",
  "our",
  "i",
  "my",
  "me",
  "want",
  "need",
  "make",
  "made",
  "build",
  "building",
  "built",
  "create",
  "creating",
  "app",
  "apps",
  "tool",
  "tools",
  "product",
  "products",
  "idea",
  "something",
  "someone",
  "people",
  "users",
  "user",
  "one",
  "out",
  "into",
  "over",
  "than",
  "then",
  "also",
  "more",
  "most",
  "very",
  "really",
  "simple",
  "easily",
  "without",
  "using",
  "use",
  "used",
  "help",
  "helps",
  "let",
  "lets",
  "get",
  "got",
  "has",
  "have",
  "had",
  "not",
  "but",
  "if",
  "do",
  "does",
  "any",
  "all",
  "new",
  "who",
  "what",
  "when",
  "how",
  "which",
  "their",
  "them",
  "they",
  "there",
  "here",
  "about",
  "into",
  "via",
  "per",
  "etc",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9.+#\s-]/g, " ")
    .split(/[\s/-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP.has(token));
}

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function phraseIn(haystack: string, needle: string) {
  return haystack.includes(needle.toLowerCase());
}

export function matchIdea(idea: string, catalog: LiveApp[] = liveApps): MatchResult[] {
  const cleaned = idea.trim();
  if (cleaned.length < 8) return [];

  const ideaLower = cleaned.toLowerCase();
  const tokens = unique(tokenize(cleaned));
  if (tokens.length === 0) return [];

  const scored = catalog.map((app) => {
    let raw = 0;
    const reasons: string[] = [];
    const haystack = `${app.name} ${app.tagline} ${app.description} ${app.category} ${app.tags.join(" ")}`.toLowerCase();

    if (phraseIn(ideaLower, app.name.toLowerCase())) {
      raw += 48;
      reasons.push(`You named ${app.name} directly`);
    }

    const tagHits = app.tags.filter((tag) => {
      const t = tag.toLowerCase();
      if (t.length <= 2) return false;
      if (phraseIn(ideaLower, t)) return true;
      const tagTokens = tokenize(t);
      return tagTokens.length > 0 && tagTokens.every((part) => tokens.includes(part));
    });

    if (tagHits.length) {
      raw += Math.min(36, tagHits.length * 9);
      const shown = tagHits.slice(0, 3);
      reasons.push(`Overlaps on ${shown.join(", ")}`);
    }

    const categoryToken = tokenize(app.category);
    if (categoryToken.some((part) => tokens.includes(part) || phraseIn(ideaLower, app.category.toLowerCase()))) {
      raw += 12;
      reasons.push(`Same category: ${app.category}`);
    }

    const descTokens = unique(tokenize(`${app.tagline} ${app.description}`));
    const overlap = descTokens.filter((token) => tokens.includes(token));
    if (overlap.length) {
      raw += Math.min(22, overlap.length * 3);
      if (reasons.length < 3) {
        reasons.push(`Similar language around ${overlap.slice(0, 2).join(" & ")}`);
      }
    }

    const makerBits = tokenize(app.maker);
    if (makerBits.some((part) => tokens.includes(part))) {
      raw += 10;
      reasons.push(`Same maker orbit: ${app.maker}`);
    }

    const source = sources.find((item) => item.id === app.sourceId);
    if (source && phraseIn(ideaLower, source.name.toLowerCase())) {
      raw += 6;
    }

    if (haystack.split(" ").some((word) => word.length > 5 && ideaLower.includes(word) && !STOP.has(word))) {
      raw += 4;
    }

    const score = Math.max(0, Math.min(97, Math.round(raw)));
    return { app, score, reasons: unique(reasons).slice(0, 3) };
  });

  return scored
    .filter((item) => item.score >= 14)
    .sort((a, b) => b.score - a.score)
    .slice(0, 9);
}

export function matchSummary(matches: MatchResult[]) {
  if (!matches.length) {
    return "No close twins in this first catalog. That can mean a gap — or a description we need more words for.";
  }
  const top = matches[0];
  if (top.score >= 70) {
    return `This idea already has close live twins. ${top.app.name} is the nearest.`;
  }
  if (top.score >= 40) {
    return `Nearby products exist. ${top.app.name} is the closest live example.`;
  }
  return `Loose cousins exist, but nothing here is a carbon copy. ${top.app.name} is the nearest neighbor.`;
}
