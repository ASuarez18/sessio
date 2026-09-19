import { SessionBrowser } from "@/components/events/SessionBrowser";
import { Session, SessionCategory } from "@/types/session";
import { connectDB } from "@/lib/mongodb";
import { formatDate, formatTime } from "@/lib/format";
import Event from "@/models/Event";
import Registration from "@/models/Registration";

async function getSessions(): Promise<Session[]> {
  await connectDB();
  const events = await Event.find({}).sort({ startAt: 1 }).lean();

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
        date: formatDate(eventDate, "en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: formatTime(eventDate, "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: event.location ?? "Online",
        spotsLeft,
        imageUrl: event.imageUrl ?? "https://picsum.photos/seed/event/800/600",
      };
    }),
  );
}

export default async function EventsPage(): Promise<React.ReactNode> {
  const sessions = await getSessions();

  return (
    <>
      <main className="bg-midnight-violet-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-midnight-violet-500">
            Browse
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-midnight-violet-900 md:text-5xl">
            Upcoming sessions
          </h1>
          <div className="mt-8">
            <SessionBrowser sessions={sessions} />
          </div>
        </div>
      </main>
    </>
  );
}
