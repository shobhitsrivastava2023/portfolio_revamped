import { NextResponse } from "next/server";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SCOPES = ["user-read-currently-playing", "user-read-playback-state"].join(
  " "
);

export function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "SPOTIFY_CLIENT_ID not set" },
      { status: 500 }
    );
  }

  // Must match exactly what you set in Spotify Dashboard → Your app → Redirect URIs
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const redirectUri = `${baseUrl.replace(/\/$/, "")}/api/spotify/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: SCOPES,
    show_dialog: "true",
  });

  return NextResponse.redirect(`${SPOTIFY_AUTH_URL}?${params.toString()}`);
}
