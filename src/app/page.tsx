import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import { getHomeHero, getFaqSection } from "@/lib/contenful";

import { Footer } from "@/components/common/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturedSessions } from "@/components/home/FeaturedSessions";
import { FaqTeaser } from "@/components/home/FaqTeaser";
import type { Session, SessionCategory } from "@/types/session";
import { getCategoryCountsFromDB } from "@/models/Category";

export const revalidate = 60;

async function getFeaturedSessionsFromDB(): Promise<Session[]> {
  try {
    await connectDB();

    const events = await Event.find({ startAt: { $gte: new Date() } })
      .sort({ startAt: 1 })
      .limit(3)
      .lean();

    const sessions = await Promise.all(
      events.map(async (event) => {
        const registeredCount = await Registration.countDocuments({
          event: event._id,
        });

        const eventDate = event.startAt ? new Date(event.startAt) : new Date();

        return {
          id: event._id.toString(),
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
          spotsLeft: Math.max(
            0,
            (event.maxAttendees ?? 0) - registeredCount
          ),
          maxAttendees: event.maxAttendees ?? 0,
          registeredCount,
          imageUrl:
            event.imageUrl ??
            "https://picsum.photos/seed/sessio-hero/1600/900",
        };
      })
    );

    return sessions;
  } catch (error) {
    console.error("Error fetching featured sessions from MongoDB:", error);
    return [];
  }
}

export default async function HomePage(): Promise<React.ReactNode> {
  const [heroData, faqData, featuredSessions, categoryHighlights] = await Promise.all([
    getHomeHero(),
    getFaqSection(),
    getFeaturedSessionsFromDB(),
    getCategoryCountsFromDB(),
  ]);

  return (
    <>
      <main>
        <Hero heroData={heroData} categoryHighlights={categoryHighlights} />
        <FeaturedSessions sessions={featuredSessions} />
        <FaqTeaser faqData={faqData} />
      </main>
      <Footer />
    </>
  );
}