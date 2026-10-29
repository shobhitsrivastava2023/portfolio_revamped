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
import { getContributions, getPublicRepoCount } from "./lib/github";
import DrawerSection from "./components/drawer/DrawerSection";
import { listPublicDrawerItems } from "./lib/drawer/db";

export default async function Home() {
  const [repoCount, contributions, drawerItems] = await Promise.all([
    getPublicRepoCount(),
    getContributions(),
    // The homepage shouldn't break if the database is unreachable; the section just hides.
    listPublicDrawerItems(3).catch(() => []),
  ]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col items-center px-4 min-[563px]:px-0">
        <Navbar />
        <Hero />
        <Suspense fallback={null}>
          <CardsSection repoCount={repoCount} />
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
