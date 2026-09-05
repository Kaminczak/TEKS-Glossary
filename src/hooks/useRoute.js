import { useCallback, useEffect, useState } from "react";

/**
 * Path router on the History API. Replaced the hash router on 2026-09-04 when
 * the landing page took over `/` and the glossary moved to `/teks`.
 *
 * Routes:
 *   /                                → { view: 'landing' }
 *   /teks                            → { view: 'list', filters }
 *   /teks?course=English+I&strand=…  → list with filters (course, strand,
 *                                      substrand, dok, video=1)
 *   /teks/110.36/1B                  → { view: 'detail', courseCode, letter }
 *   /teks/110.36/7D/i                → detail with roman sub-letter
 *   /admin/toolkit                   → { view: 'admin', subview }
 *
 * Legacy hash URLs (`#/tek/110.36/1B`, `#/list/course/English%20I`) still
 * resolve: on first load they are rewritten to the path form with
 * history.replaceState so old shared links keep working.
 *
 * GitHub Pages serves 404.html for unknown paths; that file bounces to
 * `/?/teks/110.36/1B` and the inline script in index.html restores the real
 * path before React mounts, so this hook only ever sees clean pathnames.
 */

// Vite's base is "/" on the custom domain. If the site ever moves back under a
// repo sub-path (see vite.config.js), BASE strips/adds that prefix here.
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function stripBase(pathname) {
  if (BASE && pathname.startsWith(BASE)) return pathname.slice(BASE.length) || "/";
  return pathname;
}

function readLocation() {
  return { path: stripBase(window.location.pathname), search: window.location.search };
}

/** Translate an old `#/…` hash into a path route, or null if it isn't one. */
export function legacyHashToPath(hash) {
  if (!hash || hash === "#") return null;
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (parts.length === 0) return "/teks"; // "#/" used to be the browse page
  if (parts[0] === "list") {
    const filters = {};
    for (let i = 1; i < parts.length - 1; i += 2) filters[parts[i]] = parts[i + 1];
    return listPath(filters);
  }
  if (parts[0] === "tek" && parts[1] && parts[2]) {
    return `/teks/${parts[1]}/${parts[2]}${parts[3] ? `/${parts[3]}` : ""}`;
  }
  if (parts[0] === "admin") return `/admin/${parts[1] || "toolkit"}`;
  return null;
}

export function useRoute() {
  const [loc, setLoc] = useState(() => {
    const legacy = legacyHashToPath(window.location.hash);
    if (legacy) window.history.replaceState(null, "", BASE + legacy);
    return readLocation();
  });

  useEffect(() => {
    const onPop = () => setLoc(readLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((path, { replace = false } = {}) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const current = readLocation();
    if (normalized === current.path + current.search) return;
    window.history[replace ? "replaceState" : "pushState"](null, "", BASE + normalized);
    setLoc(readLocation());
  }, []);

  return { route: parseLocation(loc), navigate };
}

function parseLocation({ path, search }) {
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) return { view: "landing" };

  if (parts[0] === "teks") {
    if (parts.length === 1) {
      const params = new URLSearchParams(search);
      const filters = {};
      for (const key of ["course", "strand", "substrand", "dok", "video"]) {
        const v = params.get(key);
        if (v) filters[key] = v;
      }
      return { view: "list", filters };
    }
    if (parts[1] && parts[2]) {
      return { view: "detail", courseCode: parts[1], letter: parts[2], roman: parts[3] || null };
    }
    return { view: "notfound", path };
  }

  if (parts[0] === "admin") return { view: "admin", subview: parts[1] || "toolkit" };

  return { view: "notfound", path };
}

/**
 * Props for an <a> that navigates client-side on a plain left click but still
 * works as a normal link (open in new tab, copy address, crawlers).
 */
export function linkProps(navigate, to) {
  return {
    href: BASE + to,
    onClick: (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
    },
  };
}

/**
 * Reconstruct a TEK code from its courseCode + letter[.roman]
 * e.g. ('110.36', '1B') -> '110.36(1)(B)'
 *      ('110.36', '7D', 'i') -> '110.36(7)(D)(i)'
 */
export function reconstructCode(courseCode, letter, roman) {
  if (!courseCode || !letter) return null;
  // Standalone-standard TEKS (like 110.36(3) Self-Sustained Reading) have
  // no expectation letter — letter is just the standard number.
  const bareNum = /^(\d+)$/.exec(letter);
  if (bareNum) {
    return `${courseCode}(${bareNum[1]})`;
  }
  const m = /^(\d+)([A-Z]+)$/.exec(letter);
  if (!m) return null;
  const stdNum = m[1];
  const expLetter = m[2];
  let code = `${courseCode}(${stdNum})(${expLetter})`;
  if (roman) code += `(${roman})`;
  return code;
}

/**
 * Path for a TEK entry. Entry must have at least { courseCode, letter }.
 * Roman numeral sub-letters are encoded with a slash: '7D.i' -> '/7D/i'
 */
export function tekPath(entry) {
  if (!entry?.courseCode || !entry?.letter) return "/teks";
  const [base, roman] = entry.letter.split(".");
  return `/teks/${entry.courseCode}/${base}${roman ? `/${roman}` : ""}`;
}

/**
 * Path for the list view with optional filters.
 *   listPath({ course: 'English I', strand: 'Response Skills' })
 *     -> '/teks?course=English+I&strand=Response+Skills'
 */
export function listPath(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== null && val !== "") params.set(key, String(val));
  }
  const qs = params.toString();
  return qs ? `/teks?${qs}` : "/teks";
}
