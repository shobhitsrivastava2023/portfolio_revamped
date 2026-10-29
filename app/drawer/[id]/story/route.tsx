import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getDrawerItem } from "../../../lib/drawer/db";
import { formatDrawerDate, formatDuration } from "../../../lib/drawer/format";
import { parseArticle } from "../../../lib/drawer/article";
import { loadOutfit } from "../../../lib/og";
import type { DrawerItem } from "../../../lib/drawer/types";

/** Instagram story size. */
const WIDTH = 1080;
const HEIGHT = 1920;
const CARD_WIDTH = 920;

const CREAM = "#FFE7D0";
const DARK = "#323232";
const DARKER = "#1B1B1B";
const ORANGE = "#FC6E20";

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** Bigger type for shorter thoughts, like a tweet card. */
function thoughtSize(length: number): number {
  if (length < 60) return 76;
  if (length < 140) return 62;
  if (length < 260) return 50;
  return 42;
}

function Waveform({ peaks, height }: { peaks: number[]; height: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, height, width: "100%" }}>
      {peaks.map((p, i) => (
        <div
          key={i}
          style={{ display: "flex", flex: 1, height: `${Math.max(8, p * 100)}%`, borderRadius: 4, background: i < peaks.length * 0.4 ? ORANGE : "rgba(255,231,208,0.3)" }}
        />
      ))}
    </div>
  );
}

function PlayCircle({ size }: { size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size, borderRadius: size, background: ORANGE }}>
      <svg width={size * 0.36} height={size * 0.36} viewBox="0 0 14 14">
        <path d="M3 1.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 3 1.5z" fill={DARK} />
      </svg>
    </div>
  );
}

/** The middle of the card, by item kind. */
function Content({ item }: { item: DrawerItem }) {
  const m = item.media[0];
  switch (item.kind) {
    case "thought": {
      const text = clip(item.body ?? "", 420);
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 180, lineHeight: 0.8, height: 110, color: ORANGE }}>“</div>
          <div style={{ display: "flex", fontSize: thoughtSize(text.length), lineHeight: 1.22, letterSpacing: "-0.03em", color: DARKER }}>{text}</div>
        </div>
      );
    }
    case "article": {
      const { title, blocks, minutes } = parseArticle(item.body);
      const opening = blocks.find((b) => b.type === "paragraph");
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: ORANGE }}>{`article · ${minutes} min read`}</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 70, lineHeight: 1.05, letterSpacing: "-0.05em", color: DARKER }}>
            {clip(title ?? "untitled", 90)}
          </div>
          {opening?.type === "paragraph" && (
            <div style={{ display: "flex", marginTop: 28, fontSize: 34, lineHeight: 1.45, color: DARK, opacity: 0.85 }}>{clip(opening.text, 220)}</div>
          )}
        </div>
      );
    }
    case "photo": {
      const ratio = m?.width && m?.height ? m.height / m.width : 1;
      const photoHeight = Math.min(980, Math.round((CARD_WIDTH - 120) * ratio));
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {m && (
            // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>
            <img src={m.url} alt="" width={CARD_WIDTH - 120} height={photoHeight} style={{ borderRadius: 28, objectFit: "cover" }} />
          )}
          {item.body && <div style={{ display: "flex", marginTop: 28, fontSize: 38, lineHeight: 1.35, color: DARKER }}>{clip(item.body, 160)}</div>}
        </div>
      );
    }
    case "audio": {
      const peaks = item.waveform?.length ? item.waveform.filter((_, i) => i % 2 === 0) : Array(80).fill(0.25);
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", padding: 44, borderRadius: 32, background: DARK, color: CREAM }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <PlayCircle size={110} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 50, letterSpacing: "-0.04em" }}>{clip(m?.title || "untitled", 26)}</div>
                <div style={{ display: "flex", fontSize: 30, opacity: 0.7 }}>{formatDuration(m?.duration)}</div>
              </div>
            </div>
            <div style={{ display: "flex", marginTop: 40 }}>
              <Waveform peaks={peaks} height={150} />
            </div>
          </div>
          {item.body && <div style={{ display: "flex", marginTop: 28, fontSize: 38, lineHeight: 1.35, color: DARKER }}>{clip(item.body, 160)}</div>}
        </div>
      );
    }
    case "video":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 520, borderRadius: 32, background: DARK }}>
            <PlayCircle size={150} />
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 38, lineHeight: 1.35, color: DARKER }}>{clip(item.body || "a clip from the drawer", 160)}</div>
        </div>
      );
  }
}

/** A drawer item as a 1080×1920 story image: a cream card on orange, like a shared tweet. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const [item, regular, bold] = await Promise.all([
    getDrawerItem((await params).id).catch(() => null),
    loadOutfit(500),
    loadOutfit(600),
  ]);
  if (!item) return new Response("Not found", { status: 404 });

  const fonts = [
    ...(regular ? [{ name: "Outfit", data: regular, weight: 500 as const, style: "normal" as const }] : []),
    ...(bold ? [{ name: "Outfit", data: bold, weight: 600 as const, style: "normal" as const }] : []),
  ];
  const avatar = new URL("/profile_portfolio.jpeg", request.url).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: ORANGE,
          fontFamily: regular ? "Outfit" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: CARD_WIDTH, padding: 60, borderRadius: 56, background: CREAM, boxShadow: "0 30px 80px rgba(50,50,50,0.25)" }}>
          {/* Header, like a tweet: photo, name, where and when */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 44 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
            <img src={avatar} alt="" width={96} height={96} style={{ borderRadius: 96, objectFit: "cover" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em", color: DARKER }}>Shobhit Srivastava</div>
              <div style={{ display: "flex", fontSize: 28, color: DARK, opacity: 0.65 }}>{`drawer · ${formatDrawerDate(item.createdAt)}`}</div>
            </div>
          </div>

          <Content item={item} />

          {item.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 36, fontSize: 28, color: ORANGE }}>
              {item.tags.slice(0, 4).map((tag) => (
                <div key={tag} style={{ display: "flex" }}>{`#${tag}`}</div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", marginTop: 64, fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", color: CREAM }}>
          shobhitsrivastava.com/drawer
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts,
      headers: { "cache-control": "public, max-age=300, s-maxage=3600" },
    }
  );
}
