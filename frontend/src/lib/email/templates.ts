/**
 * Branded order emails (plain, email-client-safe HTML with inline styles).
 * Pure functions, used by the order + status server actions.
 */

export interface EmailOrderItem {
  name: string;
  variantLabel?: string | null;
  quantity: number;
  lineTotal: number;
  notes?: string | null;
}

export interface EmailOrder {
  shortCode: string;
  customerName: string;
  channel: "udia" | "form" | "portimao";
  fulfilment: "pickup" | "delivery";
  scheduledFor?: string | null;
  addressLine?: string | null;
  items: EmailOrderItem[];
  subtotal: number;
  deliveryFee: number;
  takeoutBagFee: number;
  promoCode?: string | null;
  promoDiscount: number;
  total: number;
  paymentMethod?: "bank" | "stripe" | null;
  notes?: string | null;
}

const ESPRESSO = "#2B211B";
const GOLD = "#D4AF37";
const MUTED = "#6B6259";

/**
 * Public URL of the Affy's logo (PNG in /public/logo.png). Falls back to a
 * sensible default if NEXT_PUBLIC_SITE_URL isn't set, Resend won't be able to
 * inline it via cid, so we rely on a public absolute URL.
 *
 * Important: the constant is read inside `logoTag()` so changes to env vars at
 * runtime are picked up; do not hoist into a module-level concatenation.
 */
function logoTag(): string {
  // Email clients require an ABSOLUTE URL, use NEXT_PUBLIC_SITE_URL if set,
  // otherwise fall back to the clean Vercel alias. The logo PNG already
  // contains the "Affy's" wordmark so the header doesn't need any additional
  // text label next to it.
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://affys-ai-ordering-system.vercel.app";
  const src = `${base}/logo.png`;
  return `<img src="${src}" alt="Affy's" height="64" style="display:block;height:64px;width:auto;max-width:160px;object-fit:contain;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" />`;
}

function brandHeader(eyebrow: string): string {
  // Cream background so the logo (which has its own dark/serif wordmark)
  // reads cleanly without competing against the dark espresso block.
  return `
    <div style="background:#FAF5E5;padding:20px 24px;border-bottom:1px solid #E7E0D6;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;width:80px;padding-right:16px;">${logoTag()}</td>
          <td style="vertical-align:middle;text-align:right;">
            <span style="color:${GOLD};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;">${eyebrow}</span>
          </td>
        </tr>
      </table>
    </div>`;
}

const eur = (n: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);

const fmtDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : ", ";

function itemsRows(order: EmailOrder): string {
  return order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:6px 0;color:${ESPRESSO};font-size:14px;">
          ${it.quantity}× ${it.name}${it.variantLabel ? ` · ${it.variantLabel}` : ""}
          ${it.notes ? `<br><span style="color:${MUTED};font-size:12px;">${it.notes}</span>` : ""}
        </td>
        <td style="padding:6px 0;text-align:right;color:${ESPRESSO};font-size:14px;white-space:nowrap;">${eur(it.lineTotal)}</td>
      </tr>`,
    )
    .join("");
}

function totalsRows(order: EmailOrder): string {
  const line = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:3px 0;color:${strong ? ESPRESSO : MUTED};font-size:${strong ? "16px" : "13px"};font-weight:${strong ? "700" : "400"};">${label}</td>
      <td style="padding:3px 0;text-align:right;color:${ESPRESSO};font-size:${strong ? "16px" : "13px"};font-weight:${strong ? "700" : "400"};">${value}</td>
    </tr>`;
  let rows = line("Subtotal", eur(order.subtotal));
  if (order.deliveryFee > 0) rows += line("Delivery", eur(order.deliveryFee));
  if (order.takeoutBagFee > 0) rows += line("Takeout bag", eur(order.takeoutBagFee));
  if (order.promoDiscount > 0)
    rows += line(`Promo ${order.promoCode ?? ""}`, `−${eur(order.promoDiscount)}`);
  rows += line("Total", eur(order.total), true);
  return rows;
}

