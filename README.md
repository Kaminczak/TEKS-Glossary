# TEKS Glossary

A teacher-facing reference for the Texas Essential Knowledge and Skills (TEKS),
designed to help educators understand each student expectation — what the
standard actually means, how to teach it, the common misconceptions, and the
question stems STAAR uses to assess it.

This repo is the public prototype of the glossary page. The full vault and
content-generation pipeline live in a separate project.

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
`.github/workflows/deploy.yml`. Live site:
**https://Kaminczak.github.io/TEKS-Glossary/**

## Stack

- React 19 + Vite 6
- Tailwind CSS 4 (CSS-first config in `index.css`)
- Inline Tabler icons (MIT licensed)
- No external CDN dependencies beyond Google Fonts

## License

Content (TEK explanations, misconceptions, stems) © Steve Kaminczak.
Code MIT.
