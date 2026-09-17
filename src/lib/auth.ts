import { cookies } from "next/headers";
import { getUserFromSession } from "@/services/auth.service";

export const SESSION_COOKIE_NAME = "sessio_session";

export const SESSION_COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	path: "/",
};

export async function getCurrentUser() {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
	return token ? getUserFromSession(token) : null;
}
