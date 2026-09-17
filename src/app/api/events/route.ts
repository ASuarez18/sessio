import { NextRequest, NextResponse,  } from "next/server";
import { getEvents, createEvent } from "../../../services/event.service";
import { requireAdmin } from "@/lib/permissions";
import { EVENT_CATEGORIES } from "@/models/Event";

/**
 * @GET /api/events
 * @desc Gets all events ordered by start date
 * @returns {Promise<NextResponse>} JSON response with events or error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    const events = await getEvents(category);
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error while obtaining events:", error);
    return NextResponse.json(
      { error: "Error while obtaining events" },
      { status: 500 }
    );
  }
}
/**
 * @POST /api/events
 * @desc Creates a new event (Admins only)
 * @param {NextRequest} request - The incoming request containing event data 
 * @returns {Promise<NextResponse>} JSON response with created event or error
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { title, description, startAt, endAt, location, maxAttendees, category } = body;

    if (!title || !description || !startAt || !endAt || !location || maxAttendees === undefined) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (category && !EVENT_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Allowed: ${EVENT_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    if (typeof maxAttendees !== "number" || maxAttendees < 1) {
      return NextResponse.json(
        { error: "Maximum attendees has to be greater or equal to 1" },
        { status: 400 }
      );
    }

    if (new Date(endAt) <= new Date(startAt)) {
      return NextResponse.json(
        { error: "End date has to be posterior to start date" },
        { status: 400 }
      );
    }

    const newEvent = await createEvent(body);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error while creating event";
    const status = errorMessage === "UNAUTHORIZED" ? 401 : errorMessage === "FORBIDDEN" ? 403 : 400;
    
    return NextResponse.json({ error: errorMessage }, { status });
  }
}