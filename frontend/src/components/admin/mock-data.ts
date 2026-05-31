/**
 * Mock data for the admin scaffolding. UI-only, wire to Supabase/API later.
 *
 * Shapes here roughly match what the eventual backend will return. When you
 * connect a real data source, replace each export below with a fetch/query
 * that returns the same shape and the admin pages keep working.
 */

// ===========================================================================
// Orders
// ===========================================================================

export type OrderChannel = "udia" | "form" | "portimao";
export type OrderStatus =
  | "new"          // submitted, awaiting confirmation
  | "confirmed"    // confirmed, awaiting payment
  | "paid"         // payment received
  | "preparing"    // in the kitchen
  | "ready"        // ready for pickup / out for delivery
  | "completed"    // delivered / picked up
  | "cancelled";

export type OrderFulfilment = "pickup" | "delivery";

export interface Order {
  id: string;
  channel: OrderChannel;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: { name: string; qty: number; price: number }[];
  total: number;
  fulfilment: OrderFulfilment;
  scheduledFor: string; // ISO date+time
  address?: string;
  notes?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  submittedAt: string; // ISO
}

export const ORDERS: Order[] = [
  {
    id: "AFF-1042",
    channel: "udia",
    status: "new",
    customer: { name: "Tomi Adeyemi", phone: "+351 912 345 678", email: "tomi@example.com" },
    items: [
      { name: "Smoky party jollof", qty: 2, price: 28 },
      { name: "Suya skewers", qty: 8, price: 14 },
      { name: "Plantain (dodo)", qty: 4, price: 4 },
    ],
    total: 184,
    fulfilment: "pickup",
    scheduledFor: "2026-05-09T19:30:00",
    notes: "Birthday dinner for 8, medium spice please.",
    paymentStatus: "pending",
    submittedAt: "2026-05-07T14:12:00",
  },
  {
    id: "AFF-1041",
    channel: "form",
    status: "paid",
    customer: { name: "Sofia Martins", phone: "+351 967 234 891", email: "sofia.m@example.com" },
    items: [
      { name: "Egusi & pounded yam", qty: 1, price: 16 },
      { name: "Pepper soup (goat)", qty: 1, price: 15 },
    ],
    total: 31,
    fulfilment: "pickup",
    scheduledFor: "2026-05-08T13:00:00",
    paymentStatus: "paid",
    submittedAt: "2026-05-07T11:48:00",
  },
  {
    id: "AFF-1040",
    channel: "portimao",
    status: "paid",
    customer: { name: "James O.", phone: "+351 919 887 102", email: "j.o@example.com" },
    items: [
      { name: "Jollof + jerk chicken bowl", qty: 2, price: 12 },
      { name: "Zobo", qty: 2, price: 3.5 },
    ],
    total: 31,
    fulfilment: "pickup",
    scheduledFor: "2026-07-05T14:30:00",
    notes: "Pickup at Praia da Rocha point.",
    paymentStatus: "paid",
    submittedAt: "2026-05-07T10:22:00",
  },
  {
    id: "AFF-1039",
    channel: "form",
    status: "preparing",
    customer: { name: "Adaeze Nwosu", phone: "+351 938 412 005", email: "adaeze@example.com" },
    items: [
      { name: "Small chops platter", qty: 1, price: 28 },
      { name: "Suya skewers", qty: 4, price: 14 },
    ],
    total: 42,
    fulfilment: "delivery",
    scheduledFor: "2026-05-07T19:00:00",
    address: "Avenida da Liberdade 32, Lisboa",
    paymentStatus: "paid",
    submittedAt: "2026-05-07T09:01:00",
  },
  {
    id: "AFF-1038",
    channel: "udia",
    status: "confirmed",
    customer: { name: "Henrique Costa", phone: "+351 925 100 042", email: "h.costa@example.com" },
    items: [
      { name: "Pepper rice + fried fish", qty: 3, price: 13 },
      { name: "Plantain (dodo)", qty: 3, price: 4 },
    ],
    total: 51,
    fulfilment: "pickup",
    scheduledFor: "2026-05-09T13:30:00",
    paymentStatus: "pending",
    submittedAt: "2026-05-07T08:47:00",
  },
  {
    id: "AFF-1037",
    channel: "portimao",
    status: "new",
    customer: { name: "Marta Pereira", phone: "+351 914 738 221", email: "marta.p@example.com" },
    items: [
      { name: "Vegetable bowl", qty: 4, price: 17 },
      { name: "Pepper sauce (bottle)", qty: 2, price: 4 },
    ],
    total: 52,
    fulfilment: "pickup",
    scheduledFor: "2026-07-04T15:00:00",
    paymentStatus: "pending",
    submittedAt: "2026-05-06T22:10:00",
  },
  {
    id: "AFF-1036",
    channel: "form",
    status: "completed",
    customer: { name: "Tunde Adekunle", phone: "+351 968 102 553", email: "t.adekunle@example.com" },
    items: [
      { name: "Smoky party jollof", qty: 1, price: 28 },
      { name: "Asun (peppered goat)", qty: 1, price: 16 },
    ],
    total: 44,
    fulfilment: "pickup",
    scheduledFor: "2026-05-05T19:00:00",
    paymentStatus: "paid",
    submittedAt: "2026-05-04T15:32:00",
  },
  {
    id: "AFF-1035",
    channel: "udia",
    status: "ready",
    customer: { name: "Catarina Silva", phone: "+351 932 408 119", email: "c.silva@example.com" },
    items: [
      { name: "Suya skewers", qty: 6, price: 14 },
      { name: "Moin moin", qty: 4, price: 5 },
      { name: "Zobo", qty: 2, price: 3.5 },
    ],
    total: 111,
    fulfilment: "delivery",
    scheduledFor: "2026-05-07T20:00:00",
    address: "Rua das Janelas Verdes 18, Lisboa",
    paymentStatus: "paid",
    submittedAt: "2026-05-07T07:18:00",
  },
];

