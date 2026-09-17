import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { ValueCards } from "@/components/about/ValueCards";
import { FaqList } from "@/components/about/FaqList";
import { CtaBand } from "@/components/about/CtaBand";

export default function AboutPage(): React.ReactNode {
  return (
    <>
      <Header active="about" />
      <main>
        <AboutHero />
        <ValueCards />
        <FaqList />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
