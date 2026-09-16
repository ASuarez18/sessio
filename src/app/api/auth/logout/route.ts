import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { destroySession } from "../../../../services/auth.service";
import { SESSION_COOKIE_NAME } from "../../../../lib/auth";

export async function POST(): Promise<NextResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	if (token) {
		await destroySession(token);
	}

	const response = NextResponse.json({ success: true }, { status: 200 });
	response.cookies.delete(SESSION_COOKIE_NAME);
	return response;
}
