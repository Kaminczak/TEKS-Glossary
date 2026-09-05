import TEKDetailParchment from "../components/TEKDetailParchment";
import { useCourse, useIndex } from "../data/loader";
import { reconstructCode, tekPath } from "../hooks/useRoute";

const SHELL = {
  background: "#F6F2EC",
  color: "#1A1713",
  fontFamily: '"Manrope", system-ui, sans-serif',
};

/**
 * Detail-view shell. Fetches the course's JSON (public/data/<courseCode>.json),
 * finds the TEK by code, and hands it to the parchment page along with its
 * prev/next siblings. Renders a "not found" state if missing.
 */
export default function ParchmentPreview({ courseCode, letter, roman, navigate }) {
  const resolvedCode = reconstructCode(courseCode, letter, roman);
  const { data: course, error } = useCourse(courseCode);
  const { data: index } = useIndex();

  if (!course && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10" style={SHELL}>
        <p className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: "#6B5E3C" }}>
          Loading {resolvedCode || "…"}
        </p>
      </div>
    );
  }

  const tek = course?.find((t) => t.code === resolvedCode);

  if (!tek) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10" style={SHELL}>
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
            onClick={() => navigate?.("/teks")}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
            style={{ background: "oklch(0.45 0.08 150)", color: "#FFFDF7" }}
          >
            Back to the glossary index
          </button>
        </div>
      </div>
    );
  }

  // Prev/next siblings in the same course for arrow navigation.
  const idx = course.findIndex((t) => t.code === tek.code);
  const prev = idx > 0 ? course[idx - 1] : null;
  const next = idx >= 0 && idx < course.length - 1 ? course[idx + 1] : null;

  return (
    <TEKDetailParchment
      tek={tek}
      teksIndex={index}
      navigate={navigate}
      onNavPrev={prev ? () => navigate?.(tekPath(prev)) : null}
      onNavNext={next ? () => navigate?.(tekPath(next)) : null}
      onNavHome={() => navigate?.("/teks")}
      prevSibling={prev}
      nextSibling={next}
    />
  );
}
