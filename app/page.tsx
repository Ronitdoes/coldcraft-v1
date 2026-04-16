import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import SpeakerGrid from "@/components/SpeakerGrid";
import BentoStats from "@/components/BentoStats";
import JoinCore from "@/components/JoinCore";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <Marquee />
        <SpeakerGrid />
        <BentoStats />
        <JoinCore />
      </main>
      <Footer />
    </>
  );
}
