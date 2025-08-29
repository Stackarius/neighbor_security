import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Protected routes for any logged-in user
  const protectedRoutes = ["/dashboard", "/reports"];

  // Admin-only routes
  const adminRoutes = ["/admin"];

  // If route requires login but no session, redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If admin route, check role from profiles table
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Fetch the user’s profile to get the role
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("user_role")
      .eq("id", session.user.id)
      .single();

    if (error || profile?.user_role !== "admin") {
      // Redirect non-admins away
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Redirect logged-in users from login/signup
  if ((pathname === "/login" || pathname === "/signup") && session) {
    // Decide redirect based on role
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_role")
      .eq("id", session.user.id)
      .single();

    const redirectUrl =
      profile?.user_role === "admin" ? "/admin" : "/dashboard";

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/reports/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
