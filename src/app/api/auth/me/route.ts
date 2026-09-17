import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserFromSession } from "@/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * @GET api/auth/me
 * @desc Retrieves the currently authenticated user based on the session token stored in cookies
 * @status 200 on success, 401 if no valid session is found
 * @throws {Error} if there is a server error while retrieving the user
 * @returns {user: PublicUser} on success, or {error: string} on failure
 */
export async function GET(): Promise<NextResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	const user = token ? await getUserFromSession(token) : null;

	if (!user) {
		return NextResponse.json({ error: "Authentication required" }, { status: 401 });
	}

	return NextResponse.json({ user }, { status: 200 });
}
