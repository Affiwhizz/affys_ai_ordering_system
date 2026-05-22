import Topbar from "@/components/admin/Topbar";
import DeliveryManager from "@/components/admin/DeliveryManager";
import { getDeliverySettings } from "@/lib/delivery/get-delivery-settings";

export const dynamic = "force-dynamic";

export default async function DeliveryPage() {
  const settings = await getDeliverySettings();
  return (
    <>
      <Topbar
        title="Delivery & Payments"
        subtitle="Edit delivery fees by area, the weight surcharge, and your payment details."
      />
      <main className="px-6 py-8 md:px-8 md:py-10">
        <DeliveryManager initial={settings} />
      </main>
    </>
  );
}