function shell(heading: string, intro: string, order: EmailOrder, footer: string): string {
  return `
  <div style="margin:0;padding:24px;background:#F7F4EE;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E7E0D6;">
      ${brandHeader(order.channel === "portimao" ? "Portimão · Order" : "Order")}
      <div style="padding:28px;">
        <h1 style="margin:0 0 8px;color:${ESPRESSO};font-size:22px;">${heading}</h1>
        <p style="margin:0 0 18px;color:${MUTED};font-size:14px;line-height:1.6;">${intro}</p>

        <div style="background:#F7F4EE;border-radius:12px;padding:16px 18px;margin-bottom:18px;">
          <p style="margin:0 0 4px;color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;">Order ${order.shortCode}</p>
          <p style="margin:0;color:${ESPRESSO};font-size:14px;">
            ${order.fulfilment === "delivery" ? "Delivery" : "Pickup"} · ${fmtDate(order.scheduledFor)}
            ${order.addressLine ? `<br><span style="color:${MUTED};font-size:13px;">${order.addressLine}</span>` : ""}
          </p>
        </div>

        <table style="width:100%;border-collapse:collapse;">${itemsRows(order)}</table>
        <hr style="border:none;border-top:1px solid #E7E0D6;margin:12px 0;" />
        <table style="width:100%;border-collapse:collapse;">${totalsRows(order)}</table>

        ${order.notes ? `<p style="margin:16px 0 0;color:${MUTED};font-size:13px;font-style:italic;">Notes: ${order.notes}</p>` : ""}

        <p style="margin:22px 0 0;color:${MUTED};font-size:13px;line-height:1.6;">${footer}</p>
      </div>
    </div>
    <p style="max-width:560px;margin:14px auto 0;color:#A39A8E;font-size:11px;text-align:center;">
      Affy&rsquo;s · Nigerian meals, Lisbon · atasteofaffys.com
    </p>
  </div>`;
}

export function orderReceivedEmail(order: EmailOrder): { subject: string; html: string } {
  const isBank = order.paymentMethod === "bank";
  return {
    subject: `We got your order ${order.shortCode}, Affy's`,
    html: shell(
      `Thanks, ${order.customerName.split(" ")[0]}! Order received.`,
      isBank
        ? "We've received your order. Once we confirm your payment, we'll send a confirmation. Here's your summary:"
        : "We've received your order, here's your summary. We'll be in touch shortly to confirm.",
      order,
      isBank
        ? "Please make sure you've sent payment and shared your receipt with us on WhatsApp. Reply to this email if anything looks off."
        : "We'll confirm your order soon. Reply to this email if anything looks off.",
    ),
  };
}

export function orderConfirmedEmail(order: EmailOrder): { subject: string; html: string } {
  return {
    subject: `Order ${order.shortCode} confirmed, Affy's`,
    html: shell(
      `You're all set, ${order.customerName.split(" ")[0]}!`,
      `Your order is confirmed for ${fmtDate(order.scheduledFor)}. We can't wait to feed you. Here's your summary:`,
      order,
      order.fulfilment === "pickup"
        ? "We'll let you know when it's ready for pickup. See you soon!"
        : "We'll be in touch about delivery timing. See you soon!",
    ),
  };
}

export function ownerNewOrderEmail(order: EmailOrder): { subject: string; html: string } {
  return {
    subject: `🔔 New ${order.channel} order ${order.shortCode}, ${eur(order.total)}`,
    html: shell(
      `New order: ${order.shortCode}`,
      `${order.customerName} just placed a ${order.channel} order (${order.fulfilment}). Open the admin to confirm it.`,
      order,
      "Manage this in your admin Orders page.",
    ),
  };
}

// =============================================================================
// Catering, inquiry acknowledgement + owner alert
// =============================================================================

export interface CateringEmailPayload {
  reference: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string; // "YYYY-MM-DD"
  guestCount: number;
  location: string;
  budget: string;
  notes: string;
}

