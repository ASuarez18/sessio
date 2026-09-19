import { Button } from "../ui/Button";
import type { FaqSectionData } from "@/lib/contenful";

interface FaqTeaserProps {
  faqData?: FaqSectionData | null;
}

export function FaqTeaser({ faqData }: FaqTeaserProps): React.ReactNode {
  const title = faqData?.title || "Frequently asked questions";
  const subtitle = faqData?.subtitle || "Got questions? We have got answers.";

  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex flex-col items-start justify-between gap-4 border-t border-midnight-violet-100 pt-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold text-midnight-violet-900">
              {title}
            </h2>
            <p className="mt-1 text-midnight-violet-600">{subtitle}</p>
          </div>
          <Button href="/about" variant="outline">
            View FAQ
          </Button>
        </div>
      </div>
    </section>
  );
}
