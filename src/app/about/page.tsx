import { Footer } from "@/components/common/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { ValueCards } from "@/components/about/ValueCards";
import { FaqList } from "@/components/about/FaqList";
import { CtaBand } from "@/components/about/CtaBand";

export default function AboutPage(): React.ReactNode {
  return (
    <>
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
