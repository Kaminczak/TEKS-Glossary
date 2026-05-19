import { useEffect, useState } from "react";

/**
 * Tiny hash router that parses `window.location.hash` into a structured route.
 *
 * Hash schema:
 *   #/                          → { view: 'list' }
 *   #/list                      → { view: 'list' }
 *   #/tek/110.36/1B             → { view: 'detail', courseCode: '110.36', letter: '1B' }
 *   #/tek/110.36/7D/i           → { view: 'detail', courseCode: '110.36', letter: '7D', roman: 'i' }
 *   #/admin/toolkit             → { view: 'admin', subview: 'toolkit' }
 *
 * Returns { route, navigate }. `navigate(path)` sets the hash, e.g.
 *   navigate('/tek/110.36/1B')
 * which becomes `#/tek/110.36/1B` and triggers a re-render.
 */
export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    // Catch programmatic changes via assignment too
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const route = parseHash(hash);

  const navigate = (path) => {
    // Path must start with "/" — we set the hash including the leading "#"
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (window.location.hash !== `#${normalized}`) {
      window.location.hash = normalized;
    }
  };

  return { route, navigate };
}

function parseHash(hash) {
  // Strip leading "#" and "/" then split
  const path = hash.replace(/^#\/?/, "");
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0 || parts[0] === "list") {
    return { view: "list" };
  }

  if (parts[0] === "tek") {
    const courseCode = parts[1];
    const letter = parts[2];
    const roman = parts[3]; // optional for sub-letters like 7D.i
    return { view: "detail", courseCode, letter, roman: roman || null };
  }

  if (parts[0] === "admin") {
    return { view: "admin", subview: parts[1] || "toolkit" };
  }

  // Unknown route — default to list
  return { view: "list" };
}

/**
 * Reconstruct a TEK code from its courseCode + letter[.roman]
 * e.g. ('110.36', '1B') -> '110.36(1)(B)'
 *      ('110.36', '7D', 'i') -> '110.36(7)(D)(i)'
 */
export function reconstructCode(courseCode, letter, roman) {
  if (!courseCode || !letter) return null;
  const m = /^(\d+)([A-Z])$/.exec(letter);
  if (!m) return null;
  const stdNum = m[1];
  const expLetter = m[2];
  let code = `${courseCode}(${stdNum})(${expLetter})`;
  if (roman) code += `(${roman})`;
  return code;
}

/**
 * Build a hash path for a TEK entry. Entry must have at least { courseCode, letter }.
 * Roman numeral sub-letters are encoded with a slash separator: '7D.i' -> '/7D/i'
 */
export function tekPath(entry) {
  if (!entry?.courseCode || !entry?.letter) return "/";
  // Letter might be "1B" or "7D.i" — split on dot
  const [base, roman] = entry.letter.split(".");
  return `/tek/${entry.courseCode}/${base}${roman ? `/${roman}` : ""}`;
}
