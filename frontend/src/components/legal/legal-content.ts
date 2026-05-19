/**
 * Placeholder legal content for the website's Privacy / Terms / Cookies
 * modals. This is a first-draft, GDPR-mindful baseline — review and tailor
 * with a lawyer before launch, especially around data retention, transfers,
 * and any specifics about payment processors and third parties used.
 */

export type LegalTopic =
  | "privacy"
  | "terms"
  | "cookies"
  | "accessibility"
  | "refunds"
  | "allergy";

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

export const LEGAL_DOCS: Record<LegalTopic, LegalDocument> = {
  privacy: {
    title: "Privacy policy",
    intro:
      "This policy explains what personal data Affy's collects, why we collect it, how long we keep it, and your rights under the GDPR.",
    updated: "Updated May 2026",
    sections: [
      {
        heading: "Who we are",
        body: [
          "Affy's is a small Nigerian food brand based in Lisbon, Portugal, trading as atasteofaffy.com. You can reach us anytime at hello@atasteofaffy.com.",
        ],
      },
      {
        heading: "What we collect",
        body: [
          "When you place an order: your name, phone, email, pickup or delivery address, and what you ordered. When you contact us: the message you send and the channel you used (email, WhatsApp, Instagram). When you visit the site: standard request logs (IP, browser, page) and the cookies you've consented to.",
          "We don't ask for or store anything sensitive — no health data, no payment card details (Stripe handles payment, not us).",
        ],
      },
      {
        heading: "Why we collect it",
        body: [
          "To fulfil your order, confirm details with you, prepare the food, and get it to you. To improve the site and menu based on what's working. To send transactional emails (order confirmations, payment links). To comply with tax and accounting obligations.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Order records — 7 years (Portuguese accounting requirement). Customer contact details — until you ask us to delete them or 3 years after your last order, whichever is sooner. Cookies — see the cookie policy.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Stripe (payments), Uber Eats and our delivery couriers (when relevant to your order), Rodomail (when shipping outside Lisbon). We don't sell your data to anyone.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can access, correct, export, or delete your data anytime by emailing hello@atasteofaffy.com. You also have the right to lodge a complaint with the Portuguese data protection authority (CNPD).",
        ],
      },
    ],
  },

  terms: {
    title: "Terms & conditions",
    intro:
      "Plain-language terms covering how ordering, pickup, delivery, payment, allergies, and cancellations work with Affy's.",
    updated: "Updated May 2026",
    sections: [
      {
        heading: "Placing an order",
        body: [
          "You can preorder through this site (Ask Udia or the quick form), through our Uber Eats store during festival windows, or at our pop-ups. A submitted preorder is a request — your slot is locked once we confirm details and you pay via the Stripe link we send.",
        ],
      },
      {
        heading: "Pricing & payment",
        body: [
          "All prices include VAT where applicable. Payment is taken via Stripe; cards, Apple Pay, and Google Pay are accepted. We don't store your card details.",
        ],
      },
      {
        heading: "Pickup & delivery",
        body: [
          "Direct preorders through this site are pickup-only at the address we confirm. Delivery is available in selected zones via Uber/Bolt courier (Lisbon) or Rodomail (rest of Portugal) — fees and lead times depend on your area and are quoted before payment.",
        ],
      },
      {
        heading: "Allergies & dietary needs",
        body: [
          "Tell us about allergies and dietary requirements in your order. Our kitchen handles common allergens (gluten, peanut, soy, dairy, shellfish) — we can't guarantee a zero-trace environment but we'll do our best to accommodate.",
        ],
      },
      {
        heading: "Cancellations & refunds",
        body: [
          "Cancel 24h before your pickup window for a full refund. Within 24h, we'll do our best to reschedule — full refunds aren't possible because the food is already prepped.",
        ],
      },
      {
        heading: "Catering",
        body: [
          "Catering orders are confirmed in writing (email or WhatsApp). A 50% deposit secures the booking; the balance is due 7 days before the event. Cancellations 14+ days out are fully refundable; 7–14 days, the deposit is retained; under 7 days, the full amount stands.",
        ],
      },
    ],
  },

  cookies: {
    title: "Cookie policy",
    intro:
      "We use a few essential cookies to make the site work, plus optional analytics and marketing cookies (only with your consent).",
    updated: "Updated May 2026",
    sections: [
      {
        heading: "Essential cookies",
        body: [
          "Required for the site to function. These handle your session, security tokens, language preference, and the cookie consent itself. They can't be turned off.",
        ],
      },
      {
        heading: "Analytics cookies",
        body: [
          "Anonymous data on which pages and dishes are most useful — helps us improve. These only run if you accept analytics in the consent banner.",
        ],
      },
      {
        heading: "Marketing cookies",
        body: [
          "Used for personalized content and ads on platforms like Instagram and Facebook. Off by default — only run if you opt in.",
        ],
      },
      {
        heading: "Changing your choice",
        body: [
          "Click the cookies link in the footer at any time to re-open the preferences panel and update your choice.",
        ],
      },
    ],
  },

  accessibility: {
    title: "Accessibility statement",
    intro:
      "Affy's is committed to making atasteofaffy.com usable for everyone, including people with visual, motor, cognitive, or hearing differences.",
    updated: "Updated May 2026",
    sections: [
      {
        heading: "Our goal",
        body: [
          "We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. That means people using screen readers, keyboard-only navigation, voice control, magnifiers, or reduced-motion settings should be able to browse the menu, place an order, and contact us comfortably.",
        ],
      },
      {
        heading: "What we've built in",
        body: [
          "Semantic HTML (headings, landmarks, lists) so screen readers can navigate the page structure. Visible keyboard focus rings on links, buttons, and form fields. Sufficient colour contrast for body text and interactive elements. Alt text on meaningful images (and empty alt where the image is decorative). Forms are labelled and announce errors clearly. Animations honour the user's `prefers-reduced-motion` setting where applicable.",
        ],
      },
      {
        heading: "Known gaps we're still working on",
        body: [
          "Some decorative gradients and food backgrounds don't yet have AAA-level contrast for embedded captions. We're improving photo alt text as new images go live. The Ask Udia chat assistant is still in development and will be tested with screen readers before it ships.",
        ],
      },
      {
        heading: "Tell us if something isn't working",
        body: [
          "If you hit a barrier — anything from a button you can't reach by keyboard to text you can't read at your zoom level — please email hello@atasteofaffy.com with the page, the device/browser, and a quick description. We'll fix it.",
        ],
      },
    ],
  },

  refunds: {
    title: "Refund policy",
    intro:
      "How refunds work for direct preorders, catering bookings, and Portimão festival orders.",
    updated: "Updated May 2026",
    sections: [
      {
        heading: "Direct preorders (weekly menu)",
        body: [
          "Cancel 24 hours or more before your pickup window for a full refund. Cancellations under 24 hours can't be fully refunded because the food is already shopped and prepped — but we'll try to reschedule the slot. Refunds are returned via the original payment method (Stripe or bank transfer) within 5 working days.",
        ],
      },
      {
        heading: "Catering orders",
        body: [
          "A 50% deposit secures the booking; the balance is due 7 days before the event.",
          "Cancellations 14+ days out are fully refundable (deposit included). 7–14 days out, the deposit is retained and the balance is refunded. Under 7 days, the full amount stands — but we'll do our best to shift the booking to a new date if you'd like.",
        ],
      },
      {
        heading: "Portimão festival preorders",
        body: [
          "Cancel 24 hours or more before your pickup slot for a full refund. After that, we'll try to move you to another slot inside the festival window or, if that isn't possible, retain the order value as credit toward a future Affy's order.",
        ],
      },
      {
        heading: "If your order arrives wrong or late",
        body: [
          "Tell us within 24 hours (hello@atasteofaffy.com or WhatsApp) with a photo if relevant. We'll either remake the order, deliver the missing item, or refund the affected portion — your choice.",
        ],
      },
      {
        heading: "Quality issues",
        body: [
          "We cook every order to order. If the food isn't right (cold, undercooked, the wrong dish, etc.) let us know the same day and we'll make it right.",
        ],
      },
    ],
  },

  allergy: {
    title: "Allergy notice",
    intro:
      "Important information about ingredients, cross-contact, and how to flag dietary needs when you order.",
    updated: "Updated May 2026",
    sections: [
      {
        heading: "Common allergens in our kitchen",
        body: [
          "Our cooking regularly involves: peanuts and groundnut oil (notably in suya and some stews), tree nuts, sesame (egusi), gluten (small chops, dodo coatings), egg (puff puff, batters), dairy (some sides and drinks), shellfish (occasional pepper soup), fish, and soy.",
          "Many of our recipes use scotch bonnet and yaji spice blends. If you're sensitive to capsaicin, please tell us — we can lower the heat.",
        ],
      },
      {
        heading: "Cross-contact",
        body: [
          "We share prep surfaces, fryers, and utensils across dishes. We do our best to clean down between allergen-sensitive orders, but we can't guarantee a fully allergen-free environment. Customers with severe allergies (anaphylaxis-risk) should order with that in mind.",
        ],
      },
      {
        heading: "How to flag your needs",
        body: [
          "Tell us about allergies and dietary needs in the order notes when you place an order, or message Udia about it (when available). For catering, share allergy info at the inquiry stage so we can plan the menu around it.",
          "If you need a specific dish modified (no peanuts, no dairy, gluten-free, halal), say so — we'll let you know if we can do it safely.",
        ],
      },
      {
        heading: "We're not a clinical kitchen",
        body: [
          "Affy's cooks with care and disclosure, but we're a small kitchen and pop-up — not a medical-grade allergen-free environment. The final responsibility for an order being safe for severe allergies rests with the customer; please ask us anything you need before ordering.",
        ],
      },
    ],
  },
};
