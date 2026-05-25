"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, MessageCircle } from "lucide-react";
import StatusPill from "@/components/admin/StatusPill";
import { formatCurrency, formatDate } from "@/components/admin/mock-data";
import { setOrderStatus } from "@/app/admin/orders/actions";
import {
  ORDER_STATUSES,
  STATUS_TONE,
  type AdminOrder,
  type OrderChannel,
  type OrderStatus,
} from "@/lib/orders/types";

type Filter = "all" | OrderChannel;

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "form", label: "Quick form" },
  { id: "portimao", label: "Portimão" },
  { id: "udia", label: "Udia" },
];

const channelLabel = (c: OrderChannel) =>
  c === "udia" ? "Udia" : c === "form" ? "Form" : "Portimão";

// Pre-filled WhatsApp confirmation message to the customer (one-tap send).
function waLink(o: AdminOrder): string {
  const digits = o.customerPhone.replace(/[^\d]/g, "");
  const when = o.scheduledFor
    ? ` for ${new Date(o.scheduledFor).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}`
    : "";
  const msg = `Hi ${o.customerName.split(" ")[0]}, your Affy's order ${o.shortCode} is confirmed${when}. Total ${formatCurrency(o.total)}. Thank you! — Affy's`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

function toCsv(rows: AdminOrder[]): string {
  const head = [
    "Order",
    "Submitted",
    "Channel",
    "Customer",
    "Phone",
    "Email",
    "Items",
    "Fulfilment",
    "Scheduled",
    "Address",
    "Subtotal",
    "Delivery",
    "Bag",
    "Promo",
    "Discount",
    "Total",
    "Payment",
    "Status",
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((o) =>
    [
      o.shortCode,
      o.submittedAt,
      channelLabel(o.channel),
      o.customerName,
      o.customerPhone,
      o.customerEmail ?? "",
      o.items.map((i) => `${i.quantity}x ${i.name}`).join(" | "),
      o.fulfilment,
      o.scheduledFor ?? "",
      o.addressLine ?? "",
      o.subtotal,
      o.deliveryFee,
      o.takeoutBagFee,
      o.promoCode ?? "",
      o.promoDiscount,
      o.total,
      o.paymentStatus,
      o.status,
    ]
      .map(esc)
      .join(","),
  );
  return [head.map(esc).join(","), ...lines].join("\n");
}

export default function OrdersTable({ initial }: { initial: AdminOrder[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>(initial);
  // Re-sync when fresh server data arrives (after router.refresh()).
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setOrders(initial);
  }

  const [filter, setFilter] = useState<Filter>("all");
  const [, start] = useTransition();

  const rows = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.channel === filter)),
    [orders, filter],
  );

  const changeStatus = (id: string, status: OrderStatus) => {
    setOrders((cur) =>
      cur.map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              paymentStatus: status === "paid" ? "paid" : o.paymentStatus,
            }
          : o,
      ),
    );
    start(async () => {
      await setOrderStatus(id, status);
      router.refresh();
    });
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `affys-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Tabs + export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white p-1">
          {TABS.map((t) => {
            const active = filter === t.id;
            const count =
              t.id === "all"
                ? orders.length
                : orders.filter((o) => o.channel === t.id).length;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                  active
                    ? "bg-espresso text-ivory"
                    : "text-foreground-muted hover:bg-cream hover:text-espresso"
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
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-espresso px-4 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-foreground-muted">
            No orders yet. They&rsquo;ll appear here the moment a customer checks out.
          </p>
        ) : (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-cream/40">
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-mono text-xs font-semibold text-espresso">
                        {o.shortCode}
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground-subtle">
                        {formatDate(o.submittedAt)}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-foreground-muted">
                        {channelLabel(o.channel)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-medium text-espresso">{o.customerName}</p>
                      <p className="text-[11px] text-foreground-subtle">{o.customerPhone}</p>
                      {o.customerEmail && (
                        <p className="text-[11px] text-foreground-subtle">{o.customerEmail}</p>
                      )}
                    </td>
                    <td className="max-w-xs px-5 py-3.5 align-top">
                      <ul className="space-y-0.5 text-[12px] text-foreground-muted">
                        {o.items.map((it, i) => (
                          <li key={i}>
                            <span className="text-espresso">{it.quantity}×</span> {it.name}
                            {it.variantLabel ? (
                              <span className="text-foreground-subtle"> · {it.variantLabel}</span>
                            ) : null}
                            {it.notes ? (
                              <span className="text-foreground-subtle"> ({it.notes})</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                      {o.notes && (
                        <p className="mt-1.5 text-[11px] italic text-foreground-subtle">
                          &ldquo;{o.notes}&rdquo;
                        </p>
                      )}
                      {o.promoCode && (
                        <p className="mt-1 text-[11px] text-forest">
                          Promo {o.promoCode} (−{formatCurrency(o.promoDiscount)})
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <p className="text-xs font-medium text-espresso">
                        {o.fulfilment === "pickup" ? "Pickup" : "Delivery"}
                      </p>
                      {o.scheduledFor && (
                        <p className="text-[11px] text-foreground-subtle">
                          {new Date(o.scheduledFor).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      )}
                      {o.addressLine && (
                        <p className="mt-0.5 text-[10px] text-foreground-subtle">
                          {o.addressLine}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right align-top font-semibold text-espresso">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <StatusPill
                        label={o.paymentStatus}
                        tone={
                          o.paymentStatus === "paid"
                            ? "green"
                            : o.paymentStatus === "pending"
                              ? "amber"
                              : "red"
                        }
                      />
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="flex flex-col gap-1.5">
                        <StatusPill label={o.status} tone={STATUS_TONE[o.status]} />
                        <select
                          value={o.status}
                          onChange={(e) =>
                            changeStatus(o.id, e.target.value as OrderStatus)
                          }
                          className="rounded-lg border border-border bg-cream px-2 py-1 text-xs text-espresso focus:border-espresso focus:outline-none"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <a
                          href={waLink(o)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Send the confirmation to the customer on WhatsApp"
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-forest/40 bg-forest/5 px-2 text-[11px] font-semibold text-forest transition-colors hover:bg-forest hover:text-ivory"
                        >
                          <MessageCircle size={12} /> WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
