import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser } from "@/services/auth.service";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

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
