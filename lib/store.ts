import { getDb } from "./db";
import type { IdeaExample, LiveApp, Source, SourceId } from "./types";

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

export function listScans(userId: string): ScanRecord[] {
  const rows = getDb()
    .prepare("SELECT id, idea, summary, created_at FROM scans WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as { id: string; idea: string; summary: string; created_at: string }[];
  return plain(rows.map((row) => ({
    id: row.id,
    idea: row.idea,
    summary: row.summary,
    createdAt: row.created_at,
  })));
}
