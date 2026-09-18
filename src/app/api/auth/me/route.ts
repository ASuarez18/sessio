import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/**
 * @GET api/auth/me
 * @desc Retrieves the currently authenticated user based on the session token stored in cookies
 * @status 200 on success, 401 if no valid session is found
 * @throws {Error} if there is a server error while retrieving the user
 * @returns {user: PublicUser} on success, or {error: string} on failure
 */
export async function GET(): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { user: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { user: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
