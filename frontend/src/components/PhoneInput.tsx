"use client";

import { useMemo, useState, useEffect } from "react";

/**
 * Phone input with a country-code dropdown beside the digits field.
 *
 * - Default country: Portugal (+351), since Affy's is based there.
 * - Common countries (NG, GB, ES, US, FR, DE, IE, IT, NL, BE) are listed first.
 * - "Other" lets the user type any country code manually.
 *
 * The component reports the FULL international number (e.g. "+351914145519")
 * via `onChange`. If the parent passes a value already starting with one of
 * the known dial codes, the dropdown will match it on mount.
 */

interface Country {
  code: string;      // ISO 3166-1 alpha-2 (e.g. "PT")
  name: string;
  dial: string;      // e.g. "+351"
  flag: string;      // emoji flag
}

const COUNTRIES: Country[] = [
  { code: "PT", name: "Portugal",       dial: "+351", flag: "🇵🇹" },
  { code: "NG", name: "Nigeria",        dial: "+234", flag: "🇳🇬" },
  { code: "GB", name: "United Kingdom", dial: "+44",  flag: "🇬🇧" },
  { code: "ES", name: "Spain",          dial: "+34",  flag: "🇪🇸" },
  { code: "US", name: "United States",  dial: "+1",   flag: "🇺🇸" },
  { code: "FR", name: "France",         dial: "+33",  flag: "🇫🇷" },
  { code: "DE", name: "Germany",        dial: "+49",  flag: "🇩🇪" },
  { code: "IE", name: "Ireland",        dial: "+353", flag: "🇮🇪" },
  { code: "IT", name: "Italy",          dial: "+39",  flag: "🇮🇹" },
  { code: "NL", name: "Netherlands",    dial: "+31",  flag: "🇳🇱" },
  { code: "BE", name: "Belgium",        dial: "+32",  flag: "🇧🇪" },
  { code: "CH", name: "Switzerland",    dial: "+41",  flag: "🇨🇭" },
  { code: "ZA", name: "South Africa",   dial: "+27",  flag: "🇿🇦" },
  { code: "GH", name: "Ghana",          dial: "+233", flag: "🇬🇭" },
  { code: "KE", name: "Kenya",          dial: "+254", flag: "🇰🇪" },
  { code: "AE", name: "UAE",            dial: "+971", flag: "🇦🇪" },
  { code: "CA", name: "Canada",         dial: "+1",   flag: "🇨🇦" },
  { code: "AU", name: "Australia",      dial: "+61",  flag: "🇦🇺" },
  { code: "BR", name: "Brazil",         dial: "+55",  flag: "🇧🇷" },
];

const OTHER: Country = { code: "XX", name: "Other", dial: "", flag: "🌍" };

interface Props {
  /** Full E.164-ish value, e.g. "+351914145519". Empty string = blank. */
  value: string;
  onChange: (full: string) => void;
  required?: boolean;
  /** Show the label above the field. Defaults to true. */
  withLabel?: boolean;
  label?: string;
  placeholder?: string;
  /** Make the digits input use the .input class instead of a cream variant. */
  variant?: "white" | "cream";
}

/**
 * Try to detect which country a "+CC..." value belongs to. Longest-prefix
 * match (so +351 beats +35). Returns null if nothing matches.
 */
function detectCountry(value: string): Country | null {
  if (!value.startsWith("+")) return null;
  // Longest-prefix match
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (value.startsWith(c.dial)) return c;
  }
  return null;
}

export default function PhoneInput({
  value,
  onChange,
  required = false,
  withLabel = true,
  label = "Phone",
  placeholder = "9·· ··· ···",
  variant = "white",
}: Props) {
  // Initial: split passed-in value into country + local digits.
  const detected = useMemo(() => detectCountry(value), [value]);
  const [country, setCountry] = useState<Country>(detected ?? COUNTRIES[0]);
  const [otherDial, setOtherDial] = useState<string>(
    detected ? "" : (value.match(/^\+(\d{1,4})/)?.[1] ?? ""),
  );
  const [digits, setDigits] = useState<string>(
    detected ? value.slice(detected.dial.length).replace(/[^\d]/g, "") :
      value.startsWith("+") ? value.replace(/^\+\d{1,4}/, "").replace(/[^\d]/g, "") :
      value.replace(/[^\d]/g, ""),
  );

  // Push the combined value up whenever any field changes.
  useEffect(() => {
    const dial = country.code === "XX" ? (otherDial ? `+${otherDial.replace(/[^\d]/g, "")}` : "") : country.dial;
    const full = dial && digits ? `${dial}${digits}` : "";
    if (full !== value) onChange(full);
    // We intentionally don't include `value` in deps — that would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, otherDial, digits]);

  const inputCls =
    variant === "cream"
      ? "w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-espresso placeholder:text-foreground-subtle focus:border-espresso focus:outline-none"
      : "input";

  const selectCls =
    variant === "cream"
      ? "h-[44px] rounded-lg border border-border bg-cream pl-2 pr-7 text-sm text-espresso focus:border-espresso focus:outline-none"
      : "input !w-auto !pr-7";

  return (
    <label className="block">
      {withLabel && (
        <span className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
          {label}
          {required && " *"}
        </span>
      )}
      <div className="mt-1 flex items-stretch gap-2">
        <select
          aria-label="Country dial code"
          value={country.code}
          onChange={(e) => {
            const next =
              e.target.value === "XX"
                ? OTHER
                : COUNTRIES.find((c) => c.code === e.target.value) ?? COUNTRIES[0];
            setCountry(next);
          }}
          className={selectCls}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.dial} · {c.name}
            </option>
          ))}
          <option value="XX">{OTHER.flag} Other…</option>
        </select>
        {country.code === "XX" && (
          <input
            type="text"
            value={otherDial}
            onChange={(e) => setOtherDial(e.target.value.replace(/[^\d+]/g, "").replace(/\++/g, ""))}
            placeholder="234"
            inputMode="numeric"
            aria-label="Country dial code"
            className={`${inputCls} max-w-[80px]`}
          />
        )}
        <input
          type="tel"
          required={required}
          value={digits}
          onChange={(e) => setDigits(e.target.value.replace(/[^\d]/g, ""))}
          placeholder={placeholder}
          inputMode="numeric"
          className={`${inputCls} flex-1`}
        />
      </div>
    </label>
  );
}
