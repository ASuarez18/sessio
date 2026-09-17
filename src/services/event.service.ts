import { connectDB } from "@/lib/mongodb";
import Event, { IEvent, EventCategory } from "@/models/Event";
import Registration from "@/models/Registration";
import mongoose from "mongoose";

export interface EventDetailResponse {
  event: IEvent;
  registeredCount: number;
  spotsLeft: number;
  isFull: boolean;
  isRegistered: boolean;
}

export interface CreateEventInput {
  title: string;
  description: string;
  startAt: Date | string;
  endAt: Date | string;
  location: string;
  maxAttendees: number;
  category?: EventCategory;
  imageUrl?: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  startAt?: Date | string;
  endAt?: Date | string;
  location?: string;
  maxAttendees?: number;
  category?: EventCategory;
  imageUrl?: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
}

/**
 * @function getEvents
 * @desc Obtains all events ordered by startDate
 * @returns {Promise<IEvent[]>} List of events
 */
export async function getEvents(category?: string): Promise<IEvent[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (category) {
    filter.category = category;
  }

  return (await Event.find(filter)
    .sort({ startAt: 1 })
    .lean()
    .exec()) as unknown as IEvent[];
}

/**
 * @function getEventById
 * @desc Obtains event by its ID and calculates dynamic attributes (spots, registration status, etc.)
 * @param {string} eventId  - The ID of the event to retrieve
 * @param {string} [currentUserId] - Optional user ID to check registration status
 * @returns {Promise<EventDetailResponse | null>} Event details or null if not found
 */
export async function getEventById(
  eventId: string,
  currentUserId?: string
): Promise<EventDetailResponse | null> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return null;
  }

  const event = await Event.findById(eventId).exec();
  if (!event) {
    return null;
  }

  // Register count and registration status (dynamic attributes)
  let registeredCount = 0;
  let isRegistered = false;

  try {
    registeredCount = await Registration.countDocuments({
      event: eventId,
      status: { $ne: "cancelled" }, // Exclude cancelled registrations 
    });

    if (currentUserId && mongoose.Types.ObjectId.isValid(currentUserId)) {
      const userRegistration = await Registration.findOne({
        event: eventId,
        user: currentUserId,
      });
      isRegistered = !!userRegistration;
    }
  } catch {
    // Mantain default values if there's an error fetching registration data
    registeredCount = 0;
    isRegistered = false;
  }

  const spotsLeft = Math.max(0, event.maxAttendees - registeredCount);
  const isFull = registeredCount >= event.maxAttendees;

  return {
    event,
    registeredCount,
    spotsLeft,
    isFull,
    isRegistered,
  };
}

/**
 * @function createEvent
 * @desc Creates a new event in the database.
 * @param {CreateEventInput} data - The data for the new event
 * @returns {Promise<IEvent>} The created event
 */
export async function createEvent(data: CreateEventInput): Promise<IEvent> {
  await connectDB();

  const newEvent = new Event({
    ...data,
    category: data.category || "Uncategorized",
    startAt: new Date(data.startAt),
    endAt: new Date(data.endAt),
  });

  return newEvent.save();
}

/**
 * @function updateEvent
 * @desc Updates an existing event
 * @param {string} eventId - The ID of the event to update
 * @param {UpdateEventInput} data - The data to update the event with
 * @returns {Promise<IEvent | null>} The updated event or null if not found
 */
export async function updateEvent(
  eventId: string,
  data: UpdateEventInput
): Promise<IEvent | null> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return null;
  }

  const updateData: Record<string, unknown> = { ...data };

  if (data.startAt) {
    updateData.startAt = new Date(data.startAt);
  }
  if (data.endAt) {
    updateData.endAt = new Date(data.endAt);
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
    new: true,
    runValidators: true,
  }).exec();

  return updatedEvent;
}