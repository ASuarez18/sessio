import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserFromSession } from "../../../../services/auth.service";
import { SESSION_COOKIE_NAME } from "../../../../lib/auth";

export async function GET(): Promise<NextResponse> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	const user = token ? await getUserFromSession(token) : null;

	if (!user) {
		return NextResponse.json({ error: "Authentication required" }, { status: 401 });
	}

	return NextResponse.json({ user }, { status: 200 });
}
