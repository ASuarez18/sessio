import { VALUES } from "@/lib/mock-data";
import { Card } from "../ui/Card";

export function ValueCards(): React.ReactNode {
  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title}>
              <span className="text-3xl" role="img" aria-label={value.title}>
                {value.emoji}
              </span>
              <h2 className="mt-4 font-serif text-xl font-bold text-midnight-violet-900">
                {value.title}
              </h2>
              <p className="mt-3 text-midnight-violet-700">{value.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
