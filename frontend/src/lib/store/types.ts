/**
 * Client-safe store-flags types + helpers (no "server-only" import).
 *
 * Shared by the server reader, the admin control, the cart provider, and the
 * /portimao page.
 */
import type { PortimaoStatus } from "@/components/portimao/config";

export type { PortimaoStatus };

export type PortimaoMode = "auto" | "open" | "closed" | "sold_out";

export interface StoreFlags {
  /** Regular Lisbon ordering paused (e.g. while away at Afro Nation). */
  dailyOrderingPaused: boolean;
  /** ISO date ("YYYY-MM-DD") regular ordering resumes — shown to customers. */
  dailyResumeDate: string | null;
  /** Portimão window control. */
  portimaoMode: PortimaoMode;
  portimaoStart: string | null; // ISO date
  portimaoEnd: string | null; // ISO date
  /** Effective public status, computed from mode + dates. */
  portimaoStatus: PortimaoStatus;
}

export const DEFAULT_STORE_FLAGS: StoreFlags = {
  dailyOrderingPaused: false,
  dailyResumeDate: null,
  portimaoMode: "auto",
  portimaoStart: "2026-07-02",
  portimaoEnd: "2026-07-06",
  portimaoStatus: "off-season",
};

/** Today's date in Europe/Lisbon as "YYYY-MM-DD". */
export function lisbonToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Effective Portimão status from the mode + window. ISO date strings sort
 * lexicographically, so plain string comparison is correct here.
 */
export function computePortimaoStatus(
  mode: PortimaoMode,
  start: string | null,
  end: string | null,
  today: string,
): PortimaoStatus {
  if (mode === "open") return "live";
  if (mode === "closed") return "off-season";
  if (mode === "sold_out") return "sold-out";
  // auto — follow the window.
  if (start && today < start) return "off-season";
  if (end && today > end) return "off-season";
  if (!start && !end) return "off-season";
  return "live";
}
