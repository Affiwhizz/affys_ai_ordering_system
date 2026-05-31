"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Phone input with a searchable country-code selector + national number.
 *
 * Defaults to Portugal (+351) since most customers are local. List below
 * covers the destinations Affy's sees most often (Portugal, EU, UK, US,
 * Nigeria, etc.), extend if needed.
 */

interface Country {
  code: string;          // dial code, e.g. "+351"
  iso: string;           // ISO 3166-1 alpha-2, e.g. "PT"
  name: string;
  flag: string;          // emoji
}

const COUNTRIES: Country[] = [
  { code: "+351", iso: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "+44",  iso: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+1",   iso: "US", name: "United States", flag: "🇺🇸" },
  { code: "+1",   iso: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "+33",  iso: "FR", name: "France", flag: "🇫🇷" },
  { code: "+34",  iso: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "+39",  iso: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "+49",  iso: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "+31",  iso: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "+32",  iso: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "+41",  iso: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43",  iso: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "+45",  iso: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "+46",  iso: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "+47",  iso: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "+358", iso: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "+353", iso: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "+30",  iso: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "+48",  iso: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "+420", iso: "CZ", name: "Czechia", flag: "🇨🇿" },
  { code: "+36",  iso: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "+40",  iso: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "+55",  iso: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "+234", iso: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "+233", iso: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "+27",  iso: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "+212", iso: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "+254", iso: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "+971", iso: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "+86",  iso: "CN", name: "China", flag: "🇨🇳" },
  { code: "+81",  iso: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "+91",  iso: "IN", name: "India", flag: "🇮🇳" },
  { code: "+61",  iso: "AU", name: "Australia", flag: "🇦🇺" },
];

interface PhoneInputProps {
  /** Country ISO code (e.g. "PT"). */
  countryIso: string;
  onCountryChange: (iso: string) => void;
  /** Number without country code. */
  number: string;
  onNumberChange: (n: string) => void;
  required?: boolean;
  label?: string;
}

export default function PhoneInput({
  countryIso,
  onCountryChange,
  number,
  onNumberChange,
  required = false,
  label = "Phone",
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const country =
    COUNTRIES.find((c) => c.iso === countryIso) ?? COUNTRIES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        c.code.includes(q),
    );
  }, [query]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && (
        <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
          {label}
        </label>
      )}

      <div className="mt-1 flex w-full overflow-hidden rounded-lg border border-border bg-white">
        {/* Country picker trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 border-r border-border bg-cream px-2.5 text-sm font-medium text-espresso hover:bg-cream-deep"
        >
          <span className="text-base leading-none" aria-hidden>
            {country.flag}
          </span>
          <span className="font-mono">{country.code}</span>
          <ChevronDown size={12} className="text-foreground-muted" />
        </button>

        {/* National number input */}
        <input
          type="tel"
          inputMode="tel"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          placeholder={
            country.iso === "PT" ? "9·· ··· ···" : "Your number"
          }
          required={required}
          className="flex-1 bg-white px-3 py-2.5 text-sm text-espresso placeholder:text-foreground-subtle focus:outline-none"
        />
      </div>

      {/* Country dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-border bg-white shadow-luxe">
          <div className="border-b border-border p-2">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code…"
              className="w-full rounded-md border border-border bg-cream px-3 py-2 text-sm text-espresso placeholder:text-foreground-subtle focus:border-espresso focus:outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.iso}>
                <button
                  type="button"
                  onClick={() => {
                    onCountryChange(c.iso);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-cream ${
                    c.iso === country.iso ? "bg-gold/10" : ""
                  }`}
                >
                  <span aria-hidden>{c.flag}</span>
                  <span className="flex-1 text-espresso">{c.name}</span>
                  <span className="font-mono text-foreground-muted">{c.code}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-foreground-subtle">
                No country matches “{query}”
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Helper to compose the full international number when submitting. */
export function composeE164(countryIso: string, nationalNumber: string): string {
  const country = COUNTRIES.find((c) => c.iso === countryIso) ?? COUNTRIES[0];
  const digits = nationalNumber.replace(/\D/g, "");
  return `${country.code}${digits}`;
}
