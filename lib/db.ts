import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { liveApps, ideaExamples } from "./catalog";
import { sources as seedSources } from "./sources";

const globalForDb = globalThis as unknown as { appkinDb?: DatabaseSync };

function createDb() {
  const dir = path.join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path.join(dir, "appkin.sqlite"));
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      short TEXT NOT NULL,
      blurb TEXT NOT NULL,
      site TEXT NOT NULL,
      count_label TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS apps (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL,
      source_id TEXT NOT NULL,
      maker TEXT NOT NULL,
      year INTEGER,
      featured INTEGER NOT NULL DEFAULT 0,
      gap TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS idea_examples (
      id INTEGER PRIMARY KEY,
      label TEXT NOT NULL,
      text TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      idea TEXT NOT NULL,
      summary TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS scan_matches (
      scan_id TEXT NOT NULL,
      app_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      reasons TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `);
  seed(db);
  ensureAdmin(db);
  return db;
}

function ensureAdmin(db: DatabaseSync) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: string } | undefined;
  const hash = bcrypt.hashSync(password, 10);
  if (existing) {
    db.prepare("UPDATE users SET password_hash = ?, is_admin = 1 WHERE id = ?").run(hash, existing.id);
    return;
  }
  db.prepare("INSERT INTO users (id, email, password_hash, is_admin, created_at) VALUES (?, ?, ?, 1, ?)").run(
    crypto.randomUUID(),
    email,
    hash,
    new Date().toISOString(),
  );
}

function seed(db: DatabaseSync) {
  const count = db.prepare("SELECT COUNT(*) AS n FROM apps").get() as { n: number };
  if (count.n > 0) return;

  const insertSource = db.prepare(
    "INSERT INTO sources (id, name, short, blurb, site, count_label) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const insertApp = db.prepare(
    `INSERT INTO apps (id, name, url, tagline, description, category, tags, source_id, maker, year, featured, gap)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertExample = db.prepare(
    "INSERT INTO idea_examples (label, text, sort_order) VALUES (?, ?, ?)",
  );

  db.exec("BEGIN");
  try {
    for (const source of seedSources) {
      insertSource.run(source.id, source.name, source.short, source.blurb, source.site, source.countLabel);
    }
    for (const app of liveApps) {
      insertApp.run(
        app.id,
        app.name,
        app.url,
        app.tagline,
        app.description,
        app.category,
        JSON.stringify(app.tags),
        app.sourceId,
        app.maker,
        app.year ?? null,
        app.featured ? 1 : 0,
        app.gap,
      );
    }
    ideaExamples.forEach((example, index) => {
      insertExample.run(example.label, example.text, index);
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getDb() {
  if (!globalForDb.appkinDb) {
    globalForDb.appkinDb = createDb();
  }
  return globalForDb.appkinDb;
}
