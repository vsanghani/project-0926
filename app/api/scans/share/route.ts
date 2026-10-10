import { saveSharedScan } from "@/lib/store";
import type { MatchResult, ViabilityRadar } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      scanId?: string;
      idea?: string;
      summary?: string;
      matches?: MatchResult[];
      intelligence?: ViabilityRadar;
    };

    const idea = body.idea?.trim();
    if (!idea || idea.length < 8) {
      return Response.json({ error: "Idea description is required." }, { status: 400 });
    }

    if (!body.intelligence) {
      return Response.json({ error: "Intelligence analysis is required." }, { status: 400 });
    }

    const shareId = saveSharedScan({
      scanId: body.scanId,
      idea,
      summary: body.summary || "",
      matches: body.matches || [],
      intelligence: body.intelligence,
    });

    return Response.json({
      shareId,
      shareUrl: `/share/${shareId}`,
    });
  } catch (error) {
    console.error("Error creating shared scan:", error);
    return Response.json({ error: "Failed to generate share link." }, { status: 500 });
  }
}
