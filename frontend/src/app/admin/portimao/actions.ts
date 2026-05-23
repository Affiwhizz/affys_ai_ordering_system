"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { PortimaoMode } from "@/lib/store/types";

type Result = { ok: boolean; error?: string };

function revalidate() {
  revalidatePath("/admin/portimao");
  revalidatePath("/portimao");
  revalidatePath("/"); // homepage block + cart pause banner
  revalidatePath("/menu");
}

const VALID_MODES: PortimaoMode[] = ["auto", "open", "closed", "sold_out"];

/** Save the Portimão campaign mode + preorder window dates. */
export async function setPortimaoSettings(
  mode: PortimaoMode,
  start: string | null,
  end: string | null,
): Promise<Result> {
  if (!VALID_MODES.includes(mode)) return { ok: false, error: "Invalid mode." };
  if (start && end && end < start)
    return { ok: false, error: "End date can't be before the start date." };
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("store_settings")
      .update({
        portimao_mode: mode,
        portimao_start: start || null,
        portimao_end: end || null,
      } as never)
      .eq("id", true);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Pause / resume regular daily (Lisbon) ordering + set the resume date shown to customers. */
export async function setDailyOrdering(
  paused: boolean,
  resumeDate: string | null,
): Promise<Result> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("store_settings")
      .update({
        daily_ordering_paused: paused,
        daily_resume_date: resumeDate || null,
      } as never)
      .eq("id", true);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
