import { useState, useMemo } from 'react';
import { SAMPLE_TEKS, STRAND_COLORS, GRADE_LEVELS } from '../data/sampleTEKs';
import TEKDetailCard from '../components/TEKDetailCard';

const ALL_STRANDS = ['All Strands', 'Comprehension', 'Composition', 'Listening/Speaking', 'Inquiry & Research', 'Foundational Language'];
const ALL_GRADES  = ['All Grades', ...GRADE_LEVELS];
const DOK_LABELS  = { 1: 'Recall', 2: 'Skill/Concept', 3: 'Strategic', 4: 'Extended' };

function TEKBrowseCard({ tek, onClick }) {
  const colors = STRAND_COLORS[tek.strand_short] || STRAND_COLORS.reading;
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group ${colors.pillar} relative`}
    >
      <div className="flex justify-between items-start mb-5">
        <span className={`${colors.bg} ${colors.text} px-3 py-1 rounded-md text-[10px] font-headline font-black uppercase tracking-widest`}>
          {tek.strand}
        </span>
        <span className="text-[#c0c8c9] font-headline text-xs font-medium">{tek.standard_code}</span>
      </div>
      <h3 className="font-headline font-bold text-xl text-[#154045] mb-3 leading-tight group-hover:text-[#2f575d] transition-colors">
        {tek.title}
      </h3>
      <p className="font-body text-[#414849] leading-relaxed mb-5 text-sm line-clamp-3">
        {tek.student_friendly}
      </p>
      <div className="pt-5 border-t border-[#c0c8c9]/20 flex items-center justify-between">
        <span className="text-xs font-headline font-semibold text-[#71787a]">
          DOK {tek.dok_level} · {tek.dok_label}
        </span>
        <span className="text-xs font-headline font-semibold text-[#71787a]">{tek.course}</span>
      </div>
    </div>
  );
}

export default function TEKGlossary() {
  const [search, setSearch]     = useState('');
  const [grade, setGrade]       = useState('All Grades');
  const [strand, setStrand]     = useState('All Strands');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return SAMPLE_TEKS.filter(t => {
      const matchGrade  = grade  === 'All Grades'  || t.course  === grade;
      const matchStrand = strand === 'All Strands' || t.strand  === strand;
      const q = search.toLowerCase();
      const matchSearch = !q
        || t.title.toLowerCase().includes(q)
        || t.expectation.toLowerCase().includes(q)
        || t.standard_code.toLowerCase().includes(q)
        || t.academic_vocabulary.some(v => v.toLowerCase().includes(q));
      return matchGrade && matchStrand && matchSearch;
    });
  }, [search, grade, strand]);

  return (
    <div className="min-h-screen bg-[#f9f9f8]">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#154045] to-[#2f575d] px-8 md:px-16 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-end">
          <div className="md:col-span-3">
            <p className="text-[#a4ced4] font-headline text-xs font-black uppercase tracking-widest mb-4">ELAR TEK Glossary</p>
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-white tracking-tight mb-4 leading-none">
              Academic<br/>
              <span className="font-body italic font-normal text-[#a4ced4]">Standards.</span>
            </h1>
            <p className="font-body text-white/70 text-xl leading-relaxed max-w-xl">
              A curated repository of ELAR TEKS — searchable by strand, grade level, and cognitive complexity.
            </p>
          </div>
          <div className="md:col-span-2 flex gap-4 justify-end">
            {['Reading', 'Writing', 'Research'].map(s => (
              <div key={s} className="text-center">
                <div className="text-2xl font-headline font-black text-white">{SAMPLE_TEKS.filter(t => t.strand_short === s.toLowerCase()).length || SAMPLE_TEKS.length}</div>
                <div className="text-white/50 font-headline text-xs uppercase tracking-widest">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-0 z-40 bg-[#f3f4f2]/90 backdrop-blur-md border-b border-[#c0c8c9]/20 px-8 md:px-16 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] bg-white rounded-xl flex items-center gap-3 px-4 py-2.5 shadow-sm border border-[#c0c8c9]/30">
            <span className="text-[#71787a] text-base">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by keyword, TEK code, or vocabulary..."
              className="w-full bg-transparent border-none focus:outline-none font-headline text-sm text-[#1a1c1b] placeholder:text-[#71787a]"
            />
          </div>
          <select value={grade} onChange={e => setGrade(e.target.value)}
            className="bg-white rounded-xl px-4 py-2.5 text-sm font-headline font-semibold text-[#154045] border border-[#c0c8c9]/30 shadow-sm focus:outline-none">
            {ALL_GRADES.map(g => <option key={g}>{g}</option>)}
          </select>
          <select value={strand} onChange={e => setStrand(e.target.value)}
            className="bg-white rounded-xl px-4 py-2.5 text-sm font-headline font-semibold text-[#154045] border border-[#c0c8c9]/30 shadow-sm focus:outline-none">
            {ALL_STRANDS.map(s => <option key={s}>{s}</option>)}
          </select>
          <span className="font-headline text-xs text-[#71787a] ml-auto">
            {filtered.length} TEK{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Card grid */}
      <div className="max-w-6xl mx-auto px-8 md:px-16 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#71787a] font-body italic text-xl">
            No TEKs match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(tek => (
              <TEKBrowseCard key={tek.id} tek={tek} onClick={() => setSelected(tek)} />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && <TEKDetailCard tek={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
