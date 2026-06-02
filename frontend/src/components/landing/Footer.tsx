import Link from "next/link";
import Logo from "./Logo";
import FooterLegal from "@/components/legal/FooterLegal";
import LegalLink from "@/components/legal/LegalLink";
import type { LegalTopic } from "@/components/legal/legal-content";

// A footer link can be either a regular href or a trigger that opens the
// LegalModal via the global provider (no scroll-to-top jolt).
type FooterLink =
  | { label: string; href: string }
  | { label: string; legal: LegalTopic };

// Two short columns on mobile fit cleanly inside one viewport. The desktop
// view still gets the full quick-nav grid via lg: classes.
const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Order",
    links: [
      { label: "Menu", href: "/menu" },
      { label: "Catering", href: "/#catering" },
      { label: "Portimão", href: "/portimao" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "mailto:hello@atasteofaffys.com" },
      { label: "Allergy notice", legal: "allergy" },
      { label: "Refund policy", legal: "refunds" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/_affys",
    icon: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.75-1.25a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@_affys",
    icon: "M14 3v9a3.5 3.5 0 1 1-3.5-3.5h.5V12a1 1 0 1 0 1 1V3h2c.4 2 1.8 3.5 4 4v2c-1.6-.1-3-.6-4-1.4Z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/atasteofaffys",
    icon: "M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10.9H7.7V14h2.7v8h3.1Z",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/351914145519",
    icon: "M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.4 13.6c-.3.7-1.4 1.3-2 1.4-.5.1-1.2.2-3.6-.7a13 13 0 0 1-5.5-4.5c-.4-.6-1.1-1.7-1.1-3.2 0-1.5.8-2.2 1.1-2.5.3-.3.6-.4 1-.4h.6c.3 0 .6 0 .8.6l1 2.4c.1.2.1.4 0 .6l-.4.4-.4.4c-.1.1-.3.2-.1.5.2.3.9 1.5 2 2.5 1.4 1.2 2.6 1.6 2.9 1.7.3.1.5.1.7-.1l.9-1c.2-.3.5-.2.8-.1l2.3 1.1c.3.1.6.2.7.4.1.2.1.9-.1 1.5Z",
  },
];

/**
 * Footer.
 *
 * Mobile target: fits inside ONE viewport (no double scroll). The bento-style
 * layout puts logo + tagline at the top, the two quick-link columns side by
 * side below the brand, contact + social side by side underneath, and a tight
 * legal row at the very bottom.
 *
 * Desktop layout is broader: brand block on the left, quick-link columns on
 * the right, contact + socials below the brand, legal row at the bottom.
 */
export default function Footer() {
  return (
    <footer className="relative bg-espresso text-ivory">
      <div className="container-x py-6 md:py-12">
        {/* Top bento row */}
        <div className="grid gap-6 md:grid-cols-[1.2fr_2fr] md:gap-12">
          {/* Brand + tagline */}
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-ivory/70 md:mt-5 md:text-sm">
              Nigerian meals, made in Portugal. Slow-cooked, hand-pounded,
              brought to your table.
            </p>
          </div>

          {/* Quick links — 2 columns on mobile + desktop */}
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  {col.title}
                </h3>
                <ul className="mt-2 space-y-1.5 md:mt-4 md:space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {"legal" in l ? (
                        <LegalLink topic={l.legal} label={l.label} />
                      ) : (
                        <Link
                          href={l.href}
                          className="text-xs text-ivory/75 transition-colors hover:text-ivory md:text-sm"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact + socials row */}
        <div className="mt-5 grid grid-cols-2 items-start gap-4 md:mt-8 md:gap-12">
          {/* Hours + based-in (compact two-up) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Hours</p>
              <p className="mt-1 text-xs leading-snug text-ivory/85 md:text-sm">
                Wed to Sun<br />By preorder
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Based in</p>
              <p className="mt-1 text-xs text-ivory/85 md:text-sm">Lisbon, Portugal</p>
            </div>
          </div>

          {/* Contact email + socials */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">Say hello</p>
            <a
              href="mailto:hello@atasteofaffys.com"
              className="mt-1 inline-block text-xs text-ivory underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold md:text-sm"
            >
              hello@atasteofaffys.com
            </a>
            <div className="mt-2 flex flex-wrap gap-1.5 md:mt-3 md:gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-all hover:border-gold hover:bg-gold hover:text-espresso md:h-10 md:w-10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="md:h-[18px] md:w-[18px]">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal strip */}
        <div className="mt-5 flex flex-col items-start gap-2 border-t border-ivory/10 pt-3 sm:flex-row sm:items-center sm:justify-between md:mt-8 md:pt-5">
          <p className="text-[10px] text-ivory/55 md:text-xs">
            &copy; {new Date().getFullYear()} Affy&rsquo;s. All rights reserved.
          </p>
          <FooterLegal />
        </div>
      </div>
    </footer>
  );
}
