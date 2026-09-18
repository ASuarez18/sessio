import { createClient, type EntrySkeletonType } from "contentful";
import type { Document } from "@contentful/rich-text-types";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  console.warn(
    "Contentful environment variables (CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN) are missing."
  );
}

export const contentfulClient = createClient({
  space: spaceId || "",
  accessToken: accessToken || "",
});

// 1. HeroSection
export interface HeroSectionFields {
  title: string;
  subtitle?: string;
  description?: Document | string;
  image?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
}

export interface HeroSectionSkeleton extends EntrySkeletonType {
  contentTypeId: "heroSection";
  fields: HeroSectionFields;
}

// 2. HomeBanner (Bloque inferior CTA "Ready to start learning?")
export interface HomeBannerFields {
  title: string;
  description?: Document | string;
  ctaText?: string;
  ctaLink?: string;
}

export interface HomeBannerSkeleton extends EntrySkeletonType {
  contentTypeId: "homeBanner";
  fields: HomeBannerFields;
}

// 3. FAQItem & FAQ Container
export interface FaqItemFields {
  question: string;
  answer: Document | string;
}

export interface FaqItemSkeleton extends EntrySkeletonType {
  contentTypeId: "faqItem";
  fields: FaqItemFields;
}

export interface FaqItemData {
  question: string;
  answer: Document | string; 
}

export interface FaqSectionData {
  title: string;
  subtitle?: string;
  items: FaqItemData[];
}

export interface FaqQuestionReference {
  sys: {
    id: string;
    type: string;
    linkType: string;
  };
  fields?: FaqItemFields;
}

export interface FaqContainerFields {
  title: string;
  subtitle?: string;
  questions?: FaqQuestionReference[];
  ctaText?: string;
}

export interface FaqContainerSkeleton extends EntrySkeletonType {
  contentTypeId: "faq";
  fields: FaqContainerFields;
}

// 4. ValueCard
export interface ValueCardFields {
  title: string;
  body?: string;
  description?: Document | string;
  emoji?: string;
}

export interface ValueCardSkeleton extends EntrySkeletonType {
  contentTypeId: "valueCard";
  fields: ValueCardFields;
}

// 5. AboutPage
export interface AboutPageFields {
  badgeText?: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
}

export interface AboutPageSkeleton extends EntrySkeletonType {
  contentTypeId: "aboutPage";
  fields: AboutPageFields;
}

/**
 * @function getHomeHero
 * @desc Fetches the hero section data from Contentful
 * @returns {Promise<HeroSectionFields | null>} The hero section data or null if not found
 */
export async function getHomeHero(): Promise<HeroSectionFields | null> {
  try {
    const response = await contentfulClient.getEntries<HeroSectionSkeleton>({
      content_type: "heroSection",
      limit: 1,
    });
    if (!response.items.length) return null;
    return response.items[0].fields;
  } catch (error) {
    console.error("Error fetching Home Hero from Contentful:", error);
    return null;
  }
}

/**
 * @function getHomeBanner
 * @desc Fetches the home banner data from Contentful
 * @returns {Promise<HomeBannerFields | null>} The home banner data or null if not found
 */
export async function getHomeBanner(): Promise<HomeBannerFields | null> {
  try {
    const response = await contentfulClient.getEntries<HomeBannerSkeleton>({
      content_type: "homeBanner",
      limit: 1,
    });
    if (!response.items.length) return null;
    return response.items[0].fields;
  } catch (error) {
    console.error("Error fetching Home Banner from Contentful:", error);
    return null;
  }
}

/**
 * @function getFaqSection
 * @desc Fetches the FAQ section data from Contentful
 * @returns {Promise<FaqSectionData[]>} The FAQ section data or null if not found
 */
export async function getFaqSection(): Promise<FaqSectionData | null> {
  try {
    const response = await contentfulClient.getEntries<FaqContainerSkeleton>({
      content_type: "faq",
      include: 2,
      limit: 1,
    });

    if (!response.items.length) return null;

    const entry = response.items[0].fields;
    const rawQuestions = (entry.questions ?? []) as unknown as FaqQuestionReference[];

    const items: FaqItemData[] = rawQuestions.map((q) => {
      const itemFields = q.fields;

      return {
        question: itemFields?.question ?? "",
        answer: itemFields?.answer ?? "",
      };
    });

    return {
      title: entry.title,
      subtitle: entry.subtitle,
      items,
    };
  } catch (error) {
    console.error("Error fetching FAQ section from Contentful:", error);
    return null;
  }
}

/**
 * @function getValueCards
 * @desc Fetches the value cards data from Contentful
 * @returns {Promise<ValueCardFields[]>} An array of value card data
 */
export async function getValueCards(): Promise<ValueCardFields[]> {
  try {
    const response = await contentfulClient.getEntries<ValueCardSkeleton>({
      content_type: "valueCard",
    });
    return response.items.map((item) => item.fields);
  } catch (error) {
    console.error("Error fetching Value Cards from Contentful:", error);
    return [];
  }
}

/**
 * @function getAboutPageData
 * @desc Fetches the About Page entry data from Contentful
 * @returns {Promise<AboutPageFields | null>} The About Page data or null if not found
 */
export async function getAboutPageData(): Promise<AboutPageFields | null> {
  try {
    const response = await contentfulClient.getEntries<AboutPageSkeleton>({
      content_type: "aboutPage",
      limit: 1,
    });

    if (!response.items.length) return null;

    const entry = response.items[0];

    return {
      badgeText: entry.fields.badgeText ?? "ABOUT & FAQ",
      heroTitle: entry.fields.heroTitle ?? "Learn together, grow together",
      heroSubtitle: entry.fields.heroSubtitle ?? "",
      ctaTitle: entry.fields.ctaTitle,
      ctaSubtitle: entry.fields.ctaSubtitle,
      ctaButtonText: entry.fields.ctaButtonText,
    };
  } catch (error) {
    console.error("Error fetching About Page from Contentful:", error);
    return null;
  }
}