"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StaffInfo {
  displayName: string;
  role: string;
}

/**
 * Self-fetching user pill for the admin top bar. Reads the signed-in
 * staff member's name + role from Supabase on the client. Falls back to a
 * neutral label while loading or if not yet wired (e.g. no env vars in dev).
 */
export default function AdminUserPill() {
  const [staff, setStaff] = useState<StaffInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("staff_users")
          .select("display_name, role")
          .eq("id", user.id)
          .single();
        const row = data as { display_name: string; role: string } | null;
        if (!cancelled && row) {
          setStaff({
            displayName: row.display_name ?? user.email ?? "Staff",
            role: row.role ?? "admin",
          });
        }
      } catch {
        // Supabase not configured yet — leave the placeholder.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const initials = staff
    ? staff.displayName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-white py-1 pl-1 pr-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-espresso text-xs font-bold">
        {initials}
      </span>
      <div className="hidden flex-col leading-tight md:flex">
        <span className="text-xs font-semibold text-espresso">
          {staff?.displayName ?? "Sign in"}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-foreground-subtle">
          {staff?.role ?? "—"}
        </span>
      </div>
    </div>
  );
}
