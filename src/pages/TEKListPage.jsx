import { useMemo, useState } from "react";
import teksData from "../data/teksData.json";
import { tekPath } from "../hooks/useHashRoute";
import {
  IconSearch, IconNotebook, IconArrowUpRight, IconBrain,
} from "../components/icons/TablerIcons";

const PALETTE = {
  parchment: "#F6F2EC",
  bone: "#FFFDF7",
  linen: "#FAF6ED",
  sand: "#F1ECE3",
  oat: "#F1E9D6",
  ink: "#0E0C0A",
  inkPrimary: "#1A1713",
  inkSecondary: "#3C352D",
  inkTertiary: "#5A5148",
  monoGold: "#6B5E3C",
  stone: "#8A7F73",
  boneStone: "#BFB4A3",
  hairline: "rgba(26,23,19,0.05)",
  soft: "rgba(26,23,19,0.08)",
  standardBorder: "rgba(26,23,19,0.10)",
  tagBorder: "rgba(26,23,19,0.12)",
};

// Course → CSS accent (oklch). Same lightness/chroma per HANDOFF.md doctrine.
const COURSE_ACCENT = {
  "English I": "oklch(0.45 0.08 150)", // Pine
  "English II": "oklch(0.45 0.08 150)",
  "English III": "oklch(0.45 0.08 150)",
  "English IV": "oklch(0.45 0.08 150)",
};

const COURSES = ["All courses", "English I", "English II", "English III", "English IV"];

// Strands available across the data — derived once.
const ALL_STRANDS = (() => {
  const s = new Set();
  teksData.forEach((t) => t.strand && s.add(t.strand));
  return ["All strands", ...Array.from(s).sort()];
})();

function TEKCard({ tek, onOpen }) {
  return (
    <button
      onClick={() => onOpen(tek)}
      className="text-left flex flex-col gap-3 p-5 rounded-2xl transition-all duration-200 group"
      style={{
        background: PALETTE.bone,
        border: `1px solid ${PALETTE.tagBorder}`,
        boxShadow: "0 1px 0 rgba(255,253,247,0.6) inset",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px -8px rgba(26,23,19,0.18)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,253,247,0.6) inset";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold"
          style={{
            background: PALETTE.ink,
            color: "#D9BE7A",
            letterSpacing: "0.03em",
          }}
        >
          {tek.code}
        </span>
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--accent)" }}
        >
          <IconArrowUpRight size={16} />
        </span>
      </div>

      <h3
        className="text-base font-semibold leading-snug"
        style={{ color: PALETTE.inkPrimary }}
      >
        {tek.title}
      </h3>

      {tek.studentFriendly && (
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: PALETTE.inkSecondary }}
        >
          {tek.studentFriendly}
        </p>
      )}

      <div
        className="mt-auto pt-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em]"
        style={{ color: PALETTE.monoGold, borderTop: `1px solid ${PALETTE.hairline}` }}
      >
        <span>{tek.course}</span>
        <span className="flex items-center gap-1.5">
          <IconBrain size={12} /> DOK {tek.dok}
        </span>
      </div>

      <div className="text-[11px]" style={{ color: PALETTE.inkTertiary }}>
        {tek.strand}
        {tek.substrand ? ` · ${tek.substrand}` : ""}
      </div>
    </button>
  );
}

