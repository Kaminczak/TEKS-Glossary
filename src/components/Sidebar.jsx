import { useEffect, useState } from "react";
import {
  IconNotebook, IconLayoutList, IconCalendarTime, IconWand,
  IconChevronRight, IconClock, IconCalculator, IconFlask,
  IconWorld, IconHome,
} from "./icons/TablerIcons";
import { listPath } from "../hooks/useHashRoute";

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

const SUBJECT_NAV = [
  { id: "home", label: "Home", icon: IconHome, accent: null, kind: "link" },
  {
    id: "math",
    label: "Math",
    icon: IconCalculator,
    accent: "oklch(0.45 0.10 30)", // Brick
    kind: "subject",
  },
  {
    id: "science",
    label: "Science",
    icon: IconFlask,
    accent: "oklch(0.45 0.10 260)", // Indigo
    kind: "subject",
  },
  {
    id: "ela",
    label: "ELA",
    icon: IconNotebook,
    accent: "oklch(0.45 0.08 150)", // Pine
    kind: "subject",
  },
  {
    id: "social",
    label: "Social Studies",
    icon: IconWorld,
    accent: "oklch(0.45 0.08 70)", // Saddle
    kind: "subject",
  },
];

const AI_TOOL_NAMES = [
  "Focus Package",
  "Warm-Ups",
  "Lessons",
  "Assignments",
  "Exit Passes",
  "Unit Tests",
  "Pick 4 Essays",
  "STAAR® Blitz",
];

function SidebarSubject({ subject, activeSubject, expanded, onToggle, onNavigate, activeStrand }) {
  const isActive = subject.id === activeSubject;
  const isExpanded = expanded;
  const Icon = subject.icon;
  const [aiOpen, setAiOpen] = useState(isActive);
  const [teksOpen, setTeksOpen] = useState(isActive);

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
              {ELA_STRANDS.map((strandName) => {
                const isStrandActive = strandName === activeStrand;
                return (
                  <button
                    key={strandName}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.(listPath({ strand: strandName }));
                    }}
                    className="flex items-center gap-2 px-2 py-1 rounded text-[11px] text-left hover:bg-white/40 transition-colors"
                    style={{
                      color: isStrandActive ? PALETTE.inkPrimary : PALETTE.inkSecondary,
                      fontWeight: isStrandActive ? 600 : 400,
                      background: isStrandActive ? PALETTE.bone : "transparent",
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full inline-block"
                      style={{ background: subject.accent }}
                    />
                    <span className="flex-1">{strandName}</span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left hover:bg-white/40 transition-colors"
            style={{ color: PALETTE.inkSecondary }}
          >
            <IconCalendarTime size={13} />
            <span>Your Scope &amp; Sequence</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setAiOpen(!aiOpen); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left hover:bg-white/40 transition-colors"
            style={{ color: PALETTE.inkSecondary }}
          >
            <IconWand size={13} style={{ color: subject.accent }} />
            <span>AI Tools</span>
            <span
              className="ml-auto text-[10px] transition-transform"
              style={{
                color: PALETTE.stone,
                transform: aiOpen ? "rotate(90deg)" : "none",
              }}
            >
              <IconChevronRight size={11} />
            </span>
          </button>

          {aiOpen && (
            <div className="ml-4 my-0.5 flex flex-col">
              {AI_TOOL_NAMES.map((toolName, i) => {
                const available = i < 2;
                return (
                  <button
                    key={toolName}
                    className="flex items-center gap-2 px-2 py-1 rounded text-[11px] text-left hover:bg-white/40 transition-colors"
                    style={{
                      color: available ? PALETTE.inkSecondary : PALETTE.boneStone,
                      fontStyle: available ? "normal" : "italic",
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full inline-block"
                      style={{ background: available ? subject.accent : PALETTE.boneStone }}
                    />
                    <span className="flex-1">{toolName}</span>
                    {!available && (
                      <span style={{ color: PALETTE.boneStone }}>
                        <IconClock size={10} />
                      </span>
                    )}
                  </button>
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
export default function Sidebar({ activeSubject = "ela", activeStrand, onNavigate }) {
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
          Texas Education Agency · TEKS
        </p>
      </div>

      {SUBJECT_NAV.map((subject) => (
        <SidebarSubject
          key={subject.id}
          subject={subject}
          activeSubject={activeSubject}
          activeStrand={activeStrand}
          onNavigate={onNavigate}
          expanded={expandedId === subject.id}
          onToggle={() => setExpandedId(expandedId === subject.id ? null : subject.id)}
        />
      ))}

      <div
        className="mt-5 mx-2 px-3 py-3 rounded-lg text-xs"
        style={{
          background: PALETTE.bone,
          border: `1px solid ${PALETTE.tagBorder}`,
          color: PALETTE.inkTertiary,
        }}
      >
        <p
          className="font-mono uppercase text-[10px] tracking-[0.18em] mb-1"
          style={{ color: PALETTE.monoGold }}
        >
          Resource Center
        </p>
        <p>Generators, lesson packs, and TEK explainers — all aligned.</p>
      </div>
    </aside>
  );
}
