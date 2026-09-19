import Image from "next/image";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";
import type { HeroSectionFields } from "@/lib/contenful";

interface CategoryHighlight {
  category: string;
  count: number;
}

interface HeroProps {
  heroData?: HeroSectionFields | null;
  categoryHighlights?: CategoryHighlight[];
}

const ALL_CATEGORIES = [
  "Web Dev",
  "Software Engineering",
  "AI & ML",
  "UI design",
  "Design",
  "Data",
  "Cybersecurity",
  "Cloud & DevOps",
];

export function Hero({
  heroData,
  categoryHighlights = [],
}: HeroProps): React.ReactNode {
  const badgeText = heroData?.subtitle || "WORKSHOPS & TRAINING";
  const title = heroData?.title || "Find your next session";
  const subtitle =
    typeof heroData?.description === "string"
      ? heroData.description
      : "Discover hands-on workshops and training sessions led by industry practitioners. Learn, build, and grow with your peers.";

  const primaryCtaText = heroData?.ctaPrimaryText || "Browse sessions";
  const primaryCtaLink = heroData?.ctaPrimaryLink || "/events";

  const secondaryCtaText = heroData?.ctaSecondaryText || "Create account";
  const secondaryCtaLink = heroData?.ctaSecondaryLink || "/register";

  const imageUrl = heroData?.image?.fields?.file?.url
    ? heroData.image.fields.file.url.startsWith("//")
      ? `https:${heroData.image.fields.file.url}`
      : heroData.image.fields.file.url
    : "https://picsum.photos/seed/sessio-hero/1600/900";

  const activeCategories = ALL_CATEGORIES.map((catName) => {
    const found = categoryHighlights.find(
      (item) => item.category?.trim().toLowerCase() === catName.toLowerCase(),
    );
    return {
      category: catName,
      count: found ? found.count : 0,
    };
  }).filter((item) => item.count > 0);

  const displayCategories =
    activeCategories.length > 0
      ? activeCategories
      : [
          { category: "Web Dev", count: 0 },
          { category: "Software Engineering", count: 0 },
          { category: "AI & ML", count: 0 },
          { category: "UI design", count: 0 },
        ];

  return (
    <section className="relative overflow-hidden">
      <Image
        src={imageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-midnight-violet-950/70" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-midnight-violet-200">
              {badgeText}
            </p>
            <h1 className="mt-4 font-heading text-5xl font-bold text-white md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-md text-lg text-midnight-violet-100">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={primaryCtaLink}>{primaryCtaText}</Button>
              {/* <Button href={secondaryCtaLink} variant="outlineLight">
                {secondaryCtaText}
              </Button> */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {displayCategories.map((item) => (
              <GlassCard key={item.category}>
                <p className="text-xs font-semibold uppercase tracking-widest text-midnight-violet-200">
                  {item.category}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {item.count} {item.count === 1 ? "session" : "sessions"}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
