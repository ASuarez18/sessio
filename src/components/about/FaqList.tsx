import { FAQS } from "@/lib/mock-data";
import { Card } from "../ui/Card";

export function FaqList(): React.ReactNode {
  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="font-serif text-3xl font-bold text-midnight-violet-900">
          Frequently asked questions
        </h2>
        <div className="mt-8 flex flex-col gap-4">
          {FAQS.map((faq) => (
            <Card key={faq.question}>
              <h3 className="font-semibold text-midnight-violet-900">
                {faq.question}
              </h3>
              <p className="mt-2 text-midnight-violet-700">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
