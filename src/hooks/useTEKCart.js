import { useSyncExternalStore } from "react";

/**
 * Persistent "Lesson Cart" — an ordered list of TEK codes the teacher
 * has flagged for use by an upcoming worksheet / lesson / assessment /
 * exit ticket. Backed by localStorage so it survives reloads on the
 * same device.
 *
 * Single shared store at module scope so every component using
 * useTEKCart() sees the same cart and re-renders on any change,
 * regardless of which component made the change.
 */

const STORAGE_KEY = "teks-glossary.lesson-cart.v1";

function readFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeToStorage(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // disabled / quota — silent failure is fine
  }
}

// Stable empty-array reference so getSnapshot() returns the same value when
// nothing has changed (required by useSyncExternalStore — different array
// identities trigger spurious re-renders / "infinite loop" warnings).
const EMPTY = [];

let state = readFromStorage();
const listeners = new Set();

function setState(next) {
  if (next === state) return;
  state = next;
  writeToStorage(state);
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

// Cross-tab sync: a change in another tab updates this tab's store
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      const parsed = e.newValue ? JSON.parse(e.newValue) : EMPTY;
      if (Array.isArray(parsed)) {
        state = parsed;
        listeners.forEach((l) => l());
      }
    } catch {
      // ignore malformed cross-tab updates
    }
  });
}

// Actions — closures over the module-level state. Each call computes the next
// array and pushes it through setState, which notifies all subscribers.
function add(code) {
  setState(state.includes(code) ? state : [...state, code]);
}
function remove(code) {
  setState(state.filter((c) => c !== code));
}
function toggle(code) {
  setState(state.includes(code) ? state.filter((c) => c !== code) : [...state, code]);
}
function clear() {
  setState(EMPTY);
}

export function useTEKCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    cart,
    add,
    remove,
    toggle,
    clear,
    has: (code) => cart.includes(code),
    count: cart.length,
  };
}
