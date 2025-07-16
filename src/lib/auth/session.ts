import { createClient } from "@/lib/supabase/client";
import { authConfig } from "./config";

/**
 * Session management utilities for automatic token refresh and session monitoring
 */

let refreshTimer: NodeJS.Timeout | null = null;

/**
 * Start automatic session refresh monitoring
 * This should be called when the app initializes
 */
export function startSessionMonitoring() {
  if (typeof window === "undefined") return; // Server-side guard

  const supabase = createClient();

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state changed:", event);

    if (event === "SIGNED_IN" && session) {
      scheduleTokenRefresh(session.expires_at);
    } else if (event === "SIGNED_OUT") {
      clearTokenRefresh();
    } else if (event === "TOKEN_REFRESHED" && session) {
      scheduleTokenRefresh(session.expires_at);
    }
  });

  // Check current session and schedule refresh if needed
  checkAndScheduleRefresh();
}

/**
 * Stop session monitoring and clear any scheduled refreshes
 */
export function stopSessionMonitoring() {
  clearTokenRefresh();
}

/**
 * Schedule token refresh based on expiration time
 */
function scheduleTokenRefresh(expiresAt?: number) {
  clearTokenRefresh();

  if (!expiresAt) return;

  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresAt - now;
  const refreshTime = Math.max(
    timeUntilExpiry - authConfig.session.refreshThreshold,
    0
  );

  if (refreshTime > 0) {
    refreshTimer = setTimeout(async () => {
      try {
        const supabase = createClient();
        await supabase.auth.refreshSession();
      } catch (error) {
        console.error("Automatic token refresh failed:", error);
      }
    }, refreshTime * 1000);

    console.log(`Token refresh scheduled in ${refreshTime} seconds`);
  }
}

/**
 * Clear any scheduled token refresh
 */
function clearTokenRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

/**
 * Check current session and schedule refresh if needed
 */
async function checkAndScheduleRefresh() {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.expires_at) {
      scheduleTokenRefresh(session.expires_at);
    }
  } catch (error) {
    console.error("Error checking session for refresh scheduling:", error);
  }
}

/**
 * Force refresh the current session
 */
export async function forceRefreshSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    console.error("Force refresh failed:", error);
    throw error;
  }

  return data;
}

/**
 * Get session with automatic refresh if needed
 */
export async function getValidSession() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

  if (!session) {
    return null;
  }

  // Check if token is close to expiring
  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresAt ? expiresAt - now : 0;

  if (timeUntilExpiry < authConfig.session.refreshThreshold) {
    try {
      const { data: refreshedData, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError) {
        console.error("Session refresh failed:", refreshError);
        return session; // Return original session if refresh fails
      }

      return refreshedData.session;
    } catch (error) {
      console.error("Error during session refresh:", error);
      return session;
    }
  }

  return session;
}

/**
 * Check if current session is valid and not expired
 */
export async function isSessionValid(): Promise<boolean> {
  const session = await getValidSession();
  return session !== null;
}

/**
 * Get remaining session time in seconds
 */
export async function getSessionTimeRemaining(): Promise<number> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.expires_at) return 0;

  const now = Math.floor(Date.now() / 1000);
  return Math.max(session.expires_at - now, 0);
}
