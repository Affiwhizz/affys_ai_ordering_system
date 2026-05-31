import Topbar from "@/components/admin/Topbar";
import NotifySignupsTable from "@/components/admin/NotifySignupsTable";
import { getNotifySignups } from "@/lib/notify/get-signups";

export const dynamic = "force-dynamic";

export default async function NotifySignupsPage() {
  const signups = await getNotifySignups();

  return (
    <>
      <Topbar
        title="Waitlist signups"
        subtitle="Customers who asked to be notified about Portimão pop-ups, sold-out releases, and daily-ordering pauses."
      />
      <main className="px-6 py-8 md:px-8 md:py-10">
        <NotifySignupsTable signups={signups} />
      </main>
    </>
  );
}
