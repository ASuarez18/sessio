import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SessionBrowser } from "@/components/events/SessionBrowser";

export default function EventsPage(): React.ReactNode {
  return (
    <>
      <Header active="events" />
      <main className="bg-midnight-violet-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-midnight-violet-500">
            Browse
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-midnight-violet-900 md:text-5xl">
            Upcoming sessions
          </h1>
          <div className="mt-8">
            <SessionBrowser />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
