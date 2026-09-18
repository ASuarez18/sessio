import type { AboutPageFields } from "@/lib/contenful";

interface AboutHeroProps {
  aboutData?: AboutPageFields | null;
}

export function AboutHero({ aboutData }: AboutHeroProps): React.ReactNode {
  const badgeText = aboutData?.badgeText || "About & FAQ";
  const title = aboutData?.heroTitle || "Learn together, grow together";
  const subtitle =
    aboutData?.heroSubtitle ||
    "Sessio connects professionals with hands-on workshops and training sessions led by practitioners who care about teaching.";

  return (
    <section className="bg-midnight-violet-950">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-widest text-midnight-violet-300">
          {badgeText}
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-5xl font-bold text-white md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-midnight-violet-200">
          {subtitle}
        </p>
      </div>
    </section>
  );
}