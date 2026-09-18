import { FAQS as FALLBACK_FAQS } from "@/lib/mock-data";
import { Card } from "../ui/Card";
import { RichTextRenderer } from "../common/RichTextRenderer";
import type { FaqSectionData } from "@/lib/contenful";

interface FaqListProps {
  faqData?: FaqSectionData | null;
}

export function FaqList({ faqData }: FaqListProps): React.ReactNode {
  const sectionTitle = faqData?.title || "Frequently asked questions";
  const faqItems =
    faqData?.items && faqData.items.length > 0
      ? faqData.items
      : FALLBACK_FAQS;

  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="font-serif text-3xl font-bold text-midnight-violet-900">
          {sectionTitle}
        </h2>
        <div className="mt-8 flex flex-col gap-4">
          {faqItems.map((faq) => (
            <Card key={faq.question}>
              <h3 className="font-semibold text-midnight-violet-900">
                {faq.question}
              </h3>
              {/* Renderiza negritas, itálicas y párrafos formateados de Contentful */}
              <RichTextRenderer content={faq.answer} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}