// ===========================================================================
// Customers
// ===========================================================================

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  ordersCount: number;
  totalSpend: number;
  lastOrderAt: string;
  isRepeat: boolean;
  notes?: string;
}

export const CUSTOMERS: Customer[] = [
  {
    id: "CUS-0001",
    name: "Tomi Adeyemi",
    phone: "+351 912 345 678",
    email: "tomi@example.com",
    location: "Alvalade, Lisboa",
    ordersCount: 8,
    totalSpend: 612,
    lastOrderAt: "2026-05-07",
    isRepeat: true,
    notes: "Likes party jollof. Birthday in November.",
  },
  {
    id: "CUS-0002",
    name: "Sofia Martins",
    phone: "+351 967 234 891",
    email: "sofia.m@example.com",
    location: "Príncipe Real, Lisboa",
    ordersCount: 3,
    totalSpend: 122,
    lastOrderAt: "2026-05-07",
    isRepeat: true,
  },
  {
    id: "CUS-0003",
    name: "James O.",
    phone: "+351 919 887 102",
    email: "j.o@example.com",
    location: "Portimão",
    ordersCount: 1,
    totalSpend: 31,
    lastOrderAt: "2026-05-07",
    isRepeat: false,
  },
  {
    id: "CUS-0004",
    name: "Adaeze Nwosu",
    phone: "+351 938 412 005",
    email: "adaeze@example.com",
    location: "Avenidas Novas, Lisboa",
    ordersCount: 12,
    totalSpend: 920,
    lastOrderAt: "2026-05-07",
    isRepeat: true,
    notes: "VIP, frequent caterer for office lunches.",
  },
  {
    id: "CUS-0005",
    name: "Henrique Costa",
    phone: "+351 925 100 042",
    email: "h.costa@example.com",
    location: "Cascais",
    ordersCount: 2,
    totalSpend: 78,
    lastOrderAt: "2026-05-07",
    isRepeat: true,
  },
  {
    id: "CUS-0006",
    name: "Marta Pereira",
    phone: "+351 914 738 221",
    email: "marta.p@example.com",
    location: "Faro",
    ordersCount: 1,
    totalSpend: 52,
    lastOrderAt: "2026-05-06",
    isRepeat: false,
  },
  {
    id: "CUS-0007",
    name: "Tunde Adekunle",
    phone: "+351 968 102 553",
    email: "t.adekunle@example.com",
    location: "Alfama, Lisboa",
    ordersCount: 5,
    totalSpend: 230,
    lastOrderAt: "2026-05-05",
    isRepeat: true,
  },
  {
    id: "CUS-0008",
    name: "Catarina Silva",
    phone: "+351 932 408 119",
    email: "c.silva@example.com",
    location: "Lapa, Lisboa",
    ordersCount: 4,
    totalSpend: 311,
    lastOrderAt: "2026-05-07",
    isRepeat: true,
  },
];

// ===========================================================================
// Catering inquiries
// ===========================================================================

export type CateringStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "confirmed"
  | "declined";

export interface CateringInquiry {
  id: string;
  customer: { name: string; phone: string; email: string };
  eventType: string;
  guestCount: number;
  date: string; // ISO date
  location: string;
  budget?: string;
  notes?: string;
  status: CateringStatus;
  submittedAt: string;
  quote?: number;
}

