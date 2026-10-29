import { NextRequest, NextResponse } from "next/server";
import { checkPassword, newSessionValue, SESSION_COOKIE } from "../../../lib/drawer/auth";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/** Log in to /drawer/admin. */
export async function POST(request: NextRequest) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (!password || !checkPassword(password)) {
    // Slow down guessing a little.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const { value, maxAge } = newSessionValue();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, value, { ...cookieOptions, maxAge });
  return res;
}

/** Log out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return res;
}
