"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  category?: string;
  qty: number;
  course_desc?: string;  
  hours?: number;  
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartState | null>(null);
const LS_KEY = "educandle_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false); // 👈 New flag

  // 1️⃣ Load from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Error loading cart:", e);
    } finally {
      setHydrated(true); // ✅ mark hydration done
    }
  }, []);

  // 2️⃣ Save to localStorage only *after* hydration
  useEffect(() => {
    if (!hydrated) return; // 🧠 skip first render
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart:", e);
    }
  }, [items, hydrated]);

  const addItem: CartState["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem: CartState["removeItem"] = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const setQty: CartState["setQty"] = (id, qty) =>
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
    );

  const clearCart = () => setItems([]);

  const count = items.reduce((n, it) => n + it.qty, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQty, clearCart, count, subtotal }),
    [items, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