function cateringShell(
  heading: string,
  intro: string,
  payload: CateringEmailPayload,
  footer: string,
): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:4px 0;color:${MUTED};font-size:13px;width:120px;">${label}</td><td style="padding:4px 0;color:${ESPRESSO};font-size:14px;">${value}</td></tr>`
      : "";

  return `
  <div style="background:#FAFAF7;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E7E0D6;border-radius:16px;overflow:hidden;">
      ${brandHeader("Catering & events")}
      <div style="padding:28px 28px 24px;">
        <h1 style="margin:0;color:${ESPRESSO};font-size:22px;font-weight:600;line-height:1.25;">${heading}</h1>
        <p style="margin:10px 0 18px;color:${MUTED};font-size:14px;line-height:1.6;">${intro}</p>

        <div style="background:#FAFAF7;border:1px solid #E7E0D6;border-radius:12px;padding:14px 16px;">
          <table style="width:100%;border-collapse:collapse;">
            ${row("Reference", payload.reference)}
            ${row("Name", payload.name)}
            ${row("Phone", payload.phone)}
            ${row("Email", payload.email)}
            ${row("Event", payload.eventType)}
            ${row("Date", payload.eventDate ? fmtDate(payload.eventDate) : "")}
            ${row("Guests", payload.guestCount ? String(payload.guestCount) : "")}
            ${row("Location", payload.location)}
            ${row("Budget", payload.budget)}
          </table>
        </div>

        ${payload.notes ? `<p style="margin:16px 0 0;color:${MUTED};font-size:13px;font-style:italic;">&ldquo;${payload.notes}&rdquo;</p>` : ""}

        <p style="margin:22px 0 0;color:${MUTED};font-size:13px;line-height:1.6;">${footer}</p>
      </div>
    </div>
    <p style="max-width:560px;margin:14px auto 0;color:#A39A8E;font-size:11px;text-align:center;">
      Affy&rsquo;s &middot; Nigerian meals, Lisbon &middot; atasteofaffys.com
    </p>
  </div>`;
}

export function cateringCustomerAckEmail(
  payload: CateringEmailPayload,
): { subject: string; html: string } {
  const first = payload.name.split(" ")[0] || payload.name;
  return {
    subject: `Got it, ${first}, we'll be in touch · ${payload.reference}`,
    html: cateringShell(
      `Thanks ${first}, your catering request is in.`,
      "We've received the details below and will come back to you with a tailored menu and a real number. Most replies go out within one working day.",
      payload,
      "Reply to this email if anything needs updating, or share more context about your event.",
    ),
  };
}

export function cateringOwnerAlertEmail(
  payload: CateringEmailPayload,
): { subject: string; html: string } {
  const guestStr = payload.guestCount ? ` · ${payload.guestCount} guests` : "";
  return {
    subject: `🔔 New catering inquiry · ${payload.reference}${guestStr}`,
    html: cateringShell(
      `New catering inquiry: ${payload.reference}`,
      `${payload.name} just submitted a catering request${payload.eventType ? ` (${payload.eventType})` : ""}. Triage it in your admin Catering board.`,
      payload,
      "Manage this in your admin Catering page.",
    ),
  };
}

// =============================================================================
// Waitlist / notify-me, source-specific welcome emails
// =============================================================================

export type NotifySource = "portimao-offseason" | "portimao-waitlist" | "daily-pause" | "general";

interface NotifyContent {
  eyebrow: string;
  heading: string;
  intro: string;
  highlight: string;
  footer: string;
}

