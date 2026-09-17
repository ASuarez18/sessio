import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedSessions } from "@/components/home/FeaturedSessions";
import { FaqTeaser } from "@/components/home/FaqTeaser";

export default function HomePage(): React.ReactNode {
  return (
    <>
      <Header active="home" />
      <main>
        <Hero />
        <FeaturedSessions />
        <FaqTeaser />
      </main>
      <Footer />
    </>
  );
}
