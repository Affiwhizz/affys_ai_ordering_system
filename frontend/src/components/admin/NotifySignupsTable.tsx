"use client";

import { useMemo, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { labelForSource, toneForSource, type NotifySignup } from "@/lib/notify/types";

interface Props {
  signups: NotifySignup[];
}

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "portimao-offseason", label: "Portimão pop-up alerts" },
  { value: "portimao-waitlist", label: "Portimão sold-out waitlist" },
  { value: "daily-pause", label: "Daily ordering resume" },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function NotifySignupsTable({ signups }: Props) {
  const [source, setSource] = useState<string>("all");

  const filtered = useMemo(
    () => (source === "all" ? signups : signups.filter((s) => s.source === source)),
    [signups, source],
  );

  const csv = () => {
    const header = ["created_at", "source", "email", "phone"];
    const rows = filtered.map((s) => [
      s.createdAt,
      s.source,
      s.email ?? "",
      s.phone ?? "",
    ]);
    const body = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notify-signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Filter + export */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setSource(f.value)}
              className={`inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold transition-all ${
                source === f.value
                  ? "bg-espresso text-ivory border border-espresso"
                  : "border border-border bg-white text-foreground-muted hover:border-espresso hover:text-espresso"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={csv}
          disabled={filtered.length === 0}
          className="inline-flex h-9 items-center rounded-full border border-border bg-white px-4 text-xs font-semibold text-espresso transition-colors hover:border-espresso disabled:opacity-50"
        >
          Export CSV ({filtered.length})
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-cream/40 px-6 py-16 text-center text-sm text-foreground-muted">
          No signups in this filter.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream/60 text-[11px] uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Signed up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${toneForSource(s.source)}`}
                    >
                      {labelForSource(s.source)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-espresso">
                    {s.email ? (
                      <a
                        href={`mailto:${s.email}`}
                        className="inline-flex items-center gap-1.5 underline decoration-gold underline-offset-4"
                      >
                        <Mail size={12} className="text-foreground-subtle" /> {s.email}
                      </a>
                    ) : (
                      <span className="text-foreground-subtle">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-espresso">
                    {s.phone ? (
                      <a
                        href={`https://wa.me/${s.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 underline decoration-gold underline-offset-4"
                      >
                        <Phone size={12} className="text-foreground-subtle" /> {s.phone}
                      </a>
                    ) : (
                      <span className="text-foreground-subtle">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">{fmtDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
