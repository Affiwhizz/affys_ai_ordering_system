import Link from "next/link";
import { ShoppingBag, CreditCard, MapPin, Utensils, ArrowUpRight } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import StatCard from "@/components/admin/StatCard";
import StatusPill from "@/components/admin/StatusPill";
import {
  ORDERS,
  CATERING,
  TOP_DISHES,
  getKPIs,
  formatCurrency,
  formatDate,
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

const channelLabel: Record<string, string> = {
  udia: "Udia",
  form: "Form",
  portimao: "Portimão",
};

export default function AdminDashboard() {
  const kpis = getKPIs();
  const recent = ORDERS.slice(0, 6);
  const catering = CATERING.filter((c) => c.status === "new" || c.status === "reviewing").slice(0, 4);

  return (
    <>
      <Topbar
        title="Welcome back, Affiong"
        subtitle="Here's what's happening today across orders, catering, and Portimão."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        {/* KPI grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's orders"
            value={kpis.todayOrdersCount}
            hint={formatCurrency(kpis.todayRevenue) + " paid today"}
            icon={<ShoppingBag size={16} strokeWidth={1.8} />}
            accent="gold"
            trend="up"
            trendLabel="vs yesterday"
          />
          <StatCard
            label="Pending payments"
            value={kpis.pendingPaymentsCount}
            hint={formatCurrency(kpis.pendingPaymentsValue) + " awaiting"}
            icon={<CreditCard size={16} strokeWidth={1.8} />}
            accent="red"
          />
          <StatCard
            label="Portimão slots left"
            value={`${kpis.portimaoSlotsLeft}/${kpis.portimaoSlotsPerDay}`}
            hint="Festival mode is live"
            icon={<MapPin size={16} strokeWidth={1.8} />}
            accent="forest"
          />
          <StatCard
            label="Catering pipeline"
            value={kpis.cateringPipelineCount}
            hint="New + reviewing inquiries"
            icon={<Utensils size={16} strokeWidth={1.8} />}
            accent="espresso"
          />
        </div>

        {/* Recent + Catering */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Recent orders */}
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-espresso">Recent orders</h2>
                <p className="text-xs text-foreground-subtle">Last 6 across all channels</p>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-semibold text-espresso hover:text-red"
              >
                View all <ArrowUpRight size={14} />
              </Link>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream/60 text-[10px] uppercase tracking-wider text-foreground-subtle">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium">Order</th>
                    <th className="px-5 py-3 text-left font-medium">Customer</th>
                    <th className="px-5 py-3 text-left font-medium">Channel</th>
                    <th className="px-5 py-3 text-right font-medium">Total</th>
                    <th className="px-5 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recent.map((o) => (
                    <tr key={o.id} className="hover:bg-cream/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs font-semibold text-espresso">{o.id}</p>
                        <p className="mt-0.5 text-[11px] text-foreground-subtle">
                          {formatDate(o.submittedAt)}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-espresso">{o.customer.name}</p>
                        <p className="text-[11px] text-foreground-subtle">{o.fulfilment === "pickup" ? "Pickup" : "Delivery"}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs uppercase tracking-wider text-foreground-muted">
                        {channelLabel[o.channel]}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-espresso">
                        {formatCurrency(o.total)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill label={o.status} tone={statusTone[o.status]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Catering pipeline */}
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-espresso">Catering pipeline</h2>
                <p className="text-xs text-foreground-subtle">Inquiries awaiting response</p>
              </div>
              <Link
                href="/admin/catering"
                className="inline-flex items-center gap-1 text-xs font-semibold text-espresso hover:text-red"
              >
                Manage <ArrowUpRight size={14} />
              </Link>
            </header>
            <ul className="divide-y divide-border">
              {catering.map((c) => (
                <li key={c.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-espresso">{c.eventType}</p>
                      <p className="mt-0.5 text-xs text-foreground-muted">
                        {c.customer.name} · {c.guestCount} guests · {c.location}
                      </p>
                    </div>
                    <StatusPill label={c.status} tone={c.status === "new" ? "amber" : "neutral"} />
                  </div>
                  <p className="mt-1 text-[11px] text-foreground-subtle">
                    For {new Date(c.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long" })}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Top dishes */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-espresso">Top dishes this month</h2>
              <p className="text-xs text-foreground-subtle">By order count across all channels</p>
            </div>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-espresso hover:text-red"
            >
              Full analytics <ArrowUpRight size={14} />
            </Link>
          </header>
          <ul>
            {TOP_DISHES.map((d, i) => {
              const max = Math.max(...TOP_DISHES.map((x) => x.ordersThisMonth));
              const pct = (d.ordersThisMonth / max) * 100;
              return (
                <li key={d.name} className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-b-0">
                  <span className="w-6 text-xs font-mono text-foreground-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-espresso">{d.name}</p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-deep">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-espresso">{d.ordersThisMonth}</span>
                  <span
                    className={`text-xs font-semibold ${
                      d.trend === "up" ? "text-forest" : d.trend === "down" ? "text-red" : "text-foreground-muted"
                    }`}
                  >
                    {d.trend === "up" ? "↑" : d.trend === "down" ? "↓" : "→"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
