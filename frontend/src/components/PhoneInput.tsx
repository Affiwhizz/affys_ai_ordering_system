"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  COUNTRIES,
  countryByIso,
  detectCountry,
  filterCountries,
  type Country,
} from "@/lib/countries";

/**
 * Phone input with a SEARCHABLE country picker.
 *
 * Trigger button shows ONLY flag + dial code (no country name) so the field
 * stays compact and matches the patterns customers expect from Wolt, Stripe,
 * Booking, etc. Clicking it opens a popover with a search input at the top
 * and an alphabetical list of every country we ship to. Typing "351", "PT"
 * or "Portugal" all filter the list.
 *
 * The component reports the FULL international number (e.g. "+351914145519")
 * via `onChange`. If the parent passes a value already starting with one of
 * the known dial codes, the picker initialises on that country.
 */

interface Props {
  /** Full E.164-ish value, e.g. "+351914145519". Empty string = blank. */
  value: string;
  onChange: (full: string) => void;
  required?: boolean;
  withLabel?: boolean;
  label?: string;
  placeholder?: string;
  /** Style variant for the digits input. */
  variant?: "white" | "cream";
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
  // Initial split: detect country from "+NN..." prefix, default to Portugal.
  const detected = useMemo(() => detectCountry(value), [value]);
  const [country, setCountry] = useState<Country>(
    detected ?? countryByIso("PT") ?? COUNTRIES[0],
  );
  const [digits, setDigits] = useState<string>(() => {
    if (!value) return "";
    if (detected) return value.slice(detected.dial.length).replace(/\D/g, "");
    return value.replace(/^\+\d+/, "").replace(/\D/g, "");
  });

  // Combined value propagated up. Skip update if unchanged (avoids loops).
  useEffect(() => {
    const full = digits ? `${country.dial}${digits}` : "";
    if (full !== value) onChange(full);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, digits]);

  // Popover state + search query
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterCountries(query), [query]);

  // Focus the search box when opening; clear query on close.
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const inputCls =
    variant === "cream"
      ? "w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-espresso placeholder:text-foreground-subtle focus:border-espresso focus:outline-none"
      : "input";

  const triggerCls =
    variant === "cream"
      ? "inline-flex h-[44px] items-center gap-1.5 rounded-lg border border-border bg-cream px-3 text-sm text-espresso focus:border-espresso focus:outline-none"
      : "inline-flex h-[44px] items-center gap-1.5 rounded-[0.625rem] border border-border bg-white px-3 text-sm text-espresso focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

  return (
    <label className="block">
      {withLabel && (
        <span className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
          {label}
          {required && " *"}
        </span>
      )}

      <div ref={wrapRef} className="mt-1 flex items-stretch gap-2">
        {/* Country trigger, flag + dial code only */}
        <div className="relative shrink-0">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Country code: ${country.name} ${country.dial}`}
            onClick={() => setOpen((v) => !v)}
            className={triggerCls}
          >
            <span className="text-base leading-none">{country.flag}</span>
            <span className="font-mono text-sm">{country.dial}</span>
            <ChevronDown size={14} className="text-foreground-subtle" />
          </button>

          {open && (
            <div
              role="listbox"
              className="absolute left-0 top-[48px] z-50 w-72 overflow-hidden rounded-2xl border border-border bg-white shadow-luxe"
            >
              <div className="flex items-center gap-2 border-b border-border bg-cream/60 px-3 py-2">
                <Search size={14} className="text-foreground-subtle" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search country, code, or ISO"
                  className="w-full bg-transparent text-sm text-espresso placeholder:text-foreground-subtle focus:outline-none"
                />
              </div>
              <ul className="max-h-72 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <li className="px-3 py-3 text-xs text-foreground-subtle">No countries match.</li>
                ) : (
                  filtered.map((c) => {
                    const isCurrent = c.iso === country.iso;
                    return (
                      <li key={c.iso}>
                        <button
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            setOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                            isCurrent ? "bg-gold/15 text-espresso" : "text-espresso hover:bg-cream/60"
                          }`}
                        >
                          <span className="text-base leading-none">{c.flag}</span>
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="font-mono text-xs text-foreground-muted">{c.dial}</span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>

        <input
          type="tel"
          required={required}
          value={digits}
          onChange={(e) => setDigits(e.target.value.replace(/\D/g, ""))}
          placeholder={placeholder}
          inputMode="numeric"
          autoComplete="tel-national"
          className={`${inputCls} flex-1`}
        />
      </div>
    </label>
  );
}
