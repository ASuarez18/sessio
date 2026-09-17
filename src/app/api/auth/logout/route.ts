import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { destroySession } from "@/services/auth.service";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * @POST api/auth/logout
 * @desc Logs out the currently authenticated user by destroying their session and clearing the session cookie
 * @status 200 on success, 500 if there is a server error
 * @throws {Error} if there is a server error while destroying the session
 * @returns {message: string} on success, or {error: string} on failure
 */
export async function POST(): Promise<NextResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	if (token) {
		await destroySession(token);
	}

	const response = NextResponse.json({ message: "Succesfully logged out" }, { status: 200 });
	response.cookies.delete(SESSION_COOKIE_NAME);
	return response;
}
