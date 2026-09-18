import { NextResponse } from "next/server";
import {} from "@/services/registration.service";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Event from "@/models/Event";

/**
 * @POST /api/registrations/[eventId]
 * @desc Registers the current user for the specified event.
 * @returns {Object} Registration details.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    await connectDB();

    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: user.id,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "User is already registered for this event" },
        { status: 409 },
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const currentRegistrationsCount = await Registration.countDocuments({ event: eventId });
    if (event.maxAttendees && currentRegistrationsCount >= event.maxAttendees) {
      return NextResponse.json(
        { error: "Event is full. No spots left available." },
        { status: 400 }
      );
    }

    const registration = await Registration.create({
      event: eventId,
      user: user.id,
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 },
    );
  }
}
/**
 * @DELETE /api/registrations/[eventId]
 * @desc Unregisters the current user from the specified event.
 * @returns {Object} Success message.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    await connectDB();

    const deletedRegistration = await Registration.findOneAndDelete({
      event: eventId,
      user: user.id,
    });

    if (!deletedRegistration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Registration successfully cancelled",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { error: "Failed to cancel registration" },
      { status: 500 },
    );
  }
}
