import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser, registerUser } from "@/services/auth.service";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const input = registerSchema.safeParse(await request.json());
    if (!input.success) {
      return NextResponse.json(
        {
          error:
            "Name, valid email and password of at least 8 characters are required",
        },
        { status: 400 },
      );
    }

    const user = await registerUser(
      input.data.name,
      input.data.email,
      input.data.password,
    );
    const session = await authenticateUser(
      input.data.email,
      input.data.password,
    );

    const response = NextResponse.json({ user: session.user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      ...SESSION_COOKIE_OPTIONS,
      expires: session.expiresAt,
    });
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to create account";
    const status = message.includes("already exists") ? 400 : 500;
    return NextResponse.json(
      { error: status === 400 ? message : "Unable to create account" },
      { status },
    );
  }
}
