import { connectDB } from "@/lib/mongodb";
import Registration, { IRegistration } from "@/models/Registration";
import Event from "@/models/Event";
import mongoose from "mongoose";

/**
 * @function registerForEvent
 * @param {string} userId - The ID of the user attempting to register for the event
 * @param {string} eventId - The ID of the event for which the user is registering
 * @desc Registers a user for a specific event, ensuring event isn't full and user is not already registered
 * @throws {Error} Throws an error if user ID or event ID is invalid, if event is full, or if  user is already registered
 * @returns {Promise<IRegistration>} The newly created registration document
 */
export async function registerForEvent(
  userId: string,
  eventId: string,
): Promise<IRegistration> {
  await connectDB();

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(eventId)
  ) {
    throw new Error("INVALID_ID");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  // Capacity check: Ensure the event is not full before registering
  const activeCount = await Registration.countDocuments({
    event: eventId,
    status: { $ne: "cancelled" },
  });

  if (activeCount >= event.maxAttendees) {
    throw new Error("EVENT_FULL");
  }

  try {
    const registration = new Registration({
      user: userId,
      event: eventId,
      registeredAt: new Date(),
      status: "registered",
    });

    return await registration.save();
  } catch (error: unknown) {
    // Duplicate registration check: If the user is already registered for the event, throw a specific error
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      throw new Error("ALREADY_REGISTERED");
    }
    throw error;
  }
}

/**
 * @function unregisterFromEvent
 * @param {string} userId - The ID of the user attempting to unregister from the event
 * @param {string} eventId - The ID of the event from which the user is unregistering
 * @desc Unregisters a user from a specific event, ensuring valid IDs and existing registration
 * @throws {Error} Throws an error if user ID or event ID is invalid
 * @returns {Promise<boolean>} True if the unregistration was successful, false if no registration was found
 */
export async function unregisterFromEvent(
  userId: string,
  eventId: string,
): Promise<boolean> {
  await connectDB();

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(eventId)
  ) {
    throw new Error("INVALID_ID");
  }

  const result = await Registration.findOneAndDelete({
    user: userId,
    event: eventId,
  });

  return !!result;
}

/**
 * @function getUserRegistrations
 * @desc Retrieves all registrations for a specific user, sorted by registration date in descending order
 * @param {string} userId - The ID of the user whose registrations are being retrieved
 * @throws {Error} Throws an error if the user ID is invalid
 * @returns {Promise<IRegistration[]>} An array of registration documents for the specified user
 */
export async function getUserRegistrations(userId: string) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("INVALID_ID");
  }

  return Registration.find({ user: userId })
    .populate("event")
    .sort({ registeredAt: -1 })
    .exec();
}

/**
 * @function getEventRegistrations
 * @desc Retrieves all registrations for a specific event, sorted by registration date in descending order
 * @param {string} eventId - The ID of the event whose registrations are being retrieved
 * @throws {Error} Throws an error if the event ID is invalid
 * @returns {Promise<IRegistration[]>} An array of registration documents for the specified event
 */
export async function getEventRegistrations(eventId: string) {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new Error("INVALID_ID");
  }

  return Registration.find({ event: eventId })
    .populate("user", "name email username")
    .sort({ registeredAt: -1 })
    .exec();
}
