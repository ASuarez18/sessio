import { NextRequest, NextResponse } from "next/server";
import {
  getEventById,
  updateEvent,
} from "@/services/event.service";
import Event from "@/models/Event";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
// import { requireAdmin } from "@/lib/permissions"; // AUTH
// import { getCurrentUser } from "@/lib/auth"; // AUTH

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * @GET /api/events/[id]
 * @desc Obtains the details of a specific event and calculates dynamic attributes (spotsLeft, isFull, etc.)
 * @param {NextRequest} request - The incoming request
 * @param {RouteParams} params - The route parameters containing the event ID
 * @returns {Promise<NextResponse>} JSON response with event details or error
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Event Id" },
        { status: 400 }
      );
    }

    // TODO: Obtain user Id from session for registration status check
    // const user = await getCurrentUser();
    // const currentUserId = user ? user.id : undefined;
    const currentUserId = undefined;

    const eventDetail = await getEventById(id, currentUserId);

    if (!eventDetail) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(eventDetail, { status: 200 });
  } catch (error) {
    console.error("Error while obtaining event:", error);
    return NextResponse.json(
      { error: "Error while obtaining event" },
      { status: 500 }
    );
  }
}

/**
 * @PATCH /api/events/[id]
 * @desc Updates an existing event's information (Admins only).
 * @param {NextRequest} request - The incoming request containing updated event data
 * @param {RouteParams} params - The route parameters containing the event ID
 * @returns {Promise<NextResponse>} JSON response with updated event or error
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Auth requirement to update events (only admins)
    // await requireAdmin();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Event Id" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (body.maxAttendees !== undefined && (typeof body.maxAttendees !== "number" || body.maxAttendees < 1)) {
      return NextResponse.json(
        { error: "Maximum attendees has to be greater or equal to 1" },
        { status: 400 }
      );
    }

    if (new Date(body.endAt) <= new Date(body.startAt)) {
      return NextResponse.json(
        { error: "End date has to be posterior to start date" },
        { status: 400 }
      );
    }

    const updatedEvent = await updateEvent(id, body);

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Event to update not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error while updating event";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

/**
 * @DELETE /api/events/[id]
 * @desc Deletes an event from the database (Admins only).
 * @param {NextRequest} request - The incoming request
 * @param {RouteParams} params - The route parameters containing the event ID
 * @returns {Promise<NextResponse>} JSON response with deletion status or error
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // TODO: Auth requirement to delete events (only admins)
    // await requireAdmin();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de evento inválido" },
        { status: 400 }
      );
    }

    await connectDB();
    const deletedEvent = await Event.findByIdAndDelete(id).exec();

    if (!deletedEvent) {
      return NextResponse.json(
        { error: "Event to delete not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event Succesfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deleting event:", error);
    return NextResponse.json(
      { error: "Error while deleting event" },
      { status: 500 }
    );
  }
}