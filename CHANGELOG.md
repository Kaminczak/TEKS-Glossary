# Changelog

## 2026-09-04 — Landing page, `/teks`, and the audit fixes

**Landing page at `/`, glossary moved to `/teks`.** Kaizen.School now opens on
one screen — name, thesis line, three doors (TEKS Glossary → `/teks`, Teacher
Explainer Videos → `/teks?video=1`, The Genre Machine → thegenremachine.com) —
with a short about and a footer. Same parchment system as the glossary. The
hash router was replaced by a History-API path router (`src/hooks/useRoute.js`);
old `#/tek/…` and `#/list/…` links are rewritten on load so nothing shared
before today breaks. The sidebar "Home" item and a new "Kaizen.School" wordmark
in both glossary top bars go to `/`.

**Audit fixes, one commit each:**

1. Card strand label no longer clips mid-word ("Foundatior Languag…"). It wraps
   freely at 14px; on narrow cards the course/DOK block drops under it. Three-up
   grid now starts at `xl` (1280px) instead of `lg`.
2. Video count reconciled. 272 of 278 TEKS have an mp4 in the R2 map; the six
   without — `110.37(8)(A)`, `(B)`, `(C)`, `(E)`, `(F)`, `(G)` — have local renders
   but were never uploaded (the upload manifest predates them). Label now reads
   "272 of 278 with video"; "more in production" is gone.
3. Casing: **TEKS** everywhere in the UI (top bar, h1, badge, section headers,
   sidebar).
4. `<head>` metadata: description, canonical (kept in step with the route),
   Open Graph + Twitter cards with a generated 1200×630 `og.png`, SVG favicon,
   `favicon.ico`, `apple-touch-icon.png`, theme-color, font preconnects.
   `tools/og/render.py` regenerates the images.
5. Bundle: glossary data is no longer inlined. `tools/build-data.mjs` (prebuild)
   splits `teksData.json` into `public/data/index.json` (one slim row per TEK)
   and `public/data/tek/<slug>.json` (one full entry each, ~7 KB), fetched on
   demand. Routes are code-split; the card grid renders 24 cards and streams the
   rest on scroll; the featured-video strip shows 6 with a "See all".

   | | JS on first load | Data fetched |
   |---|---|---|
   | Before | 2,784.7 KB (792.8 KB gzip), one chunk | none (all inlined) |
   | After, `/` | 209.0 KB (66.1 KB gzip) | none |
   | After, `/teks` | 209.0 + 18.8 + 9.8 KB (≈76 KB gzip) | `index.json`, 143 KB |
   | After, `/teks/…` | 209.0 + 17.0 + 9.8 KB (≈75 KB gzip) | one TEK, ~7 KB, plus `index.json` for the sidebar |

   The 200 KB target for `/` is missed by 9 KB: the entry chunk is React and
   react-dom (~190 KB of the 209) plus the landing page and router.
6. GitHub Pages SPA routing: `public/404.html` bounces unknown paths to
   `/?/…` and a script in `index.html` restores the URL before React mounts.
   Cloudflare Pages was not set up for this repo (only R2), so hosting stays put.
7. Lighthouse pass (mobile, `/`, `/teks`, `/teks/110.36/1B`): contrast on the
   muted labels, `aria-label` on the selects and search inputs, 24px touch
   targets on the card filter buttons, visible focus rings, dead
   "Standards / Resources / Glossary" links removed from the detail top bar,
   Manrope loaded from `<head>` (non-blocking) instead of a CSS `@import`
   chain, `robots.txt`. Detail pages now fetch one ~7 KB TEK file instead of a
   550 KB course file.

   | Page | Perf | A11y | Best practices | SEO | FCP | LCP |
   |---|---|---|---|---|---|---|
   | `/` | 100 | 100 | 100 | 100 | 1.2 s | 1.2 s |
   | `/teks` | 98 | 100 | 100 | 100 | 1.3 s | 2.3 s |
   | `/teks/110.36/1B` | 96 | 100 | 100 | 100 | 1.3 s | 2.7 s |

   (Lighthouse 12 simulated Moto G / slow 4G against `vite preview`.) The "under
   1 s" first-paint target for the glossary lands at 1.3 s on that throttle; the
   remaining cost is the render-blocking app CSS and React itself.
