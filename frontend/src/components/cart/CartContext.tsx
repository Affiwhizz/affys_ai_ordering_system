"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchStoreFlags } from "@/lib/store/actions";

/**
 * Cart context — single source of truth for items, totals, drawer state.
 * Persists to localStorage so a refresh doesn't lose the user's progress.
 */

export interface CartItem {
  id: string;             // unique line id ("{itemId}::{variant}::{spice}")
  itemId: string;         // base menu item id (for grouping the same item)
  name: string;
  variant?: string;       // optional size/portion label
  spice?: string;         // optional spice preference (mild/spicy/hot/extra)
  price: number;          // unit price
  qty: number;
  channel: "normal" | "portimao";
  thumbnail?: { initial: string; gradient: string };
}

interface CartState {
  items: CartItem[];
  add: (input: AddInput) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  /** Triggers the cart-icon pulse animation. */
  pulseSeed: number;
  /** Regular (Lisbon) ordering paused by the operator — e.g. while at a pop-up. */
  orderingPaused: boolean;
  /** ISO date regular ordering resumes (shown to customers). */
  resumeDate: string | null;
}

interface AddInput {
  itemId: string;
  name: string;
  variant?: string;
  spice?: string;
  price: number;
  qty?: number;
  channel?: "normal" | "portimao";
  thumbnail?: { initial: string; gradient: string };
}

const STORAGE_KEY = "affys.cart.v1";

const CartContext = createContext<CartState | null>(null);

function buildId(itemId: string, variant?: string, spice?: string) {
  return [itemId, variant ?? "", spice ?? ""].join("::");
}

function readPersisted(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage full / disabled — ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [pulseSeed, setPulseSeed] = useState(0);
  const [orderingPaused, setOrderingPaused] = useState(false);
  const [resumeDate, setResumeDate] = useState<string | null>(null);

  // Pull the operator flags (daily-ordering pause + resume date) once on mount.
  useEffect(() => {
    let active = true;
    fetchStoreFlags()
      .then((f) => {
        if (!active) return;
        setOrderingPaused(f.dailyOrderingPaused);
        setResumeDate(f.dailyResumeDate);
      })
      .catch(() => {
        /* keep defaults — ordering stays live */
      });
    return () => {
      active = false;
    };
  }, []);

  // Hydrate from localStorage once on mount.
  // We deliberately keep initial state empty (so SSR + first client render
  // match — no hydration mismatch) and read storage in an effect. The lint
  // rule warns about setState in effect, but this is the legit
  // hydrate-after-mount pattern for external storage.
  useEffect(() => {
    const persisted = readPersisted();
    if (persisted.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(persisted);
  }, []);

  // Sync to localStorage on item changes (but not the initial mount when empty)
  useEffect(() => {
    persist(items);
  }, [items]);

  const add = useCallback(
    (input: AddInput) => {
    const channel = input.channel ?? "normal";
    // Regular Lisbon ordering is paused — block normal items (Portimão preorders
    // are unaffected). The UI also disables the buttons; this is a safety net.
    if (orderingPaused && channel === "normal") return;
    const id = buildId(input.itemId, input.variant, input.spice);
    setItems((prev) => {
      const existing = prev.find((x) => x.id === id);
      if (existing) {
        return prev.map((x) =>
          x.id === id ? { ...x, qty: x.qty + (input.qty ?? 1) } : x,
        );
      }
      return [
        ...prev,
        {
          id,
          itemId: input.itemId,
          name: input.name,
          variant: input.variant,
          spice: input.spice,
          price: input.price,
          qty: input.qty ?? 1,
          channel,
          thumbnail: input.thumbnail,
        },
      ];
    });
    setPulseSeed((n) => n + 1);
    },
    [orderingPaused],
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const update = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((x) => x.id !== id)
        : prev.map((x) => (x.id === id ? { ...x, qty } : x)),
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
    [items],
  );
  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items],
  );

  const value: CartState = {
    items,
    add,
    remove,
    update,
    clear,
    subtotal,
    count,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    checkoutOpen,
    openCheckout: () => {
      setDrawerOpen(false);
      setCheckoutOpen(true);
    },
    closeCheckout: () => setCheckoutOpen(false),
    pulseSeed,
    orderingPaused,
    resumeDate,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return ctx;
}
