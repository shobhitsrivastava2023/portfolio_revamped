import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getDrawerItem } from "../../../lib/drawer/db";
import { isAdmin } from "../../../lib/drawer/auth";
import { formatDrawerDate, formatDuration } from "../../../lib/drawer/format";
import { parseArticle } from "../../../lib/drawer/article";
import { inkOn, sanitizeStoryStyle, STORY_SIZES, withAlpha, type StoryStyle } from "../../../lib/drawer/story";
import { loadOutfit } from "../../../lib/og";
import type { DrawerItem } from "../../../lib/drawer/types";

const CARD_WIDTH = 920;
const CREAM = "#FFE7D0";

/** Colours the content is drawn in, worked out from the style. */
type Palette = {
  ink: string;
  sub: string;
  accent: string;
  /** the audio / video box: ink-coloured, with text in the opposite tone */
  panel: string;
  panelText: string;
};

/** Tallest a photo may be inside the card, per size. */
const PHOTO_MAX: Record<StoryStyle["size"], number> = { story: 980, post: 560, square: 380 };

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

function Waveform({ peaks, height, p }: { peaks: number[]; height: number; p: Palette }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, height, width: "100%" }}>
      {peaks.map((v, i) => (
        <div
          key={i}
          style={{ display: "flex", flex: 1, height: `${Math.max(8, v * 100)}%`, borderRadius: 4, background: i < peaks.length * 0.4 ? p.accent : withAlpha(p.panelText, 0.3) }}
        />
      ))}
    </div>
  );
}

function PlayCircle({ size, accent }: { size: number; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: size, height: size, borderRadius: size, background: accent }}>
      <svg width={size * 0.36} height={size * 0.36} viewBox="0 0 14 14">
        <path d="M3 1.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 3 1.5z" fill={inkOn(accent)} />
      </svg>
    </div>
  );
}

/** The middle of the card, by item kind. `k` scales the text. */
function Content({ item, style, p, k }: { item: DrawerItem; style: StoryStyle; p: Palette; k: number }) {
  const m = item.media[0];
  const text = style.text ?? item.body ?? "";
  const caption = text ? (
    <div style={{ display: "flex", marginTop: 28, fontSize: 38 * k, lineHeight: 1.35, color: p.ink }}>{clip(text, 160)}</div>
  ) : null;

  switch (item.kind) {
    case "thought": {
      const body = clip(text, 420);
      return <div style={{ display: "flex", fontSize: thoughtSize(body.length) * k, lineHeight: 1.22, letterSpacing: "-0.03em", color: p.ink }}>{body}</div>;
    }
    case "article": {
      const { title, blocks, minutes } = parseArticle(item.body);
      const opening = blocks.find((b) => b.type === "paragraph");
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30 * k, color: p.accent }}>{`article · ${minutes} min read`}</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 70 * k, lineHeight: 1.05, letterSpacing: "-0.05em", color: p.ink }}>
            {clip(style.text ?? title ?? "untitled", 90)}
          </div>
          {opening?.type === "paragraph" && (
            <div style={{ display: "flex", marginTop: 28, fontSize: 34 * k, lineHeight: 1.45, color: p.sub }}>{clip(opening.text, 220)}</div>
          )}
        </div>
      );
    }
    case "photo": {
      // With the photo as the background, the card only carries the caption.
      if (style.photoBg) return caption ?? <div style={{ display: "flex" }} />;
      const ratio = m?.width && m?.height ? m.height / m.width : 1;
      const photoHeight = Math.min(PHOTO_MAX[style.size], Math.round((CARD_WIDTH - 120) * ratio));
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {m && (
            // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>
            <img src={m.url} alt="" width={CARD_WIDTH - 120} height={photoHeight} style={{ borderRadius: 28, objectFit: "cover" }} />
          )}
          {caption}
        </div>
      );
    }
    case "audio": {
      const peaks = item.waveform?.length ? item.waveform.filter((_, i) => i % 2 === 0) : Array(80).fill(0.25);
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", padding: 44, borderRadius: 32, background: p.panel, color: p.panelText }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <PlayCircle size={110} accent={p.accent} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 50 * k, letterSpacing: "-0.04em" }}>{clip(m?.title || "untitled", 26)}</div>
                <div style={{ display: "flex", fontSize: 30 * k, opacity: 0.7 }}>{formatDuration(m?.duration)}</div>
              </div>
            </div>
            <div style={{ display: "flex", marginTop: 40 }}>
              <Waveform peaks={peaks} height={150} p={p} />
            </div>
          </div>
          {caption}
        </div>
      );
    }
    case "video":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: style.size === "story" ? 520 : 380, borderRadius: 32, background: p.panel }}>
            <PlayCircle size={150} accent={p.accent} />
          </div>
          {style.text === null && !item.body ? (
            <div style={{ display: "flex", marginTop: 28, fontSize: 38 * k, lineHeight: 1.35, color: p.ink }}>a clip from the drawer</div>
          ) : (
            caption
          )}
        </div>
      );
  }
}

