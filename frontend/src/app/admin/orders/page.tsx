import Topbar from "@/components/admin/Topbar";
import OrdersTable from "@/components/admin/OrdersTable";
import { getOrders } from "@/lib/orders/get-orders";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();
  return (
    <>
      <Topbar
        title="Orders"
        subtitle="All orders across the quick form and Portimão preorders."
      />
      <main className="px-6 py-8 md:px-8 md:py-10">
        <OrdersTable initial={orders} />
      </main>
    </>
  );
}
