"use client";

import { useState } from "react";
import { CreditCard, MailCheck, MoreHorizontal } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import StatusPill from "@/components/admin/StatusPill";
import {
  ORDERS,
  formatCurrency,
  formatDate,
  type OrderChannel,
  type OrderStatus,
} from "@/components/admin/mock-data";

const statusTone: Record<OrderStatus, "neutral" | "amber" | "green" | "red" | "gold"> = {
  new: "amber",
  confirmed: "amber",
  paid: "gold",
  preparing: "amber",
  ready: "green",
  completed: "green",
  cancelled: "red",
};

type Filter = "all" | OrderChannel;

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "udia", label: "Udia" },
  { id: "form", label: "Quick form" },
  { id: "portimao", label: "Portimão" },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = filter === "all" ? ORDERS : ORDERS.filter((o) => o.channel === filter);

  return (
    <>
      <Topbar title="Orders" subtitle="All orders across Udia, the quick form, and Portimão preorders." />

      <main className="px-6 py-8 md:px-8 md:py-10">
        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white p-1">
            {TABS.map((t) => {
              const active = filter === t.id;
              const count =
                t.id === "all" ? ORDERS.length : ORDERS.filter((o) => o.channel === t.id).length;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFilter(t.id)}
                  className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                    active
                      ? "bg-espresso text-ivory"
                      : "text-foreground-muted hover:text-espresso hover:bg-cream"
                  }`}
                >
                  {t.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      active ? "bg-gold text-espresso" : "bg-cream-deep text-foreground-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-full bg-espresso px-4 text-sm font-semibold text-ivory hover:bg-gold hover:text-espresso transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/60 text-[10px] uppercase tracking-wider text-foreground-subtle">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Order</th>
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Items</th>
                  <th className="px-5 py-3 text-left font-medium">Pickup / Delivery</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                  <th className="px-5 py-3 text-left font-medium">Payment</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium" aria-label="Actions" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/40 transition-colors">
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-mono text-xs font-semibold text-espresso">{o.id}</p>
                      <p className="mt-0.5 text-[11px] text-foreground-subtle">{formatDate(o.submittedAt)}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground-muted">
                        {o.channel === "udia" ? "Udia" : o.channel === "form" ? "Form" : "Portimão"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-medium text-espresso">{o.customer.name}</p>
                      <p className="text-[11px] text-foreground-subtle">{o.customer.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 align-top max-w-xs">
                      <ul className="space-y-0.5 text-[12px] text-foreground-muted">
                        {o.items.map((it, i) => (
                          <li key={i}>
                            <span className="text-espresso">{it.qty}×</span> {it.name}
                          </li>
                        ))}
                      </ul>
                      {o.notes && (
                        <p className="mt-1.5 text-[11px] italic text-foreground-subtle">&ldquo;{o.notes}&rdquo;</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <p className="text-xs font-medium text-espresso">
                        {o.fulfilment === "pickup" ? "Pickup" : "Delivery"}
                      </p>
                      <p className="text-[11px] text-foreground-subtle">
                        {new Date(o.scheduledFor).toLocaleString("en-GB", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {o.address && (
                        <p className="mt-0.5 text-[10px] text-foreground-subtle">{o.address}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 align-top text-right font-semibold text-espresso">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <StatusPill
                        label={o.paymentStatus}
                        tone={o.paymentStatus === "paid" ? "green" : o.paymentStatus === "pending" ? "amber" : "red"}
                      />
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <StatusPill label={o.status} tone={statusTone[o.status]} />
                    </td>
                    <td className="px-5 py-3.5 align-top text-right">
                      <div className="inline-flex items-center gap-1">
                        {o.paymentStatus === "pending" && (
                          <button
                            type="button"
                            title="Send payment link"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-espresso transition-colors hover:border-espresso hover:bg-espresso hover:text-ivory"
                          >
                            <CreditCard size={13} />
                          </button>
                        )}
                        {o.status === "new" && (
                          <button
                            type="button"
                            title="Send confirmation"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-espresso transition-colors hover:border-espresso hover:bg-espresso hover:text-ivory"
                          >
                            <MailCheck size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          title="More"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-foreground-muted transition-colors hover:border-espresso hover:text-espresso"
                        >
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
