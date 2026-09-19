import { NextRequest, NextResponse } from "next/server";
import { getEventRegistrations } from "@/services/registration.service";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/permissions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * @GET /api/events/[id]/registrations
 * @desc Obtain the list of users registered for a specific event.
 * @returns {Array} List of registrations with user details.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid event Id" },
        { status: 400 }
      );
    }

    const registrations = await getEventRegistrations(id);
    return NextResponse.json(registrations, { status: 200 });
  } catch (error) {
    console.error("Error when getting registered users:", error);
    return NextResponse.json(
      { error: "Error when getting registered users" },
      { status: 500 }
    );
  }
}