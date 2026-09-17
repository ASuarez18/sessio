import { Button } from "../ui/Button";

export function CtaBand(): React.ReactNode {
  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-midnight-violet-950 px-6 py-16 text-center">
          <h2 className="font-serif text-4xl font-bold text-white">
            Ready to start learning?
          </h2>
          <p className="mt-3 text-midnight-violet-200">
            Browse our upcoming sessions and register for free.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/events">Browse sessions</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
