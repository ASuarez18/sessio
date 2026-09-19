import { Button } from "../ui/Button";
import type { HomeBannerFields, AboutPageFields } from "@/lib/contenful";

interface CtaBandProps {
  bannerData?: HomeBannerFields | null;
  aboutData?: AboutPageFields | null;
}

export function CtaBand({
  bannerData,
  aboutData,
}: CtaBandProps): React.ReactNode {
  const title =
    bannerData?.title || aboutData?.ctaTitle || "Ready to start learning?";

  const subtitle =
    typeof bannerData?.description === "string"
      ? bannerData.description
      : aboutData?.ctaSubtitle ||
        "Browse our upcoming sessions and register for free.";

  const buttonText =
    bannerData?.ctaText || aboutData?.ctaButtonText || "Browse sessions";
  const buttonLink = bannerData?.ctaLink || "/events";

  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-midnight-violet-950 px-6 py-16 text-center">
          <h2 className="font-heading text-4xl font-bold text-white">
            {title}
          </h2>
          <p className="mt-3 text-midnight-violet-200">{subtitle}</p>
          <div className="mt-8 flex justify-center">
            <Button href={buttonLink}>{buttonText}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
