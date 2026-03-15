import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(
      `Spotify auth failed: ${error}. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local, then visit /api/spotify/auth again.`,
      { status: 400, headers: { "Content-Type": "text/plain" } }
    );
  }

  if (!code) {
    return new NextResponse("Missing code. Visit /api/spotify/auth first.", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new NextResponse(
      "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local",
      { status: 500, headers: { "Content-Type": "text/plain" } }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    request.nextUrl.origin;
  const redirectUri = `${String(baseUrl).replace(/\/$/, "")}/api/spotify/callback`;

  const tokenRes = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return new NextResponse(
      `Token exchange failed: ${tokenRes.status} ${text}`,
      { status: 502, headers: { "Content-Type": "text/plain" } }
    );
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  const refreshToken = tokens.refresh_token;
  if (!refreshToken) {
    return new NextResponse(
      "No refresh_token in response. Re-authorize and ensure you don't skip the consent screen.",
      { status: 502, headers: { "Content-Type": "text/plain" } }
    );
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Spotify connected</title></head>
<body style="font-family: system-ui; max-width: 560px; margin: 2rem auto; padding: 0 1rem;">
  <h1>Spotify connected</h1>
  <p>Add this to your <code>.env.local</code> (do not commit it):</p>
  <pre style="background: #f4f4f4; padding: 1rem; overflow-x: auto; word-break: break-all;">SPOTIFY_REFRESH_TOKEN=${refreshToken}</pre>
  <p>Then restart the dev server. Your “Currently Listening” section will use live data.</p>
  <p><a href="/">Back to portfolio</a></p>
</body>
</html>
`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
