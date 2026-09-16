import { NextRequest, NextResponse } from "next/server";
import {
  registerForEvent,
  unregisterFromEvent,
} from "@/services/registration.service";
import mongoose from "mongoose";
// ! import { getCurrentUser } from "@/lib/auth"; // AUTH

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

/**
 * @POST /api/registrations/[eventId]
 * @desc Registers the current user for the specified event.
 * @returns {Object} Registration details.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: "ID de evento inválido" },
        { status: 400 }
      );
    }

    // TODO: Get user from session or auth context
    // const user = await getCurrentUser();
    // if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    // const userId = user.id;

    // Temporal fallback to get userId from request body for testing purposes
    const body = await request.json().catch(() => ({}));
    const userId = body.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "userId es requerido y debe ser un ObjectId válido" },
        { status: 400 }
      );
    }

    const registration = await registerForEvent(userId, eventId);
    return NextResponse.json(registration, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "EVENT_NOT_FOUND") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (message === "EVENT_FULL") {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }
    if (message === "ALREADY_REGISTERED") {
      return NextResponse.json(
        { error: "You're already registered to this event" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error while processing registration" },
      { status: 500 }
    );
  }
}

/**
 * @DELETE /api/registrations/[eventId]
 * @desc Unregisters the current user from the specified event.
 * @returns {Object} Success message.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { eventId } = await params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: "Invalid Event Id" },
        { status: 400 }
      );
    }

    // TODO: Obtain userId from session or auth context
    // const user = await getCurrentUser();
    // if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    // const userId = user.id;

    // Temporal fallback to get userId from request body for testing purposes
    const body = await request.json().catch(() => ({}));
    const userId = body.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "userId is required and needs to be a valid ObjectId" },
        { status: 400 }
      );
    }

    const success = await unregisterFromEvent(userId, eventId);

    if (!success) {
      return NextResponse.json(
        { error: "No registration found to cancel" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Registration succesfully cancelled" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while cancelling registration:", error);
    return NextResponse.json(
      { error: "Error while cancelling registration" },
      { status: 500 }
    );
  }
}