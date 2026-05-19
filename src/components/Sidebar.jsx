import { useEffect, useState } from "react";
import {
  IconNotebook, IconLayoutList, IconCalendarTime, IconWand,
  IconChevronRight, IconClock, IconCalculator, IconFlask,
  IconWorld, IconHome, IconArrowUpRight,
} from "./icons/TablerIcons";
import { listPath, tekPath } from "../hooks/useHashRoute";
import { useTEKCart } from "../hooks/useTEKCart";
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

function LessonCartPanel({ onNavigate }) {
  const { cart, remove, clear, count } = useTEKCart();
  const [open, setOpen] = useState(true);

  // Resolve codes to full TEK records for display
  const byCode = Object.fromEntries(teksData.map((t) => [t.code, t]));

  return (
    <div
      className="mt-5 mx-2 rounded-lg overflow-hidden"
      style={{
        background: PALETTE.bone,
        border: `1px solid ${PALETTE.tagBorder}`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-black/[0.02] transition-colors"
      >
        <IconNotebook size={14} style={{ color: "var(--accent)" }} />
        <span
          className="font-mono uppercase text-[10px] tracking-[0.18em] flex-1"
          style={{ color: PALETTE.monoGold }}
        >
          Lesson Cart
        </span>
        <span
          className="text-[10px] font-mono px-1.5 rounded"
          style={{
            color: count > 0 ? PALETTE.bone : PALETTE.stone,
            background: count > 0 ? "var(--accent)" : PALETTE.sand,
            border: `1px solid ${count > 0 ? "var(--accent)" : PALETTE.tagBorder}`,
            minWidth: 18,
            textAlign: "center",
          }}
        >
          {count}
        </span>
        <span
          className="text-[10px] transition-transform"
          style={{
            color: PALETTE.stone,
            transform: open ? "rotate(90deg)" : "none",
          }}
        >
          <IconChevronRight size={11} />
        </span>
      </button>

      {open && (
        <div
          className="px-3 pb-3 flex flex-col gap-1"
          style={{ borderTop: count > 0 ? `1px solid ${PALETTE.hairline}` : "none" }}
        >
          {count === 0 ? (
            <p className="text-[11px] leading-relaxed mt-2" style={{ color: PALETTE.inkTertiary }}>
              Add TEKs from any page. Build the set first, then generate a worksheet, exit ticket, or lesson plan that covers all of them at once.
            </p>
          ) : (
            <>
              <ul className="mt-2 flex flex-col gap-1">
                {cart.map((code) => {
                  const t = byCode[code];
                  return (
                    <li
                      key={code}
                      className="flex items-center gap-2 text-[11px] rounded px-1.5 py-1 hover:bg-black/[0.03] group"
                    >
                      <button
                        onClick={() => t && onNavigate?.(tekPath(t))}
                        className="flex-1 min-w-0 text-left flex items-center gap-2"
                        title={t ? `${code} — ${t.title}` : code}
                      >
                        <span
                          className="font-mono px-1.5 rounded shrink-0"
                          style={{
                            background: PALETTE.ink,
                            color: "#D9BE7A",
                            fontSize: "10px",
                          }}
                        >
                          {code}
                        </span>
                        <span
                          className="truncate"
                          style={{ color: PALETTE.inkSecondary }}
                        >
                          {t?.title || ""}
                        </span>
                      </button>
                      <button
                        onClick={() => remove(code)}
                        title="Remove from lesson cart"
                        className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0 px-1"
                        style={{ color: PALETTE.stone }}
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2 flex items-center gap-2">
                <button
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-[11px] font-medium opacity-50 cursor-not-allowed"
                  style={{
                    background: "var(--accent)",
                    color: PALETTE.bone,
                  }}
                  title="Generators coming soon"
                >
                  Generate from selection
                  <IconArrowUpRight size={11} />
                </button>
                <button
                  onClick={clear}
                  className="text-[10px] font-mono uppercase tracking-[0.12em] px-2 py-1.5 rounded hover:bg-black/[0.03]"
                  style={{ color: PALETTE.stone }}
                >
                  Clear
                </button>
              </div>
            </>
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

      <LessonCartPanel onNavigate={onNavigate} />
    </aside>
  );
}
