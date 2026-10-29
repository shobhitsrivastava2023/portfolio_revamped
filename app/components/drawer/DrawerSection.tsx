import Image from "next/image";
import Link from "next/link";
import type { DrawerItem } from "../../lib/drawer/types";
import { formatDrawerDate } from "../../lib/drawer/format";
import { t } from "../../data/strings";
import SongPlayer from "./SongPlayer";
import ClipPlayer from "./ClipPlayer";
import { parseArticle } from "../../lib/drawer/article";

const linkClass =
  "block h-full no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFE7D0] rounded-[10px]";

/** One square tile: thoughts and photos link to the item; clips and songs play in place. */
function Tile({ item }: { item: DrawerItem }) {
  const href = `/drawer/${item.id}`;
  const m = item.media[0];
  switch (item.kind) {
    case "thought":
      return (
        <Link href={href} className={linkClass}>
          <div className="h-full overflow-hidden rounded-[10px] border-2 border-[#323232] p-3 transition-colors hover:bg-[#323232]/5">
            <p
              className="font-outfit font-medium text-[#1B1B1B]"
              style={{ fontSize: 15, letterSpacing: "-0.03em", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 7, WebkitBoxOrient: "vertical", overflow: "hidden" }}
            >
              {item.body}
            </p>
          </div>
        </Link>
      );
    case "article": {
      const { title, blocks } = parseArticle(item.body);
      const opening = blocks.find((b) => b.type === "paragraph");
      return (
        <Link href={href} className={linkClass}>
          <div className="relative h-full overflow-hidden rounded-[10px] bg-[#323232] p-3 text-[#FFE7D0] transition-opacity hover:opacity-95">
            <p className="font-outfit font-medium text-[#FC6E20]" style={{ fontSize: 11, letterSpacing: "-0.01em" }}>
              article
            </p>
            <p className="mt-1 font-outfit font-medium" style={{ fontSize: 17, letterSpacing: "-0.05em", lineHeight: 1.1 }}>
              {title ?? "untitled"}
            </p>
            {opening?.type === "paragraph" && (
              <p className="mt-2 opacity-80" style={{ fontSize: 12, lineHeight: 1.45 }}>
                {opening.text}
              </p>
            )}
            {/* Fade the overflow into the card */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-14" style={{ background: "linear-gradient(to bottom, rgba(50,50,50,0), #323232)" }} />
          </div>
        </Link>
      );
    }
    case "photo":
      return m ? (
        <Link href={href} className={linkClass} aria-label={item.body ?? "photo"}>
          <div className="relative h-full overflow-hidden rounded-[10px] bg-[#323232]/10">
            <Image src={m.url} alt={item.body ?? "photo"} fill sizes="(max-width: 562px) 50vw, 180px" className="object-cover transition-transform duration-300 hover:scale-[1.03]" />
            {item.media.length > 1 && (
              <span className="absolute right-2 top-2 rounded-md bg-[#323232]/80 px-1.5 py-0.5 font-outfit text-[11px] font-medium text-[#FFE7D0]">
                +{item.media.length - 1}
              </span>
            )}
          </div>
        </Link>
      ) : null;
    case "video":
      return m ? <ClipPlayer media={m} fill /> : null;
    case "audio":
      return m ? <SongPlayer media={m} waveform={item.waveform} compact fill /> : null;
  }
}

/** Homepage: the latest few drawer items, above Proof of Work. Hidden when the drawer is empty. */
export default function DrawerSection({ items }: { items: DrawerItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="w-full max-w-[562px]" style={{ marginTop: 70 }}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-outfit font-medium text-[#1B1B1B]" style={{ fontSize: 34, letterSpacing: "-0.08em", lineHeight: 1 }}>
          {t("drawer.title")}
        </h2>
        <Link
          href="/drawer"
          className="font-outfit font-medium text-[#323232] underline decoration-[#FC6E20] decoration-2 underline-offset-4 hover:opacity-80"
          style={{ fontSize: 15, letterSpacing: "-0.04em" }}
        >
          {t("drawer.open")} →
        </Link>
      </div>

      <ul className="m-0 mt-4 grid list-none grid-cols-3 gap-3 p-0 max-[562px]:grid-cols-2">
        {items.slice(0, 3).map((item, i) => (
          <li key={item.id} className={i === 2 ? "max-[562px]:hidden" : undefined}>
            <div className="aspect-square">
              <Tile item={item} />
            </div>
            <Link
              href={`/drawer/${item.id}`}
              className="mt-1.5 inline-block font-outfit font-medium text-[#323232]/70 no-underline hover:text-[#323232]"
              style={{ fontSize: 12, letterSpacing: "-0.02em" }}
            >
              {formatDrawerDate(item.createdAt)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
