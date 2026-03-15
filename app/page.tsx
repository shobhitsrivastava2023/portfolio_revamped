import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CardsSection from "./components/CardsSection";
import BeyondCode from "./components/BeyondCode";
import ListeningDrinkingSection from "./components/ListeningDrinkingSection";
import Philosophy from "./components/Philosophy";
import MusicProduction from "./components/MusicProduction";
import Blogs from "./components/Blogs";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col items-center px-4 min-[563px]:px-0">
        <Navbar />
        <Hero />
        <CardsSection />
        <BeyondCode />
        <ListeningDrinkingSection />
        <Philosophy />
        <MusicProduction />
        <Blogs />
        <Footer />
      </main>
    </div>
  );
}
