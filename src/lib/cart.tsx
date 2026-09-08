"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * One cart for the whole site: membership plans, paid downloads and free
 * worksheets. Prices here are for display only — createCartOrder recomputes
 * every line from its own catalog before charging anything.
 */
export type CartKind = "membership" | "product";

export interface CartItem {
  /** Plan id for a membership, catalog id for a product. */
  id: string;
  kind: CartKind;
  name: string;
  price: number;
  qty: number;
  /** Sibling discount on additional memberships, e.g. 0.1 for 10% off. */
  siblingDiscount?: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  hasMembership: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "vetaasCart";

/** Additional memberships are discounted; downloads are one per household. */
export function lineTotal(item: CartItem) {
  if (item.kind === "membership") {
    const discount = item.siblingDiscount ?? 0;
    return Math.round(item.price + (item.qty - 1) * item.price * (1 - discount));
  }
  return Math.round(item.price);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Nothing renders cart contents until the stored cart has been read, so the
  // server-rendered markup and the first client render agree.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing) return [...prev, { ...item, qty }];
      // Downloads are per-household, so re-adding one is a no-op.
      if (item.kind === "product") return prev;
      return prev.map((i) =>
        i.id === item.id ? { ...i, qty: Math.min(20, i.qty + qty) } : i
      );
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(20, qty)) } : i))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      total: items.reduce((sum, i) => sum + lineTotal(i), 0),
      hasMembership: items.some((i) => i.kind === "membership"),
      add,
      setQty,
      remove,
      clear,
      ready,
    }),
    [items, add, setQty, remove, clear, ready]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export const fmtINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
