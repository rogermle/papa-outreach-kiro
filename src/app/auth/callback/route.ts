import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDefaultRedirectForRole } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user && data.session) {
      try {
        // Create or update user in our users table
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email!.split("@")[0],
          role: "volunteer" as const, // Default role
          google_profile:
            data.user.app_metadata?.provider === "google"
              ? data.user.user_metadata
              : null,
          discord_profile:
            data.user.app_metadata?.provider === "discord"
              ? data.user.user_metadata
              : null,
          updated_at: new Date().toISOString(),
        };

        const { data: existingUser } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (existingUser) {
          // Update existing user, preserve role
          await supabase
            .from("users")
            .update({
              name: userData.name,
              google_profile: userData.google_profile,
              discord_profile: userData.discord_profile,
              updated_at: userData.updated_at,
            })
            .eq("id", data.user.id);
        } else {
          // Create new user
          await supabase.from("users").insert(userData);
        }

        // Determine redirect URL based on user role
        const userRole = existingUser?.role || "volunteer";
        const redirectUrl = next || getDefaultRedirectForRole(userRole);

        // Handle redirect based on environment
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${redirectUrl}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(
            `https://${forwardedHost}${redirectUrl}`
          );
        } else {
          return NextResponse.redirect(`${origin}${redirectUrl}`);
        }
      } catch (dbError) {
        console.error("Error creating/updating user:", dbError);
        // Still redirect to dashboard even if user creation fails
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
