import { Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CardsSection from "./components/CardsSection";
import BeyondCode from "./components/BeyondCode";
import ListeningDrinkingSection from "./components/ListeningDrinkingSection";
import ProofOfWorkSection from "./components/ProofOfWorkSection";
import Philosophy from "./components/Philosophy";
import MusicProduction from "./components/MusicProduction";
import Blogs from "./components/Blogs";
import Footer from "./components/Footer";
import { getContributions } from "./lib/github";
import { getLeetCodeStats } from "./lib/leetcode";
import DrawerSection from "./components/drawer/DrawerSection";
import { listPublicDrawerItems } from "./lib/drawer/db";

export default async function Home() {
  const [contributions, drawerItems, leetcode] = await Promise.all([
    getContributions(),
    // The homepage shouldn't break if the database is unreachable; the section just hides.
    listPublicDrawerItems(3).catch(() => []),
    getLeetCodeStats(),
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col items-center px-4 min-[563px]:px-0">
        <Navbar />
        <Hero />
        <Suspense fallback={null}>
          <CardsSection leetcode={leetcode} />
        </Suspense>
        <DrawerSection items={drawerItems} />
        <ProofOfWorkSection contributions={contributions} />
        <BeyondCode />
        <ListeningDrinkingSection />
        <Philosophy />
        <MusicProduction />
        <Suspense fallback={null}>
          <Blogs />
        </Suspense>
        <Footer />
      </main>
    </div>
  );
}
