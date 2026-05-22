import Topbar from "@/components/admin/Topbar";
import AvailabilityManager from "@/components/admin/AvailabilityManager";
import { getAvailability } from "@/lib/availability/get-availability";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const availability = await getAvailability();
  return (
    <>
      <Topbar
        title="Availability"
        subtitle="Set how much notice you need, which days you're open, and block specific dates."
      />
      <main className="px-6 py-8 md:px-8 md:py-10">
        <AvailabilityManager initial={availability} />
      </main>
    </>
  );
}
