import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionForUser , registerUser } from "@/services/auth.service";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-0_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

/**
 * @POST /api/auth/register
 * @desc Registers a new user and creates a session for them
 * @param request 
 * @status 201 on success, 400 if input is invalid or user already exists, 500 on server error
 * @throws {Error} if user already exists or if there is a server error
 * @returns {user: PublicUser, token: string, expiresAt: Date} on success, or {error: string} on failure
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const input = registerSchema.safeParse(await request.json());
    if (!input.success) {
      return NextResponse.json(
        {
          error:
            "Name, valid email, username (3-20 chars) and password (min 8 chars) are required.",
        },
        { status: 400 }
      );
    }

    const user = await registerUser(
      input.data.name,
      input.data.email,
      input.data.password,
      input.data.username
    );

    const session = await createSessionForUser(user.id);

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      ...SESSION_COOKIE_OPTIONS,
      expires: session.expiresAt,
    });

    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to create account";
    const status = message.includes("already exists") ? 400 : 500;
    console.error("Error in /api/auth/register:", error);
    return NextResponse.json(
      { error: status === 400 ? message : "Unable to create account" },
      { status }
    );
  }
}