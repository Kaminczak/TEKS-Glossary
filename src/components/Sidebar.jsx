import { useEffect, useState } from "react";
import {
  IconNotebook, IconLayoutList, IconChevronRight, IconHome,
} from "./icons/TablerIcons";
import { listPath } from "../hooks/useHashRoute";
import teksData from "../data/teksData.json";

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

// ELA strands in canonical order (matches HANDOFF strand/substrand lookup
// and the strand values in teksData.json).
export const ELA_STRANDS = [
  "Foundational Language Skills",
  "Comprehension Skills",
  "Response Skills",
  "Multiple Genres",
  "Author's Purpose and Craft",
  "Composition",
  "Inquiry & Research",
];

export const ELA_COURSES = ["English I", "English II", "English III", "English IV"];

// Per-course accent. Added 2026-08-29 for the DESIGN.md note that course headings
// need their own colour so Steve can drill down by scanning rather than reading.
// Muted, low-chroma, same family as the subject Pine so they sit on parchment without
// shouting. These also drive the presenter's outfit per course in the video pipeline —
// English I is terracotta because its 72 clips are already rendered in the rust shirt.
// Course accent — Adobe square harmony, chosen 2026-08-29. Deep and saturated;
// closest pair separates at RGB distance 77, and lightness varies between them.
// The rejected alternative held lightness and chroma fixed at 0.32 / 0.07 and
// varied only hue, which separated at 51 and read as one shade in four tints.
// If these are ever re-tuned: vary lightness as well as hue, and keep every pair
// above ~60 apart. Verify contrast through a canvas readback, not getComputedStyle.
export const COURSE_ACCENT = {
  "English I":   "oklch(0.30 0.15 28)", // oxblood
  "English II":  "#030D66",             // navy
  "English III": "#03661D",             // forest
  "English IV":  "oklch(0.40 0.12 325)", // plum
};
// English IV went olive -> brown -> plum. Olive (#665003) and the oxblood were the
// closest pair at 77; brown at L 0.46 opened that to 83 but Steve still read the two
// as related, which is fair — both sit in the warm quarter of the wheel alongside
// English I. Plum moves into the empty gap between navy (265) and oxblood (28) and
// separates at 104, the widest of any candidate tried, with better chip contrast too.
//
// The four hues are 28 / 265 / 146 / 325 and lightness runs 0.247 to 0.444. Keep BOTH
// irregular: an earlier set held lightness and chroma fixed and varied only hue, and
// it read as one shade in four tints.

// Pre-compute counts per (course, strand) so we don't recalc on every render.
const COURSE_COUNTS = Object.fromEntries(
  ELA_COURSES.map((c) => [c, teksData.filter((t) => t.course === c).length])
);
const COURSE_STRAND_COUNTS = Object.fromEntries(
  ELA_COURSES.map((c) => [
    c,
    Object.fromEntries(
      ELA_STRANDS.map((s) => [
        s,
        teksData.filter((t) => t.course === c && t.strand === s).length,
      ])
    ),
  ])
);

const SUBJECT_NAV = [
  { id: "home", label: "Home", icon: IconHome, accent: null, kind: "link" },
  {
    id: "ela",
    label: "ELA",
    icon: IconNotebook,
    // Rust — 2026-08-29. Was Pine "oklch(0.45 0.08 150)". The brand is rust rather
    // than the abandoned Koi Orange or the unused teal in index.css: 117 explainer
    // videos are already rendered in the rust overshirt, so rust makes the presenter
    // and the site agree, and it sits naturally on the parchment neutrals.
    accent: "oklch(0.52 0.12 45)",
    kind: "subject",
  },
];

