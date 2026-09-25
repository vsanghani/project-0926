import { getDb } from "./db";
import type { IdeaExample, LiveApp, MatchResult, Source, SourceId } from "./types";

type AppRow = {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  category: string;
  tags: string;
  source_id: SourceId;
  maker: string;
  year: number | null;
  featured: number;
  gap: string;
};

type SourceRow = {
  id: SourceId;
  name: string;
  short: string;
  blurb: string;
  site: string;
  count_label: string;
};

export type AppInput = {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  sourceId: SourceId;
  maker: string;
  year?: number | null;
  featured?: boolean;
  gap: string;
};

function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toApp(row: AppRow): LiveApp {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    tags: JSON.parse(row.tags) as string[],
    sourceId: row.source_id,
    maker: row.maker,
    year: row.year ?? undefined,
    featured: row.featured === 1,
    gap: row.gap,
  };
}

function toSource(row: SourceRow): Source {
  return {
    id: row.id,
    name: row.name,
    short: row.short,
    blurb: row.blurb,
    site: row.site,
    countLabel: row.count_label,
  };
}

export function listApps(): LiveApp[] {
  const rows = getDb().prepare("SELECT * FROM apps ORDER BY name COLLATE NOCASE").all() as AppRow[];
  return plain(rows.map(toApp));
}

export function listFeaturedApps(): LiveApp[] {
  const rows = getDb()
    .prepare("SELECT * FROM apps WHERE featured = 1 ORDER BY name COLLATE NOCASE")
    .all() as AppRow[];
  return plain(rows.map(toApp));
}

export function getApp(id: string): LiveApp | undefined {
  const row = getDb().prepare("SELECT * FROM apps WHERE id = ?").get(id) as AppRow | undefined;
  return row ? toApp(row) : undefined;
}

export function listSources(): Source[] {
  const rows = getDb().prepare("SELECT * FROM sources ORDER BY name COLLATE NOCASE").all() as SourceRow[];
  return plain(rows.map(toSource));
}

export function listIdeaExamples(): IdeaExample[] {
  const rows = getDb()
    .prepare("SELECT label, text FROM idea_examples ORDER BY sort_order")
    .all() as IdeaExample[];
  return plain(rows);
}

export function createApp(input: AppInput) {
  getDb()
    .prepare(
      `INSERT INTO apps (id, name, url, tagline, description, category, tags, source_id, maker, year, featured, gap)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.id,
      input.name,
      input.url,
      input.tagline,
      input.description,
      input.category,
      JSON.stringify(input.tags),
      input.sourceId,
      input.maker || input.name,
      input.year ?? null,
      input.featured ? 1 : 0,
      input.gap,
    );
  return getApp(input.id);
}

export function updateApp(id: string, input: AppInput) {
  const result = getDb()
    .prepare(
      `UPDATE apps SET
        id = ?, name = ?, url = ?, tagline = ?, description = ?, category = ?, tags = ?,
        source_id = ?, maker = ?, year = ?, featured = ?, gap = ?
       WHERE id = ?`,
    )
    .run(
      input.id,
      input.name,
      input.url,
      input.tagline,
      input.description,
      input.category,
      JSON.stringify(input.tags),
      input.sourceId,
      input.maker || input.name,
      input.year ?? null,
      input.featured ? 1 : 0,
      input.gap,
      id,
    );
  if (result.changes === 0) return undefined;
  return getApp(input.id);
}

export function deleteApp(id: string) {
  const result = getDb().prepare("DELETE FROM apps WHERE id = ?").run(id);
  return result.changes > 0;
}

export type ScanRecord = {
  id: string;
  idea: string;
  summary: string;
  createdAt: string;
  matchCount: number;
  nearestName?: string;
  nearestScore?: number;
};

export type SavedScan = ScanRecord & {
  matches: MatchResult[];
  missing: number;
};

export function saveScan(userId: string, idea: string, summary: string, matches: { appId: string; score: number; reasons: string[] }[]) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const db = getDb();
  db.exec("BEGIN");
  try {
    db.prepare("INSERT INTO scans (id, user_id, idea, summary, created_at) VALUES (?, ?, ?, ?, ?)").run(
      id,
      userId,
      idea,
      summary,
      createdAt,
    );
    const insert = db.prepare(
      "INSERT INTO scan_matches (scan_id, app_id, score, reasons, position) VALUES (?, ?, ?, ?, ?)",
    );
    matches.forEach((match, index) => {
      insert.run(id, match.appId, match.score, JSON.stringify(match.reasons), index);
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return id;
}

type ScanListRow = {
  id: string;
  idea: string;
  summary: string;
  created_at: string;
  match_count: number;
  nearest_name: string | null;
  nearest_score: number | null;
};

export function listScans(userId: string): ScanRecord[] {
  const rows = getDb()
    .prepare(
      `SELECT s.id, s.idea, s.summary, s.created_at,
        (SELECT COUNT(*) FROM scan_matches WHERE scan_id = s.id) AS match_count,
        (SELECT a.name FROM scan_matches m JOIN apps a ON a.id = m.app_id
          WHERE m.scan_id = s.id ORDER BY m.position LIMIT 1) AS nearest_name,
        (SELECT m.score FROM scan_matches m JOIN apps a ON a.id = m.app_id
          WHERE m.scan_id = s.id ORDER BY m.position LIMIT 1) AS nearest_score
       FROM scans s WHERE s.user_id = ? ORDER BY s.created_at DESC`,
    )
    .all(userId) as ScanListRow[];
  return plain(
    rows.map((row) => ({
      id: row.id,
      idea: row.idea,
      summary: row.summary,
      createdAt: row.created_at,
      matchCount: row.match_count,
      nearestName: row.nearest_name ?? undefined,
      nearestScore: row.nearest_score ?? undefined,
    })),
  );
}

export function getScan(userId: string, id: string): SavedScan | undefined {
  const row = getDb()
    .prepare("SELECT id, idea, summary, created_at FROM scans WHERE id = ? AND user_id = ?")
    .get(id, userId) as { id: string; idea: string; summary: string; created_at: string } | undefined;
  if (!row) return undefined;

  const matches = getDb()
    .prepare("SELECT app_id, score, reasons FROM scan_matches WHERE scan_id = ? ORDER BY position")
    .all(id) as { app_id: string; score: number; reasons: string }[];

  const resolved: MatchResult[] = [];
  let missing = 0;
  for (const match of matches) {
    const app = getApp(match.app_id);
    if (!app) {
      missing += 1;
      continue;
    }
    resolved.push({ app, score: match.score, reasons: JSON.parse(match.reasons) as string[] });
  }

  return plain({
    id: row.id,
    idea: row.idea,
    summary: row.summary,
    createdAt: row.created_at,
    matchCount: matches.length,
    nearestName: resolved[0]?.app.name,
    nearestScore: resolved[0]?.score,
    matches: resolved,
    missing,
  });
}

export function deleteScan(userId: string, id: string) {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM scans WHERE id = ? AND user_id = ?").get(id, userId);
  if (!existing) return false;
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM scan_matches WHERE scan_id = ?").run(id);
    db.prepare("DELETE FROM scans WHERE id = ? AND user_id = ?").run(id, userId);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return true;
}
