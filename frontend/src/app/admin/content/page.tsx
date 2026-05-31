import { Pencil, Image as ImageIcon, Sparkles } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import StatusPill from "@/components/admin/StatusPill";
import { CONTENT_BLOCKS, BLOG_POSTS } from "@/components/admin/mock-data";

export default function ContentManagerPage() {
  return (
    <>
      <Topbar
        title="Content manager"
        subtitle="Homepage hero, this-week featured, announcement banner, Udia toggle, and blog posts."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        {/* Content blocks */}
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-espresso">Homepage blocks</h2>
            <p className="text-xs text-foreground-subtle">
              These power the live hero, This-Week card, banner, and Udia visibility.
            </p>
          </header>
          <ul className="divide-y divide-border">
            {CONTENT_BLOCKS.map((b) => (
              <li key={b.key} className="flex items-start gap-4 px-5 py-4">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream-deep text-foreground-muted">
                  {b.type === "image" || b.type === "video" ? (
                    <ImageIcon size={14} />
                  ) : b.type === "toggle" ? (
                    <Sparkles size={14} />
                  ) : (
                    <Pencil size={14} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-sm font-semibold text-espresso">{b.label}</p>
                    <span className="font-mono text-[10px] text-foreground-subtle">{b.key}</span>
                  </div>
                  {b.description && (
                    <p className="mt-0.5 text-[11px] text-foreground-subtle">{b.description}</p>
                  )}
                  {b.type === "toggle" ? (
                    <div className="mt-2.5 flex items-center gap-3">
                      <label className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full ${b.value ? "bg-forest" : "bg-border-strong"}`}>
                        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm ${b.value ? "ml-5" : "ml-0.5"}`} />
                      </label>
                      <span className="text-xs font-semibold text-foreground-muted">
                        {b.value ? "On" : "Off"}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 rounded-lg border border-border bg-cream px-3 py-2 text-sm text-foreground-muted">
                      {b.value === "" ? <span className="italic text-foreground-subtle">,  empty , </span> : String(b.value)}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={`Edit ${b.label}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-espresso hover:border-espresso transition-colors"
                >
                  <Pencil size={13} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Blog posts */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-espresso">Blog posts</h2>
              <p className="text-xs text-foreground-subtle">
                Drafts and published posts shown in &ldquo;Blogs from the kitchen&rdquo;.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-full bg-espresso px-4 text-sm font-semibold text-ivory hover:bg-gold hover:text-espresso transition-colors"
            >
              New post
            </button>
          </header>
          <table className="w-full text-sm">
            <thead className="bg-cream/60 text-[10px] uppercase tracking-wider text-foreground-subtle">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Title</th>
                <th className="px-5 py-3 text-left font-medium">Category</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Published</th>
                <th className="px-5 py-3 text-right font-medium">Read time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BLOG_POSTS.map((p) => (
                <tr key={p.id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-espresso">{p.title}</p>
                    <p className="font-mono text-[11px] text-foreground-subtle">/blog/{p.slug}</p>
                  </td>
                  <td className="px-5 py-3.5 text-foreground-muted">{p.category}</td>
                  <td className="px-5 py-3.5">
                    <StatusPill
                      label={p.status}
                      tone={p.status === "published" ? "green" : p.status === "scheduled" ? "amber" : "neutral"}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-foreground-muted">{p.publishedAt ?? ", "}</td>
                  <td className="px-5 py-3.5 text-right text-foreground-muted">{p.readMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
