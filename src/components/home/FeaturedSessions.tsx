import Link from "next/link";
import { FEATURED_SESSIONS } from "@/lib/mock-data";
import { SessionCard } from "../SessionCard";

export function FeaturedSessions(): React.ReactNode {
  return (
    <section className="bg-midnight-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-midnight-violet-900">
            Featured sessions
          </h2>
          <Link
            href="/events"
            className="text-sm font-medium text-midnight-violet-700 hover:text-midnight-violet-900"
          >
            View all sessions ›
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {FEATURED_SESSIONS.map((session) => (
            <SessionCard key={session.id} session={session} showTime />
          ))}
        </div>
      </div>
    </section>
  );
}
