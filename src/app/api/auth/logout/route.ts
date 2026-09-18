import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { destroySession } from "@/services/auth.service";
import { getCurrentUser } from "@/lib/auth";

/**
 * @POST api/auth/logout
 * @desc Logs out the currently authenticated user by destroying their session and clearing the session cookie
 * @status 200 on success, 500 if there is a server error
 * @throws {Error} if there is a server error while destroying the session
 * @returns {message: string} on success, or {error: string} on failure
 */
export async function POST() : Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessio_session")?.value;

    if (sessionToken) {
      await destroySession(sessionToken);
    }

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.delete("sessio_session");

    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { error: "Failed to log out" },
      { status: 500 }
    );
  }
}
