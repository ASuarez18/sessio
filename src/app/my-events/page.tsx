import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatStatus, formatTime } from "@/lib/format";
import { getUserUpcomingSessions } from "@/services/registration.service";
import { Footer } from "@/components/common/Footer";
import { UnregisterButton } from "@/components/my-events/UnregisterButton";

export default async function MyEventsPage(): Promise<React.ReactNode> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const sessions = await getUserUpcomingSessions(user.id);

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      <section className="flex-1 bg-midnight-violet-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-midnight-violet-500">
          Dashboard
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-midnight-violet-900 md:text-5xl">
          My sessions
        </h1>

        <div className="mt-8 overflow-hidden rounded-2xl border border-midnight-violet-100 bg-white">
          <div className="border-b border-midnight-violet-100 px-6 py-4">
            <h2 className="font-serif text-xl font-bold text-midnight-violet-900">
              Upcoming sessions
            </h2>
          </div>

          {sessions.length === 0 ? (
            <p className="px-6 py-10 text-center text-midnight-violet-600">
              You have no upcoming sessions.{" "}
              <Link href="/events" className="font-medium underline">
                Browse sessions
              </Link>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-midnight-violet-100 text-left text-xs uppercase tracking-wide text-midnight-violet-500">
                    <th className="px-6 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-midnight-violet-100">
                  {sessions.map((session) => (
                    <tr key={session.registrationId}>
                      <td className="px-6 py-4">
                        <Link
                          href={`/events/${session.eventId}`}
                          className="font-semibold text-midnight-violet-900 hover:underline"
                        >
                          {session.title}
                        </Link>
                        <p className="text-xs text-midnight-violet-500">
                          {session.category}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-midnight-violet-700">
                        <span>{formatDate(session.startAt)}</span>
                        <br />
                        <span className="text-midnight-violet-500">
                          {formatTime(session.startAt)}–
                          {formatTime(session.endAt)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-midnight-violet-700">
                        {session.location}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          {formatStatus(session.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <UnregisterButton eventId={session.eventId} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </section>
      <Footer />
    </div>
  );
}
