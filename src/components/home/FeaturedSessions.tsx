import Link from "next/link";
import { SessionCard } from "../common/SessionCard";
import type { Session } from "@/types/session";

interface FeaturedSessionsProps {
  sessions: Session[];
}

export function FeaturedSessions({ sessions }: FeaturedSessionsProps): React.ReactNode {
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
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionCard key={session.id} session={session} showTime />
            ))
          ) : (
            <p className="col-span-3 text-center text-midnight-violet-600 py-8">
              No sessions available at the moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}