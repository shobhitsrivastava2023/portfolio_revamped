import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Admin login for /drawer/admin: one password (DRAWER_ADMIN_PASSWORD) and a
 * signed cookie holding an expiry time. No users table needed.
 */
export const SESSION_COOKIE = "drawer_session";
const SESSION_DAYS = 30;

function secret(): string {
  const password = process.env.DRAWER_ADMIN_PASSWORD;
  if (!password) throw new Error("DRAWER_ADMIN_PASSWORD is not set");
  // Changing the password logs every existing session out.
  return `drawer:${password}`;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(attempt: string): boolean {
  const password = process.env.DRAWER_ADMIN_PASSWORD;
  return Boolean(password) && safeEqual(attempt, password!);
}

export function newSessionValue(): { value: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const expires = String(Date.now() + maxAge * 1000);
  return { value: `${expires}.${sign(expires)}`, maxAge };
}

export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}
