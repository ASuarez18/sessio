import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser } from "@/services/auth.service";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

// TODO: Implement login also by username in addition to email
/**
 * @function POST
 * @param request 
 * @desc Authenticates a user with the provided email and password, creates a session, and sets a session cookie
 * @status 200 on success, 400 if input is invalid, 401 if authentication fails, 500 on server error
 * @throws {Error} if there is a server error while authenticating the user
 * @returns {user: PublicUser, token: string, expiresAt: Date} on success, or {error: string} on failure
 */
export async function POST(request: Request): Promise<NextResponse> {
	try {
		const input = loginSchema.safeParse(await request.json());
		if (!input.success) {
			return NextResponse.json({ error: "A valid email and password are required" }, { status: 400 });
		}

		const session = await authenticateUser(input.data.email, input.data.password);
		const response = NextResponse.json({ user: session.user }, { status: 200 });
		response.cookies.set(SESSION_COOKIE_NAME, session.token, {
			...SESSION_COOKIE_OPTIONS,
			expires: session.expiresAt,
		});
		return response;
	} catch {
		return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
	}
}
