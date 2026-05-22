"use client";

import { useMemo, useState } from "react";
import {
  Truck,
  Store,
  CreditCard,
  Banknote,
  MessageCircle,
  Mail,
  Copy,
  Check,
  ShoppingBag,
  Upload,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/motion";
import { useCart } from "./CartContext";
import PhoneInput, { composeE164 } from "./PhoneInput";
import OrderDatePicker from "./OrderDatePicker";
import { AML, OUTSIDE_AML, getMunicipality } from "./aml-data";
import {
  computeDelivery,
  FREE_DELIVERY_THRESHOLD,
  formatEuro,
  type DeliveryResult,
} from "./delivery-zones";

/**
 * Checkout modal — opens from the cart drawer.
 *
 * - Customer info (name, phone with country picker, email)
 * - Fulfilment: delivery (default) or pickup
 * - Region → Municipality → Parish cascading dropdowns
 * - Split address (street, house number, floor, postcode)
 * - Promo, notes, order summary, totals
 * - WhatsApp escalation when subtotal > €500
 * - Payment: Bank transfer/MBWay OR Stripe
 * - Post-submit confirmation step with receipt-upload affordance
 *
 * UI-only — wire to backend (Stripe + Supabase) in the next phase.
 */

const PAYMENT_DETAILS = {
  mbway: "927062759",
  iban: "PT50 0035 0159 0009 1873 0307 7",
  accountName: "Affy's · Unipessoal LDA",
  bicSwift: "CGDIPTPL",
};

const WHATSAPP_HREF = "https://wa.me/351914145519";
const WHATSAPP_DISPLAY = "+351 914 145 519";
const SUPPORT_EMAIL = "hello@atasteofaffys.com";
const UBER_EATS_HREF = "https://ubereats.com/"; // replace with real Affy's UE store URL

const TAKEOUT_BAG_FEE = 0.4; // €0.40 per bag
const TAKEOUT_BAG_THRESHOLD = 2; // 1 bag covers up to 2 plates

type Fulfilment = "delivery" | "pickup";
type PaymentMethod = "bank" | "stripe";

export default function CheckoutModal() {
  const { items, subtotal, checkoutOpen, closeCheckout, clear } = useCart();
  const isPortimao = items.some((it) => it.channel === "portimao");

  // ---------- Customer ----------
  const [name, setName] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("PT");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  // ---------- Fulfilment + payment (derived defaults, no useEffect) ----------
  const [fulfilmentChoice, setFulfilmentChoice] = useState<Fulfilment | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<PaymentMethod | null>(null);
  const fulfilment: Fulfilment =
    fulfilmentChoice ?? (isPortimao ? "pickup" : "delivery");
  const payment: PaymentMethod =
    paymentChoice ?? (isPortimao ? "stripe" : "bank");

  // ---------- Delivery location (cascading) ----------
  const [region, setRegion] = useState<"aml" | "rest">("aml");
  const [municipalityKey, setMunicipalityKey] = useState<string>("lisboa");
  const [parish, setParish] = useState<string>("");
  const [restCity, setRestCity] = useState<string>("");

  // ---------- Address (split into 4 fields) ----------
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [postcode, setPostcode] = useState("");

  // ---------- Misc ----------
  const [promo, setPromo] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  // ---------- Submission state ----------
  const [submitted, setSubmitted] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // ---------- Derived ----------
  const selectedMunicipality = useMemo(() => {
    if (municipalityKey === "outside-aml") return OUTSIDE_AML;
    return getMunicipality(municipalityKey);
  }, [municipalityKey]);

  const parishOptions = useMemo(() => {
    const m = getMunicipality(municipalityKey);
    return m?.parishes ?? [];
  }, [municipalityKey]);

  const totalPlates = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items],
  );
  const takeoutBags = useMemo(
    () => (fulfilment === "delivery" ? Math.ceil(totalPlates / TAKEOUT_BAG_THRESHOLD) : 0),
    [fulfilment, totalPlates],
  );
  const takeoutFee = takeoutBags * TAKEOUT_BAG_FEE;

  const deliveryResult: DeliveryResult | null = useMemo(() => {
    if (fulfilment !== "delivery") return null;
    return computeDelivery(municipalityKey, subtotal);
  }, [fulfilment, municipalityKey, subtotal]);

  const deliveryFee =
    deliveryResult && deliveryResult.kind === "fee" ? deliveryResult.amount : 0;
  const requiresWhatsapp = deliveryResult?.kind === "whatsapp";

  const total = subtotal + deliveryFee + takeoutFee;

  const remainingFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  // ---------- Validation ----------
  const detailsValid =
    name.trim().length > 1 &&
    phoneNumber.trim().length > 5 &&
    (isPortimao ? email.trim().length > 3 : true);

  const addressValid =
    fulfilment === "pickup" ||
    (street.trim().length > 1 &&
      houseNumber.trim().length > 0 &&
      postcode.trim().length > 3 &&
      (region === "aml"
        ? municipalityKey !== "" && municipalityKey !== "outside-aml" && parish !== ""
        : restCity.trim().length > 1));

  // A valid preferred date is required (the picker clears itself if invalid).
  const dateValid = preferredDate.trim().length > 0;

  const canSubmit =
    items.length > 0 &&
    detailsValid &&
    dateValid &&
    addressValid &&
    !requiresWhatsapp &&
    (payment === "stripe" || paymentConfirmed);

  // ---------- Copy helpers ----------
  const copyToClipboard = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      // ignore
    }
  };

  // ---------- Submit ----------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO wire to /api/orders (Supabase) + Stripe redirect.
    // For now we move to the confirmation step (with receipt-upload UI).
    setSubmitted(true);
  };

  const closeAndReset = () => {
    closeCheckout();
    // Defer reset slightly so the user doesn't see the form snap back
    setTimeout(() => {
      setSubmitted(false);
      setReceiptFile(null);
      setPaymentConfirmed(false);
      clear();
    }, 200);
  };

  // ---------- Render ----------
  return (
    <Modal
      open={checkoutOpen}
      onClose={closeCheckout}
      label="Checkout"
      maxWidth="max-w-2xl"
    >
      {submitted ? (
        <PostSubmitConfirmation
          isPortimao={isPortimao}
          payment={payment}
          phone={composeE164(phoneCountry, phoneNumber)}
          email={email}
          receiptFile={receiptFile}
          onReceiptFile={setReceiptFile}
          onDone={closeAndReset}
        />
      ) : (
        <form onSubmit={handleSubmit} className="px-6 pt-9 pb-8 sm:px-10 sm:pt-12 sm:pb-10">
          {/* Header */}
          <p className="eyebrow inline-flex items-center">
            <span className="gold-rule" />
            {isPortimao ? "Portimão preorder" : "Checkout"}
            <span className="gold-rule-after" />
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
            {isPortimao ? "Lock your festival slot" : "Almost there"}
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            {isPortimao
              ? "Pickup-only at Praia da Rocha. We confirm via email + phone after submission."
              : "Fill these details and pick a payment method — we'll take it from there."}
          </p>

          {/* Empty state safety */}
          {items.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-border-strong bg-cream/40 p-8 text-center text-sm text-foreground-muted">
              <ShoppingBag className="mx-auto" size={20} />
              <p className="mt-3">Your cart is empty. Add a dish first.</p>
            </div>
          )}

          {items.length > 0 && (
            <>
              {/* 1. Customer */}
              <Section title="Your details">
                <Field
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="e.g. Tomi A."
                  required
                />
                <div className="mt-3">
                  <PhoneInput
                    countryIso={phoneCountry}
                    onCountryChange={setPhoneCountry}
                    number={phoneNumber}
                    onNumberChange={setPhoneNumber}
                    required
                  />
                </div>
                <div className="mt-3">
                  <Field
                    label={isPortimao ? "Email (required)" : "Email"}
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    type="email"
                    required={isPortimao}
                  />
                </div>
                <Consent
                  checked={allowNotifications}
                  onChange={setAllowNotifications}
                  label="Email + WhatsApp me order updates"
                  description="We send a confirmation when payment is verified, a heads-up when food is ready, and a delivery progress note. Opt out anytime."
                />
              </Section>

              {/* 2. Fulfilment */}
              {!isPortimao && (
                <Section title="How would you like it?">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FulfilmentCard
                      icon={<Truck size={18} />}
                      label="Delivery"
                      description="We bring it to you"
                      active={fulfilment === "delivery"}
                      onClick={() => setFulfilmentChoice("delivery")}
                    />
                    <FulfilmentCard
                      icon={<Store size={18} />}
                      label="Self pickup"
                      description="Pick up · No fee"
                      active={fulfilment === "pickup"}
                      onClick={() => setFulfilmentChoice("pickup")}
                    />
                  </div>
                </Section>
              )}

              {/* 3. Delivery location (cascading) + split address */}
              {fulfilment === "delivery" && !isPortimao && (
                <Section title="Delivery location">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Region */}
                    <Select
                      label="Delivery region"
                      value={region}
                      onChange={(v) => {
                        const r = v as "aml" | "rest";
                        setRegion(r);
                        setParish("");
                        if (r === "rest") {
                          setMunicipalityKey("outside-aml");
                        } else {
                          setMunicipalityKey("lisboa");
                          setRestCity("");
                        }
                      }}
                      options={[
                        { value: "aml", label: AML.label },
                        { value: "rest", label: "Rest of Portugal" },
                      ]}
                      hint="Region we're delivering to"
                    />

                    {region === "aml" ? (
                      /* Municipality (Lisbon metro) */
                      <Select
                        label="Municipality"
                        value={municipalityKey}
                        onChange={(v) => {
                          setMunicipalityKey(v);
                          setParish("");
                        }}
                        options={AML.municipalities.map((m) => ({
                          value: m.key,
                          label: `${m.name} — ${formatEuro(m.baseFee)}`,
                        }))}
                        hint="Sets the base delivery fee"
                        required
                      />
                    ) : (
                      /* City / town for the rest of Portugal */
                      <Field
                        label="City / town (required)"
                        value={restCity}
                        onChange={setRestCity}
                        placeholder="e.g. Porto, Braga, Faro…"
                        required
                      />
                    )}
                  </div>

                  {/* Parish (only for AML municipalities) */}
                  {region === "aml" && parishOptions.length > 0 && (
                    <div className="mt-3">
                      <Select
                        label="Parish / Freguesia"
                        value={parish}
                        onChange={setParish}
                        options={[
                          { value: "", label: "Select your parish…" },
                          ...parishOptions.map((p) => ({ value: p.name, label: p.name })),
                        ]}
                        required
                      />
                    </div>
                  )}

                  {/* Rest-of-Portugal note */}
                  {region === "rest" && (
                    <p className="mt-3 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-[11px] text-foreground-muted">
                      Outside Lisbon — delivery starts from{" "}
                      <strong className="text-espresso">
                        {formatEuro(OUTSIDE_AML.baseFee)}
                      </strong>
                      . Larger/heavier orders may need a quick weight check; we&rsquo;ll
                      confirm the final delivery cost before payment.
                    </p>
                  )}

                  {/* Tier-fee notice */}
                  {subtotal > 200 && subtotal <= 500 && (
                    <p className="mt-3 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-[11px] text-foreground-muted">
                      Larger order ({formatEuro(subtotal)}) — tiered delivery fee of{" "}
                      <strong className="text-espresso">
                        {formatEuro(subtotal > 400 ? 50 : 30)}
                      </strong>{" "}
                      applies (overrides the municipality base).
                    </p>
                  )}

                  {/* Address — split */}
                  <div className="mt-5">
                    <p className="eyebrow inline-flex items-center">
                      <span className="gold-rule" />
                      Delivery address
                      <span className="gold-rule-after" />
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Field
                          label="Street / address (required)"
                          value={street}
                          onChange={setStreet}
                          placeholder="e.g. Rua Beatriz Costa"
                          required
                        />
                      </div>
                      <Field
                        label="House / building number (required)"
                        value={houseNumber}
                        onChange={setHouseNumber}
                        placeholder="e.g. 10"
                        required
                      />
                      <Field
                        label="Apartment / suite / floor (optional)"
                        value={floor}
                        onChange={setFloor}
                        placeholder="e.g. 3.º Dto."
                      />
                      <div className="sm:col-span-2">
                        <Field
                          label="Postal code (required)"
                          value={postcode}
                          onChange={setPostcode}
                          placeholder="e.g. 1700-001"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </Section>
              )}

              {/* 4. Promo */}
              <Section title="Promo code">
                <div className="flex gap-2">
                  <Field
                    label=""
                    value={promo}
                    onChange={setPromo}
                    placeholder="PROMO CODE"
                    uppercase
                  />
                  <button
                    type="button"
                    className="inline-flex h-11 shrink-0 items-center rounded-lg border border-border bg-white px-4 text-sm font-semibold text-espresso hover:border-espresso transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </Section>

              {/* Preferred date */}
              <Section title="When would you like it?">
                <OrderDatePicker value={preferredDate} onChange={setPreferredDate} />
              </Section>

              {/* 5. Notes */}
              <Section title="Notes (optional)">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Allergies, spice level, gate code…"
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-espresso placeholder:text-foreground-subtle focus:border-espresso focus:outline-none"
                />
              </Section>

              {/* 6. Order summary */}
              <Section title="Order summary">
                <ul className="divide-y divide-border rounded-xl border border-border bg-white">
                  {items.map((it) => (
                    <li key={it.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <span>
                        <span className="font-semibold text-espresso">{it.qty} ×</span>{" "}
                        <span className="text-espresso">{it.name}</span>
                        {it.variant && (
                          <span className="text-foreground-subtle"> · {it.variant}</span>
                        )}
                      </span>
                      <span className="font-semibold text-espresso">
                        {formatEuro(it.price * it.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Free delivery progress (welcome offer placeholder) */}
                {!isPortimao && fulfilment === "delivery" && (
                  <div className="mt-3 rounded-xl border border-border bg-cream/40 p-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono uppercase tracking-wider text-foreground-muted">
                        {remainingFree === 0
                          ? "Free delivery (first order) ✓"
                          : `Free delivery on first order over ${formatEuro(FREE_DELIVERY_THRESHOLD)}`}
                      </span>
                      <span className="font-semibold text-espresso">
                        {remainingFree === 0 ? "" : `${formatEuro(remainingFree)} to go`}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream-deep">
                      <div
                        className="h-full rounded-full bg-forest transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <dl className="mt-4 space-y-1.5 text-sm">
                  <Line label="Subtotal" value={formatEuro(subtotal)} />
                  {fulfilment === "delivery" && deliveryResult && (
                    <Line
                      label={
                        <span className="flex items-center gap-1.5">
                          <Truck size={12} className="text-foreground-muted" />
                          Delivery ·{" "}
                          {selectedMunicipality
                            ? "name" in selectedMunicipality
                              ? selectedMunicipality.name
                              : selectedMunicipality.label
                            : ""}
                        </span>
                      }
                      value={deliveryResult.kind === "whatsapp" ? "—" : formatEuro(deliveryFee)}
                    />
                  )}
                  {fulfilment === "delivery" && takeoutBags > 0 && (
                    <Line
                      label={
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag size={12} className="text-foreground-muted" />
                          Takeout bag ×{takeoutBags}
                          <span className="ml-1 text-[10px] uppercase tracking-wider text-foreground-subtle">
                            {totalPlates} plates · max 2 per bag
                          </span>
                        </span>
                      }
                      value={`+${formatEuro(takeoutFee)}`}
                    />
                  )}
                  <hr className="border-border" />
                  <Line
                    label={<span className="font-display text-base font-semibold text-espresso">Total</span>}
                    value={
                      <span className="font-display text-xl font-semibold text-espresso">
                        {formatEuro(total)}
                      </span>
                    }
                  />
                </dl>
              </Section>

              {/* WhatsApp escalation */}
              {requiresWhatsapp && (
                <Section title="Large order">
                  <div className="rounded-2xl border border-red/30 bg-red/5 p-5">
                    <p className="text-sm leading-relaxed text-espresso">
                      {deliveryResult && "reason" in deliveryResult ? deliveryResult.reason : ""}
                    </p>
                    <Link
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex h-11 items-center rounded-full bg-red px-5 text-sm font-semibold text-ivory hover:bg-red-soft transition-colors"
                    >
                      <MessageCircle size={14} className="mr-2" />
                      Continue on WhatsApp ({WHATSAPP_DISPLAY})
                    </Link>
                  </div>
                </Section>
              )}

              {/* Payment method */}
              {!requiresWhatsapp && (
                <Section title="Payment method">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {!isPortimao && (
                      <PaymentCard
                        icon={<Banknote size={18} />}
                        label="Bank transfer / MBWay"
                        description="Pay before confirmation"
                        active={payment === "bank"}
                        onClick={() => setPaymentChoice("bank")}
                      />
                    )}
                    <PaymentCard
                      icon={<CreditCard size={18} />}
                      label="Pay online"
                      description="Card via Stripe"
                      active={payment === "stripe"}
                      onClick={() => setPaymentChoice("stripe")}
                    />
                  </div>

                  {/* Bank transfer details */}
                  {payment === "bank" && !isPortimao && (
                    <div className="mt-4 rounded-2xl border border-border bg-cream p-5">
                      <p className="text-sm text-foreground-muted">
                        Please send payment before confirmation and share the
                        receipt via WhatsApp on{" "}
                        <a
                          href={WHATSAPP_HREF}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-espresso underline decoration-gold underline-offset-4"
                        >
                          {WHATSAPP_DISPLAY}
                        </a>{" "}
                        or via email to{" "}
                        <a
                          href={`mailto:${SUPPORT_EMAIL}`}
                          className="font-semibold text-espresso underline decoration-gold underline-offset-4"
                        >
                          {SUPPORT_EMAIL}
                        </a>
                        .
                      </p>
                      <dl className="mt-4 divide-y divide-border-strong">
                        <PaymentRow
                          label="MBWAY"
                          value={PAYMENT_DETAILS.mbway}
                          copied={copied === "mbway"}
                          onCopy={() => copyToClipboard("mbway", PAYMENT_DETAILS.mbway)}
                        />
                        <PaymentRow
                          label="IBAN"
                          value={PAYMENT_DETAILS.iban}
                          copied={copied === "iban"}
                          onCopy={() => copyToClipboard("iban", PAYMENT_DETAILS.iban)}
                        />
                        <PaymentRow
                          label="Account name"
                          value={PAYMENT_DETAILS.accountName}
                          copied={copied === "name"}
                          onCopy={() => copyToClipboard("name", PAYMENT_DETAILS.accountName)}
                        />
                        <PaymentRow
                          label="BIC/SWIFT"
                          value={PAYMENT_DETAILS.bicSwift}
                          copied={copied === "swift"}
                          onCopy={() => copyToClipboard("swift", PAYMENT_DETAILS.bicSwift)}
                        />
                      </dl>
                      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground-muted">
                        <input
                          type="checkbox"
                          checked={paymentConfirmed}
                          onChange={(e) => setPaymentConfirmed(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-red"
                        />
                        <span>
                          I confirm I have sent the payment to the account above (MBWay or bank transfer).
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Portimão Uber Eats alternative */}
                  {isPortimao && (
                    <p className="mt-4 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-xs text-foreground-muted">
                      Walk-up customer during festival hours? You can also{" "}
                      <Link
                        href={UBER_EATS_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-espresso underline decoration-gold underline-offset-4"
                      >
                        order on Uber Eats
                      </Link>{" "}
                      instead.
                    </p>
                  )}
                </Section>
              )}

              {/* Submit */}
              {!requiresWhatsapp && (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition-all ${
                    canSubmit
                      ? "bg-espresso text-ivory hover:bg-gold hover:text-espresso shadow-luxe"
                      : "bg-border-strong text-foreground-muted cursor-not-allowed"
                  }`}
                >
                  {payment === "stripe" ? "Continue to Stripe" : "Confirm payment sent above"}
                  <span aria-hidden className="ml-2">→</span>
                </button>
              )}

              <p className="mt-4 text-center text-[11px] text-foreground-subtle">
                By submitting you agree to our{" "}
                <Link href="#" className="underline decoration-gold underline-offset-2 hover:text-espresso">
                  terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline decoration-gold underline-offset-2 hover:text-espresso">
                  privacy policy
                </Link>
                .
              </p>
            </>
          )}
        </form>
      )}
    </Modal>
  );
}

// ===========================================================================
// Post-submit confirmation step — receipt upload + WhatsApp + email options
// ===========================================================================

interface PostSubmitConfirmationProps {
  isPortimao: boolean;
  payment: PaymentMethod;
  phone: string;
  email: string;
  receiptFile: File | null;
  onReceiptFile: (f: File | null) => void;
  onDone: () => void;
}

function PostSubmitConfirmation({
  isPortimao,
  payment,
  phone,
  email,
  receiptFile,
  onReceiptFile,
  onDone,
}: PostSubmitConfirmationProps) {
  const isBank = payment === "bank";
  const whatsappMessage = encodeURIComponent(
    `Hi Affy's — I just placed an order (phone: ${phone}${email ? `, email: ${email}` : ""}). Attaching my payment receipt.`,
  );

  return (
    <div className="px-6 pt-9 pb-8 sm:px-10 sm:pt-12 sm:pb-10">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest/15 text-forest">
        <Check size={22} strokeWidth={2.4} />
      </span>
      <h2 className="mt-5 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
        {isBank ? "Order received — last step" : "Order received"}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
        {isBank
          ? "Send the payment to the account shown, then share the receipt with us in one of the ways below. We'll confirm via WhatsApp + email as soon as we see it."
          : isPortimao
          ? "We've got your Portimão preorder. Stripe checkout will open in a moment — once paid, your slot is locked. We'll confirm via WhatsApp + email."
          : "Stripe checkout will open in a moment. Once paid, you're done — confirmation lands by WhatsApp + email."}
      </p>

      {/* Three options for sharing the receipt */}
      {isBank && (
        <div className="mt-7 space-y-3">
          {/* Option 1: Upload here */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-deep text-espresso">
                <Upload size={16} />
              </span>
              <div>
                <p className="font-semibold text-espresso">Upload here</p>
                <p className="text-[11px] text-foreground-muted">
                  Fastest — we&rsquo;ll get it instantly
                </p>
              </div>
            </div>
            <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-border-strong bg-cream/40 px-4 py-5 text-center text-sm text-foreground-muted transition-colors hover:border-espresso hover:bg-cream">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => onReceiptFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              {receiptFile ? (
                <span className="font-semibold text-espresso">
                  ✓ {receiptFile.name}
                </span>
              ) : (
                <>Tap to upload your receipt (image or PDF)</>
              )}
            </label>
          </div>

          {/* Option 2: WhatsApp */}
          <Link
            href={`${WHATSAPP_HREF}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 transition-colors hover:border-espresso"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
              <MessageCircle size={16} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-espresso">Send via WhatsApp</p>
              <p className="text-[11px] text-foreground-muted">
                Opens our WhatsApp — attach the receipt there
              </p>
            </div>
            <span aria-hidden>→</span>
          </Link>

          {/* Option 3: Email */}
          <Link
            href={`mailto:${SUPPORT_EMAIL}?subject=Receipt%20for%20my%20Affy%27s%20order&body=Hi%20Affy%27s%2C%20attaching%20my%20payment%20receipt.%20Order%20phone%3A%20${encodeURIComponent(phone)}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-5 transition-colors hover:border-espresso"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red/10 text-red">
              <Mail size={16} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-espresso">Send via email</p>
              <p className="text-[11px] text-foreground-muted">{SUPPORT_EMAIL}</p>
            </div>
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      {/* What happens next */}
      <div className="mt-7 rounded-2xl border border-border bg-cream/40 p-5">
        <p className="eyebrow inline-flex items-center">
          <span className="gold-rule" />
          What happens next
          <span className="gold-rule-after" />
        </p>
        <ol className="mt-3 space-y-2 text-sm text-foreground-muted">
          <li>
            <span className="font-semibold text-espresso">1.</span> We verify
            your {isBank ? "receipt" : "payment"} (within a few hours, usually faster).
          </li>
          <li>
            <span className="font-semibold text-espresso">2.</span> You get a
            confirmation message via WhatsApp + email.
          </li>
          <li>
            <span className="font-semibold text-espresso">3.</span> On the day,
            we send a progress note when your food is being prepared and again
            when it&rsquo;s out for delivery / ready for pickup.
          </li>
        </ol>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="btn-gold mt-7 w-full"
      >
        Done
      </button>
    </div>
  );
}

// ===========================================================================
// Small UI helpers
// ===========================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <p className="eyebrow inline-flex items-center">
        <span className="gold-rule" />
        {title}
        <span className="gold-rule-after" />
      </p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  uppercase?: boolean;
}

function Field({ label, value, onChange, placeholder, type = "text", required, uppercase }: FieldProps) {
  return (
    <div className="flex-1">
      {label && (
        <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`${label ? "mt-1" : ""} w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-espresso placeholder:text-foreground-subtle focus:border-espresso focus:outline-none ${
          uppercase ? "uppercase tracking-wider" : ""
        }`}
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
  required?: boolean;
}

function Select({ label, value, onChange, options, hint, required }: SelectProps) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
        {label}
      </label>
      <div className="relative mt-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none rounded-lg border border-border bg-white px-3 py-2.5 pr-9 text-sm text-espresso focus:border-espresso focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted"
        />
      </div>
      {hint && (
        <p className="mt-1 text-[10px] text-foreground-subtle">{hint}</p>
      )}
    </div>
  );
}

function FulfilmentCard({
  icon, label, description, active, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
        active
          ? "border-red bg-red/5 ring-1 ring-red"
          : "border-border bg-white hover:border-foreground-muted"
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-red text-ivory" : "bg-cream-deep text-foreground-muted"
        }`}
      >
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-espresso">{label}</span>
        <span className="block text-[11px] text-foreground-muted">{description}</span>
      </span>
    </button>
  );
}

function PaymentCard({
  icon, label, description, active, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
        active
          ? "border-red bg-red/5 ring-1 ring-red"
          : "border-border bg-white hover:border-foreground-muted"
      }`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-red text-ivory" : "bg-cream-deep text-foreground-muted"
        }`}
      >
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-espresso">{label}</span>
        <span className="block text-[11px] text-foreground-muted">{description}</span>
      </span>
    </button>
  );
}

function PaymentRow({
  label, value, onCopy, copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-foreground-subtle">{label}</p>
        <p className="mt-0.5 break-all font-mono text-sm text-espresso">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-red hover:border-red"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  );
}

function Line({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-foreground-muted">{label}</dt>
      <dd className="text-espresso">{value}</dd>
    </div>
  );
}

function Consent({
  checked, onChange, label, description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-cream/40 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-red"
      />
      <span className="text-sm">
        <span className="block font-semibold text-espresso">{label}</span>
        <span className="block text-[11px] leading-relaxed text-foreground-muted">{description}</span>
      </span>
    </label>
  );
}
