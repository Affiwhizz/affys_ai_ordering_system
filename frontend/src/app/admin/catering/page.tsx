import Topbar from "@/components/admin/Topbar";
import CateringBoard from "@/components/admin/CateringBoard";
import { getCateringInquiries } from "@/lib/catering/get-inquiries";

// Always re-read on visit so new inquiries show up without manual refresh.
export const dynamic = "force-dynamic";

export default async function CateringPage() {
  const inquiries = await getCateringInquiries();

  return (
    <>
      <Topbar
        title="Catering inquiries"
        subtitle="Pipeline of catering and event requests across the channels."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        {inquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong bg-cream/40 px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold text-espresso">
              No catering inquiries yet.
            </p>
            <p className="mt-2 text-sm text-foreground-muted">
              Submissions from the public catering form will appear here.
            </p>
          </div>
        ) : (
          <CateringBoard inquiries={inquiries} />
        )}
      </main>
    </>
  );
}
