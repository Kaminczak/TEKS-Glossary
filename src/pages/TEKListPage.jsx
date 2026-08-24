import { useEffect, useMemo, useState } from "react";
import teksData from "../data/teksData.json";
import { tekPath, listPath } from "../hooks/useHashRoute";
import Sidebar from "../components/Sidebar";
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

// Strand → accent color. Tuned to harmonize with the parchment/ink palette.
// Each strand gets a single canonical color; substrand variations are conveyed
// via the strand+substrand line at the bottom of each card.
export const STRAND_COLORS = {
  "Foundational Language Skills": "oklch(0.45 0.08 150)", // Pine
  "Comprehension Skills":         "oklch(0.42 0.13 25)",  // Burgundy
  "Response Skills":              "oklch(0.48 0.08 240)", // Slate Blue
  "Multiple Genres":              "oklch(0.42 0.10 310)", // Plum
  "Author's Purpose and Craft":   "oklch(0.55 0.10 75)",  // Ochre
  "Composition":                  "oklch(0.50 0.12 35)",  // Terracotta
  "Inquiry & Research":           "oklch(0.40 0.10 165)", // Forest
};

// DOK → brain icon color. Cognitive-depth scale: gray (recall) → green/amber.
export const DOK_COLORS = {
  1: "oklch(0.55 0.02 0)",   // muted gray
  2: "oklch(0.55 0.10 240)", // soft blue
  3: "oklch(0.50 0.13 145)", // green (most common, 171 TEKs)
  4: "oklch(0.60 0.13 75)",  // warm amber/gold
};
export const DOK_LABELS = { 1: "Recall", 2: "Skill", 3: "Strategic", 4: "Extended" };

// Strands available across the data — derived once.
const ALL_STRANDS = (() => {
  const s = new Set();
  teksData.forEach((t) => t.strand && s.add(t.strand));
  return ["All strands", ...Array.from(s).sort()];
})();

// TEKs that already have an explainer video wired — featured at the top of the
// unfiltered browse view so visitors land on working video content first.
const VIDEO_TEKS = teksData.filter(
  (t) => t.explainerVideo?.videoUrl || t.explainerVideo?.youtubeId
);

