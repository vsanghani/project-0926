import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDb } from "./db";

const COOKIE = "appkin_session";
const MONTH_MS = 1000 * 60 * 60 * 24 * 30;

export type SessionUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  is_admin: number;
};

function userFromRow(row: UserRow): SessionUser {
  return { id: row.id, email: row.email, isAdmin: row.is_admin === 1 };
}

export async function currentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT users.id, users.email, users.password_hash, users.is_admin
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ? AND sessions.expires_at > ?`,
    )
    .get(token, new Date().toISOString()) as UserRow | undefined;
  return row ? userFromRow(row) : null;
}

export async function signIn(email: string, password: string) {
  const row = getDb().prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as UserRow | undefined;
  if (!row || !bcrypt.compareSync(password, row.password_hash)) return null;
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + MONTH_MS).toISOString();
  getDb().prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, row.id, expires);
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", expires: new Date(expires) });
  return userFromRow(row);
}

export async function signOut() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  jar.delete(COOKIE);
}

export async function signUp(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || password.length < 8) {
    throw new Error("Use a valid email and a password of at least 8 characters.");
  }
  const existing = getDb().prepare("SELECT id FROM users WHERE email = ?").get(normalized);
  if (existing) throw new Error("That email already has an account.");
  const id = crypto.randomUUID();
  getDb()
    .prepare("INSERT INTO users (id, email, password_hash, is_admin, created_at) VALUES (?, ?, ?, 0, ?)")
    .run(id, normalized, bcrypt.hashSync(password, 10), new Date().toISOString());
  return signIn(normalized, password);
}

