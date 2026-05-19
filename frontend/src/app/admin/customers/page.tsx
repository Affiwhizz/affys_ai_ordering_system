import { Phone, Mail, Star } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import StatusPill from "@/components/admin/StatusPill";
import { CUSTOMERS, formatCurrency } from "@/components/admin/mock-data";

export default function CustomersPage() {
  return (
    <>
      <Topbar
        title="Customers"
        subtitle="People who've ordered from Affy's, repeat behaviour and notes."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-espresso">
                {CUSTOMERS.length} customers
              </h2>
              <p className="text-xs text-foreground-subtle">
                {CUSTOMERS.filter((c) => c.isRepeat).length} repeat ·{" "}
                {formatCurrency(CUSTOMERS.reduce((s, c) => s + c.totalSpend, 0))} lifetime
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-full bg-espresso px-4 text-sm font-semibold text-ivory hover:bg-gold hover:text-espresso transition-colors"
            >
              Export CSV
            </button>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/60 text-[10px] uppercase tracking-wider text-foreground-subtle">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Contact</th>
                  <th className="px-5 py-3 text-left font-medium">Location</th>
                  <th className="px-5 py-3 text-right font-medium">Orders</th>
                  <th className="px-5 py-3 text-right font-medium">Lifetime spend</th>
                  <th className="px-5 py-3 text-left font-medium">Last order</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CUSTOMERS.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-espresso">{c.name}</p>
                      <p className="font-mono text-[11px] text-foreground-subtle">{c.id}</p>
                      {c.notes && (
                        <p className="mt-1 text-[11px] italic text-foreground-subtle">&ldquo;{c.notes}&rdquo;</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="flex items-center gap-1.5 text-[12px] text-foreground-muted">
                        <Phone size={11} /> {c.phone}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-foreground-muted">
                        <Mail size={11} /> {c.email}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-foreground-muted">{c.location}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-espresso">{c.ordersCount}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-espresso">
                      {formatCurrency(c.totalSpend)}
                    </td>
                    <td className="px-5 py-3.5 text-foreground-muted">{c.lastOrderAt}</td>
                    <td className="px-5 py-3.5">
                      {c.isRepeat ? (
                        <StatusPill label="Repeat" tone="gold" />
                      ) : (
                        <StatusPill label="New" tone="neutral" />
                      )}
                      {c.ordersCount >= 8 && (
                        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold-deep">
                          <Star size={10} /> VIP
                        </span>
                      )}
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
