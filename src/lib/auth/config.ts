/**
 * Authentication configuration for Supabase OAuth providers
 * This file contains the configuration for Google and Discord OAuth providers
 */

export const authConfig = {
  // OAuth provider configurations
  providers: {
    google: {
      scopes: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar",
      ].join(" "),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
    discord: {
      scopes: ["identify", "email"].join(" "),
      queryParams: {},
    },
  },

  // Redirect URLs
  redirectUrls: {
    callback: "/auth/callback",
    error: "/auth/auth-code-error",
    success: "/dashboard",
    login: "/login",
  },

  // Session configuration
  session: {
    // Refresh token when it expires in less than 5 minutes
    refreshThreshold: 300, // 5 minutes in seconds
    // Maximum session duration (24 hours)
    maxDuration: 86400, // 24 hours in seconds
  },

  // Protected routes that require authentication
  protectedRoutes: ["/dashboard", "/profile", "/events"],

  // Role-based route access
  roleRoutes: {
    manager: ["/dashboard/manager", "/admin", "/reports", "/users"],
    lead: ["/dashboard/lead", "/events/manage"],
    volunteer: ["/dashboard", "/profile", "/events/signup"],
  },

  // Default redirect paths based on user role
  defaultRedirects: {
    manager: "/dashboard/manager",
    lead: "/dashboard/lead",
    volunteer: "/dashboard",
  },
} as const;

/**
 * Get the appropriate redirect URL based on user role
 */
export function getDefaultRedirectForRole(
  role: "manager" | "lead" | "volunteer"
): string {
  return authConfig.defaultRedirects[role];
}

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return authConfig.protectedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Check if a route requires specific role access
 */
export function getRequiredRoleForRoute(
  pathname: string
): "manager" | "lead" | "volunteer" | null {
  for (const [role, routes] of Object.entries(authConfig.roleRoutes)) {
    if (routes.some((route) => pathname.startsWith(route))) {
      return role as "manager" | "lead" | "volunteer";
    }
  }
  return null;
}

/**
 * Check if user has access to a specific route
 */
export function hasRouteAccess(
  userRole: "manager" | "lead" | "volunteer" | null,
  pathname: string
): boolean {
  if (!userRole) return false;

  const requiredRole = getRequiredRoleForRoute(pathname);
  if (!requiredRole) return true; // Public route

  // Managers have access to all routes
  if (userRole === "manager") return true;

  // Lead volunteers have access to lead and volunteer routes
  if (
    userRole === "lead" &&
    (requiredRole === "lead" || requiredRole === "volunteer")
  ) {
    return true;
  }

  // Regular volunteers only have access to volunteer routes
  if (userRole === "volunteer" && requiredRole === "volunteer") {
    return true;
  }

  return false;
}
