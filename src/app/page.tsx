import { Footer } from "@/components/common/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedSessions } from "@/components/home/FeaturedSessions";
import { FaqTeaser } from "@/components/home/FaqTeaser";

export default function HomePage(): React.ReactNode {
  return (
    <>
      <main>
        <Hero />
        <FeaturedSessions />
        <FaqTeaser />
      </main>
      <Footer />
    </>
  );
}
