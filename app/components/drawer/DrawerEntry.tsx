import Image from "next/image";
import Link from "next/link";
import type { DrawerItem } from "../../lib/drawer/types";
import { formatDrawerDate } from "../../lib/drawer/format";
import { t } from "../../data/strings";
import SongPlayer from "./SongPlayer";
import ClipPlayer from "./ClipPlayer";
import ShareButton from "./ShareButton";
import ArticleView from "./ArticleView";
import StoryButton from "./StoryButton";
import { articleTitle } from "../../lib/drawer/article";
import { storyVersion } from "../../lib/drawer/story";

function Photos({ item }: { item: DrawerItem }) {
  const photos = item.media;
  if (photos.length === 1) {
    const p = photos[0];
    return (
      <div className="relative w-full overflow-hidden rounded-[10px] bg-[#323232]/10">
        <Image
          src={p.url}
          alt={item.body ?? "photo"}
          width={p.width ?? 1200}
          height={p.height ?? 900}
          sizes="(max-width: 562px) 100vw, 562px"
          className="h-auto max-h-[640px] w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.slice(0, 4).map((p, i) => (
        <div key={p.key} className="relative aspect-square overflow-hidden rounded-[10px] bg-[#323232]/10">
          <Image src={p.url} alt={`${item.body ?? "photo"} (${i + 1})`} fill sizes="(max-width: 562px) 50vw, 281px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

/** The item itself: a thought, an article, photos, a clip or a song. `truncate` cuts long articles (feed). */
export function DrawerContent({ item, truncate = false }: { item: DrawerItem; truncate?: boolean }) {
  switch (item.kind) {
    case "article":
      return <ArticleView body={item.body} truncate={truncate} />;
    case "thought":
      return (
        <div className="w-full rounded-[10px] border-2 border-[#323232] p-5 max-[562px]:p-4">
          <p
            className="whitespace-pre-line font-outfit font-medium text-[#1B1B1B]"
            style={{ fontSize: "clamp(18px, 4.2vw, 24px)", letterSpacing: "-0.04em", lineHeight: 1.3 }}
          >
            {item.body}
          </p>
        </div>
      );
    case "photo":
      return <Photos item={item} />;
    case "video":
      return item.media[0] ? <ClipPlayer media={item.media[0]} /> : null;
    case "audio":
      return item.media[0] ? <SongPlayer media={item.media[0]} waveform={item.waveform} /> : null;
  }
}

/** One item in the feed or on its own page: content, caption, then date · tags · share. */
export default function DrawerEntry({ item, linkDate = true }: { item: DrawerItem; linkDate?: boolean }) {
  const date = formatDrawerDate(item.createdAt);
  const caption = item.kind === "thought" || item.kind === "article" ? null : item.body;
  const shareTitle = item.kind === "article" ? articleTitle(item.body) : item.body?.slice(0, 80) ?? "drawer";
  return (
    <article className="w-full">
      {item.pinned && (
        <p className="mb-2 font-outfit font-medium text-[#FC6E20]" style={{ fontSize: 12, letterSpacing: "-0.02em" }}>
          {t("drawer.pinned")}
        </p>
      )}
      <DrawerContent item={item} truncate={linkDate} />
      {caption && (
        <p className="mt-3 whitespace-pre-line text-[#323232]" style={{ fontSize: 15, lineHeight: 1.45 }}>
          {caption}
        </p>
      )}
      <footer
        className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-outfit font-medium text-[#323232]/70"
        style={{ fontSize: 13, letterSpacing: "-0.03em" }}
      >
        {linkDate ? (
          <Link href={`/drawer/${item.id}`} className="no-underline text-[#323232]/70 hover:text-[#323232]">
            {date}
          </Link>
        ) : (
          <span>{date}</span>
        )}
        {item.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
        <span className="ml-auto flex items-center gap-3">
          <StoryButton id={item.id} version={storyVersion(item.storyStyle)} />
          <ShareButton path={`/drawer/${item.id}`} title={shareTitle} />
        </span>
      </footer>
    </article>
  );
}
