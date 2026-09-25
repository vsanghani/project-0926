import type { AppInput } from "./store";
import type { SourceId } from "./types";

const required = ["id", "name", "url", "tagline", "description", "category", "gap"] as const;

export function parseAppInput(body: unknown, sourceIds: SourceId[]): AppInput | string {
  if (!body || typeof body !== "object") return "Expected a JSON object.";
  const record = body as Record<string, unknown>;
  for (const key of required) {
    if (typeof record[key] !== "string" || !record[key].trim()) return `${key} is required.`;
  }
  if (typeof record.sourceId !== "string" || !sourceIds.includes(record.sourceId as SourceId)) {
    return "sourceId must be an existing source.";
  }
  const tags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    : typeof record.tags === "string"
      ? record.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];
  if (!tags.length) return "Add at least one tag.";
  const year = record.year === "" || record.year == null ? null : Number(record.year);
  if (year != null && !Number.isInteger(year)) return "Year must be a number.";
  return {
    id: String(record.id).trim(),
    name: String(record.name).trim(),
    url: String(record.url).trim(),
    tagline: String(record.tagline).trim(),
    description: String(record.description).trim(),
    category: String(record.category).trim(),
    tags,
    sourceId: record.sourceId as SourceId,
    maker: typeof record.maker === "string" && record.maker.trim() ? record.maker.trim() : String(record.name).trim(),
    year,
    featured: record.featured === true || record.featured === "true" || record.featured === 1,
    gap: String(record.gap).trim(),
  };
}
