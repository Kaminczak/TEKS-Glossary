import { useState } from 'react';
import GeneratePage from './pages/GeneratePage';
import TEKGlossary from './pages/TEKGlossary';
import ParchmentPreview from './pages/ParchmentPreview';

const PAGES = {
  parchment: { label: 'Parchment Preview', component: <ParchmentPreview />, ownsChrome: true },
  toolkit: { label: 'AI Toolkit', component: <GeneratePage />, ownsChrome: false },
  glossary: { label: 'TEK Glossary (old)', component: <TEKGlossary />, ownsChrome: false },
};

export default function App() {
  const [page, setPage] = useState('parchment');
  const current = PAGES[page];

  // The Parchment page renders its own top bar — App chrome would clash.
  // Show only a tiny floating switcher there.
  if (current.ownsChrome) {
    return (
      <>
        {current.component}
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/90 backdrop-blur shadow-xl border border-black/10">
          {Object.entries(PAGES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                page === key
                  ? 'bg-[#1A1713] text-white'
                  : 'text-[#3C352D] hover:bg-[#F1ECE3]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f8]">
      <header className="sticky top-0 z-50 bg-[#f9f9f8]/90 backdrop-blur-md border-b border-[#c0c8c9]/20 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[#154045] text-xl">📖</span>
          <span className="font-headline font-extrabold text-[#154045] text-xl tracking-tight">
            The Editorial Scholar
          </span>
        </div>
        <nav className="flex items-center gap-2">
          {Object.entries(PAGES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`font-headline font-semibold text-sm px-4 py-2 rounded-lg transition-all ${
                page === key
                  ? 'bg-[#154045] text-white'
                  : 'text-[#414849] hover:bg-[#e8e8e6]'
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
