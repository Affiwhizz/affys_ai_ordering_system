"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Supabase client for browser-side use (React Client Components).
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL plus the browser-safe key. Supabase renamed
 * the "anon key" to the "publishable key", so we accept either env var name.
 * These keys are safe to ship to the browser — Row Level Security in the
 * database is what actually gates access.
 */
export const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_PUBLIC_KEY!,
  );
}