function TEKCard({ tek, onOpen, onFilter }) {
  const strandColor = STRAND_COLORS[tek.strand] || PALETTE.stone;
  const dokColor = DOK_COLORS[tek.dok] || PALETTE.stone;
  const hasVideo = !!tek.explainerVideo?.videoUrl || !!tek.explainerVideo?.youtubeId;

  // Inner-click helper: stop the outer card-open behavior and call onFilter.
  const filterClick = (e, payload) => {
    e.stopPropagation();
    e.preventDefault();
    onFilter?.(payload);
  };

  return (
    // div + role=button instead of <button> because the card has nested
    // interactive elements (strand/DOK/substrand filter buttons), which
    // <button> can't legally contain.
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(tek)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(tek);
        }
      }}
      className="text-left flex flex-col gap-3 p-5 rounded-2xl transition-all duration-200 group relative cursor-pointer outline-none focus-visible:ring-2"
      style={{
        background: PALETTE.bone,
        // Left rail = strand color (3px), rest subtle
        borderTop: `1px solid ${PALETTE.tagBorder}`,
        borderRight: `1px solid ${PALETTE.tagBorder}`,
        borderBottom: `1px solid ${PALETTE.tagBorder}`,
        borderLeft: `4px solid ${strandColor}`,
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
        <div className="flex items-center gap-2">
          {hasVideo && (
            <span
              title="Has explainer video"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.12em]"
              style={{ background: strandColor, color: PALETTE.bone }}
            >
              ▶ video
            </span>
          )}
        </div>
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
        <button
          type="button"
          onClick={(e) => filterClick(e, { course: tek.course })}
          className="hover:underline underline-offset-2 transition-colors"
          title={`Filter to ${tek.course} only`}
        >
          {tek.course}
        </button>
        <button
          type="button"
          onClick={(e) => filterClick(e, { dok: tek.dok })}
          className="flex items-center gap-1.5 hover:underline underline-offset-2 transition-colors"
          title={`Filter to DOK ${tek.dok} (${DOK_LABELS[tek.dok] || ""}) only`}
        >
          <span style={{ color: dokColor }}>
            <IconBrain size={14} />
          </span>
          DOK {tek.dok}
        </button>
      </div>

      <div className="text-[11px] flex flex-wrap items-center gap-1" style={{ color: PALETTE.inkTertiary }}>
        <button
          type="button"
          onClick={(e) => filterClick(e, { strand: tek.strand })}
          className="hover:underline underline-offset-2 transition-colors"
          title={`Filter to ${tek.strand}`}
          style={{ color: strandColor, fontWeight: 600 }}
        >
          {tek.strand}
        </button>
        {tek.substrand && (
          <>
            <span>·</span>
            <button
              type="button"
              onClick={(e) => filterClick(e, { substrand: tek.substrand })}
              className="hover:underline underline-offset-2 transition-colors"
              title={`Filter to ${tek.substrand}`}
            >
              {tek.substrand}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TopBar({
  search, setSearch,
  course, setCourse,
  strand, setStrand,
  dok, setDok,
  substrand, setSubstrand,
  onClearFilter,
  count,
}) {
  const hasActiveFilters =
    course !== "All courses" ||
    strand !== "All strands" ||
    dok ||
    substrand;

  return (
    <div
      className="sticky top-0 z-30 flex flex-col px-6 lg:px-10 pt-3 pb-2"
      style={{ background: PALETTE.bone, borderBottom: `1px solid ${PALETTE.standardBorder}` }}
    >
    <div className="flex items-center gap-3 flex-wrap">
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

      <select
        value={dok || ""}
        onChange={(e) => setDok(e.target.value ? Number(e.target.value) : null)}
        className="text-sm px-3 py-1.5 rounded-md outline-none"
        style={{
          background: PALETTE.sand,
          border: `1px solid ${PALETTE.soft}`,
          color: PALETTE.inkPrimary,
        }}
      >
        <option value="">All DOK</option>
        <option value="1">DOK 1 · Recall</option>
        <option value="2">DOK 2 · Skill</option>
        <option value="3">DOK 3 · Strategic</option>
        <option value="4">DOK 4 · Extended</option>
      </select>
    </div>

    {/* Active filter chips row — shows what's currently filtered, each clickable to clear.
        Clearing pushes to URL so refresh/back-button stays consistent. */}
    {hasActiveFilters && (
      <div className="flex items-center gap-1.5 flex-wrap mt-2">
        <span
          className="text-[10px] font-mono uppercase tracking-[0.18em]"
          style={{ color: PALETTE.monoGold }}
        >
          Filters:
        </span>
        {course !== "All courses" && (
          <FilterChip
            label={course}
            onClear={() => onClearFilter("course")}
          />
        )}
        {strand !== "All strands" && (
          <FilterChip
            label={strand}
            accent={STRAND_COLORS[strand]}
            onClear={() => onClearFilter("strand")}
          />
        )}
        {substrand && (
          <FilterChip
            label={substrand}
            onClear={() => onClearFilter("substrand")}
          />
        )}
        {dok && (
          <FilterChip
            label={`DOK ${dok} · ${DOK_LABELS[dok] || ""}`}
            accent={DOK_COLORS[dok]}
            onClear={() => onClearFilter("dok")}
          />
        )}
        <button
          type="button"
          onClick={() => onClearFilter("all")}
          className="text-[10px] font-mono uppercase tracking-[0.18em] underline underline-offset-2 ml-1"
          style={{ color: PALETTE.stone }}
        >
          Clear all
        </button>
      </div>
    )}
    </div>
  );
}

function FilterChip({ label, accent, onClear }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] transition-all hover:opacity-80"
      style={{
        background: PALETTE.linen,
        border: `1px solid ${accent || PALETTE.tagBorder}`,
        color: PALETTE.inkSecondary,
      }}
      title="Click to remove this filter"
    >
      {accent && (
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: accent }}
        />
      )}
      <span>{label}</span>
      <span style={{ color: PALETTE.stone, fontSize: 13, lineHeight: 1 }}>×</span>
    </button>
  );
}