function TopBar({ search, setSearch, course, setCourse, strand, setStrand, count }) {
  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-3 px-6 lg:px-10 h-14 flex-wrap"
      style={{ background: PALETTE.bone, borderBottom: `1px solid ${PALETTE.standardBorder}` }}
    >
      <span className="font-semibold tracking-tight" style={{ color: PALETTE.inkPrimary }}>
        TEKS Glossary
      </span>
      <span
        className="text-[10px] font-mono uppercase tracking-[0.22em]"
        style={{ color: PALETTE.monoGold }}
      >
        {count} / {teksData.length} TEKs
      </span>

      <div
        className="ml-auto flex items-center gap-2 w-72 max-w-full px-3 py-1.5 rounded-md"
        style={{ background: PALETTE.sand, border: `1px solid ${PALETTE.soft}` }}
      >
        <span style={{ color: PALETTE.stone }}>
          <IconSearch size={14} />
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search code, title, or keyword…"
          className="bg-transparent outline-none w-full text-sm"
          style={{ color: PALETTE.inkPrimary }}
        />
      </div>

      <select
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        className="text-sm px-3 py-1.5 rounded-md outline-none"
        style={{
          background: PALETTE.sand,
          border: `1px solid ${PALETTE.soft}`,
          color: PALETTE.inkPrimary,
        }}
      >
        {COURSES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={strand}
        onChange={(e) => setStrand(e.target.value)}
        className="text-sm px-3 py-1.5 rounded-md outline-none max-w-[14rem]"
        style={{
          background: PALETTE.sand,
          border: `1px solid ${PALETTE.soft}`,
          color: PALETTE.inkPrimary,
        }}
      >
        {ALL_STRANDS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function TEKListPage({ navigate }) {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All courses");
  const [strand, setStrand] = useState("All strands");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teksData.filter((t) => {
      if (course !== "All courses" && t.course !== course) return false;
      if (strand !== "All strands" && t.strand !== strand) return false;
      if (!q) return true;
      const hay = [
        t.code,
        t.title,
        t.studentFriendly,
        t.overview,
        t.expectation,
        ...(t.displayTags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [search, course, strand]);

  // Group filtered TEKs by course → strand for visual clarity.
  const grouped = useMemo(() => {
    const m = new Map();
    for (const t of filtered) {
      if (!m.has(t.course)) m.set(t.course, new Map());
      const strandMap = m.get(t.course);
      const key = t.strand || "Other";
      if (!strandMap.has(key)) strandMap.set(key, []);
      strandMap.get(key).push(t);
    }
    return m;
  }, [filtered]);

  const handleOpen = (tek) => {
    navigate(tekPath(tek));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        "--accent": "oklch(0.45 0.08 150)", // ELA Pine — list page is course-agnostic
        background: PALETTE.parchment,
        color: PALETTE.inkPrimary,
        fontFamily: '"Manrope", system-ui, sans-serif',
      }}
    >
      <TopBar
        search={search}
        setSearch={setSearch}
        course={course}
        setCourse={setCourse}
        strand={strand}
        setStrand={setStrand}
        count={filtered.length}
      />

      <main className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
        <header className="mb-8">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em]"
            style={{ color: PALETTE.monoGold }}
          >
            Texas Essential Knowledge and Skills · English Language Arts
          </p>
          <h1
            className="font-semibold leading-tight mt-2"
            style={{
              color: PALETTE.inkPrimary,
              fontSize: "clamp(1.85rem, 2.4vw + 1rem, 2.8rem)",
            }}
          >
            Browse the TEKs Glossary
          </h1>
          <p className="mt-3 text-base leading-relaxed max-w-2xl" style={{ color: PALETTE.inkSecondary }}>
            Every English I–IV TEK, translated for teachers — what the standard means,
            how to teach it, the misconceptions to watch for, and the STAAR-style stems
            students will see. Click any card to open the full glossary entry.
          </p>
        </header>

        {filtered.length === 0 ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: PALETTE.bone, border: `1px solid ${PALETTE.standardBorder}` }}
          >
            <p style={{ color: PALETTE.inkTertiary }}>No TEKs match your filters.</p>
          </div>
        ) : (
          // When a filter is active that flattens results, just show a grid.
          // Otherwise, group by course → strand with section headers for orientation.
          course !== "All courses" || strand !== "All strands" || search ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => (
                <TEKCard key={t.code} tek={t} onOpen={handleOpen} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {Array.from(grouped.entries()).map(([courseName, strandMap]) => (
                <section key={courseName}>
                  <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
                    <h2
                      className="font-semibold"
                      style={{
                        color: PALETTE.inkPrimary,
                        fontSize: "1.4rem",
                      }}
                    >
                      {courseName}
                    </h2>
                    <span
                      className="text-[10px] font-mono uppercase tracking-[0.22em]"
                      style={{ color: PALETTE.monoGold }}
                    >
                      {Array.from(strandMap.values()).reduce((s, arr) => s + arr.length, 0)} TEKs
                    </span>
                  </div>

                  <div className="flex flex-col gap-6">
                    {Array.from(strandMap.entries()).map(([strandName, items]) => (
                      <div key={strandName}>
                        <p
                          className="text-[11px] font-mono uppercase tracking-[0.22em] mb-3"
                          style={{ color: PALETTE.inkTertiary }}
                        >
                          {strandName}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {items.map((t) => (
                            <TEKCard key={t.code} tek={t} onOpen={handleOpen} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
