import { createClient } from "@/lib/supabase/server";
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

// Server-side authentication utilities
export async function getServerSession() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

  return session;
}

export async function getServerUser(): Promise<User | null> {
  const session = await getServerSession();
  if (!session?.user) return null;

  const supabase = await createClient();
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
