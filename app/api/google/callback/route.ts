import { NextRequest, NextResponse } from "next/server";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(`Google auth failed: ${error}`, {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  if (!code) {
    return new NextResponse("Missing code. Visit /api/google/auth first.", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new NextResponse(
      "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in env first.",
      { status: 500, headers: { "Content-Type": "text/plain" } }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    request.nextUrl.origin;
  const redirectUri = `${String(baseUrl).replace(/\/$/, "")}/api/google/callback`;

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text().catch(() => "");
    return new NextResponse(`Token exchange failed: ${tokenRes.status} ${text}`, {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const tokens = (await tokenRes.json()) as {
    refresh_token?: string;
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };

  if (!tokens.refresh_token) {
    return new NextResponse(
      "No refresh_token returned. Make sure you used prompt=consent and that you haven't already granted access; try removing app access from your Google Account and retry.",
      { status: 502, headers: { "Content-Type": "text/plain" } }
    );
  }

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Google Calendar connected</title></head>
<body style="font-family: system-ui; max-width: 680px; margin: 2rem auto; padding: 0 1rem;">
  <h1>Google Calendar connected</h1>
  <p>Add this to your <code>.env</code> / production env (do not commit it):</p>
  <pre style="background:#f4f4f4;padding:1rem;overflow-x:auto;word-break:break-all;">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
  <p>Also set <code>GOOGLE_CALENDAR_ID</code> (recommended: a dedicated calendar id, or <code>primary</code>).</p>
  <p><a href="/">Back to portfolio</a></p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

