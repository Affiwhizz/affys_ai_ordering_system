import Link from "next/link";
import Logo from "./Logo";
import { AzulejoStrip } from "./Azulejo";
import FooterLegal from "@/components/legal/FooterLegal";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Order",
    links: [
      { label: "Menu", href: "#menu" },
      { label: "Ask Udia", href: "#udia" },
      { label: "Quick form", href: "#order" },
      { label: "Portimão preorder", href: "#portimao" },
      { label: "Catering quote", href: "#catering" },
    ],
  },
  {
    title: "Affy's",
    links: [
      { label: "Our story", href: "#story" },
      { label: "Pop-ups", href: "#catering" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Contact us", href: "mailto:hello@atasteofaffy.com" },
      { label: "Order status", href: "#" },
      { label: "Allergy notice", href: "#" },
      { label: "Refund policy", href: "#" },
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

export default function Footer() {
  return (
    <footer className="relative bg-espresso text-ivory">
      <AzulejoStrip className="w-full" height={36} tone="forest" />

      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
              Modern Nigerian, made in Portugal. Slow-cooked, hand-pounded,
              and brought to your table with the kind of care food deserves.
            </p>

            {/* Hours / location */}
            <dl className="mt-7 grid grid-cols-2 gap-6 max-w-sm">
              <div>
                <dt className="eyebrow text-gold">Kitchen hours</dt>
                <dd className="mt-2 text-sm text-ivory/85">
                  Wed — Sun
                  <br />
                  By preorder · 24h notice
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-gold">Based in</dt>
                <dd className="mt-2 text-sm text-ivory/85">
                  Lisbon, Portugal
                </dd>
                <dt className="eyebrow text-gold mt-4">Pickup &amp; delivery zones</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ivory/85">
                  Lisbon Centre · Amadora · Odivelas · Loures · Sintra ·
                  Cascais · Rest of Portugal (30+ km via Rodomail)
                </dd>
              </div>
            </dl>

            {/* Direct contact */}
            <div className="mt-7">
              <p className="eyebrow text-gold">Say hello</p>
              <a
                href="mailto:hello@atasteofaffy.com"
                className="mt-2 inline-block text-sm text-ivory underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
              >
                hello@atasteofaffy.com
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-all hover:border-gold hover:bg-gold hover:text-espresso hover:-translate-y-0.5"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow text-gold">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-ivory/75 transition-colors hover:text-ivory"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 border-t border-ivory/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ivory/55">
            Copyright © {new Date().getFullYear()} Affy&rsquo;s. All rights reserved.
          </p>
          <FooterLegal />
        </div>
      </div>
    </footer>
  );
}