/**
 * A drawer item as a share image (story 1080×1920, post 1080×1350 or square), drawn with its saved
 * card design. The admin page can preview unsaved designs with ?style=<json>; that's ignored for
 * everyone else, so nobody can put words on a card with my name on it.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await isAdmin().catch(() => false);
  const [item, regular, bold] = await Promise.all([
    getDrawerItem((await params).id, admin).catch(() => null),
    loadOutfit(500),
    loadOutfit(600),
  ]);
  if (!item) return new Response("Not found", { status: 404 });

  const override = admin ? request.nextUrl.searchParams.get("style") : null;
  let style = sanitizeStoryStyle(item.storyStyle);
  if (override) {
    try {
      style = sanitizeStoryStyle(JSON.parse(override));
    } catch {
      // Bad JSON: keep the saved design.
    }
  }

  const { width, height } = STORY_SIZES[style.size];
  const photo = style.photoBg && item.kind === "photo" ? item.media[0]?.url : undefined;
  // What the text sits on: the card, the photo (darkened), or the background colour.
  const surface = style.showCard ? style.card : photo ? "#1B1B1B" : style.bg;
  const ink = inkOn(surface);
  const p: Palette = { ink, sub: withAlpha(ink, 0.72), accent: style.accent, panel: ink, panelText: inkOn(ink) };
  const k = style.scale * (style.size === "square" ? 0.8 : style.size === "post" ? 0.9 : 1);
  // Instagram and WhatsApp draw their own bars over the top and bottom of a story.
  const padY = style.size === "story" ? 240 : 90;
  const onBg = photo ? CREAM : inkOn(style.bg);

  const fonts = [
    ...(regular ? [{ name: "Outfit", data: regular, weight: 500 as const, style: "normal" as const }] : []),
    ...(bold ? [{ name: "Outfit", data: bold, weight: 600 as const, style: "normal" as const }] : []),
  ];
  const avatar = new URL("/profile_portfolio.jpeg", request.url).toString();

  return new ImageResponse(
    (
      // Layers: background (colour or photo), then the content on top. Satori still applies a
      // parent's centring to absolute children, so the root does no alignment itself.
      <div style={{ width, height, display: "flex", position: "relative", background: style.bg, fontFamily: regular ? "Outfit" : "sans-serif" }}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>
          <img src={photo} alt="" width={width} height={height} style={{ position: "absolute", top: 0, left: 0, width, height, objectFit: "cover" }} />
        )}
        {photo && <div style={{ display: "flex", position: "absolute", top: 0, left: 0, width, height, background: "rgba(0,0,0,0.35)" }} />}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: style.align === "top" ? "flex-start" : style.align === "bottom" ? "flex-end" : "center",
            padding: `${padY}px 0`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: CARD_WIDTH,
              padding: style.showCard ? 60 : 0,
              borderRadius: 56,
              background: style.showCard ? style.card : "transparent",
              boxShadow: style.showCard ? "0 30px 80px rgba(0,0,0,0.25)" : "none",
            }}
          >
            {/* Header, like a tweet: photo, name, where and when */}
            {style.header && (
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 44 }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
                <img src={avatar} alt="" width={96} height={96} style={{ borderRadius: 96, objectFit: "cover" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em", color: ink }}>Shobhit Srivastava</div>
                  <div style={{ display: "flex", fontSize: 28, color: p.sub }}>{`drawer · ${formatDrawerDate(item.createdAt)}`}</div>
                </div>
              </div>
            )}
  
            <Content item={item} style={style} p={p} k={k} />
  
            {style.tags && item.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 36, fontSize: 28, color: style.accent }}>
                {item.tags.slice(0, 4).map((tag) => (
                  <div key={tag} style={{ display: "flex" }}>{`#${tag}`}</div>
                ))}
              </div>
            )}
          </div>
  
          {style.footer && style.footerText.trim() && (
            <div style={{ display: "flex", marginTop: 64, fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", color: onBg }}>
              {style.footerText}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts,
      // Admin previews change with every tweak; public cards are cached (?v= changes when the design does).
      headers: { "cache-control": admin ? "private, no-store" : "public, max-age=300, s-maxage=3600" },
    }
  );
}
