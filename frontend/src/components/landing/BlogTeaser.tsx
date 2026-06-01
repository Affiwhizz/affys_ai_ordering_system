import { FadeIn, MotionCard, RevealHeading } from "@/components/motion";

/**
 * Placeholder blog posts. Replace with real content when the blog is wired.
 * Slugs point to /blog/[slug] (route to be built in a future phase).
 */
interface Post {
  slug: string;
  category: string;
  date: string;       // already-formatted display string
  readMinutes: number;
  title: string;
  excerpt: string;
  initial: string;
  bg: string;         // gradient classes (matches dish-card style)
}

const POSTS: Post[] = [
  {
    slug: "how-much-food-to-order-for-a-party",
    category: "Catering",
    date: "May 2 · 2026",
    readMinutes: 5,
    title: "How much food to order for a party",
    excerpt:
      "A simple rule of thumb for jollof, proteins, sides, and small chops, sized to your guest count and time of day.",
    initial: "P",
    bg: "from-red via-red-soft to-espresso",
  },
  {
    slug: "what-to-serve-at-a-naming-ceremony",
    category: "Traditions",
    date: "Apr 24 · 2026",
    readMinutes: 6,
    title: "What to serve at a Nigerian naming ceremony",
    excerpt:
      "From small chops to the main spread, here’s how we plan the menu for naming ceremonies, what to feed kids, elders, and the in-laws.",
    initial: "N",
    bg: "from-forest via-forest-soft to-espresso",
  },
  {
    slug: "behind-the-menu-this-weeks-drop",
    category: "Kitchen notes",
    date: "Apr 18 · 2026",
    readMinutes: 3,
    title: "Behind the menu: this week’s drop",
    excerpt:
      "What’s cooking on Friday, what’s changed since last week, and a quick word on where the suya beef came from.",
    initial: "K",
    bg: "from-espresso via-red to-gold",
  },
];

export default function BlogTeaser() {
  return (
    <section
      id="blog"
      aria-label="From Affy's kitchen"
      className="relative py-10 md:py-32 bg-surface-warm border-y border-border"
    >
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <FadeIn delay={0.05} y={12}>
              <span className="eyebrow inline-flex items-center">
                <span className="gold-rule" />
                Blogs from the kitchen
                <span className="gold-rule-after" />
              </span>
            </FadeIn>
            <RevealHeading
              as="h2"
              delay={0.15}
              className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-espresso sm:text-5xl"
              tokens={[
                "Notes,",
                "guides,",
                "and",
                <span key="ital" className="italic text-red">
                  the stories
                </span>,
                "behind",
                "the",
                "menu.",
              ]}
            />
          </div>
          <FadeIn delay={0.4}>
            {/* Blog system is on the roadmap. Show a non-link label here
                so the section doesn't have a dead button. Swap back to a
                <Link href="/blog"> once the blog routes ship. */}
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-espresso">
              Blog launching soon
            </span>
          </FadeIn>
        </div>

        {/* Posts grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3" role="list">
          {POSTS.map((p, i) => (
            <FadeIn key={p.slug} delay={0.5 + i * 0.1} y={20}>
              <MotionCard
                lift={-6}
                className="group h-full overflow-hidden rounded-3xl border border-border bg-surface transition-colors hover:border-gold/50 hover:shadow-luxe"
              >
                {/* Cards are visual previews until the blog routes ship; no
                    Link wrapper so they don't navigate to a dead URL. */}
                <div className="flex h-full flex-col">
                  {/* Cover */}
                  <div
                    className={`relative h-48 overflow-hidden bg-gradient-to-br ${p.bg}`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center font-display text-[7rem] leading-none text-gold/85 transition-transform duration-500 group-hover:scale-105" aria-hidden>
                      {p.initial}
                    </span>
                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-espresso">
                      {p.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                      <span>{p.date}</span>
                      <span aria-hidden>·</span>
                      <span>{p.readMinutes} min read</span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-tight tracking-tight text-espresso">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-muted">
                      {p.excerpt}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-subtle">
                      Coming soon
                    </span>
                  </div>
                </div>
              </MotionCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
