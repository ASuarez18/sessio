import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getEventAvailability } from "@/services/registration.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * @GET /api/events/[id]/availability
 * @desc Public endpoint returning the live remaining spots for an event.
 * @returns {EventAvailability} The availability snapshot for the event.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
    }

    const availability = await getEventAvailability(id);
    return NextResponse.json(availability, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "EVENT_NOT_FOUND") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    console.error("Error when getting event availability:", error);
    return NextResponse.json(
      { error: "Error when getting event availability" },
      { status: 500 },
    );
  }
}
