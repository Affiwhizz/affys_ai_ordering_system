import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  DEFAULT_STORE_FLAGS,
  computePortimaoStatus,
  lisbonToday,
  type PortimaoMode,
  type StoreFlags,
} from "./types";

interface FlagsRow {
  daily_ordering_paused: boolean | null;
  daily_resume_date: string | null;
  portimao_mode: string | null;
  portimao_start: string | null;
  portimao_end: string | null;
}

const VALID_MODES: PortimaoMode[] = ["auto", "open", "closed", "sold_out"];

/**
 * Reads operator flags (daily-ordering pause + Portimão window) and computes
 * the effective Portimão status. Falls back to defaults so the public site
 * always renders.
 */
export async function getStoreFlags(): Promise<StoreFlags> {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("store_settings")
      .select(
        "daily_ordering_paused, daily_resume_date, portimao_mode, portimao_start, portimao_end",
      )
      .eq("id", true)
      .maybeSingle();

    const row = (data as FlagsRow | null) ?? null;

    const mode: PortimaoMode = VALID_MODES.includes(
      (row?.portimao_mode ?? "") as PortimaoMode,
    )
      ? (row!.portimao_mode as PortimaoMode)
      : DEFAULT_STORE_FLAGS.portimaoMode;

    const start = row?.portimao_start ?? DEFAULT_STORE_FLAGS.portimaoStart;
    const end = row?.portimao_end ?? DEFAULT_STORE_FLAGS.portimaoEnd;

    return {
      dailyOrderingPaused: !!row?.daily_ordering_paused,
      dailyResumeDate: row?.daily_resume_date ?? null,
      portimaoMode: mode,
      portimaoStart: start,
      portimaoEnd: end,
      portimaoStatus: computePortimaoStatus(mode, start, end, lisbonToday()),
    };
  } catch {
    return DEFAULT_STORE_FLAGS;
  }
}
