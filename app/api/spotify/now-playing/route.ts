import { NextResponse } from "next/server";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export type NowPlayingResponse =
  | {
      isPlaying: true;
      track: string;
      artists: string;
      albumArtUrl: string | null;
      trackUrl: string | null;
    }
  | { isPlaying: false };

export async function GET(): Promise<NextResponse<NowPlayingResponse | { error: string }>> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "Spotify not configured" },
      { status: 503 }
    );
  }

  const response = await fetch(SPOTIFY_NOW_PLAYING_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  // 204 = nothing playing
  if (response.status === 204) {
    return NextResponse.json({ isPlaying: false });
  }

  if (!response.ok) {
    return NextResponse.json({ isPlaying: false });
  }

  const data = (await response.json()) as {
    is_playing: boolean;
    item?: {
      name: string;
      artists: Array<{ name: string }>;
      album?: { images: Array<{ url: string; height: number }> };
      external_urls?: { spotify: string };
    };
  };

  if (!data.is_playing || !data.item) {
    return NextResponse.json({ isPlaying: false });
  }

  const item = data.item;
  const artists = item.artists?.map((a) => a.name).join(", ") ?? "";
  const albumArtUrl =
    item.album?.images?.sort((a, b) => b.height - a.height)[0]?.url ?? null;
  const trackUrl = item.external_urls?.spotify ?? null;

  return NextResponse.json({
    isPlaying: true,
    track: item.name,
    artists,
    albumArtUrl,
    trackUrl,
  });
}
