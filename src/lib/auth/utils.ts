import { createClient } from "@/lib/supabase/client";
import { getValidSession } from "./session";
import type { User } from "@/types";

// Database user type (matches the database schema)
interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "manager" | "lead" | "volunteer";
  pilot_training_status?:
    | "Initial(PPL, IR, Comm)"
    | "CFI/CFII"
    | "Airline Pilot-ATP";
  location_type?: "local" | "traveling";
  can_provide_pickup?: boolean;
  needs_travel_voucher?: boolean;
  hotel_info?: string;
  shipping_address?: Record<string, unknown> | null;
  discord_profile?: Record<string, unknown>;
  google_profile?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Client-side authentication utilities
export async function getClientSession() {
  // Use the session management utility for automatic refresh
  return await getValidSession();
}

export async function getClientUser(): Promise<User | null> {
  const session = await getClientSession();
  if (!session?.user) return null;

  const supabase = createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return user ? mapDatabaseUserToUser(user) : null;
}

// OAuth sign in functions
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createClient();

  // Get current URL for redirect, preserve intended destination
  const callbackUrl = `${window.location.origin}/auth/callback`;
  const finalRedirectTo = redirectTo
    ? `${callbackUrl}?next=${encodeURIComponent(redirectTo)}`
    : callbackUrl;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: finalRedirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
        scope: "openid email profile https://www.googleapis.com/auth/calendar",
      },
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error);
    throw new Error(`Google sign-in failed: ${error.message}`);
  }

  return data;
}

export async function signInWithDiscord(redirectTo?: string) {
  const supabase = createClient();

  // Get current URL for redirect, preserve intended destination
  const callbackUrl = `${window.location.origin}/auth/callback`;
  const finalRedirectTo = redirectTo
    ? `${callbackUrl}?next=${encodeURIComponent(redirectTo)}`
    : callbackUrl;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: finalRedirectTo,
      queryParams: {
        scope: "identify email",
      },
    },
  });

  if (error) {
    console.error("Error signing in with Discord:", error);
    throw new Error(`Discord sign-in failed: ${error.message}`);
  }

  return data;
}

// Sign out function
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Session management and token refresh
export async function refreshSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    console.error("Error refreshing session:", error);
    throw error;
  }

  return data;
}

export async function getAccessToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error("Error getting access token:", error);
    return null;
  }

  return session.access_token;
}

// Check if session is expired and refresh if needed
export async function ensureValidSession() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error checking session:", error);
    return null;
  }

  if (!session) {
    return null;
  }

  // Check if token is close to expiring (within 5 minutes)
  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresAt ? expiresAt - now : 0;

  if (timeUntilExpiry < 300) {
    // Less than 5 minutes, refresh the session
    try {
      const { data: refreshedData, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError) {
        console.error("Error refreshing session:", refreshError);
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

// Role-based access control utilities
export function hasRole(user: User | null, role: User["role"]): boolean {
  return user?.role === role;
}

export function hasAnyRole(user: User | null, roles: User["role"][]): boolean {
  return user ? roles.includes(user.role) : false;
}

export function isManager(user: User | null): boolean {
  return hasRole(user, "manager");
}

export function isLead(user: User | null): boolean {
  return hasRole(user, "lead");
}

export function isVolunteer(user: User | null): boolean {
  return hasRole(user, "volunteer");
}

export function canManageEvents(user: User | null): boolean {
  return hasAnyRole(user, ["manager", "lead"]);
}

export function canViewAllEvents(user: User | null): boolean {
  return hasRole(user, "manager");
}

// Helper function to map database user to User type
function mapDatabaseUserToUser(dbUser: DatabaseUser): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    phone: dbUser.phone,
    role: dbUser.role,
    pilotTrainingStatus: dbUser.pilot_training_status,
    locationType: dbUser.location_type,
    canProvidePickup: dbUser.can_provide_pickup,
    needsTravelVoucher: dbUser.needs_travel_voucher,
    hotelInfo: dbUser.hotel_info,
    shippingAddress: dbUser.shipping_address as User["shippingAddress"],
    discordProfile: dbUser.discord_profile,
    googleProfile: dbUser.google_profile,
    createdAt: new Date(dbUser.created_at),
    updatedAt: new Date(dbUser.updated_at),
  };
}

// User profile management
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<User | null> {
  const supabase = createClient();

  // Map User type fields to database column names
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.role !== undefined) dbUpdates.role = updates.role;
  if (updates.pilotTrainingStatus !== undefined)
    dbUpdates.pilot_training_status = updates.pilotTrainingStatus;
  if (updates.locationType !== undefined)
    dbUpdates.location_type = updates.locationType;
  if (updates.canProvidePickup !== undefined)
    dbUpdates.can_provide_pickup = updates.canProvidePickup;
  if (updates.needsTravelVoucher !== undefined)
    dbUpdates.needs_travel_voucher = updates.needsTravelVoucher;
  if (updates.hotelInfo !== undefined) dbUpdates.hotel_info = updates.hotelInfo;
  if (updates.shippingAddress !== undefined)
    dbUpdates.shipping_address = updates.shippingAddress;
  if (updates.discordProfile !== undefined)
    dbUpdates.discord_profile = updates.discordProfile;
  if (updates.googleProfile !== undefined)
    dbUpdates.google_profile = updates.googleProfile;

  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("users")
    .update(dbUpdates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data ? mapDatabaseUserToUser(data) : null;
}

// Create or update user after OAuth sign in
export async function upsertUserAfterAuth(authUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}): Promise<User | null> {
  const supabase = createClient();

  const userData = {
    id: authUser.id,
    email: authUser.email,
    name: authUser.user_metadata?.full_name || authUser.email,
    role: "volunteer" as const, // Default role
    google_profile:
      authUser.app_metadata?.provider === "google"
        ? authUser.user_metadata
        : null,
    discord_profile:
      authUser.app_metadata?.provider === "discord"
        ? authUser.user_metadata
        : null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(userData, {
      onConflict: "id",
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", error);
    throw error;
  }

  return data ? mapDatabaseUserToUser(data) : null;
}
