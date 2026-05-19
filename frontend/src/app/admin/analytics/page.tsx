import { TrendingUp, TrendingDown, Minus, ShoppingBag, Sparkles, XCircle } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import StatCard from "@/components/admin/StatCard";
import { TOP_DISHES, LEAD_SOURCES, ORDERS } from "@/components/admin/mock-data";

export default function AnalyticsPage() {
  const cancelledRate = (ORDERS.filter((o) => o.status === "cancelled").length / ORDERS.length) * 100;
  const udiaCount = ORDERS.filter((o) => o.channel === "udia").length;
  const udiaPct = (udiaCount / ORDERS.length) * 100;

  return (
    <>
      <Topbar
        title="Analytics"
        subtitle="What's selling, what's converting, and where customers are coming from."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        {/* KPI strip */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Orders this month"
            value={ORDERS.length * 12}
            hint="Across all channels"
            icon={<ShoppingBag size={16} strokeWidth={1.8} />}
            accent="gold"
            trend="up"
            trendLabel="+18% MoM"
          />
          <StatCard
            label="Avg. order value"
            value="€72"
            hint="Last 30 days"
            icon={<TrendingUp size={16} strokeWidth={1.8} />}
            accent="forest"
          />
          <StatCard
            label="Udia share of orders"
            value={`${udiaPct.toFixed(0)}%`}
            hint={`${udiaCount} via Udia in sample`}
            icon={<Sparkles size={16} strokeWidth={1.8} />}
            accent="espresso"
          />
          <StatCard
            label="Cancellation rate"
            value={`${cancelledRate.toFixed(1)}%`}
            hint="Healthy <5%"
            icon={<XCircle size={16} strokeWidth={1.8} />}
            accent="red"
          />
        </div>

        {/* Top dishes */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-espresso">Top dishes this month</h2>
            <p className="text-xs text-foreground-subtle">By order count across all channels.</p>
          </header>
          <ul>
            {TOP_DISHES.map((d, i) => {
              const max = Math.max(...TOP_DISHES.map((x) => x.ordersThisMonth));
              const pct = (d.ordersThisMonth / max) * 100;
              return (
                <li
                  key={d.name}
                  className="flex items-center gap-4 border-b border-border px-5 py-3.5 last:border-b-0"
                >
                  <span className="w-6 text-xs font-mono text-foreground-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-espresso">{d.name}</p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-cream-deep">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-espresso">{d.ordersThisMonth}</span>
                  <span className="flex items-center text-xs">
                    {d.trend === "up" ? (
                      <TrendingUp size={14} className="text-forest" />
                    ) : d.trend === "down" ? (
                      <TrendingDown size={14} className="text-red" />
                    ) : (
                      <Minus size={14} className="text-foreground-muted" />
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Lead sources */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-espresso">
              Catering lead sources
            </h2>
            <p className="text-xs text-foreground-subtle">
              Where catering inquiries come from and how many turn into bookings.
            </p>
          </header>
          <table className="w-full text-sm">
            <thead className="bg-cream/60 text-[10px] uppercase tracking-wider text-foreground-subtle">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Source</th>
                <th className="px-5 py-3 text-right font-medium">Inquiries</th>
                <th className="px-5 py-3 text-right font-medium">Conversion</th>
                <th className="px-5 py-3 text-left font-medium">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LEAD_SOURCES.map((s) => {
                const max = Math.max(...LEAD_SOURCES.map((x) => x.inquiries));
                const pct = (s.inquiries / max) * 100;
                return (
                  <tr key={s.source} className="hover:bg-cream/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-espresso">{s.source}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-espresso">
                      {s.inquiries}
                    </td>
                    <td className="px-5 py-3.5 text-right text-foreground-muted">
                      {(s.conversionRate * 100).toFixed(0)}%
                    </td>
                    <td className="px-5 py-3.5 w-72">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream-deep">
                        <div
                          className="h-full rounded-full bg-forest"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Udia usage callout */}
        <section className="mt-6 rounded-2xl border border-gold/40 bg-gradient-to-br from-espresso to-red/70 p-6 text-ivory shadow-luxe md:p-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Udia usage</p>
          <h2 className="mt-3 font-display text-2xl font-medium tracking-tight">
            Once Udia is live, this panel will show usage signals
          </h2>
          <p className="mt-2 max-w-lg text-sm text-ivory/80">
            Prompt examples used, conversion from chat to confirmed order, time-to-confirm,
            and which dish suggestions land. Wires up once the AI assistant ships.
          </p>
        </section>
      </main>
    </>
  );
}
