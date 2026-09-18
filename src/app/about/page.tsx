import {
  getFaqSection,
  getValueCards,
  getHomeBanner,
  contentfulClient,
  type AboutPageSkeleton,
  type AboutPageFields,
} from "@/lib/contenful";

import { Footer } from "@/components/common/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { ValueCards } from "@/components/about/ValueCards";
import { FaqList } from "@/components/about/FaqList";
import { CtaBand } from "@/components/about/CtaBand";

async function getAboutPageData(): Promise<AboutPageFields | null> {
  try {
    const response = await contentfulClient.getEntries<AboutPageSkeleton>({
      content_type: "aboutPage",
      limit: 1,
    });

    if (!response.items.length) return null;
    return response.items[0].fields;
  } catch (error) {
    console.error("Error fetching About Page from Contentful:", error);
    return null;
  }
}

export default async function AboutPage(): Promise<React.ReactNode> {
  const [aboutData, valueCards, faqData, homeBanner] = await Promise.all([
    getAboutPageData(),
    getValueCards(),
    getFaqSection(),
    getHomeBanner(),
  ]);

  return (
    <>
      <main>
        <AboutHero aboutData={aboutData} />
        <ValueCards cards={valueCards} />
        <FaqList faqData={faqData} />
        <CtaBand bannerData={homeBanner} aboutData={aboutData} />
      </main>
      <Footer />
    </>
  );
}