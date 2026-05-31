import { createServerSupabase } from "@/lib/supabase/server";

export interface CurrentStaff {
  id: string;
  email: string | null;
  displayName: string;
  role: "owner" | "admin" | "kitchen";
}

/**
 * Returns the currently signed-in staff member (their staff_users row joined
 * with the auth user), or null if not signed in / not an active staff member.
 *
 * Server-only, call from Server Components, Route Handlers, Server Actions.
 */
export async function getCurrentStaff(): Promise<CurrentStaff | null> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("staff_users")
    .select("display_name, role, is_active")
    .eq("id", user.id)
    .single();

  const staff = data as
    | { display_name: string; role: CurrentStaff["role"]; is_active: boolean }
    | null;

  if (!staff || !staff.is_active) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    displayName: staff.display_name ?? user.email ?? "Staff",
    role: staff.role ?? "admin",
  };
}
