import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require admin privileges
const ADMIN_ROUTES = ["/admin"];

// Routes for authenticated users only
const PROTECTED_ROUTES = ["/my-events"];

// Routes for guest users only
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessio_session")?.value;

  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAdminRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try { // Validate session token and fetch user data
    const response = await fetch(new URL("/api/auth/me", request.url), {
      headers: {
        cookie: `sessio_session=${sessionToken}`,
      },
    });

    if (!response.ok) {
      const loginUrl = new URL("/login", request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("sessio_session");
      return res;
    }

    const { user } = await response.json();

    if (isAdminRoute && user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth check failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Routes that require middleware
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/my-registrations/:path*",
    "/login",
    "/register",
  ],
};