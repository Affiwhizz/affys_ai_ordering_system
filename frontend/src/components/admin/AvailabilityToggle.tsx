"use client";

import { useState, useTransition } from "react";
import { setMenuItemAvailability } from "@/app/admin/menu/actions";

/**
 * On/off switch for a dish. Optimistic: flips immediately, reverts if the
 * server write fails. A successful write revalidates the public /menu page,
 * so turning a dish off here hides it on the storefront.
 */
export default function AvailabilityToggle({
  dbId,
  initial,
  label,
}: {
  dbId: string;
  initial: boolean;
  label: string;
}) {
  const [on, setOn] = useState(initial);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !on;
    setOn(next);
    startTransition(async () => {
      const res = await setMenuItemAvailability(dbId, next);
      if (!res.ok) setOn(!next);
    });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`${on ? "Hide" : "Show"} ${label} on the public menu`}
      onClick={toggle}
      disabled={pending}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        on ? "bg-forest" : "bg-foreground-subtle/40"
      } ${pending ? "opacity-60" : ""}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
