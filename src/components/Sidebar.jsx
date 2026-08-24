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
    accent: "oklch(0.45 0.08 150)", // Pine
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
                return (
                  <div key={courseName} className="flex flex-col">
                    {/* Course header row — toggles expansion AND filters to this course */}
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate?.(listPath({ course: courseName }));
                        }}
                        className="flex-1 flex items-center gap-2 px-2 py-1 rounded text-[11px] text-left hover:bg-white/40 transition-colors"
                        style={{
                          color: isCourseActive ? PALETTE.inkPrimary : PALETTE.inkSecondary,
                          fontWeight: isCourseActive ? 600 : 500,
                          background: isCourseActive ? PALETTE.bone : "transparent",
                        }}
                      >
                        <span
                          className="w-1 h-1 rounded-full inline-block"
                          style={{ background: subject.accent }}
                        />
                        <span className="flex-1">{courseName}</span>
                        <span
                          className="text-[10px] font-mono px-1 rounded"
                          style={{
                            color: subject.accent,
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
