import { use } from "react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import EventDetailClient from "./EventDetailClient";
import type { SessionCategory } from "@/types/session";

export interface EventDetailData {
  id: string;
  title: string;
  category: SessionCategory;
  description?: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  registeredCount: number;
  imageUrl: string;
}

async function getEventDetails(id: string): Promise<EventDetailData | null> {
  await connectDB();

  if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Mongoose ObjectId validation
    return null;
  }

  const event = await Event.findById(id).lean();
  if (!event) return null;

  const registeredCount = await Registration.countDocuments({ event: id });
  const eventDate = event.startAt ? new Date(event.startAt) : new Date();

  return {
    id: event._id.toString(),
    title: event.title,
    category: (event.category ?? "Uncategorized") as SessionCategory,
    description: event.description,
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
    maxAttendees: event.maxAttendees ?? 0,
    registeredCount,
    imageUrl: event.imageUrl ?? "https://picsum.photos/seed/sessio-hero/1600/900",
  };
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const session = use(getEventDetails(id));

  if (!session) {
    notFound();
  }

  return <EventDetailClient session={session} />;
}