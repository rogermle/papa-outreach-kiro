"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui";
import { hasRouteAccess } from "@/lib/auth/config";
import type { User } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: User["role"];
  fallbackPath?: string;
  showLoading?: boolean;
}

export default function AuthGuard({
  children,
  requiredRole,
  fallbackPath = "/login",
  showLoading = true,
}: AuthGuardProps) {
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // If no user and we need authentication, redirect to login
    if (!user) {
      const loginUrl = `${fallbackPath}?redirectTo=${encodeURIComponent(
        pathname
      )}`;
      router.push(loginUrl);
      return;
    }

    // If user exists but doesn't have required role access
    if (requiredRole && !hasRouteAccess(user.role, pathname)) {
      // Redirect to appropriate dashboard based on user role
      const dashboardMap = {
        manager: "/dashboard/manager",
        lead: "/dashboard/lead",
        volunteer: "/dashboard",
      };
      router.push(dashboardMap[user.role]);
      return;
    }
  }, [user, loading, requiredRole, router, pathname, fallbackPath]);

  // Show loading state
  if (loading && showLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-base-content/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="text-error mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-error mb-2">
                Authentication Error
              </h1>
              <p className="text-base-content/70 mb-6">{error}</p>
              <button
                onClick={() => router.push("/login")}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render children if still loading or no user
  if (loading || !user) {
    return null;
  }

  // Check role access one more time before rendering
  if (requiredRole && !hasRouteAccess(user.role, pathname)) {
    return null;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function ManagerGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="manager">{children}</AuthGuard>;
}

export function LeadGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="lead">{children}</AuthGuard>;
}

export function VolunteerGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="volunteer">{children}</AuthGuard>;
}
