/**
 * Stable per-browser device ID used for promo single-use enforcement.
 *
 * Stored in localStorage so the same browser keeps the same ID across visits.
 * Best-effort only (a customer can clear storage or switch device) — it's one
 * of three signals (phone + email + device) used together.
 */
const KEY = "affys_device_id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