function SidebarSubject({ subject, activeSubject, expanded, onToggle, onNavigate, activeStrand, activeCourse }) {
  const isActive = subject.id === activeSubject;
  const isExpanded = expanded;
  const Icon = subject.icon;
  const [teksOpen, setTeksOpen] = useState(isActive);
  // Which course is currently expanded inside the ELA TEKs tree.
  // Default to the active course if one is set, otherwise none.
  const [openCourse, setOpenCourse] = useState(activeCourse || null);
  useEffect(() => {
    if (activeCourse) setOpenCourse(activeCourse);
  }, [activeCourse]);

  if (subject.kind === "link") {
    return (
      <button
        onClick={() => subject.id === "home" && onNavigate?.("/")}
        className="relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-left transition-colors hover:bg-white/40"
        style={{ color: PALETTE.inkSecondary, background: "transparent" }}
      >
        <Icon size={16} />
        {subject.label}
      </button>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        className="relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-left transition-colors group"
        style={{
          color: isActive ? PALETTE.inkPrimary : PALETTE.inkSecondary,
          background: isActive ? PALETTE.bone : "transparent",
        }}
      >
        {isActive && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r"
            style={{ background: subject.accent }}
          />
        )}
        <span style={{ color: subject.accent }}>
          <Icon size={16} />
        </span>
        <span className="flex-1">{subject.label}</span>
        <span
          className="text-[10px] transition-transform"
          style={{
            color: PALETTE.stone,
            transform: isExpanded ? "rotate(90deg)" : "none",
          }}
        >
          <IconChevronRight size={12} />
        </span>
      </button>

      {isExpanded && (
        <div
          className="ml-3 my-1 pl-3 flex flex-col gap-0.5"
          style={{ borderLeft: `2px solid ${subject.accent}` }}
        >
          {/* {Subject} TEKs — expandable to show strands */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (subject.id === "ela") {
                setTeksOpen(!teksOpen);
              } else {
                onNavigate?.(listPath());
              }
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left hover:bg-white/40 transition-colors"
            style={{ color: PALETTE.inkSecondary }}
          >
            <IconLayoutList size={13} />
            <span>{subject.label} TEKs</span>
            <span
              className="ml-auto text-[10px] font-mono px-1.5 rounded"
              style={{
                color: subject.accent,
                background: PALETTE.bone,
                border: `1px solid ${PALETTE.tagBorder}`,
              }}
            >
              {subject.id === "ela" ? "278" : "—"}
            </span>
            {subject.id === "ela" && (
              <span
                className="text-[10px] transition-transform"
                style={{
                  color: PALETTE.stone,
                  transform: teksOpen ? "rotate(90deg)" : "none",
                }}
              >
                <IconChevronRight size={11} />
              </span>
            )}
          </button>

          {subject.id === "ela" && teksOpen && (
            <div className="ml-4 my-0.5 flex flex-col">
              {ELA_COURSES.map((courseName) => {
                const isCourseActive = courseName === activeCourse;
                const isCourseOpen = openCourse === courseName;
                const strandCounts = COURSE_STRAND_COUNTS[courseName] || {};
                const courseAccent = COURSE_ACCENT[courseName] || subject.accent;
                return (
                  <div key={courseName} className="flex flex-col">
                    {/* Course header row — toggles expansion AND filters to this course */}
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate?.(listPath({ course: courseName }));
                        }}
                        className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded text-[13px] text-left hover:bg-white/40 transition-colors"
                        style={{
                          color: isCourseActive ? courseAccent : PALETTE.inkSecondary,
                          fontWeight: isCourseActive ? 700 : 600,
                          background: isCourseActive ? PALETTE.bone : "transparent",
                          letterSpacing: "0.005em",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                          style={{ background: courseAccent }}
                        />
                        <span className="flex-1">{courseName}</span>
                        <span
                          className="text-[10px] font-mono px-1 rounded"
                          style={{
                            color: courseAccent,
                            background: PALETTE.bone,
                            border: `1px solid ${PALETTE.tagBorder}`,
                          }}
                        >
                          {COURSE_COUNTS[courseName]}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCourse(isCourseOpen ? null : courseName);
                        }}
                        className="px-1.5 py-1 rounded hover:bg-white/40 transition-colors"
                        title={isCourseOpen ? "Collapse" : "Expand strands"}
                      >
                        <span
                          className="text-[10px] transition-transform inline-block"
                          style={{
                            color: PALETTE.stone,
                            transform: isCourseOpen ? "rotate(90deg)" : "none",
                          }}
                        >
                          <IconChevronRight size={11} />
                        </span>
                      </button>
                    </div>

                    {/* Strands nested under each course */}
                    {isCourseOpen && (
                      <div
                        className="ml-3 my-0.5 pl-3 flex flex-col gap-0.5"
                        style={{ borderLeft: `1px dashed ${PALETTE.tagBorder}` }}
                      >
                        {ELA_STRANDS.map((strandName) => {
                          const n = strandCounts[strandName] || 0;
                          if (n === 0) return null;
                          const isStrandActive =
                            isCourseActive && strandName === activeStrand;
                          return (
                            <button
                              key={strandName}
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate?.(
                                  listPath({ course: courseName, strand: strandName })
                                );
                              }}
                              className="flex items-center gap-2 px-2 py-0.5 rounded text-[10.5px] text-left hover:bg-white/40 transition-colors"
                              style={{
                                color: isStrandActive
                                  ? PALETTE.inkPrimary
                                  : PALETTE.inkTertiary,
                                fontWeight: isStrandActive ? 600 : 400,
                                background: isStrandActive ? PALETTE.bone : "transparent",
                              }}
                            >
                              <span className="flex-1">{strandName}</span>
                              <span
                                className="text-[9px] font-mono"
                                style={{ color: PALETTE.stone }}
                              >
                                {n}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

/**
 * Shared sidebar — used on both list and detail views.
 *
 * Props:
 *   activeSubject  — id of the current subject (default 'ela'); drives the
 *                    left-rail indicator and which subject is expanded by
 *                    default.
 *   activeStrand   — the strand currently in view (a TEK's strand on detail,
 *                    or the active filter on list). Bolds the matching item.
 *   onNavigate     — (path: string) => void, called when user clicks a
 *                    strand or "{Subject} TEKs" link. Receives a path like
 *                    '/list/strand/Response%20Skills' or '/'.
 */
export default function Sidebar({ activeSubject = "ela", activeStrand, activeCourse, onNavigate }) {
  // Re-expand the active subject whenever activeSubject changes (e.g. when
  // navigating between pages or filtering to a different strand within ELA).
  const [expandedId, setExpandedId] = useState(activeSubject);
  useEffect(() => {
    setExpandedId(activeSubject);
  }, [activeSubject]);

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 py-6 px-3 gap-0.5"
      style={{
        background: PALETTE.sand,
        borderRight: `1px solid ${PALETTE.standardBorder}`,
      }}
    >
      <div className="px-3 mb-5">
        <p
          className="text-[10px] font-mono uppercase tracking-[0.22em]"
          style={{ color: PALETTE.monoGold }}
        >
          Curriculum Archive
        </p>
        <p className="text-xs mt-0.5" style={{ color: PALETTE.inkTertiary }}>
          Texas Education Agency · TEKS · English I–IV
        </p>
      </div>

      {SUBJECT_NAV.map((subject) => (
        <SidebarSubject
          key={subject.id}
          subject={subject}
          activeSubject={activeSubject}
          activeStrand={activeStrand}
          activeCourse={activeCourse}
          onNavigate={onNavigate}
          expanded={expandedId === subject.id}
          onToggle={() => setExpandedId(expandedId === subject.id ? null : subject.id)}
        />
      ))}

    </aside>
  );
}