export const CATERING: CateringInquiry[] = [
  {
    id: "CAT-0014",
    customer: { name: "Bunmi A.", phone: "+351 918 332 110", email: "bunmi@example.com" },
    eventType: "Naming ceremony",
    guestCount: 80,
    date: "2026-06-14",
    location: "Cascais",
    budget: "€1,800-€2,500",
    notes: "Wants small chops station and full main spread.",
    status: "new",
    submittedAt: "2026-05-07T11:02:00",
  },
  {
    id: "CAT-0013",
    customer: { name: "Office Manager · Outsystems", phone: "+351 932 010 044", email: "events@outsystems.example" },
    eventType: "Corporate lunch",
    guestCount: 25,
    date: "2026-05-21",
    location: "Lisboa, Parque das Nações",
    budget: "≈ €15 p.p.",
    status: "reviewing",
    submittedAt: "2026-05-06T16:45:00",
  },
  {
    id: "CAT-0012",
    customer: { name: "Daniela & Pedro", phone: "+351 967 510 220", email: "daniela@example.com" },
    eventType: "Wedding",
    guestCount: 180,
    date: "2026-09-12",
    location: "Sintra",
    notes: "Outdoor event. Mixed Portuguese/Nigerian crowd.",
    status: "quoted",
    quote: 6800,
    submittedAt: "2026-05-04T09:18:00",
  },
  {
    id: "CAT-0011",
    customer: { name: "Adeola K.", phone: "+351 925 776 119", email: "ade@example.com" },
    eventType: "Birthday (40th)",
    guestCount: 30,
    date: "2026-05-29",
    location: "Lisboa, Belém",
    budget: "€600-€900",
    status: "confirmed",
    quote: 820,
    submittedAt: "2026-04-28T12:00:00",
  },
  {
    id: "CAT-0010",
    customer: { name: "Marisa F.", phone: "+351 919 200 555", email: "marisa@example.com" },
    eventType: "Christening",
    guestCount: 50,
    date: "2026-05-17",
    location: "Lisboa, Olivais",
    status: "confirmed",
    quote: 1450,
    submittedAt: "2026-04-22T10:05:00",
  },
  {
    id: "CAT-0009",
    customer: { name: "Hugo S.", phone: "+351 968 778 109", email: "hugo@example.com" },
    eventType: "Private dinner",
    guestCount: 12,
    date: "2026-05-10",
    location: "Lisboa, Estrela",
    status: "declined",
    notes: "Out of pickup zone for the date requested.",
    submittedAt: "2026-04-20T19:30:00",
  },
];

// ===========================================================================
// Menu items (admin manageable)
// ===========================================================================

export interface MenuVariant {
  size: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: "Mains" | "Soups & swallow" | "Small chops" | "Sides" | "Drinks" | "Festival bowls";
  description: string;
  variants: MenuVariant[];
  allergens: string[];
  isAvailable: boolean;
  imageUrl: string | null;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "MN-001",
    name: "Smoky party jollof",
    category: "Mains",
    description: "Open-fire rice, scotch bonnet, slow-built tomato base.",
    variants: [
      { size: "2L tray (serves 3-4)", price: 28 },
      { size: "3L tray (serves 5-6)", price: 42 },
      { size: "4L tray (serves 8-10)", price: 56 },
    ],
    allergens: [],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-002",
    name: "Egusi & pounded yam",
    category: "Soups & swallow",
    description: "Melon-seed stew, leafy greens, hand-pounded yam.",
    variants: [{ size: "Single serving", price: 16 }],
    allergens: ["sesame"],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-003",
    name: "Suya skewers",
    category: "Mains",
    description: "Yaji-spiced beef, charcoal-grilled, onions & lime.",
    variants: [
      { size: "4 sticks", price: 14 },
      { size: "8 sticks", price: 26 },
    ],
    allergens: ["peanut"],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-004",
    name: "Asun (peppered goat)",
    category: "Mains",
    description: "Smoked goat, peppers, onions, bar-snack royalty.",
    variants: [{ size: "Pack (serves 1-2)", price: 16 }],
    allergens: [],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-005",
    name: "Pepper soup",
    category: "Soups & swallow",
    description: "Goat or catfish, fragrant herbs, healing broth.",
    variants: [{ size: "Bowl", price: 15 }],
    allergens: ["fish"],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-006",
    name: "Small chops platter",
    category: "Small chops",
    description: "Puff puff, gizdodo, spring rolls, samosas.",
    variants: [
      { size: "Platter (serves 4-6)", price: 28 },
      { size: "Large (serves 8-10)", price: 48 },
    ],
    allergens: ["gluten", "egg"],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-007",
    name: "Plantain (dodo)",
    category: "Sides",
    description: "Soft, sweet, golden, the way it should be.",
    variants: [{ size: "Portion", price: 4 }],
    allergens: [],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-008",
    name: "Moin moin",
    category: "Sides",
    description: "Steamed bean cake, a little spicy.",
    variants: [{ size: "Portion", price: 5 }],
    allergens: [],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-009",
    name: "Zobo",
    category: "Drinks",
    description: "Hibiscus, ginger, citrus, chilled.",
    variants: [{ size: "Bottle", price: 3.5 }],
    allergens: [],
    isAvailable: true,
    imageUrl: null,
  },
  {
    id: "MN-010",
    name: "Chapman",
    category: "Drinks",
    description: "Sweet, fruity, festival favourite.",
    variants: [{ size: "Bottle", price: 4 }],
    allergens: [],
    isAvailable: true,
    imageUrl: null,
  },
];

