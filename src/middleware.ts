import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes - always allow
        const publicPaths = [
          "/",
          "/login",
          "/database",
          "/trends",
          "/tools",
          "/pricing",
          "/features",
          "/about",
          "/updates",
        ];

        // Check exact match for public paths
        if (publicPaths.includes(pathname)) {
          return true;
        }

        // Allow API routes
        if (pathname.startsWith("/api/")) {
          return true;
        }

        // Allow Next.js internals
        if (pathname.startsWith("/_next/")) {
          return true;
        }

        // Allow static assets
        if (pathname === "/favicon.ico" || pathname.startsWith("/images/")) {
          return true;
        }

        // Protected routes - require authentication
        const protectedPrefixes = [
          "/dashboard",
          "/hub",
          "/profile",
          "/settings",
        ];

        const isProtected = protectedPrefixes.some(
          (prefix) =>
            pathname === prefix || pathname.startsWith(`${prefix}/`)
        );

        if (isProtected) {
          return !!token;
        }

        // Default: allow access
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
