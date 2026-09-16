import { NextResponse } from "next/server";
import { z } from "zod";
import { registerUser } from "../../../../services/auth.service";

const registerSchema = z.object({
	name: z.string().trim().min(2).max(80),
	email: z.string().email(),
	password: z.string().min(8),
});

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const input = registerSchema.safeParse(await request.json());
		if (!input.success) {
			return NextResponse.json({ error: "Name, valid email and password of at least 8 characters are required" }, { status: 400 });
		}

		const user = await registerUser(input.data.name, input.data.email, input.data.password);
		return NextResponse.json({ user }, { status: 201 });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unable to create account";
		const status = message.includes("already exists") ? 400 : 500;
		return NextResponse.json({ error: status === 400 ? message : "Unable to create account" }, { status });
	}
}
