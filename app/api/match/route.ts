import { currentUser } from "@/lib/auth";
import { FREE_SCAN_LIMIT } from "@/lib/billing";
import { appEmbeddingText, EMBEDDING_MODEL, embeddingHash, embedText } from "@/lib/embed";
import { matchIdea, matchSummary } from "@/lib/match";
import { countScans, listApps, listSources, saveAppEmbedding, saveScan, storedEmbeddings } from "@/lib/store";

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

  let scanId: string | null = null;
  let saveStatus: "anonymous" | "saved" | "limit" | "pro" = "anonymous";
  if (user) {
    const used = countScans(user.id);
    if (user.plan === "pro" || used < FREE_SCAN_LIMIT) {
      scanId = saveScan(
        user.id,
        idea,
        summary,
        matches.map((match) => ({ appId: match.app.id, score: match.score, reasons: match.reasons })),
      );
      saveStatus = user.plan === "pro" ? "pro" : "saved";
    } else {
      saveStatus = "limit";
    }
  }

  return Response.json({
    matches,
    summary,
    scanId,
    sources,
    saveStatus,
    scanLimit: FREE_SCAN_LIMIT,
    scanCount: user ? countScans(user.id) : 0,
    plan: user?.plan ?? null,
  });
}
