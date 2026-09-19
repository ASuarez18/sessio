import { VALUES as FALLBACK_VALUES } from "@/lib/mock-data";
import { Card } from "../ui/Card";
import { RichTextRenderer } from "../common/RichTextRenderer";
import type { ValueCardFields } from "@/lib/contenful";

interface ValueCardsProps {
  cards?: ValueCardFields[];
}

export function ValueCards({ cards }: ValueCardsProps): React.ReactNode {
  const valueList =
    cards && cards.length > 0
      ? cards.map((c) => ({
          title: c.title,
          content: c.description || c.body || "",
          emoji: c.emoji || "✨",
        }))
      : FALLBACK_VALUES.map((v) => ({
          title: v.title,
          content: v.body,
          emoji: v.emoji,
        }));

  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {valueList.map((value) => (
            <Card key={value.title}>
              <span className="text-3xl" role="img" aria-label={value.title}>
                {value.emoji}
              </span>
              <h2 className="mt-4 font-heading text-xl font-bold text-midnight-violet-900">
                {value.title}
              </h2>
              <div className="mt-3 text-midnight-violet-700">
                <RichTextRenderer content={value.content} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
