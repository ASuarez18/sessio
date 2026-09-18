import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser } from "@/services/auth.service";
import { getCurrentUser, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
	rememberMe: z.boolean().optional(),
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
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      return NextResponse.json(
        { error: "User is already logged in" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = result.data;

    let authResult;
    try {
      authResult = await authenticateUser(email, password, rememberMe);
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Invalid email or password";
      return NextResponse.json(
        { error: message },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { user: authResult.user },
      { status: 200 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, authResult.token, {
      ...SESSION_COOKIE_OPTIONS,
      expires: authResult.expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
