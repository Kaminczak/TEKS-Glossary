# Kaizen.School

The site at **https://kaizen.school**: a landing page for Steve Kaminczak's work,
and the TEKS Glossary — a teacher-facing reference for the Texas Essential
Knowledge and Skills, designed to help educators understand each student
expectation — what the standard actually means, how to teach it, the common
misconceptions, and the question stems STAAR uses to assess it.

The full vault and content-generation pipeline live in the parent project; this
repo is the site that serves them.

## Routes

| Path | What it is |
|---|---|
| `/` | Landing page — three doors: the glossary, the explainer videos, the Genre Machine |
| `/teks` | Browse all 278 English I–IV TEKS (query string carries filters: `?course=English+I&strand=…&dok=3`) |
| `/teks?video=1` | Only the TEKS with a teacher explainer video |
| `/teks/110.36/1B` | One TEK's glossary entry (`/teks/{courseCode}/{standard+letter}[/{roman}]`) |
| `/admin/toolkit` | Unlinked admin tools (TipTap editor, SSE client) |

Old hash links (`#/tek/110.36/1B`, `#/list/course/English%20I`) still resolve —
`src/hooks/useRoute.js` rewrites them to the path form on load. Deep links and
refreshes work on GitHub Pages via the `public/404.html` shim.

## Data

`src/data/teksData.json` is the source of truth the Python pipeline writes to.
It is **not** bundled: `tools/build-data.mjs` (run automatically before `dev` and
`build`) splits it into `public/data/index.json` (one slim row per TEK, for cards,
search, sidebar counts, and prev/next) and `public/data/tek/<slug>.json` (one full
entry per TEK, fetched by the detail page), and writes `src/data/stats.json` for
the counts on the landing page. `public/data/` is gitignored.

## What you're looking at

A single TEK detail page rendered in React, themed in a warm parchment palette
with subject-color accents (Pine for ELA, Brick for Math, Indigo for Science,
Saddle for Social Studies). Each TEK page contains:

- **Standard Expectation** — the TEA verbatim language
- **Student-Friendly Explanation** — translated for the room
- **What Mastery Looks Like** — observable behaviors
- **Question Stems** — the STAAR-style phrasings to recognize
- **Common Misconceptions** — provocative, specific, classroom-real
- **Tips & Video Explainer** — Mr. K walking through the skill
- **AI Generators** — worksheet, exit ticket, warm-up, assessment,
  lesson plan, differentiated versions — generated against the TEK
  source-of-truth, not vague prompts

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173/

## Deploy

`main` branch deploys automatically to GitHub Pages via the workflow in
`.github/workflows/deploy.yml`, served on the custom domain
**https://kaizen.school** (`public/CNAME`). Explainer videos are served from
Cloudflare R2, not this repo.

`public/og.png`, `favicon.ico`, and `apple-touch-icon.png` are committed
assets; regenerate them with `python tools/og/render.py` if the wordmark or
thesis line changes.

## Stack

- React 19 + Vite 6
- Tailwind CSS 4 (CSS-first config in `index.css`)
- Inline Tabler icons (MIT licensed)
- No external CDN dependencies beyond Google Fonts

## License

Content (TEK explanations, misconceptions, stems) © Steve Kaminczak.
Code MIT.
