import Link from "next/link";
import { AzulejoTile } from "./Azulejo";
import { FadeIn, RevealHeading } from "@/components/motion";

const STEPS = [
  {
    n: "01",
    title: "Tell Udia what you want",
    body: "A craving, a budget, a guest count, an event, anything. Type or talk.",
  },
  {
    n: "02",
    title: "Udia builds the order",
    body: "Smart picks from the menu, sized for your group, paced for your day.",
  },
  {
    n: "03",
    title: "Confirm and pay",
    body: "A clean summary lands in your hands. One tap to pay via Stripe.",
  },
];

const CAPABILITIES = [
  "Suggests dishes by craving, mood, or event",
  "Right-sizes for 2 friends or a 200-person catering",
  "Captures pickup or delivery, date, time, address",
  "Hands you a clean summary before you pay",
];

export default function MeetUdia() {
  return (
    <section
      id="udia"
      className="relative overflow-hidden bg-forest text-ivory py-24 md:py-32"
    >
      {/* Decorative azulejo top-left */}
      <div className="pointer-events-none absolute -top-8 -left-8 hidden lg:block opacity-30">
        <div className="grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <AzulejoTile key={i} size={84} tone="forest" />
          ))}
        </div>
      </div>
      <div className="absolute -bottom-32 -right-32 h-[26rem] w-[26rem] rounded-full bg-gold/15 blur-3xl" aria-hidden />

      <div className="container-x relative">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Copy column */}
          <div>
            <FadeIn delay={0.05} y={12}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.22em] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Coming soon
              </span>
            </FadeIn>

            <RevealHeading
              as="h2"
              delay={0.15}
              className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              tokens={[
                "Meet",
                <span key="udia" className="gold-shimmer italic">
                  Udia
                </span>,
                ", your",
                <span key="b" className="whitespace-nowrap">
                  Affy{"’"}s
                </span>,
                "food",
                "guide.",
              ]}
            />

            <FadeIn delay={0.55}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
                Tell Udia what you&rsquo;re craving, your budget, group
                size, or event type, and Udia helps you build the right
                order.
              </p>
            </FadeIn>

            {/* Capabilities */}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {CAPABILITIES.map((c, i) => (
                <FadeIn key={c} delay={0.7 + i * 0.08} y={14}>
                  <li className="flex h-full items-start gap-3 rounded-2xl border border-ivory/10 bg-ivory/5 px-4 py-3 text-sm text-ivory/90 backdrop-blur-sm">
                    <span
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-espresso"
                      aria-hidden
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {c}
                  </li>
                </FadeIn>
              ))}
            </ul>

            {/* Three-step flow */}
            <ol className="mt-10 space-y-5">
              {STEPS.map((s, i) => (
                <FadeIn key={s.n} delay={1.05 + i * 0.12} y={14}>
                  <li className="flex items-start gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-espresso/40 font-mono text-xs text-gold backdrop-blur">
                      {s.n}
                    </span>
                    <div className="flex-1 pt-1">
                      <h3 className="font-display text-xl font-semibold">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ivory/70">
                        {s.body}
                      </p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <span className="hidden md:inline-block h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent self-center" />
                    )}
                  </li>
                </FadeIn>
              ))}
            </ol>

            <FadeIn delay={1.5}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/menu"
                  className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Try Udia now
                  <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex h-12 items-center rounded-full border border-ivory/30 px-7 text-sm font-semibold text-ivory transition-colors hover:bg-ivory/10"
                >
                  Use the form instead
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Chat preview */}
          <UdiaChatPreview />
        </div>
      </div>
    </section>
  );
}

function UdiaChatPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-gold/30 via-transparent to-oxblood/30 blur-md" aria-hidden />

      <div className="relative rounded-[1.8rem] border border-ivory/10 bg-espresso/70 p-2 shadow-luxe backdrop-blur-xl">
        <div className="rounded-[1.4rem] border border-ivory/10 bg-espresso p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ivory/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gold/60">
                <span className="absolute inset-1 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep" />
                <span className="relative font-display text-sm font-semibold text-espresso">U</span>
              </span>
              <div>
                <p className="text-sm font-semibold text-ivory">Udia</p>
                <p className="text-[11px] uppercase tracking-wider text-ivory/60">
                  Affy&rsquo;s food guide
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-soft/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Online
            </span>
          </div>

          {/* Conversation */}
          <div className="mt-5 space-y-4">
            {/* User msg */}
            <div className="flex justify-end">
              <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-gold px-4 py-2.5 text-sm text-espresso">
                Birthday dinner for 8. Something with jollof and suya.
              </p>
            </div>

            {/* Udia reply */}
            <div className="flex gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-espresso text-[11px] font-bold">
                U
              </span>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-ivory/10 bg-ivory/5 px-4 py-3 text-sm text-ivory">
                <p>Lovely. Here&rsquo;s a starter for 8, adjust anything:</p>
                <ul className="mt-3 space-y-2">
                  {[
                    { name: "Smoky party jollof, large tray", qty: "×1", price: "€48" },
                    { name: "Suya skewers", qty: "×16", price: "€56" },
                    { name: "Plantain (dodo)", qty: "×8", price: "€16" },
                    { name: "Small chops platter", qty: "×1", price: "€28" },
                  ].map((line) => (
                    <li
                      key={line.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-ivory/10 bg-espresso/60 px-3 py-2"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-ivory/90">{line.name}</span>
                        <span className="text-[11px] text-ivory/50">{line.qty}</span>
                      </span>
                      <span className="text-xs font-medium text-gold">{line.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-gold/15 px-3 py-2 text-xs">
                  <span className="text-ivory/80">Estimated total</span>
                  <span className="font-display text-base font-semibold text-gold">€148</span>
                </div>
              </div>
            </div>

            {/* Udia follow-up */}
            <div className="flex gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-espresso text-[11px] font-bold">
                U
              </span>
              <p className="max-w-[80%] rounded-2xl rounded-tl-sm border border-ivory/10 bg-ivory/5 px-4 py-2.5 text-sm text-ivory/90">
                Pickup or delivery? And what time on the day?
              </p>
            </div>

            {/* Typing */}
            <div className="flex items-center gap-2 pl-9 text-[11px] text-ivory/50">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0.3s" }} />
              </span>
              <span>Udia is preparing your summary…</span>
            </div>
          </div>

          {/* Try-saying chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "Sunday dinner for 4 with jollof",
              "Office lunch for 25, €15 a head",
              "Naming ceremony for 80",
              "I need food for Portimão",
              "Help me choose soup & swallow",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="rounded-full border border-ivory/15 bg-ivory/5 px-3 py-1 text-[11px] text-ivory/70 transition-colors hover:border-gold/50 hover:text-ivory"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="mt-3 flex items-center gap-2 rounded-full border border-ivory/15 bg-ivory/5 px-3 py-2">
            <span className="text-ivory/40" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 19v3M5 9a7 7 0 0 0 14 0M12 16a7 7 0 0 1-7-7V8a7 7 0 0 1 14 0v1a7 7 0 0 1-7 7Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="flex-1 text-sm text-ivory/40">
              Tell Udia what you&rsquo;re craving…
            </span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-espresso">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l14-7-7 14-2-5-5-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
