import { Button } from "../ui/Button";

export function FaqTeaser(): React.ReactNode {
  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex flex-col items-start justify-between gap-4 border-t border-midnight-violet-100 pt-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-midnight-violet-900">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-midnight-violet-600">
              Got questions? We have got answers.
            </p>
          </div>
          <Button href="/about" variant="outline">
            View FAQ
          </Button>
        </div>
      </div>
    </section>
  );
}
