"use client";

import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

export default function MusicProduction() {
  const { t } = useLanguage();
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
          <span
            className="mt-1 font-outfit font-medium"
            style={{
              fontSize: 8,
              letterSpacing: "-0.05em",
              color: "var(--background)",
            }}
          >
            {t("music.spotify")}
          </span>
        </div>
      </div>
    </section>
  );
}
