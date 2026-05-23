import { Clock } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import PortimaoControl from "@/components/admin/PortimaoControl";
import { FESTIVAL_MENU } from "@/components/portimao/config";
import { getStoreFlags } from "@/lib/store/get-store-flags";

export const dynamic = "force-dynamic";

export default async function AdminPortimaoPage() {
  const flags = await getStoreFlags();

  return (
    <>
      <Topbar
        title="Portimão control"
        subtitle="Set the preorder window, switch campaign mode, and pause regular Lisbon ordering while you're away."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        <PortimaoControl initial={flags} />

        {/* Festival menu (read-only summary — manage in the Menu manager) */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-espresso">
                Festival menu
              </h2>
              <p className="text-xs text-foreground-subtle">
                Categories shown during the campaign. Manage prices and availability
                in the Menu manager.
              </p>
            </div>
            <Clock size={16} className="text-gold-deep" />
          </header>
          <ul className="divide-y divide-border">
            {FESTIVAL_MENU.map((m) => (
              <li
                key={m.name}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-espresso">{m.name}</p>
                  <p className="text-[11px] text-foreground-subtle">
                    {m.category} · {m.description}
                  </p>
                </div>
                <span className="whitespace-nowrap font-display text-sm font-semibold text-red">
                  {m.priceFrom}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
