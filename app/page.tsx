import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
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
        <SpeakerGrid />
        <BentoStats />
        <JoinCore />
      </main>
      <Footer />
    </>
  );
}
