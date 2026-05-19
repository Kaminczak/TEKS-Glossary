import { useEffect } from "react";
import GeneratePage from "./pages/GeneratePage";
import TEKGlossaryOld from "./pages/TEKGlossary";
import ParchmentPreview from "./pages/ParchmentPreview";
import TEKListPage from "./pages/TEKListPage";
import { useHashRoute } from "./hooks/useHashRoute";

/**
 * Hash-routed shell.
 *
 * Routes:
 *   #/                          → TEK list/browse
 *   #/list                      → TEK list/browse
 *   #/tek/{courseCode}/{letter} → TEK detail (parchment view)
 *   #/admin/toolkit             → AI Toolkit (old GeneratePage)
 *   #/admin/old-glossary        → previous glossary mockup
 */
export default function App() {
  const { route, navigate } = useHashRoute();

  // Scroll to top on route change for a clean detail-view entry
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.view, route.courseCode, route.letter, route.roman]);

  if (route.view === "detail") {
    return (
      <ParchmentPreview
        courseCode={route.courseCode}
        letter={route.letter}
        roman={route.roman}
        navigate={navigate}
      />
    );
  }

  if (route.view === "admin") {
    return <AdminShell subview={route.subview} navigate={navigate} />;
  }

  // Default: list view (route.filters may pre-fill course/strand)
  return <TEKListPage navigate={navigate} initialFilters={route.filters || {}} />;
}

function AdminShell({ subview, navigate }) {
  const subviews = {
    toolkit: { label: "AI Toolkit", component: <GeneratePage /> },
    "old-glossary": { label: "Old Glossary", component: <TEKGlossaryOld /> },
  };
  const current = subviews[subview] || subviews.toolkit;

  return (
    <div className="min-h-screen bg-[#f9f9f8]">
      <header className="sticky top-0 z-50 bg-[#f9f9f8]/90 backdrop-blur-md border-b border-[#c0c8c9]/20 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#414849] hover:underline"
          >
            ← Glossary
          </button>
          <span className="font-headline font-extrabold text-[#154045] text-xl tracking-tight">
            Admin · {current.label}
          </span>
        </div>
        <nav className="flex items-center gap-2">
          {Object.entries(subviews).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => navigate(`/admin/${key}`)}
              className={`font-headline font-semibold text-sm px-4 py-2 rounded-lg transition-all ${
                subview === key
                  ? "bg-[#154045] text-white"
                  : "text-[#414849] hover:bg-[#e8e8e6]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>
      {current.component}
    </div>
  );
}
