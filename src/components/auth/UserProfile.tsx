"use client";

import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui";

interface UserProfileProps {
  variant?: "card" | "dropdown" | "inline";
  showRole?: boolean;
  showEmail?: boolean;
  className?: string;
}

export default function UserProfile({
  variant = "card",
  showRole = true,
  showEmail = true,
  className = "",
}: UserProfileProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="sm" />;
  }

  if (!user) {
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "manager":
        return "badge-primary";
      case "lead":
        return "badge-secondary";
      case "volunteer":
        return "badge-accent";
      default:
        return "badge-neutral";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "manager":
        return "Manager";
      case "lead":
        return "Lead Volunteer";
      case "volunteer":
        return "Volunteer";
      default:
        return role;
    }
  };

  if (variant === "dropdown") {
    return (
      <div className={`p-4 border-b border-base-300 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span className="text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-base-content truncate">
              {user.name}
            </p>
            {showEmail && (
              <p className="text-sm text-base-content/70 truncate">
                {user.email}
              </p>
            )}
            {showRole && (
              <div className="mt-1">
                <span
                  className={`badge badge-sm ${getRoleBadgeColor(user.role)}`}
                >
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-8">
            <span className="text-xs">{user.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-medium text-sm text-base-content">
            {user.name}
          </span>
          {showRole && (
            <span
              className={`badge badge-xs ml-2 ${getRoleBadgeColor(user.role)}`}
            >
              {getRoleDisplayName(user.role)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`card bg-base-100 shadow-sm ${className}`}>
      <div className="card-body p-4">
        <div className="flex items-center space-x-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12">
              <span className="text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base-content">{user.name}</h3>
            {showEmail && (
              <p className="text-sm text-base-content/70">{user.email}</p>
            )}
            {user.phone && (
              <p className="text-sm text-base-content/70">{user.phone}</p>
            )}
            {showRole && (
              <div className="mt-2">
                <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            )}
            {user.pilotTrainingStatus && (
              <div className="mt-1">
                <span className="badge badge-outline badge-sm">
                  {user.pilotTrainingStatus}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
