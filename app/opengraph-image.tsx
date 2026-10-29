import { ImageResponse } from "next/og";
import { loadOutfit } from "./lib/og";

export const alt = "Shobhit Srivastava, fullstack developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const outfit = await loadOutfit(500);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFE7D0",
          padding: 56,
          fontFamily: outfit ? "Outfit" : "sans-serif",
          color: "#323232",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 130,
            padding: "0 40px",
            borderRadius: 22,
            background: "#FC6E20",
            fontSize: 96,
            letterSpacing: "-0.1em",
          }}
        >
          SHOBHIT.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 64,
            fontSize: 76,
            letterSpacing: "-0.06em",
            color: "#1B1B1B",
          }}
        >
          fullstack developer.
        </div>
        <div style={{ display: "flex", marginTop: "auto", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 26px",
              borderRadius: 14,
              background: "#323232",
              color: "#FFE7D0",
              fontSize: 36,
              letterSpacing: "-0.04em",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#FC6E20" }} />
            open to work
          </div>
          <div style={{ display: "flex", fontSize: 32, letterSpacing: "-0.04em" }}>
            AI workflows · real-time apps · proof of work, live
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: outfit ? [{ name: "Outfit", data: outfit, weight: 500, style: "normal" }] : [],
    }
  );
}
