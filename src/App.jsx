import { useEffect } from "react";
import GeneratePage from "./pages/GeneratePage";
import TEKGlossaryOld from "./pages/TEKGlossary";
import ParchmentPreview from "./pages/ParchmentPreview";
import TEKListPage from "./pages/TEKListPage";
import LandingPage from "./pages/LandingPage";
import { useRoute, linkProps } from "./hooks/useRoute";

/**
 * Path-routed shell (see hooks/useRoute.js for the route table).
 *
 *   /                            → landing page
 *   /teks                        → TEK list/browse (query string carries filters)
 *   /teks/{courseCode}/{letter}  → TEK detail (parchment view)
 *   /admin/toolkit               → AI Toolkit (old GeneratePage)
 *   /admin/old-glossary          → previous glossary mockup
 */
export default function App() {
  const { route, navigate } = useRoute();

  // Scroll to top on route change for a clean detail-view entry
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.view, route.courseCode, route.letter, route.roman]);

  useEffect(() => {
    document.title = titleFor(route);
  }, [route]);

  if (route.view === "landing") {
    return <LandingPage navigate={navigate} />;
  }

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

  if (route.view === "notfound") {
    return <NotFound path={route.path} navigate={navigate} />;
  }

  // List view (route.filters may pre-fill course/strand/dok/video)
  return <TEKListPage navigate={navigate} initialFilters={route.filters || {}} />;
}

function titleFor(route) {
  switch (route.view) {
    case "landing":
      return "Kaizen.School — Steve Kaminczak";
    case "list":
      return route.filters?.video
        ? "Teacher Explainer Videos · TEKS Glossary · Kaizen.School"
        : "TEKS Glossary · Kaizen.School";
    case "detail":
      return `${route.courseCode}(${route.letter}) · TEKS Glossary · Kaizen.School`;
    case "admin":
      return "Admin · Kaizen.School";
    default:
      return "Not found · Kaizen.School";
  }
}

function NotFound({ path, navigate }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-10"
      style={{ background: "#F6F2EC", color: "#1A1713", fontFamily: '"Manrope", system-ui, sans-serif' }}
    >
      <div className="max-w-md text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-2" style={{ color: "#6B5E3C" }}>
          Page not found
        </p>
        <h1 className="text-2xl font-semibold mb-3">Nothing lives at {path}</h1>
        <div className="flex items-center justify-center gap-4 mt-5 text-sm">
          <a {...linkProps(navigate, "/")} className="underline underline-offset-4">
            Home
          </a>
          <a {...linkProps(navigate, "/teks")} className="underline underline-offset-4">
            TEKS Glossary
          </a>
        </div>
      </div>
    </div>
  );
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
            onClick={() => navigate("/teks")}
            className="text-sm text-[#414849] hover:underline"
          >
            ← Glossary
          </button>
          <span className="font-headline font-extrabold text-primary text-xl tracking-tight">
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
                  ? "bg-primary text-white"
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
