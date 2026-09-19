import { NextRequest, NextResponse } from "next/server";
import {
  getEventById,
  updateEvent,
} from "../../../../services/event.service";
import Event, { EVENT_CATEGORIES } from "../../../../models/Event";
import { connectDB } from "../../../../lib/mongodb";
import mongoose from "mongoose";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;


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

    // Check if the user is authenticated to determine registration status
    const user = await getCurrentUser();
    const currentUserId = user ? user.id : undefined;

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
    await requireAdmin();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Event Id" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (body.category && !EVENT_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Allowed: ${EVENT_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (body.maxAttendees !== undefined && (typeof body.maxAttendees !== "number" || body.maxAttendees < 1)) {
      return NextResponse.json(
        { error: "Maximum attendees has to be greater or equal to 1" },
        { status: 400 }
      );
    }

    if (body.startAt && body.endAt && new Date(body.endAt) <= new Date(body.startAt)) {
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

    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${updatedEvent._id}`);
    revalidatePath("/");

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error while updating event";
    const status = errorMessage === "UNAUTHORIZED" ? 401 : errorMessage === "FORBIDDEN" ? 403 : 400;

    return NextResponse.json({ error: errorMessage }, { status });
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
    await requireAdmin();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Event Id" },
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
      { message: "Event successfully deleted" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error while deleting event";
    const status = errorMessage === "UNAUTHORIZED" ? 401 : errorMessage === "FORBIDDEN" ? 403 : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