function notifyShell({
  eyebrow,
  heading,
  intro,
  highlight,
  footer,
}: NotifyContent): string {
  return `
  <div style="margin:0;padding:24px;background:#F7F4EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E7E0D6;">
      ${brandHeader(eyebrow)}
      <div style="padding:28px;">
        <h1 style="margin:0 0 10px;color:${ESPRESSO};font-size:24px;font-weight:600;line-height:1.2;font-family:Georgia,serif;">${heading}</h1>
        <p style="margin:0 0 20px;color:${MUTED};font-size:14px;line-height:1.65;">${intro}</p>

        <div style="background:linear-gradient(135deg,#FAF5E5 0%,#F7F4EE 100%);border:1px solid ${GOLD}40;border-radius:12px;padding:18px 20px;margin-bottom:18px;">
          <p style="margin:0;color:${ESPRESSO};font-size:14px;line-height:1.65;">${highlight}</p>
        </div>

        <p style="margin:0;color:${MUTED};font-size:13px;line-height:1.65;">${footer}</p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;border-collapse:collapse;">
          <tr>
            <td style="background:${GOLD};border-radius:999px;">
              <a href="https://atasteofaffys.com/menu" style="display:inline-block;padding:12px 22px;color:${ESPRESSO};font-size:13px;font-weight:700;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;">Browse the menu →</a>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <p style="max-width:560px;margin:14px auto 0;color:#A39A8E;font-size:11px;text-align:center;">
      You're getting this because you signed up to be notified at atasteofaffys.com.<br/>
      Affy&rsquo;s &middot; Nigerian meals, Lisbon &middot; atasteofaffys.com
    </p>
  </div>`;
}

/**
 * Welcome email sent to a customer who signed up via the notify-me / waitlist
 * forms. Returns null for sources we don't have content for, or when no email
 * was provided.
 */
export function notifyWelcomeEmail(
  source: NotifySource | string,
  email: string,
): { subject: string; html: string } | null {
  if (!email || !email.includes("@")) return null;

  if (source === "portimao-offseason") {
    return {
      subject: "You're on the list, next Portimão pop-up · Affy's",
      html: notifyShell({
        eyebrow: "Portimão pop-up alerts",
        heading: "We'll wave you down at the next one.",
        intro:
          "You're on the list for Affy's next Portimão pop-up. We don't pop up there year-round, we come and feed the crowd during big moments like Afro Nation, then head back to the kitchen in Lisbon.",
        highlight:
          "The moment we lock in the next Portimão dates, you'll get an email here with the menu, pre-order window, and pickup spot, before we open it publicly.",
        footer:
          "Until then, you can always order from us in Lisbon. We deliver across the AML and ship a little further on request.",
      }),
    };
  }

  if (source === "portimao-waitlist") {
    return {
      subject: "You're on the Portimão waitlist · Affy's",
      html: notifyShell({
        eyebrow: "Portimão waitlist",
        heading: "We've added you to the waitlist.",
        intro:
          "Today's Portimão slots are full, but we'll release more if the kitchen catches up or someone cancels. You'll be among the first to know.",
        highlight:
          "We'll email you the moment new slots open, with a direct link to grab one. Slots usually go in minutes, so keep an eye on this address.",
        footer:
          "Thanks for being patient, Portimão weekends are intense and we want everyone fed properly.",
      }),
    };
  }

  if (source === "daily-pause") {
    return {
      subject: "We'll let you know the kitchen is back open · Affy's",
      html: notifyShell({
        eyebrow: "Daily ordering",
        heading: "We'll email you the moment we're back.",
        intro:
          "Daily ordering is paused for now, but you've asked us to ping you when it's live again, and we will.",
        highlight:
          "Expect a short, plain email here the day we re-open, with a direct link to the menu and any new dishes we've added in the meantime.",
        footer:
          "If you have a catering need or a Portimão pop-up question in the meantime, just reply to this email, it goes to a real inbox.",
      }),
    };
  }

  // Generic fallback so future sources still get something polite.
  return {
    subject: "You're on the list · Affy's",
    html: notifyShell({
      eyebrow: "You're on the list",
      heading: "Thanks, we'll be in touch.",
      intro:
        "We've added you to the list. When there's an update worth your inbox, you'll hear from us here.",
      highlight: "No spam, ever, just real updates from the kitchen.",
      footer: "Thanks for trusting us with your email.",
    }),
  };
}