export default function TEKListPage({ navigate, initialFilters = {} }) {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState(initialFilters.course || "All courses");
  const [strand, setStrand] = useState(initialFilters.strand || "All strands");
  const [substrand, setSubstrand] = useState(initialFilters.substrand || null);
  const [dok, setDok] = useState(initialFilters.dok ? Number(initialFilters.dok) : null);

  // If URL filters change (back/forward navigation, deep links, click-to-filter
  // from card), sync local state.
  useEffect(() => {
    if (initialFilters.course && initialFilters.course !== course) {
      setCourse(initialFilters.course);
    }
    if (initialFilters.strand && initialFilters.strand !== strand) {
      setStrand(initialFilters.strand);
    }
    const incomingSubstrand = initialFilters.substrand || null;
    if (incomingSubstrand !== substrand) setSubstrand(incomingSubstrand);
    const incomingDok = initialFilters.dok ? Number(initialFilters.dok) : null;
    if (incomingDok !== dok) setDok(incomingDok);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters.course, initialFilters.strand, initialFilters.substrand, initialFilters.dok]);

  // Build the current filter set, including any patch overrides.
  const buildFilters = (patch = {}) => {
    const next = {
      course: patch.course ?? (course !== "All courses" ? course : undefined),
      strand: patch.strand ?? (strand !== "All strands" ? strand : undefined),
      substrand: patch.substrand ?? substrand ?? undefined,
      dok: patch.dok ?? dok ?? undefined,
    };
    return Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
  };

  // Click-to-filter from cards: merge new filter dim into current state, push to URL.
  const handleCardFilter = (patch) => {
    navigate(listPath(buildFilters(patch)));
  };

  // Chip-clear / clear-all: remove a single filter dim from URL (or all of them).
  const handleClearFilter = (key) => {
    if (key === "all") {
      navigate(listPath({}));
      return;
    }
    const current = buildFilters();
    delete current[key];
    navigate(listPath(current));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teksData.filter((t) => {
      if (course !== "All courses" && t.course !== course) return false;
      if (strand !== "All strands" && t.strand !== strand) return false;
      if (substrand && t.substrand !== substrand) return false;
      if (dok && t.dok !== dok) return false;
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
  }, [search, course, strand, substrand, dok]);

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
        dok={dok}
        setDok={setDok}
        substrand={substrand}
        setSubstrand={setSubstrand}
        onClearFilter={handleClearFilter}
        count={filtered.length}
      />

      <div className="flex">
        <Sidebar
          activeSubject="ela"
          activeStrand={strand !== "All strands" ? strand : null}
          activeCourse={course !== "All courses" ? course : null}
          onNavigate={navigate}
        />

        <main className="flex-1 max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 py-10">
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
          course !== "All courses" || strand !== "All strands" || substrand || dok || search ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => (
                <TEKCard
                  key={t.code}
                  tek={t}
                  onOpen={handleOpen}
                  onFilter={handleCardFilter}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {VIDEO_TEKS.length > 0 && (
                <section>
                  <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
                    <div>
                      <p
                        className="text-[10px] font-mono uppercase tracking-[0.22em]"
                        style={{ color: PALETTE.monoGold }}
                      >
                        ▶ Teacher explainers · watch Mr. K unpack the standard
                      </p>
                      <h2
                        className="font-semibold mt-1"
                        style={{ color: PALETTE.inkPrimary, fontSize: "1.4rem" }}
                      >
                        TEKs with video
                      </h2>
                    </div>
                    <span
                      className="text-[10px] font-mono uppercase tracking-[0.22em]"
                      style={{ color: PALETTE.monoGold }}
                    >
                      {VIDEO_TEKS.length} live · more in production
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {VIDEO_TEKS.map((t) => (
                      <TEKCard
                        key={`vid-${t.code}`}
                        tek={t}
                        onOpen={handleOpen}
                        onFilter={handleCardFilter}
                      />
                    ))}
                  </div>
                </section>
              )}
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
                            <TEKCard
                              key={t.code}
                              tek={t}
                              onOpen={handleOpen}
                              onFilter={handleCardFilter}
                            />
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
    </div>
  );
}
