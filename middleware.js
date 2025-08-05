import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/admin", "/reports"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get user from cookies/session
  const token = request.cookies.get("sb-access-token")?.value;

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/reports/:path*"],
};
