import { ImageResponse } from "next/og";
import { getDrawerItem } from "../../lib/drawer/db";
import { formatDrawerDate } from "../../lib/drawer/format";
import { loadOutfit } from "../../lib/og";

export const alt = "From Shobhit's drawer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#FFE7D0";
const DARK = "#323232";
const ORANGE = "#FC6E20";

/** Link preview for a drawer item: the photo itself, or a card in the site's style. */
export default async function DrawerItemImage({ params }: { params: Promise<{ id: string }> }) {
  const [item, outfit] = await Promise.all([
    getDrawerItem((await params).id).catch(() => null),
    loadOutfit(500),
  ]);
  const fonts = outfit ? [{ name: "Outfit", data: outfit, weight: 500 as const, style: "normal" as const }] : [];
  const fontFamily = outfit ? "Outfit" : "sans-serif";
  const footer = item ? `shobhit's drawer · ${formatDrawerDate(item.createdAt)}` : "shobhit's drawer";

  // Photo: full-bleed, with a small label.
  if (item?.kind === "photo" && item.media[0]) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: DARK, fontFamily }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={item.media[0].url} alt="" width={1200} height={630} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          <div
            style={{
              position: "absolute",
              left: 40,
              bottom: 40,
              display: "flex",
              padding: "12px 22px",
              borderRadius: 12,
              background: CREAM,
              color: DARK,
              fontSize: 30,
              letterSpacing: "-0.04em",
            }}
          >
            {footer}
          </div>
        </div>
      ),
      { ...size, fonts }
    );
  }

  // Song: dark card with the title and its waveform.
  if (item?.kind === "audio") {
    const peaks = item.waveform?.length ? item.waveform.filter((_, i) => i % 2 === 0) : Array(80).fill(0.25);
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: DARK, color: CREAM, padding: 64, fontFamily }}>
          <div style={{ display: "flex", fontSize: 30, color: ORANGE, letterSpacing: "-0.04em" }}>a song from the drawer</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 84, letterSpacing: "-0.06em", lineHeight: 1.05 }}>
            {item.media[0]?.title || "untitled"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, height: 160, marginTop: "auto" }}>
            {peaks.map((p: number, i: number) => (
              <div key={i} style={{ display: "flex", flex: 1, height: `${Math.max(6, p * 100)}%`, borderRadius: 4, background: i < peaks.length * 0.35 ? ORANGE : "rgba(255,231,208,0.3)" }} />
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, opacity: 0.7 }}>{footer}</div>
        </div>
      ),
      { ...size, fonts }
    );
  }

  // Thought or clip: the words, big, on cream.
  const text = item?.body ?? (item?.kind === "video" ? "a clip from the drawer" : "shobhit's drawer");
  const fontSize = text.length > 180 ? 40 : text.length > 90 ? 52 : 68;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: CREAM, color: DARK, padding: 64, fontFamily }}>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 14, background: ORANGE, fontSize: 40, letterSpacing: "-0.1em" }}>
            SHOBHIT.
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 44, fontSize, letterSpacing: "-0.04em", lineHeight: 1.2, color: "#1B1B1B" }}>
          {text.length > 260 ? `${text.slice(0, 257)}...` : text}
        </div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 28, opacity: 0.7 }}>{footer}</div>
      </div>
    ),
    { ...size, fonts }
  );
}
