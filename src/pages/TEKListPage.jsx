import { useEffect, useMemo, useState } from "react";
import teksData from "../data/teksData.json";
import { tekPath, listPath } from "../hooks/useHashRoute";
import Sidebar, { COURSE_ACCENT } from "../components/Sidebar";
import { StrandChip } from "../components/icons/StrandIcons";
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

// COURSE_ACCENT now lives in Sidebar.jsx and is imported above — it used to be
// duplicated here with all four courses set to the same pine, which meant course
// colour was stubbed out and never actually differentiated anything.

const COURSES = ["All courses", "English I", "English II", "English III", "English IV"];

// Strand → accent color. Tuned to harmonize with the parchment/ink palette.
// Each strand gets a single canonical color; substrand variations are conveyed
// via the strand+substrand line at the bottom of each card.
// Hues respaced 2026-08-29. The original set put Comprehension at 25 and Composition
// at 35 (10 apart) and Foundational at 150 and Inquiry at 165 (15 apart) — two pairs
// that read as the same colour, which Steve spotted immediately once the TEK chip
// started carrying strand colour. Seven strands need the hue wheel divided seven ways.
//
// RULES when editing: keep every pair >=35 hue apart, and keep lightness <=0.50 so the
// #F3E3BE chip text stays above WCAG AA 4.5:1 at 11px. Verify with the canvas contrast
// check before committing — getComputedStyle returns oklch() unresolved, so naive
// parsing silently reports nonsense.
export const STRAND_COLORS = {
  "Comprehension Skills":         "oklch(0.42 0.13 25)",  // Burgundy
  "Composition":                  "oklch(0.50 0.12 68)",  // Terracotta / amber
  "Author's Purpose and Craft":   "oklch(0.48 0.10 105)", // Olive
  "Foundational Language Skills": "oklch(0.45 0.08 150)", // Pine
  "Inquiry & Research":           "oklch(0.44 0.08 195)", // Teal
  "Response Skills":              "oklch(0.48 0.08 240)", // Slate Blue
  "Multiple Genres":              "oklch(0.42 0.10 310)", // Plum
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
  // 2026-08-29: the card's colour encodes the COURSE, not the strand, so every
  // English I card looks alike and a teacher's own course reads as one set. Strand
  // is carried by the icon glyph in the identity row, which needs no colour at all.
  const courseColor = COURSE_ACCENT[tek.course] || PALETTE.stone;
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
        borderLeft: `6px solid ${courseColor}`,
        // Resting shadow, added 2026-08-29. Cards previously sat flat with only an
        // inset highlight, so a grid of them read as one field and the strand rail
        // went unnoticed. A real drop shadow separates each card from the parchment
        // and gives the rail an edge to sit against.
        boxShadow: "0 1px 0 rgba(255,253,247,0.6) inset, 0 2px 10px -4px rgba(26,23,19,0.14)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 0 rgba(255,253,247,0.6) inset, 0 10px 26px -10px rgba(26,23,19,0.28)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 0 rgba(255,253,247,0.6) inset, 0 2px 10px -4px rgba(26,23,19,0.14)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold"
          style={{
            // 2026-08-29: chip carries the COURSE colour instead of flat ink. It is the
            // largest, left-most element on the card, so it is where course actually
            // registers — the 6px rail alone went unnoticed. Strand is carried by the
            // footer glyph instead. Gold text holds contrast on every COURSE_ACCENT.
            background: courseColor,
            color: "#F3E3BE",
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
              style={{ background: courseColor, color: PALETTE.bone }}
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

      {/* One footer row. Left: strand glyph, then DOK, then the strand/substrand
          text. Right: the course, set larger because it is the card's loudest
          identity — the rail and chip already carry its colour. Merging what were
          two rows puts the course on the same baseline as the strand name. */}
      <div
        className="mt-auto pt-3 flex items-center justify-between gap-3"
        style={{ borderTop: `1px solid ${PALETTE.hairline}` }}
      >
        {/* Glyph above its own label. Every card has a strand, so this block is the
            same height everywhere — the previous two-column version stacked DOK under
            the chip and the substrand under the strand, which left a hole on the 142
            of 278 TEKs that have no substrand. Substrand now lives only on the detail
            page and in the filters, where its absence costs nothing. */}
        {/* Both sides are a single mono line at the same size and weight, on one
            baseline. The filled tile is the footer's only accent mass; the glyph
            shape carries the strand, so the tile itself takes the course colour.
            DOK sits with the course rather than trailing as a footnote. */}
        {/* 44px band. Left: washed tile + the strand name in mixed-case sans at
            15px/600 — mixed case is narrower per character than mono uppercase with
            letter-spacing, which is what lets the FULL names fit here when the
            shortened uppercase ones did not. Right: course over DOK, stacked inside
            the same band so both sides occupy one aligned block. */}
        <button
          type="button"
          onClick={(e) => filterClick(e, { strand: tek.strand })}
          className="flex items-center gap-3 min-w-0 text-left group/strand"
          title={`Show all ${tek.strand}`}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <StrandChip strand={tek.strand} color={courseColor} size={44} />
          {/* Wraps to at most two lines instead of truncating. The band is 44px and
              the line is 15px, so two lines fit inside it — that is what lets the
              full names survive at three-up, where even mixed case clipped 109 of
              294 on one line. */}
          <span
            className="text-[15px] group-hover/strand:underline underline-offset-2"
            style={{
              color: PALETTE.inkPrimary,
              fontWeight: 600,
              lineHeight: 1.15,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textWrap: "balance",
            }}
          >
            {tek.strand}
          </span>
        </button>

        <div className="flex flex-col items-end justify-center shrink-0" style={{ minHeight: 44 }}>
          <button
            type="button"
            onClick={(e) => filterClick(e, { course: tek.course })}
            className="text-[15px] font-mono uppercase tracking-[0.08em] hover:underline underline-offset-2 transition-colors"
            title={`Filter to ${tek.course} only`}
            style={{ color: courseColor, fontWeight: 600 }}
          >
            {tek.course}
          </button>
          <button
            type="button"
            onClick={(e) => filterClick(e, { dok: tek.dok })}
            className="text-[11px] font-mono uppercase tracking-[0.12em] hover:underline underline-offset-2 transition-colors"
            title={`Filter to DOK ${tek.dok} (${DOK_LABELS[tek.dok] || ""}) only`}
            style={{ color: PALETTE.stone }}
          >
            DOK {tek.dok}
          </button>
        </div>
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
