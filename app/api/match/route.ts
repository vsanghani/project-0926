import { currentUser } from "@/lib/auth";
import { matchIdea, matchSummary } from "@/lib/match";
import { listApps, listSources, saveScan } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { idea?: string };
  const idea = body.idea?.trim() ?? "";
  if (idea.length < 8) return Response.json({ error: "Describe the idea in at least 8 characters." }, { status: 400 });

  const matches = matchIdea(idea, listApps());
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

  return Response.json({ matches, summary, scanId, sources: listSources() });
}
