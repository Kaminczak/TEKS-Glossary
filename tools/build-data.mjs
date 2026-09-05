// Splits src/data/teksData.json (the file the Python pipeline writes) into the
// static JSON the site fetches at runtime, so none of it ends up in the JS bundle:
//
//   public/data/index.json     one slim row per TEK — enough for cards, search,
//                              sidebar counts. ~1/20th the size of the full file.
//   public/data/tek/<slug>.json one full entry per TEK (110.36(1)(B) -> 110-36-1-B),
//                              fetched by the detail page. Prev/next siblings
//                              come from the index, so nothing else is needed.
//   src/data/stats.json        {total, withVideo} — tiny, imported by the landing
//                              page so it can show real numbers without a fetch.
//
// Worksheets: drop a PDF in public/worksheets/ named "<slug> - <Title>.pdf", e.g.
// "110-36-4-G - The Detail Sorter.pdf", and it is attached to that TEK as
// { worksheet: { title, url } } — no JSON to edit. The slug is the same one the
// video keys use (110.36(4)(G) -> 110-36-4-G).
//
// Runs automatically before `vite dev` and `vite build` (see package.json).
// public/data/ is gitignored; stats.json is committed so a stale count can't ship.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src", "data", "teksData.json");
const outDir = join(root, "public", "data");

const teks = JSON.parse(readFileSync(src, "utf8"));
const hasVideo = (t) => !!(t.explainerVideo?.videoUrl || t.explainerVideo?.youtubeId);
// Cards clamp the blurb to two lines, so the index only needs the opening of it.
const blurb = (s = "", max = 180) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max).replace(/\s+\S*$/, "");
  return `${cut}…`;
};

// Same slug the R2 video keys use: 110.36(7)(D)(i) -> 110-36-7-D-i
export const tekSlug = (code) => code.replace(/[().]+/g, "-").replace(/-+$/, "");

const wsDir = join(root, "public", "worksheets");
const worksheets = new Map(); // slug -> { title, url }
if (existsSync(wsDir)) {
  for (const f of readdirSync(wsDir)) {
    const m = /^(\S+) - (.+)\.pdf$/i.exec(f);
    if (m) worksheets.set(m[1], { title: m[2], url: `/worksheets/${f}` });
  }
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const index = teks.map((t) => ({
  code: t.code,
  title: t.title,
  course: t.course,
  courseCode: String(t.courseCode),
  letter: t.letter,
  strand: t.strand,
  substrand: t.substrand || null,
  dok: t.dok,
  hasVideo: hasVideo(t),
  hasWorksheet: worksheets.has(tekSlug(t.code)),
  studentFriendly: blurb(t.studentFriendly),
  displayTags: t.displayTags || [],
}));
writeFileSync(join(outDir, "index.json"), JSON.stringify(index));

const byCourse = new Map();
mkdirSync(join(outDir, "tek"), { recursive: true });
for (const t of teks) {
  const key = String(t.courseCode);
  if (!byCourse.has(key)) byCourse.set(key, []);
  byCourse.get(key).push(t);
  const ws = worksheets.get(tekSlug(t.code));
  writeFileSync(
    join(outDir, "tek", `${tekSlug(t.code)}.json`),
    JSON.stringify({ ...t, courseCode: key, ...(ws ? { worksheet: ws } : {}) })
  );
}

const stats = {
  total: teks.length,
  withVideo: teks.filter(hasVideo).length,
  courses: Object.fromEntries([...byCourse].map(([c, e]) => [c, e.length])),
};
writeFileSync(join(root, "src", "data", "stats.json"), JSON.stringify(stats, null, 2) + "\n");

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)} KB`;
console.log(
  `data: ${teks.length} TEKS → index.json ${kb(JSON.stringify(index))}, ` +
  `${teks.length} per-TEK files, ${stats.withVideo} with video, ${worksheets.size} worksheets`
);
