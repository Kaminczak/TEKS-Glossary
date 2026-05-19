import TEKDetailParchment from "../components/TEKDetailParchment";
import teksData from "../data/teksData.json";
import { reconstructCode, tekPath } from "../hooks/useHashRoute";

/**
 * Detail-view shell. Looks up the TEK by code (or by courseCode+letter+roman)
 * from the bundled teksData.json. Renders a "not found" state if missing.
 */
export default function ParchmentPreview({ code, courseCode, letter, roman, navigate }) {
  const resolvedCode = code || reconstructCode(courseCode, letter, roman);
  const tek = teksData.find((t) => t.code === resolvedCode);

  if (!tek) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-10"
        style={{ background: "#F6F2EC", color: "#1A1713", fontFamily: '"Manrope", system-ui, sans-serif' }}
      >
        <div className="max-w-md text-center">
          <p
            className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2"
            style={{ color: "#6B5E3C" }}
          >
            TEK not found
          </p>
          <h1 className="text-2xl font-semibold mb-3">
            No glossary entry for {resolvedCode || "(no code given)"}
          </h1>
          <p className="text-sm" style={{ color: "#3C352D" }}>
            Either the code is malformed, the entry hasn't been added yet, or the route
            decoded to something we don't have. Try browsing the list.
          </p>
          <button
            onClick={() => navigate?.("/")}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
            style={{ background: "oklch(0.45 0.08 150)", color: "#FFFDF7" }}
          >
            Back to the glossary index
          </button>
        </div>
      </div>
    );
  }

  // Compute prev/next siblings in the same course for arrow navigation.
  const same = teksData.filter((t) => t.course === tek.course);
  const idx = same.findIndex((t) => t.code === tek.code);
  const prev = idx > 0 ? same[idx - 1] : null;
  const next = idx >= 0 && idx < same.length - 1 ? same[idx + 1] : null;

  return (
    <TEKDetailParchment
      tek={tek}
      onNavPrev={prev ? () => navigate?.(tekPath(prev)) : null}
      onNavNext={next ? () => navigate?.(tekPath(next)) : null}
      onNavHome={() => navigate?.("/")}
      prevSibling={prev}
      nextSibling={next}
    />
  );
}
