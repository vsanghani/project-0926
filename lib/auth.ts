import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDb } from "./db";

const COOKIE = "appkin_session";
const MONTH_MS = 1000 * 60 * 60 * 24 * 30;

export type Plan = "free" | "pro";

export type SessionUser = {
  id: string;
  email: string;
  isAdmin: boolean;
  plan: Plan;
  planStatus: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  is_admin: number;
  plan: string | null;
  plan_status: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

function userFromRow(row: UserRow): SessionUser {
  const plan: Plan = row.is_admin === 1 || row.plan === "pro" ? "pro" : "free";
  return {
    id: row.id,
    email: row.email,
    isAdmin: row.is_admin === 1,
    plan,
    planStatus: row.plan_status,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
  };
}

function selectUser(where: string, value: string) {
  return getDb()
    .prepare(
      `SELECT id, email, password_hash, is_admin, plan, plan_status, stripe_customer_id, stripe_subscription_id
       FROM users WHERE ${where}`,
    )
    .get(value) as UserRow | undefined;
}

export async function currentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT users.id, users.email, users.password_hash, users.is_admin, users.plan, users.plan_status,
              users.stripe_customer_id, users.stripe_subscription_id
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ? AND sessions.expires_at > ?`,
    )
    .get(token, new Date().toISOString()) as UserRow | undefined;
  return row ? userFromRow(row) : null;
}

export function getUserById(id: string) {
  const row = selectUser("id = ?", id);
  return row ? userFromRow(row) : null;
}

export function getUserByCustomerId(customerId: string) {
  const row = selectUser("stripe_customer_id = ?", customerId);
  return row ? userFromRow(row) : null;
}

export function setStripeCustomerId(userId: string, customerId: string) {
  getDb().prepare("UPDATE users SET stripe_customer_id = ? WHERE id = ?").run(customerId, userId);
}

export function setUserPlan(
  userId: string,
  plan: Plan,
  planStatus: string | null,
  subscriptionId: string | null,
) {
  getDb()
    .prepare("UPDATE users SET plan = ?, plan_status = ?, stripe_subscription_id = ? WHERE id = ?")
    .run(plan, planStatus, subscriptionId, userId);
}

export async function signIn(email: string, password: string) {
  const row = selectUser("email = ?", email.toLowerCase());
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
    .prepare(
      "INSERT INTO users (id, email, password_hash, is_admin, created_at, plan) VALUES (?, ?, ?, 0, ?, 'free')",
    )
    .run(id, normalized, bcrypt.hashSync(password, 10), new Date().toISOString());
  return signIn(normalized, password);
}
