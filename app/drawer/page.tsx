import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import DrawerEntry from "../components/drawer/DrawerEntry";
import { listPublicDrawerItems } from "../lib/drawer/db";
import type { DrawerItem } from "../lib/drawer/types";
import { t } from "../data/strings";

// New posts refresh this page right away (revalidatePath); this is just a safety net.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Drawer",
  description: "Thoughts, photos, clips and songs by Shobhit Srivastava. Unfiltered, newest first.",
};

async function loadItems(): Promise<DrawerItem[]> {
  try {
    return await listPublicDrawerItems(100);
  } catch (err) {
    console.error("drawer: failed to load items", err);
    return [];
  }
}

export default async function DrawerPage() {
  const items = await loadItems();
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col px-4 min-[563px]:px-0">
        <Navbar />
        <div style={{ marginTop: 50 }}>
          <BackButton href="/" />
        </div>
        <h1
          className="mt-6 font-outfit font-medium text-[#1B1B1B]"
          style={{ fontSize: "clamp(56px, 16vw, 96px)", letterSpacing: "-0.08em", lineHeight: 1 }}
        >
          {t("drawer.title")}
        </h1>
        <p className="mt-3 text-[#323232]" style={{ fontSize: 16, letterSpacing: "-0.01em" }}>
          {t("drawer.intro")}
        </p>

        <div className="mt-10 flex flex-col" style={{ gap: 48, marginBottom: 80 }}>
          {items.length === 0 ? (
            <p className="font-outfit font-medium text-[#323232]/70" style={{ fontSize: 16 }}>
              {t("drawer.empty")}
            </p>
          ) : (
            items.map((item) => <DrawerEntry key={item.id} item={item} />)
          )}
        </div>
      </main>
    </div>
  );
}
