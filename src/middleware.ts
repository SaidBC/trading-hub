import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // If the user is not logged in and trying to access protected routes
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check for admin routes
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/bybit-puzzle-hunt", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    "/bybit-puzzle-hunt/marketplace/:path*",
    "/messages/:path*",
    "/admin/:path*",
  ],
};
