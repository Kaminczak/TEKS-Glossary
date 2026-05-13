import { useState } from 'react';
import { STRAND_COLORS } from '../data/sampleTEKs';

const DOK_COLORS = {
  1: 'bg-[#e8e8e6] text-[#414849]',
  2: 'bg-[#c0eaf1] text-[#001f24]',
  3: 'bg-[#ffdcbf] text-[#2c1601]',
  4: 'bg-[#154045] text-white',
};

const BLOOM_ICONS = {
  Remember: '🔍', Understand: '💡', Apply: '⚙️',
  Analyze: '🔬', Evaluate: '⚖️', Create: '✨',
};

function CollapsibleSection({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[#c0c8c9]/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="flex items-center gap-2 font-headline font-semibold text-sm text-[#414849] uppercase tracking-widest">
          <span>{icon}</span> {title}
        </span>
        <span className="text-[#71787a] group-hover:text-[#154045] transition-colors text-lg leading-none">
          {open ? '−' : '+'}
        </span>
      </button>
      <div className={`section-content ${open ? 'expanded' : 'collapsed'}`}>
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
}

export default function TEKDetailCard({ tek, onClose }) {
  const colors = STRAND_COLORS[tek.strand_short] || STRAND_COLORS.reading;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#1a1c1b]/60 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className={`relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl ${colors.pillar} overflow-hidden`}>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#154045] to-[#2f575d] p-8 text-white relative">
          <button onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl leading-none transition-colors">×</button>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`${colors.bg} ${colors.text} px-3 py-1 rounded-md text-[10px] font-headline font-black uppercase tracking-widest`}>
              {tek.strand}
            </span>
            <span className={`${DOK_COLORS[tek.dok_level]} px-3 py-1 rounded-md text-[10px] font-headline font-black uppercase tracking-widest`}>
              DOK {tek.dok_level} · {tek.dok_label}
            </span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-md text-[10px] font-headline font-black uppercase tracking-widest">
              {BLOOM_ICONS[tek.bloom_level]} {tek.bloom_level}
            </span>
          </div>
          <p className="font-headline text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
            {tek.standard_code} · {tek.course}
          </p>
          <h2 className="font-headline font-extrabold text-2xl md:text-3xl leading-tight mb-3">{tek.title}</h2>
          <p className="font-body italic text-white/80 text-base leading-relaxed">{tek.assessment_format}</p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-0">

          {/* Official language */}
          <div className="pb-6">
            <p className="text-[10px] font-headline font-black uppercase tracking-widest text-[#71787a] mb-3">Official TEK Language</p>
            <p className="font-body text-[#1a1c1b] leading-relaxed text-base">{tek.expectation}</p>
          </div>

          {/* Student-friendly */}
          <CollapsibleSection title="Student-Friendly Version" icon="🎯" defaultOpen={true}>
            <div className="bg-[#f3f4f2] rounded-xl p-5">
              <p className="font-body text-[#1a1c1b] leading-relaxed text-base italic">{tek.student_friendly}</p>
            </div>
          </CollapsibleSection>

          {/* Academic vocabulary */}
          <CollapsibleSection title="Academic Vocabulary" icon="📚" defaultOpen={true}>
            <div className="flex flex-wrap gap-2">
              {tek.academic_vocabulary.map(term => (
                <span key={term}
                  className="bg-[#f3f4f2] text-[#154045] px-3 py-1.5 rounded-lg text-sm font-headline font-semibold border border-[#c0c8c9]/30">
                  {term}
                </span>
              ))}
            </div>
          </CollapsibleSection>

          {/* Text demands */}
          <CollapsibleSection title="Text Demands" icon="📖">
            <p className="font-body text-[#414849] leading-relaxed">{tek.text_demands}</p>
          </CollapsibleSection>

          {/* Instructional implications */}
          <CollapsibleSection title="Instructional Implications" icon="🏫">
            <p className="font-body text-[#414849] leading-relaxed">{tek.instructional_implications}</p>
          </CollapsibleSection>

          {/* Anticipated mistakes */}
          <CollapsibleSection title="Anticipated Mistakes" icon="⚠️">
            <ul className="space-y-2">
              {tek.anticipated_mistakes.map((m, i) => (
                <li key={i} className="flex gap-3 font-body text-[#414849] leading-relaxed">
                  <span className="text-[#77583a] font-bold shrink-0">→</span> {m}
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Question stems */}
          <CollapsibleSection title="Example Question Stems" icon="❓">
            <ul className="space-y-3">
              {tek.question_stems.map((q, i) => (
                <li key={i} className="bg-[#f3f4f2] rounded-lg p-4 font-body text-[#1a1c1b] leading-relaxed italic">
                  "{q}"
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Mastery indicators */}
          <CollapsibleSection title="Mastery Indicators" icon="✅">
            <ul className="space-y-2">
              {tek.mastery_indicators.map((m, i) => (
                <li key={i} className="flex gap-3 font-body text-[#414849] leading-relaxed">
                  <span className="text-[#25401e] shrink-0">✓</span> {m}
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Vertical alignment */}
          <CollapsibleSection title="Vertical Alignment Notes" icon="📐">
            <p className="font-body text-[#414849] leading-relaxed">{tek.vertical_notes}</p>
          </CollapsibleSection>

          {/* Connected TEKs */}
          <CollapsibleSection title="Connected TEKs" icon="🔗">
            <div className="flex flex-wrap gap-2">
              {tek.connected_teks.map(code => (
                <span key={code}
                  className="bg-[#154045] text-white px-3 py-1.5 rounded-lg text-xs font-headline font-bold">
                  {code}
                </span>
              ))}
            </div>
          </CollapsibleSection>

        </div>
      </div>
    </div>
  );
}
