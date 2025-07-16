"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  variant?: "button" | "dropdown" | "icon";
  showText?: boolean;
}

export default function LogoutButton({
  className = "",
  variant = "button",
  showText = true,
}: LogoutButtonProps) {
  const { signOut, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if logout fails
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isDisabled = loading || isLoggingOut;

  if (variant === "dropdown") {
    return (
      <button
        onClick={handleLogout}
        disabled={isDisabled}
        className={`w-full text-left px-4 py-2 text-sm hover:bg-base-200 ${className}`}
      >
        {isDisabled ? (
          <span className="flex items-center">
            <span className="loading loading-spinner loading-xs mr-2"></span>
            Signing out...
          </span>
        ) : (
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </span>
        )}
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleLogout}
        disabled={isDisabled}
        className={`btn btn-ghost btn-circle ${className}`}
        title="Sign Out"
      >
        {isDisabled ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isDisabled}
      className={`btn btn-outline btn-error ${className}`}
    >
      {isDisabled ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          {showText && "Signing out..."}
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {showText && "Sign Out"}
        </>
      )}
    </button>
  );
}
