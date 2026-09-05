// Splits src/data/teksData.json (the file the Python pipeline writes) into the
// static JSON the site fetches at runtime, so none of it ends up in the JS bundle:
//
//   public/data/index.json     one slim row per TEK — enough for cards, search,
//                              sidebar counts. ~1/20th the size of the full file.
//   public/data/<course>.json  full entries for one course, fetched on the detail
//                              page (and for prev/next siblings).
//   src/data/stats.json        {total, withVideo} — tiny, imported by the landing
//                              page so it can show real numbers without a fetch.
//
// Runs automatically before `vite dev` and `vite build` (see package.json).
// public/data/ is gitignored; stats.json is committed so a stale count can't ship.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
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
  studentFriendly: blurb(t.studentFriendly),
  displayTags: t.displayTags || [],
}));
writeFileSync(join(outDir, "index.json"), JSON.stringify(index));

const byCourse = new Map();
for (const t of teks) {
  const key = String(t.courseCode);
  if (!byCourse.has(key)) byCourse.set(key, []);
  byCourse.get(key).push({ ...t, courseCode: key });
}
for (const [code, entries] of byCourse) {
  writeFileSync(join(outDir, `${code}.json`), JSON.stringify(entries));
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
  `${byCourse.size} course files, ${stats.withVideo} with video`
);
