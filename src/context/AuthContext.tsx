"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  signInWithGoogle,
  signInWithDiscord,
  signOut,
  upsertUserAfterAuth,
} from "@/lib/auth/utils";
import {
  startSessionMonitoring,
  stopSessionMonitoring,
  getValidSession,
} from "@/lib/auth/session";
import type { User } from "@/types";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signInWithDiscord: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchUser = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        setUser(null);
        setError(null);
        return;
      }

      try {
        setError(null);
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          // If user doesn't exist in our database, create them
          if (error.code === "PGRST116") {
            try {
              const newUser = await upsertUserAfterAuth(session.user);
              setUser(newUser);
              setError(null);
            } catch (upsertError) {
              console.error("Error creating user:", upsertError);
              setError("Failed to create user profile");
              setUser(null);
            }
          } else {
            setError("Failed to fetch user profile");
            setUser(null);
          }
          return;
        }

        // Map database user to User type
        const mappedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          pilotTrainingStatus: userData.pilot_training_status,
          locationType: userData.location_type,
          canProvidePickup: userData.can_provide_pickup,
          needsTravelVoucher: userData.needs_travel_voucher,
          hotelInfo: userData.hotel_info,
          shippingAddress: userData.shipping_address,
          discordProfile: userData.discord_profile,
          googleProfile: userData.google_profile,
          createdAt: new Date(userData.created_at),
          updatedAt: new Date(userData.updated_at),
        };

        setUser(mappedUser);
        setError(null);
      } catch (error) {
        console.error("Error in fetchUser:", error);
        setError("An unexpected error occurred");
        setUser(null);
      }
    },
    [supabase]
  );

  const refreshUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    await fetchUser(session);
  };

  useEffect(() => {
    // Get initial session with automatic refresh
    const getInitialSession = async () => {
      try {
        const session = await getValidSession();
        setSession(session);
        await fetchUser(session);
      } catch (error) {
        console.error("Error getting initial session:", error);
        setError("Failed to initialize session");
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Start session monitoring for automatic token refresh
    startSessionMonitoring();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      setSession(session);
      await fetchUser(session);

      // Clear loading state for auth events
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED"
      ) {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      stopSessionMonitoring();
    };
  }, [supabase.auth, fetchUser]);

  const handleSignInWithGoogle = async (redirectTo?: string) => {
    try {
      setLoading(true);
      await signInWithGoogle(redirectTo);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithDiscord = async (redirectTo?: string) => {
    try {
      setLoading(true);
      await signInWithDiscord(redirectTo);
    } catch (error) {
      console.error("Error signing in with Discord:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithDiscord: handleSignInWithDiscord,
    signOut: handleSignOut,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
