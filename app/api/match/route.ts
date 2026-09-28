import { currentUser } from "@/lib/auth";
import { appEmbeddingText, EMBEDDING_MODEL, embeddingHash, embedText } from "@/lib/embed";
import { matchIdea, matchSummary } from "@/lib/match";
import { listApps, listSources, saveAppEmbedding, saveScan, storedEmbeddings } from "@/lib/store";

async function catalogEmbeddings(apps: ReturnType<typeof listApps>) {
  const stored = storedEmbeddings(EMBEDDING_MODEL);
  const byAppId = new Map<string, number[]>();
  for (const app of apps) {
    const text = appEmbeddingText(app);
    const hash = embeddingHash(text);
    const existing = stored.get(app.id);
    if (existing && existing.hash === hash) {
      byAppId.set(app.id, existing.vector);
      continue;
    }
    const vector = await embedText(text);
    saveAppEmbedding(app.id, EMBEDDING_MODEL, hash, vector);
    byAppId.set(app.id, vector);
  }
  return byAppId;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { idea?: string };
  const idea = body.idea?.trim() ?? "";
  if (idea.length < 8) return Response.json({ error: "Describe the idea in at least 8 characters." }, { status: 400 });

  const sources = listSources();
  const apps = listApps();
  let embeddings: { idea: number[]; byAppId: Map<string, number[]> } | undefined;
  try {
    embeddings = { idea: await embedText(idea), byAppId: await catalogEmbeddings(apps) };
  } catch (error) {
    console.error("Embedding match failed, using word overlap only.", error);
  }
  const matches = matchIdea(idea, apps, sources, embeddings);
  const summary = matchSummary(matches);
  const user = await currentUser();
  const scanId = user
    ? saveScan(
        user.id,
        idea,
        summary,
        matches.map((match) => ({ appId: match.app.id, score: match.score, reasons: match.reasons })),
      )
    : null;

  return Response.json({ matches, summary, scanId, sources });
}
