import Image from "next/image";
import { CATEGORY_HIGHLIGHTS } from "@/lib/mock-data";
import { Button } from "../ui/Button";
import { GlassCard } from "../ui/GlassCard";

export function Hero(): React.ReactNode {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="https://picsum.photos/seed/sessio-hero/1600/900"
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
              Workshops &amp; Training
            </p>
            <h1 className="mt-4 font-serif text-5xl font-bold text-white md:text-6xl">
              Find your next session
            </h1>
            <p className="mt-6 max-w-md text-lg text-midnight-violet-100">
              Discover hands-on workshops and training sessions led by industry
              practitioners. Learn, build, and grow with your peers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/events">Browse sessions</Button>
              <Button href="/register" variant="outlineLight">
                Create account
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {CATEGORY_HIGHLIGHTS.map((item) => (
              <GlassCard key={item.category}>
                <p className="text-xs font-semibold uppercase tracking-widest text-midnight-violet-200">
                  {item.category}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {item.count} sessions
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
