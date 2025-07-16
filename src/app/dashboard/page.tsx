"use client";

import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import UserProfile from "@/components/auth/UserProfile";
import LogoutButton from "@/components/auth/LogoutButton";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl text-primary">PAPA Events</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar placeholder"
            >
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <UserProfile variant="dropdown" />
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <LogoutButton variant="dropdown" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="hero bg-base-100 rounded-lg shadow-xl">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold text-primary">
                Welcome, {user.name}!
              </h1>
              <p className="py-6 text-base-content/70">
                You are signed in as a <strong>{user.role}</strong>. Your
                dashboard will be customized based on your role and
                responsibilities.
              </p>

              {/* Role-specific content preview */}
              <div className="card bg-base-200 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title text-secondary">
                    {user.role === "manager" && "Manager Dashboard"}
                    {user.role === "lead" && "Lead Volunteer Dashboard"}
                    {user.role === "volunteer" && "Volunteer Dashboard"}
                  </h2>
                  <p className="text-sm text-base-content/60">
                    {user.role === "manager" &&
                      "Manage events, volunteers, and system settings."}
                    {user.role === "lead" &&
                      "Coordinate volunteers and manage assigned events."}
                    {user.role === "volunteer" &&
                      "Browse events and manage your volunteer commitments."}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="stats stats-vertical lg:stats-horizontal shadow mt-6">
                <div className="stat">
                  <div className="stat-title">Email</div>
                  <div className="stat-value text-sm">{user.email}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Role</div>
                  <div className="stat-value text-primary">{user.role}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Member Since</div>
                  <div className="stat-value text-sm">
                    {user.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
