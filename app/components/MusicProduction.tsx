"use client";

import Image from "next/image";
import { t } from "../data/strings";

/** Spotify artist page. Leave empty to hide the link. */
const MUSIC_URL = "https://open.spotify.com/artist/7zy2N6RF08pABki08HEw1B";

export default function MusicProduction() {
  return (
    <section
      className="w-full max-w-[562px] rounded-[10px] pt-8 pb-8 pl-8 pr-[70px] max-[562px]:pr-8"
      style={{
        marginTop: 50,
        minHeight: 440,
        backgroundColor: "#323232",
      }}
    >
      <h2
        className="font-outfit font-medium max-[562px]:text-[clamp(2rem,12vw,4rem)]"
        style={{
          fontSize: 64,
          letterSpacing: "-0.05em",
          color: "var(--background)",
        }}
      >
        {t("music.title")}
      </h2>
      <div
        className="flex flex-col min-[563px]:flex-row max-[562px]:gap-6"
        style={{ marginTop: 34.06, gap: 65 }}
      >
        <div
          className="font-outfit font-medium text-justify shrink-0 w-[210px] max-[562px]:w-full max-[562px]:h-auto"
          style={{
            height: 180,
            fontSize: 16,
            letterSpacing: "-0.05em",
            color: "var(--background)",
          }}
        >
          {t("music.body")}
        </div>
        <div className="flex shrink-0 flex-col w-[200px] max-[562px]:w-full max-[562px]:max-w-[200px]">
          <Image
            src="/music.jpg"
            alt="Music production"
            width={200}
            height={200}
            className="object-cover size-[200px] max-[562px]:w-full! max-[562px]:h-auto! max-[562px]:aspect-square!"
          />
          {MUSIC_URL && (
            <a
              href={MUSIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-fit font-outfit font-medium underline decoration-[#FC6E20] decoration-2 underline-offset-4 hover:opacity-80"
              style={{
                fontSize: 14,
                letterSpacing: "-0.05em",
                color: "var(--background)",
              }}
            >
              {t("music.spotify")} ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
