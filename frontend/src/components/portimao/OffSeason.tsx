import Link from "next/link";
import { FadeIn, RevealHeading } from "@/components/motion";
import { AzulejoTile } from "../landing/Azulejo";
import NotifyMeForm from "@/components/NotifyMeForm";

/**
 * OFF-SEASON state, campaign not active.
 * Quiet "see you next year" page that still keeps brand presence + offers
 * a notify-me capture.
 */
export default function PortimaoOffSeason() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-paper" aria-hidden />
        <div className="container-x relative pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn delay={0.1} y={12}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-foreground-subtle transition-colors hover:text-espresso"
              >
                <span aria-hidden>←</span>
                Back to Affy&rsquo;s
              </Link>
            </FadeIn>

            <FadeIn delay={0.2}>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-cream px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-foreground-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground-subtle" />
                Off-season
              </span>
            </FadeIn>

            <RevealHeading
              as="h1"
              delay={0.35}
              className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight text-espresso sm:text-6xl lg:text-7xl"
              tokens={[
                <span key="line">
                  Affy&rsquo;s is not in{" "}
                  <span className="italic text-red">Portimão</span> at this
                  time.
                </span>,
              ]}
            />

            <FadeIn delay={0.6}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">
                The pop-up is closed for now. Drop your details and
                we&rsquo;ll let you know the moment the next Portimão window
                opens, usually around festival season.
              </p>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="mx-auto mt-9 max-w-md rounded-2xl border border-border bg-surface p-5 text-left shadow-luxe">
                <NotifyMeForm
                  source="portimao-offseason"
                  buttonLabel="Notify me next time"
                />
              </div>
            </FadeIn>

            <FadeIn delay={1.0}>
              <p className="mt-10 text-sm text-foreground-muted">
                In the meantime, take a look at the{" "}
                <Link href="/#menu" className="font-semibold text-espresso underline decoration-gold underline-offset-4 hover:text-red">
                  weekly menu
                </Link>{" "}
                or{" "}
                <Link href="/#udia" className="font-semibold text-espresso underline decoration-gold underline-offset-4 hover:text-red">
                  Ask Udia
                </Link>{" "}
                for catering or weeknight orders.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Decorative azulejo strip */}
        <div className="container-x relative mt-12">
          <div className="mx-auto max-w-md opacity-30">
            <div className="grid grid-cols-5 gap-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <AzulejoTile key={i} size={64} tone="ivory" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
