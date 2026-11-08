import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, createHash } from "node:crypto";
import { db } from "./db";
import { can, type Permission } from "./permissions";

const COOKIE = "muec_session";
const TTL_MS = 1000 * 60 * 60 * 24 * 7;
const sha = (t: string) => createHash("sha256").update(t).digest("hex");

export type SessionUser = { id: number; username: string; email: string; role: string; created_at: string };

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  db.prepare("INSERT INTO sessions (token,user_id,expires_at) VALUES (?,?,?)").run(sha(token), userId, Date.now() + TTL_MS);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: TTL_MS / 1000,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const t = jar.get(COOKIE)?.value;
  if (t) db.prepare("DELETE FROM sessions WHERE token = ?").run(sha(t));
  jar.delete(COOKIE);
}

export async function currentUser(): Promise<SessionUser | null> {
  const t = (await cookies()).get(COOKIE)?.value;
  if (!t) return null;
  const row = db.prepare(
    "SELECT u.id,u.username,u.email,u.role,u.created_at,s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?"
  ).get(sha(t)) as (SessionUser & { expires_at: number }) | undefined;
  if (!row || row.expires_at < Date.now()) return null;
  return { id: row.id, username: row.username, email: row.email, role: row.role, created_at: row.created_at };
}

export async function requireUser(): Promise<SessionUser> {
  const u = await currentUser();
  if (!u) redirect("/login");
  return u;
}

export async function requirePerm(p: Permission): Promise<SessionUser> {
  const u = await requireUser();
  if (!can(u.role, p)) redirect("/painel");
  return u;
}

/** Limite simples de tentativas (padrão: 8 a cada 10 minutos por chave). */
export function rateLimit(key: string, max = 8, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const r = db.prepare("SELECT count, window_start FROM login_attempts WHERE key=?").get(key) as
    { count: number; window_start: number } | undefined;
  if (!r || now - r.window_start > windowMs) {
    db.prepare("INSERT OR REPLACE INTO login_attempts (key,count,window_start) VALUES (?,1,?)").run(key, now);
    return true;
  }
  if (r.count >= max) return false;
  db.prepare("UPDATE login_attempts SET count=count+1 WHERE key=?").run(key);
  return true;
}