// ===========================================================================
// Content blocks (homepage hero, featured dish, announcement banner)
// ===========================================================================

export interface ContentBlock {
  key: string;
  label: string;
  type: "text" | "image" | "video" | "url" | "toggle";
  value: string | boolean;
  description?: string;
}

export const CONTENT_BLOCKS: ContentBlock[] = [
  { key: "hero.eyebrow", label: "Hero eyebrow", type: "text", value: "Bold West-African flavours · Made in Portugal" },
  { key: "hero.headline", label: "Hero headline", type: "text", value: "A taste of home, served with care." },
  { key: "hero.body", label: "Hero body", type: "text", value: "Bold, comforting, home-style Nigerian meals, preordered, delivered, catered, and brought to life at pop-ups across Portugal. Slow-cooked the way it should be." },
  { key: "hero.video", label: "Hero video URL", type: "video", value: "" },
  { key: "thisweek.dishes", label: "Featured dishes (this week)", type: "text", value: "Smoky party jollof, suya skewers, pepper sauce, and soft plantain." },
  { key: "thisweek.deadline", label: "Order deadline", type: "text", value: "Preorders close every Friday · 18:00 WET" },
  { key: "announce.banner", label: "Announcement banner", type: "text", value: "" },
  { key: "udia.enabled", label: "Enable Ask Udia", type: "toggle", value: false, description: "When off, all Udia CTAs show coming-soon labels." },
];

// ===========================================================================
// Blog posts (for content manager)
// ===========================================================================

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: "draft" | "published" | "scheduled";
  publishedAt: string | null;
  readMinutes: number;
}

export const BLOG_POSTS: BlogPost[] = [
  { id: "BP-001", slug: "how-much-food-to-order-for-a-party", title: "How much food to order for a party", category: "Catering", status: "published", publishedAt: "2026-05-02", readMinutes: 5 },
  { id: "BP-002", slug: "what-to-serve-at-a-naming-ceremony", title: "What to serve at a Nigerian naming ceremony", category: "Traditions", status: "published", publishedAt: "2026-04-24", readMinutes: 6 },
  { id: "BP-003", slug: "behind-the-menu-this-weeks-drop", title: "Behind the menu: this week's drop", category: "Kitchen notes", status: "published", publishedAt: "2026-04-18", readMinutes: 3 },
  { id: "BP-004", slug: "portimao-pop-up-recap-2025", title: "Portimão pop-up recap 2025", category: "Pop-ups", status: "draft", publishedAt: null, readMinutes: 4 },
];

// ===========================================================================
// Analytics snapshots
// ===========================================================================

export interface TopDish {
  name: string;
  ordersThisMonth: number;
  trend: "up" | "down" | "flat";
}

export const TOP_DISHES: TopDish[] = [
  { name: "Smoky party jollof", ordersThisMonth: 142, trend: "up" },
  { name: "Suya skewers", ordersThisMonth: 118, trend: "up" },
  { name: "Egusi & pounded yam", ordersThisMonth: 96, trend: "flat" },
  { name: "Small chops platter", ordersThisMonth: 71, trend: "up" },
  { name: "Pepper soup", ordersThisMonth: 54, trend: "down" },
];

export interface LeadSource {
  source: string;
  inquiries: number;
  conversionRate: number;
}

export const LEAD_SOURCES: LeadSource[] = [
  { source: "Instagram", inquiries: 38, conversionRate: 0.42 },
  { source: "Word of mouth", inquiries: 24, conversionRate: 0.71 },
  { source: "Google", inquiries: 19, conversionRate: 0.31 },
  { source: "WhatsApp share", inquiries: 14, conversionRate: 0.65 },
  { source: "TikTok", inquiries: 9, conversionRate: 0.22 },
];

// ===========================================================================
// Helpers for the dashboard
// ===========================================================================

export function getKPIs() {
  const today = ORDERS.filter((o) => o.submittedAt.startsWith("2026-05-07"));
  const pending = ORDERS.filter((o) => o.paymentStatus === "pending");
  const cateringNew = CATERING.filter((c) => c.status === "new" || c.status === "reviewing");
  return {
    todayOrdersCount: today.length,
    todayRevenue: today.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0),
    pendingPaymentsCount: pending.length,
    pendingPaymentsValue: pending.reduce((s, o) => s + o.total, 0),
    portimaoSlotsLeft: 28,
    portimaoSlotsPerDay: 80,
    cateringPipelineCount: cateringNew.length,
  };
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
