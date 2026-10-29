import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import DrawerEntry from "../../components/drawer/DrawerEntry";
import { getDrawerItem } from "../../lib/drawer/db";
import { formatDrawerDate } from "../../lib/drawer/format";
import type { DrawerItem } from "../../lib/drawer/types";
import { articleTitle } from "../../lib/drawer/article";
import { t } from "../../data/strings";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

async function load(id: string): Promise<DrawerItem | null> {
  try {
    return await getDrawerItem(id);
  } catch {
    return null;
  }
}

/** Title for link previews: the text itself, or what the item is. */
function previewTitle(item: DrawerItem): string {
  if (item.kind === "article") return articleTitle(item.body);
  if (item.body) return item.body.length > 70 ? `${item.body.slice(0, 67)}...` : item.body;
  if (item.kind === "audio") return item.media[0]?.title || "a song";
  return item.kind === "photo" ? "a photo" : "a clip";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await load((await params).id);
  if (!item) return {};
  const title = previewTitle(item);
  const description = `from shobhit's drawer · ${formatDrawerDate(item.createdAt)}`;
  // The preview image comes from opengraph-image.tsx next to this page.
  return {
    title,
    description,
    // Unlisted items can be shared by link but shouldn't show up in search.
    robots: item.visibility === "public" ? undefined : { index: false },
    openGraph: { type: "article", title, description, publishedTime: item.createdAt },
  };
}

export default async function DrawerItemPage({ params }: Props) {
  const item = await load((await params).id);
  if (!item) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col px-4 min-[563px]:px-0">
        <Navbar />
        <div style={{ marginTop: 50, marginBottom: 24 }}>
          <BackButton href="/drawer" />
        </div>
        <DrawerEntry item={item} linkDate={false} />
        <Link
          href="/drawer"
          className="mt-12 self-start font-outfit font-medium text-[#323232] underline decoration-[#FC6E20] decoration-2 underline-offset-4 hover:opacity-80"
          style={{ fontSize: 18, letterSpacing: "-0.04em", marginBottom: 80 }}
        >
          {t("drawer.more")} →
        </Link>
      </main>
    </div>
  );
}
