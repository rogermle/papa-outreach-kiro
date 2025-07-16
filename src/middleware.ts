import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isProtectedRoute,
  hasRouteAccess,
  getDefaultRedirectForRole,
  authConfig,
} from "@/lib/auth/config";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: { [key: string]: unknown }) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: { [key: string]: unknown }) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const pathname = req.nextUrl.pathname;

  // Skip middleware for API routes, static files, and auth callback
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/auth/callback") ||
    pathname.includes(".")
  ) {
    return res;
  }

  try {
    // Get current session and refresh if needed
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error in middleware:", sessionError);
      // Clear potentially corrupted session
      res.cookies.delete("sb-access-token");
      res.cookies.delete("sb-refresh-token");

      if (isProtectedRoute(pathname)) {
        const redirectUrl = new URL("/login", req.url);
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return res;
    }

    // Handle session refresh if token is close to expiring
    if (session?.expires_at) {
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = session.expires_at - now;

      if (timeUntilExpiry < authConfig.session.refreshThreshold) {
        try {
          await supabase.auth.refreshSession();
        } catch (refreshError) {
          console.error("Token refresh failed in middleware:", refreshError);
        }
      }
    }

    // Check if route requires authentication
    if (isProtectedRoute(pathname) && !session) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Role-based access control for authenticated users
    if (session?.user) {
      try {
        // Get user role from database
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("role, name")
          .eq("id", session.user.id)
          .single();

        if (userError) {
          console.error("Error fetching user in middleware:", userError);

          // If user doesn't exist in our database, create them
          if (userError.code === "PGRST116") {
            const userData = {
              id: session.user.id,
              email: session.user.email!,
              name:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                session.user.email!.split("@")[0],
              role: "volunteer" as const,
              google_profile:
                session.user.app_metadata?.provider === "google"
                  ? session.user.user_metadata
                  : null,
              discord_profile:
                session.user.app_metadata?.provider === "discord"
                  ? session.user.user_metadata
                  : null,
            };

            await supabase.from("users").insert(userData);

            // Redirect to dashboard for new users
            if (pathname !== "/dashboard") {
              return NextResponse.redirect(new URL("/dashboard", req.url));
            }
          } else {
            // Other database errors, redirect to dashboard
            return NextResponse.redirect(new URL("/dashboard", req.url));
          }
        } else if (user) {
          // Check if user has access to the requested route
          if (!hasRouteAccess(user.role, pathname)) {
            const defaultRedirect = getDefaultRedirectForRole(user.role);
            return NextResponse.redirect(new URL(defaultRedirect, req.url));
          }

          // If logged in and trying to access login page, redirect to appropriate dashboard
          if (pathname === "/login") {
            const defaultRedirect = getDefaultRedirectForRole(user.role);
            return NextResponse.redirect(new URL(defaultRedirect, req.url));
          }
        }
      } catch (error) {
        console.error("Unexpected error in middleware:", error);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Add security headers
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return res;
  } catch (error) {
    console.error("Critical error in middleware:", error);

    // Fallback: allow request to proceed but clear potentially corrupted cookies
    res.cookies.delete("sb-access-token");
    res.cookies.delete("sb-refresh-token");

    if (isProtectedRoute(pathname)) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
