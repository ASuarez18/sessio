import Link from "next/link";

import { SessionCard } from "@/components/common/SessionCard";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import type { Session, SessionCategory } from "@/types/session";

async function getFeaturedSessions(): Promise<Session[]> {
  await connectDB();

  const events = await Event.find({ startAt: { $gte: new Date() } })
    .sort({ startAt: 1 })
    .limit(3)
    .lean();

  return Promise.all(
    events.map(async (event) => {
      const eventId = event._id.toString();
      const registeredCount = await Registration.countDocuments({
        event: eventId,
      });

      const maxAttendees = event.maxAttendees ?? 0;
      const spotsLeft = Math.max(0, maxAttendees - registeredCount);
      const eventDate = event.startAt ? new Date(event.startAt) : new Date();

      return {
        id: eventId,
        title: event.title,
        category: (event.category ?? "Uncategorized") as SessionCategory,
        date: eventDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: eventDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: event.location ?? "Online",
        spotsLeft,
        imageUrl: event.imageUrl ?? "/image_not_available.png",
      };
    }),
  );
}

export async function FeaturedSessions(): Promise<React.ReactNode> {
  const sessions = await getFeaturedSessions();

  if (sessions.length === 0) {
    return null;
  }

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
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} showTime />
          ))}
        </div>
      </div>
    </section>
  );
}
