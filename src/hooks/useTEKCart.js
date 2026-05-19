import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "teks-glossary.lesson-cart.v1";

/**
 * Persistent "Lesson Cart" — an ordered list of TEK codes the teacher
 * has flagged for use by an upcoming worksheet / lesson / assessment /
 * exit ticket. Backed by localStorage so it survives reloads on the
 * same device. No cross-device sync yet (would need a backend).
 *
 * Returns:
 *   cart        — string[] of TEK codes in the order they were added
 *   add(code)   — append to cart if not already present
 *   remove(code)— drop the code from the cart
 *   toggle(code)— add if missing, remove if present
 *   has(code)   — boolean
 *   clear()     — empty the cart
 *   count       — cart.length
 */
export function useTEKCart() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Persist on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // localStorage can throw if disabled / quota — silent failure is fine
    }
  }, [cart]);

  // Listen for changes from other tabs of the same site
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : [];
        if (Array.isArray(parsed)) setCart(parsed);
      } catch {
        // ignore malformed cross-tab updates
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((code) => {
    setCart((prev) => (prev.includes(code) ? prev : [...prev, code]));
  }, []);

  const remove = useCallback((code) => {
    setCart((prev) => prev.filter((c) => c !== code));
  }, []);

  const toggle = useCallback((code) => {
    setCart((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }, []);

  const has = useCallback((code) => cart.includes(code), [cart]);

  const clear = useCallback(() => setCart([]), []);

  return { cart, add, remove, toggle, has, clear, count: cart.length };
}
