"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { hasRouteAccess, getDefaultRedirectForRole } from "@/lib/auth/config";
import type { User } from "@/types";

interface UseAuthGuardOptions {
  requiredRole?: User["role"];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

interface UseAuthGuardReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

/**
 * Hook for protecting components and pages with authentication and role-based access control
 */
export function useAuthGuard(
  options: UseAuthGuardOptions = {}
): UseAuthGuardReturn {
  const { requiredRole, redirectTo, onUnauthorized } = options;
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsAuthorized(false);
      return;
    }

    // If no user and authentication is required
    if (!user) {
      setIsAuthorized(false);

      if (redirectTo !== null) {
        // Allow null to disable redirect
        const loginUrl =
          redirectTo || `/login?redirectTo=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
      }

      onUnauthorized?.();
      return;
    }

    // Check role-based access
    if (requiredRole) {
      const hasAccess = hasRouteAccess(user.role, pathname);

      if (!hasAccess) {
        setIsAuthorized(false);

        if (redirectTo !== null) {
          const fallbackUrl =
            redirectTo || getDefaultRedirectForRole(user.role);
          router.push(fallbackUrl);
        }

        onUnauthorized?.();
        return;
      }
    }

    setIsAuthorized(true);
  }, [
    user,
    loading,
    requiredRole,
    pathname,
    router,
    redirectTo,
    onUnauthorized,
  ]);

  return {
    isAuthorized,
    isLoading: loading,
    user,
    error,
  };
}

/**
 * Hook for checking if user has specific role
 */
export function useRole(role: User["role"]) {
  const { user } = useAuth();
  return user?.role === role;
}

/**
 * Hook for checking if user has any of the specified roles
 */
export function useRoles(roles: User["role"][]) {
  const { user } = useAuth();
  return user ? roles.includes(user.role) : false;
}

/**
 * Hook for manager-only access
 */
export function useManagerAccess() {
  return useAuthGuard({ requiredRole: "manager" });
}

/**
 * Hook for lead volunteer access (includes managers)
 */
export function useLeadAccess() {
  const { user } = useAuth();
  const hasAccess = user && (user.role === "manager" || user.role === "lead");

  return useAuthGuard({
    requiredRole: "lead",
    onUnauthorized: () => {
      if (user && !hasAccess) {
        console.warn("User does not have lead volunteer access");
      }
    },
  });
}

/**
 * Hook for any authenticated user access
 */
export function useVolunteerAccess() {
  return useAuthGuard({ requiredRole: "volunteer" });
}
