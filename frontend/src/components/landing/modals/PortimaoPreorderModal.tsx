"use client";

import Link from "next/link";
import { Modal } from "@/components/motion";
import { AzulejoTile } from "../Azulejo";
import { PORTIMAO } from "@/components/portimao/config";

interface PortimaoPreorderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PortimaoPreorderModal({ open, onClose }: PortimaoPreorderModalProps) {
  return (
    <Modal open={open} onClose={onClose} label="Pre-order for Portimão" maxWidth="max-w-2xl">
      <div className="relative overflow-hidden">
        {/* Decorative top band */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-forest via-espresso to-red/80">
          <div className="absolute inset-0 opacity-20" aria-hidden>
            <div className="grid h-full w-full grid-cols-5 grid-rows-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <AzulejoTile key={i} tone="forest" size={120} />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent" aria-hidden />
          <div className="absolute bottom-4 left-7 right-7 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-soft/60 bg-red/15 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-ivory backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red opacity-80 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red" />
              </span>
              Festival mode · Live
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-ivory/80">
              Bowls {PORTIMAO.bowlPriceFrom}-{PORTIMAO.bowlPriceTo}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 pt-7 pb-7 sm:px-10 sm:pt-9 sm:pb-10">
          <h2 className="font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
            Affy&rsquo;s in{" "}
            <span className="italic text-red">Portim&atilde;o.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground-muted">
            We open a calendar of available pickup dates and times for the
            festival window. Pick your slot, choose your bowls, we follow up
            with the final details and your secure payment link.
          </p>

          <dl className="mt-7 grid grid-cols-3 gap-4">
            <div className="border-l border-gold/40 pl-3">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground-subtle">Window</dt>
              <dd className="mt-1.5 text-sm font-semibold text-espresso">{PORTIMAO.campaignWindow}</dd>
            </div>
            <div className="border-l border-gold/40 pl-3">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground-subtle">Pickup</dt>
              <dd className="mt-1.5 text-sm font-semibold text-espresso">{PORTIMAO.pickupLocation}</dd>
            </div>
            <div className="border-l border-gold/40 pl-3">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground-subtle">Slots / day</dt>
              <dd className="mt-1.5 text-sm font-semibold text-espresso">{PORTIMAO.slotsPerDay}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/portimao#preorder"
              onClick={onClose}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft active:scale-[0.98]"
            >
              Open Portim&atilde;o preorder
              <span className="ml-2" aria-hidden>→</span>
            </Link>
            <Link
              href="/portimao#menu"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-white px-6 text-sm font-semibold text-espresso transition-colors hover:border-espresso hover:bg-cream"
            >
              See festival menu
            </Link>
          </div>

          <p className="mt-5 text-xs text-foreground-subtle">
            Two ways to order: through Affy&rsquo;s site (pickup only) or via
            Uber Eats during festival hours.
          </p>
        </div>
      </div>
    </Modal>
  );
}
