"use client";

import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section
      className="grid w-full max-w-[562px] grid-cols-[281px_281px] gap-0 max-[562px]:grid-cols-1"
      style={{ marginTop: 40 }}
    >
      {/* Left column: 281px, attached to left margin of navbar */}
      <div className="relative flex w-[281px] max-[562px]:w-full flex-col">
        <h1
          className="font-outfit font-medium text-[#1B1B1B]"
          style={{
            fontSize: 48,
            letterSpacing: "-0.1em",
          }}
        >
          {t("hero.greeting")}
        </h1>
        <p
          className="font-medium text-[#323232]"
          style={{
            marginTop: 23,
            fontSize: 24,
            lineHeight: 1.4,
          }}
        >
          {t("hero.intro")}
        </p>
        <p
          className="font-medium text-[#323232] max-[562px]:mb-6"
          style={{
            marginTop: 45,
            fontSize: 24,
            lineHeight: 1.4,
            fontWeight: 600,
          }}
        >
          {t("hero.cta")}
        </p>

        <p
          className="absolute bottom-0 left-0 font-medium text-[#323232]"
          style={{ fontSize: 14, letterSpacing: "-0.05em" }}
        >
        
        </p>
      </div>

      {/* Right column: 281px, photo attached to right margin of navbar; full width on mobile, reduced height + gap from text */}
      <div className="relative flex w-[281px] max-[562px]:w-full max-[562px]:justify-start min-[563px]:justify-end max-[562px]:aspect-224/200 max-[562px]:max-h-[220px]">
        {/* Desktop / larger viewports: original hero photo */}
        <Image
          src="/hero.jpg"
          alt="Portrait"
          width={224}
          height={272}
          className="hidden min-[563px]:block rounded-[9px] object-cover w-[224px] h-[272px]"
          priority
        />
        {/* Mobile view: alternate hero image */}
        <Image
          src="/hero2.png"
          alt="Portrait"
          width={224}
          height={272}
          className="block min-[563px]:hidden rounded-[9px] object-cover w-full h-full max-[562px]:min-h-0!"
          priority
        />
      </div>
    </section>
  );
}
