import Topbar from "@/components/admin/Topbar";
import PromoManager from "@/components/admin/PromoManager";
import { getPromoCodes } from "@/lib/promo/get-promos";

export const dynamic = "force-dynamic";

export default async function PromosPage() {
  const promos = await getPromoCodes();
  return (
    <>
      <Topbar
        title="Promo codes"
        subtitle="Create discount codes, set usage limits, and stop abuse, single-use codes are blocked by phone, email, and device."
      />
      <main className="px-6 py-8 md:px-8 md:py-10">
        <PromoManager initial={promos} />
      </main>
    </>
  );
}
