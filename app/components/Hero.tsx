import Image from "next/image";
import { t } from "../data/strings";
import { SITE_NAME } from "../lib/site";

/**
 * Bars of public/barcode-Code128B.svg as [offset, thickness] along the code,
 * in that file's units (the code is 224 long). Drawn inline so it takes the
 * site's colour instead of the file's black-on-white.
 */
const BARS: [number, number][] = [
  [0, 4], [6, 2], [12, 2], [22, 4], [28, 6], [36, 2], [44, 4], [54, 2], [58, 2], [66, 2],
  [74, 6], [82, 4], [88, 2], [96, 2], [100, 4], [110, 4], [120, 2], [124, 2], [132, 4], [142, 2],
  [150, 2], [154, 4], [160, 6], [172, 2], [176, 8], [186, 2], [192, 2], [198, 4], [208, 6], [216, 2],
  [220, 4],
];
const BARCODE_LENGTH = 224;

/** The barcode turned vertical: bars run across, and it stretches to fill its box. */
function VerticalBarcode({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 10 ${BARCODE_LENGTH}`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {BARS.map(([offset, thickness]) => (
        <rect key={offset} x={0} y={offset} width={10} height={thickness} fill="currentColor" />
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      className="grid w-full max-w-[562px] grid-cols-[281px_281px] gap-0 max-[562px]:grid-cols-2 max-[562px]:gap-x-3"
      style={{ marginTop: 40 }}
    >
      {/* The intro isn't shown any more; keep it for search engines and screen readers */}
      <h1 className="sr-only">{SITE_NAME}</h1>
      <p className="sr-only">
        {t("hero.intro")} {t("hero.cta")}
      </p>

      {/* Left column: barcode, same width as the cards below and same height as the photo.
          On phones both halves are equal width, so sharing the photo's 224:272 shape keeps them level. */}
      <div className="flex w-[281px] max-[562px]:aspect-224/272 max-[562px]:w-full">
        <VerticalBarcode className="h-[272px] w-[271px] text-[#323232] max-[562px]:h-full max-[562px]:w-full" />
      </div>

      {/* Right column: photo attached to right margin of navbar */}
      <div className="flex w-[281px] max-[562px]:w-full justify-end">
        <Image
          src="/profile_portfolio.jpeg"
          alt="Shobhit Srivastava"
          width={224}
          height={272}
          sizes="(max-width: 562px) 50vw, 224px"
          className="h-[272px] w-[224px] rounded-[9px] object-cover max-[562px]:aspect-224/272 max-[562px]:h-auto max-[562px]:w-full"
          priority
        />
      </div>
    </section>
  );
}
