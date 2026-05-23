/**
 * Portimão campaign — single source of truth.
 *
 * Toggle these values to control the public Portimão experience.
 * Eventually this will be wired to admin-controlled state in the backend.
 */

export type PortimaoStatus =
  | "live"        // Campaign active, accepting orders
  | "sold-out"    // Campaign live but daily slots full
  | "off-season"; // Campaign not active

export const PORTIMAO_STATUS: PortimaoStatus = "live";

export const PORTIMAO = {
  // Campaign meta
  // NOTE: these are display strings only. The real open/close window is set in
  // the admin Portimão control (store_settings → portimao_start / portimao_end).
  campaignName: "Afro Nation week 2026",
  campaignWindow: "Jul 2 — Jul 6, 2026",
  campaignWindowShort: "Thurs 2 — Mon 6 July",

  // Order deadlines / windows (Afro Nation is 3–5 July; we sell 2–6 July)
  preorderDeadline: "Thursday (2 July) · 10:00 WET",
  deliveryStart: "Preorder pickup starts Thursday (2 July) · 10:00 WET",
  pickupWindow: "Thurs (2 July) — Mon (6 July) · Rua da Pedra",
  pickupLocation: "Rua da Pedra, Portimão",
  pickupNote: "Exact pickup point sent by email after we confirm.",

  /**
   * Capacity / live slot count.
   *
   * TODO (backend): wire `slotsLeftToday` to a real source instead of a
   * static value. Options when the backend lands:
   *
   *   (a) Supabase + realtime — single source of truth in the orders
   *       table, listen to insert/delete events to recompute remaining
   *       slots, push to all connected clients instantly. Cleanest.
   *
   *   (b) Polling — a /api/portimao/slots endpoint returns the current
   *       remaining count, the page revalidates every 30–60s. Good
   *       enough for non-realtime needs.
   *
   *   (c) Manual admin toggle — Affy updates the count from the admin
   *       dashboard. Lowest infra, but stale.
   *
   * Uber Eats orders won't surface in the count automatically — those
   * are separate. We only track Affy's-direct preorder slots here.
   */
  slotsPerDay: 80,
  slotsLeftToday: 28,

  // Channels
  affysSiteLabel: "Preorder direct",
  uberEatsHref: "https://ubereats.com/", // replace with real Affy's UE store URL
  uberEatsHours: "Sat & Sun · 13:00 — 23:00",
  whatsappHref: "https://wa.me/351914145519",

  // Pricing range hint
  bowlPriceFrom: "€19",
  bowlPriceTo: "€22",
};

export interface FestivalItem {
  name: string;
  description: string;
  priceFrom: string;
  category: "Bowl" | "Side" | "Snack box";
  tag?: string;
  initial: string;
}

export const FESTIVAL_MENU: FestivalItem[] = [
  // Bowls
  {
    category: "Bowl",
    name: "Jollof Special",
    description: "Smoky party jollof with a proper protein cut and the works.",
    priceFrom: "From €19",
    tag: "Most ordered",
    initial: "J",
  },
  {
    category: "Bowl",
    name: "Jollof Supreme",
    description: "Jollof loaded — bigger portion, extra protein, fully dressed.",
    priceFrom: "From €22",
    tag: "Premium",
    initial: "J",
  },
  {
    category: "Bowl",
    name: "Vegetable Bowl",
    description: "Mixed seasonal vegetables with a generous helping of jollof.",
    priceFrom: "From €17",
    initial: "V",
  },

  // Sides
  {
    category: "Side",
    name: "Coleslaw",
    description: "Classic, fresh, the right amount of crunch.",
    priceFrom: "€4",
    initial: "C",
  },
  {
    category: "Side",
    name: "Pepper sauce",
    description: "House-blend scotch bonnet sauce. As fierce as you want it.",
    priceFrom: "€4",
    initial: "P",
  },

  // Snack boxes
  {
    category: "Snack box",
    name: "Chop Life · Small",
    description: "Pick-and-mix small chops box for one — quick festival fuel.",
    priceFrom: "From €10",
    tag: "On the go",
    initial: "C",
  },
  {
    category: "Snack box",
    name: "Chop Life · Medium",
    description: "Bigger small chops box for sharing — pastries, puff puff, more.",
    priceFrom: "From €18",
    tag: "Sharing",
    initial: "C",
  },
];

export interface FAQ {
  q: string;
  a: string;
}

export const PORTIMAO_FAQS: FAQ[] = [
  {
    q: "How do I actually preorder?",
    a: "Use the form on this page (or Ask Udia). Submit your order, we confirm by email and phone, then we send a Stripe payment link. Once paid, your slot is locked.",
  },
  {
    q: "What's the difference between preordering here and Uber Eats?",
    a: "Affy's direct is pickup-only with a confirmed slot — best for groups, large orders, or specific times. Uber Eats is live during festival hours for walk-up speed and delivery options.",
  },
  {
    q: "Can I get delivery in Portimão?",
    a: "Direct preorders through this site are pickup-only. For delivery during the festival, please order through Uber Eats during opening hours.",
  },
  {
    q: "What if my slot sells out?",
    a: "We open a waitlist when daily slots fill. We'll message you the moment a slot opens — usually due to a cancellation.",
  },
  {
    q: "What if I don't eat meat?",
    a: "We have a Vegetable Bowl — mixed seasonal vegetables with jollof. For specific dietary needs (e.g. no fish, no dairy), flag it in the order notes or message us on WhatsApp.",
  },
  {
    q: "Where exactly is the pickup point?",
    a: "Praia da Rocha, Portimão. The exact spot is sent by email after we confirm your order — it can change slightly day to day during the festival.",
  },
  {
    q: "How spicy is the food?",
    a: "Spice levels vary by dish. Most are medium-spiced. We can dial up or down — just say in the order notes or to Udia.",
  },
  {
    q: "What's the refund policy?",
    a: "We refund unused slots cancelled 24h before pickup. After that, we'll do our best to reschedule — full refunds aren't possible because the food is already prepped.",
  },
];
