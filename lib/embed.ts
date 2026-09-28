import { createHash } from "node:crypto";
import type { LiveApp } from "./types";

export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

type Extractor = (
  text: string,
  options: { pooling: "mean"; normalize: true },
) => Promise<{ data: ArrayLike<number> }>;

const globalForEmbed = globalThis as unknown as { appkinEmbedder?: Promise<Extractor> };

function embedder() {
  if (!globalForEmbed.appkinEmbedder) {
    globalForEmbed.appkinEmbedder = import("@huggingface/transformers").then(async ({ pipeline }) => {
      const extractor = await pipeline("feature-extraction", EMBEDDING_MODEL);
      return extractor as Extractor;
    });
  }
  return globalForEmbed.appkinEmbedder;
}

export function appEmbeddingText(app: LiveApp) {
  return `${app.name}. ${app.tagline} ${app.description} Category: ${app.category}. Tags: ${app.tags.join(", ")}.`;
}

export function embeddingHash(text: string) {
  return createHash("sha256").update(`${EMBEDDING_MODEL}\n${text}`).digest("hex");
}

export async function embedText(text: string) {
  const extractor = await embedder();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data, (value) => Number(value.toFixed(6)));
}

export function cosineSimilarity(left: number[], right: number[]) {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  for (let index = 0; index < length; index += 1) dot += left[index] * right[index];
  return dot;
}
