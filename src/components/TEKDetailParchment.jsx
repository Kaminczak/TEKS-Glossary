import { useState } from 'react';
import {
  IconEar, IconMessageQuestion, IconListNumbers, IconBulb,
  IconTarget, IconBlockquote, IconAlertTriangle, IconChecks,
  IconNotebook, IconPlayerPlayFilled, IconArrowLeft, IconArrowRight,
  IconSearch, IconClock, IconBrain, IconLayoutList,
  IconFilePencil, IconClipboardCheck, IconSunrise, IconListCheck,
  IconBook, IconUsersGroup, IconWand, IconArrowUpRight,
  IconChevronRight, IconCalendarTime, IconCalculator, IconFlask,
  IconWorld, IconHome,
  GLYPH,
} from './icons/TablerIcons';
import Sidebar from './Sidebar';
import { useTEKCart } from '../hooks/useTEKCart';

const GENERATORS = [
  {
    key: 'worksheet',
    icon: IconFilePencil,
    name: 'Worksheet',
    desc: '10-question practice with answer key, aligned to this TEK.',
  },
  {
    key: 'exit-ticket',
    icon: IconClipboardCheck,
    name: 'Exit Ticket',
    desc: 'A 3-question formative check to gauge mastery in 5 minutes.',
  },
  {
    key: 'warm-up',
    icon: IconSunrise,
    name: 'Warm-Up',
    desc: 'Bell ringer to activate prior knowledge before the lesson.',
  },
  {
    key: 'assessment',
    icon: IconListCheck,
    name: 'Assessment',
    desc: 'STAAR-aligned quiz with mixed-DOK items and a rubric.',
  },
  {
    key: 'lesson-plan',
    icon: IconBook,
    name: 'Lesson Plan',
    desc: '45-minute structured lesson — hook, instruction, practice, close.',
  },
  {
    key: 'differentiate',
    icon: IconUsersGroup,
    name: 'Differentiate',
    desc: 'Three leveled versions: scaffolded, on-level, and challenge.',
  },
];

const PALETTE = {
  parchment: '#F6F2EC',
  bone: '#FFFDF7',
  linen: '#FAF6ED',
  sand: '#F1ECE3',
  oat: '#F1E9D6',
  ink: '#0E0C0A',
  inkPrimary: '#1A1713',
  inkSecondary: '#3C352D',
  inkTertiary: '#5A5148',
  monoGold: '#6B5E3C',
  honeyGold: '#D9BE7A',
  stone: '#8A7F73',
  boneStone: '#BFB4A3',
  hairline: 'rgba(26,23,19,0.05)',
  soft: 'rgba(26,23,19,0.08)',
  standardBorder: 'rgba(26,23,19,0.10)',
  tagBorder: 'rgba(26,23,19,0.12)',
  strongBorder: 'rgba(26,23,19,0.15)',
};

// Section heading with eyebrow + title + icon. Bigger and more relaxed now.
function BlockHeading({ icon: Icon, eyebrow, title }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
        style={{
          background: PALETTE.linen,
          color: 'var(--accent)',
          border: `1px solid ${PALETTE.tagBorder}`,
        }}
      >
        <Icon size={24} />
      </span>
      <div className="flex flex-col leading-tight">
        <span
          className="text-[10px] font-mono uppercase tracking-[0.22em]"
          style={{ color: PALETTE.monoGold }}
        >
          {eyebrow}
        </span>
        <span
          className="font-semibold mt-0.5"
          style={{ color: PALETTE.inkPrimary, fontSize: '1.15rem' }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, eyebrow, value }) {
  return (
    <div
      className="flex-1 min-w-[160px] px-5 py-4 rounded-2xl flex items-center gap-4"
      style={{ background: PALETTE.linen, border: `1px solid ${PALETTE.hairline}` }}
    >
      <span
        className="inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
        style={{
          background: PALETTE.bone,
          color: 'var(--accent)',
          border: `1px solid ${PALETTE.tagBorder}`,
        }}
      >
        <Icon size={22} />
      </span>
      <div className="flex flex-col leading-tight">
        <span
          className="text-[10px] font-mono uppercase tracking-[0.22em]"
          style={{ color: PALETTE.monoGold }}
        >
          {eyebrow}
        </span>
        <span className="text-base font-semibold mt-0.5" style={{ color: PALETTE.inkPrimary }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function ChipRow({ items }) {
  // Spread chips edge-to-edge so the row balances across the card width.
  // On narrow screens where they wrap, fall back to a normal gap layout so a
  // single-chip last row doesn't get stretched into the void.
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {items.map((label) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono"
          style={{
            color: PALETTE.inkSecondary,
            background: PALETTE.sand,
            border: `1px solid ${PALETTE.tagBorder}`,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function GlyphStrip({ glyphs }) {
  return (
    <div className="flex gap-2.5">
      {glyphs.map((slug) => {
        const Icon = GLYPH[slug] || IconBulb;
        return (
          <span
            key={slug}
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl"
            style={{
              background: PALETTE.linen,
              color: 'var(--accent)',
              border: `1px solid ${PALETTE.tagBorder}`,
            }}
            title={slug}
          >
            <Icon size={26} />
          </span>
        );
      })}
    </div>
  );
}


function TopBar({ onNavHome }) {
  return (
    <div
      className="sticky top-0 z-30 flex items-center gap-4 px-6 lg:px-10 h-14"
      style={{ background: PALETTE.bone, borderBottom: `1px solid ${PALETTE.standardBorder}` }}
    >
      <button
        onClick={onNavHome}
        className="font-semibold tracking-tight hover:opacity-80 transition-opacity"
        style={{ color: PALETTE.inkPrimary }}
      >
        TEKS Glossary
      </button>
      <nav className="hidden md:flex items-center gap-5 ml-6 text-sm">
        {['Standards', 'Resources', 'Generators', 'Glossary'].map((label) => (
          <a key={label} className="hover:underline" style={{ color: PALETTE.inkTertiary }} href="#">
            {label}
          </a>
        ))}
      </nav>
      <div
        className="ml-auto flex items-center gap-2 w-72 max-w-full px-3 py-1.5 rounded-md"
        style={{ background: PALETTE.sand, border: `1px solid ${PALETTE.soft}` }}
      >
        <span style={{ color: PALETTE.stone }}>
          <IconSearch size={14} />
        </span>
        <input
          placeholder="Search a TEK code, keyword, or strand…"
          className="bg-transparent outline-none w-full text-sm"
          style={{ color: PALETTE.inkPrimary }}
        />
        <kbd
          className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded font-mono"
          style={{
            color: PALETTE.monoGold,
            background: PALETTE.bone,
            border: `1px solid ${PALETTE.strongBorder}`,
          }}
        >
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

function VideoCard({ video, sectionTitle }) {
  if (!video) {
    return (
      <div
        className="rounded-3xl p-6 flex flex-col gap-3"
        style={{ background: PALETTE.sand, border: `1px solid ${PALETTE.tagBorder}` }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: PALETTE.monoGold }}>
            <IconPlayerPlayFilled size={16} />
          </span>
          <span
            className="text-[10px] font-mono uppercase tracking-[0.18em]"
            style={{ color: PALETTE.monoGold }}
          >
            Teacher Explainer
          </span>
        </div>
        <p className="text-sm" style={{ color: PALETTE.inkSecondary }}>
          Video coming soon — Mr. K is recording the explainer for {sectionTitle}.
        </p>
        <div
          className="mt-2 aspect-video rounded-lg flex items-center justify-center"
          style={{ background: PALETTE.bone, border: `1px dashed ${PALETTE.tagBorder}` }}
        >
          <span style={{ color: PALETTE.boneStone }}>
            <IconPlayerPlayFilled size={32} />
          </span>
        </div>
      </div>
    );
  }
  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col"
      style={{ background: PALETTE.ink }}
    >
      <div className="relative aspect-video" style={{ background: '#1a1612' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.label}
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-5">
        <div>
          <p
            className="text-[10px] font-mono uppercase tracking-[0.18em]"
            style={{ color: PALETTE.honeyGold }}
          >
            {video.label}
          </p>
          <p className="text-sm font-semibold" style={{ color: PALETTE.bone }}>
            {sectionTitle}
          </p>
        </div>
        <span
          className="text-[11px] font-mono px-2 py-1 rounded"
          style={{
            color: PALETTE.honeyGold,
            background: 'rgba(217,190,122,0.12)',
            border: `1px solid rgba(217,190,122,0.3)`,
          }}
        >
          {video.duration}
        </span>
      </div>
    </div>
  );
}

function MisconceptionsAccordion({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((m, i) => {
        const open = openIdx === i;
        return (
          <div
            key={i}
            className="rounded-lg overflow-hidden"
            style={{ border: `1px solid ${PALETTE.tagBorder}`, background: PALETTE.bone }}
          >
            <button
              onClick={() => setOpenIdx(open ? -1 : i)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left"
            >
              <span
                className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono"
                style={{
                  background: open ? 'var(--accent)' : PALETTE.sand,
                  color: open ? PALETTE.bone : PALETTE.monoGold,
                  border: `1px solid ${PALETTE.tagBorder}`,
                }}
              >
                {i + 1}
              </span>
              <span
                className="flex-1 text-sm font-medium leading-snug"
                style={{ color: PALETTE.inkPrimary }}
              >
                {m.title}
              </span>
              <span
                className="text-xs mt-1 transition-transform"
                style={{ color: PALETTE.stone, transform: open ? 'rotate(180deg)' : 'none' }}
              >
                ▾
              </span>
            </button>
            {open && (
              <div
                className="px-4 pb-4 pt-1 text-sm leading-relaxed"
                style={{ color: PALETTE.inkSecondary, borderTop: `1px solid ${PALETTE.hairline}` }}
              >
                {m.body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AssignmentCard({ assignment }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: PALETTE.bone, border: `1px solid ${PALETTE.tagBorder}` }}
    >
      <p className="text-sm font-semibold mb-1" style={{ color: PALETTE.inkPrimary }}>
        {assignment.name}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: PALETTE.inkSecondary }}>
        {assignment.body}
      </p>
    </div>
  );
}

function GeneratorCard({ gen, tekCode }) {
  const [hover, setHover] = useState(false);
  const Icon = gen.icon;
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => alert(`Generate "${gen.name}" for ${tekCode} — wire this to your AI Toolkit endpoint.`)}
      className="text-left rounded-xl p-5 transition-all duration-200 group flex flex-col gap-3"
      style={{
        background: PALETTE.bone,
        border: `1px solid ${hover ? 'var(--accent)' : PALETTE.tagBorder}`,
        boxShadow: hover ? '0 4px 16px -8px rgba(26,23,19,0.15)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
          style={{
            background: hover ? 'var(--accent)' : PALETTE.linen,
            color: hover ? PALETTE.bone : 'var(--accent)',
            border: `1px solid ${PALETTE.tagBorder}`,
          }}
        >
          <Icon size={20} />
        </span>
        <span
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--accent)' }}
        >
          <IconArrowUpRight size={18} />
        </span>
      </div>
      <div>
        <p className="text-base font-semibold" style={{ color: PALETTE.inkPrimary }}>
          {gen.name}
        </p>
        <p
          className="text-sm leading-relaxed mt-1"
          style={{ color: PALETTE.inkSecondary }}
        >
          {gen.desc}
        </p>
      </div>
      <span
        className="text-[11px] font-mono uppercase tracking-[0.18em] mt-auto pt-1 inline-flex items-center gap-1"
        style={{ color: hover ? 'var(--accent)' : PALETTE.monoGold }}
      >
        Generate
        <IconWand size={12} />
      </span>
    </button>
  );
}

export default function TEKDetailParchment({
  tek,
  onNavPrev,
  onNavNext,
  onNavHome,
  prevSibling,
  nextSibling,
}) {
  const [showAllStems, setShowAllStems] = useState(false);
  const visibleStems = showAllStems ? tek.questionStems : tek.questionStems.slice(0, 4);
  const { has: cartHas, toggle: cartToggle } = useTEKCart();
  const inCart = cartHas(tek.code);

  return (
    <div
      className="min-h-screen"
      style={{
        // Pine for ELA — flip via CSS var when subject changes.
        '--accent': 'oklch(0.45 0.08 150)',
        background: PALETTE.parchment,
        color: PALETTE.inkPrimary,
        fontFamily: '"Manrope", system-ui, sans-serif',
      }}
    >
      <TopBar onNavHome={onNavHome} />

      <div className="flex">
        <Sidebar
          activeSubject="ela"
          activeStrand={tek.strand}
          onNavigate={(path) => { window.location.hash = path; }}
        />

        <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20 pt-6 relative">

          {/* Breadcrumb sits OUTSIDE the page-card, on the parchment */}
          <nav
            className="flex items-center gap-2 text-xs mb-3 px-2"
            style={{ color: PALETTE.inkTertiary }}
          >
            <span>{tek.course}</span>
            <span style={{ color: PALETTE.boneStone }}>/</span>
            <span>{tek.strand}</span>
            <span style={{ color: PALETTE.boneStone }}>/</span>
            <span style={{ color: PALETTE.inkPrimary }}>{tek.substrand}</span>
          </nav>

          {/* === The page-card: one big rounded paper sitting on parchment === */}
          <article
            className="relative rounded-[2.5rem] p-6 sm:p-8 lg:p-10"
            style={{
              background: PALETTE.bone,
              border: `1px solid ${PALETTE.standardBorder}`,
              boxShadow:
                '0 1px 0 rgba(255,255,253,0.8) inset, 0 12px 40px -20px rgba(26,23,19,0.18), 0 2px 8px -2px rgba(26,23,19,0.06)',
            }}
          >
            {/* Floating action cluster — top-right corner of the page-card */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-7 flex items-center gap-2">
              {/* Add to lesson cart toggle */}
              <button
                onClick={() => cartToggle(tek.code)}
                title={inCart ? "Remove from lesson cart" : "Add this TEK to your lesson cart"}
                className="inline-flex items-center gap-1.5 h-11 px-3.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{
                  background: inCart ? "var(--accent)" : PALETTE.linen,
                  color: inCart ? PALETTE.bone : PALETTE.inkSecondary,
                  border: `1px solid ${inCart ? "var(--accent)" : PALETTE.tagBorder}`,
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1 }}>{inCart ? "✓" : "+"}</span>
                <span className="hidden sm:inline">{inCart ? "In lesson" : "Add to lesson"}</span>
              </button>

              <button
                onClick={onNavPrev || undefined}
                disabled={!onNavPrev}
                title={
                  prevSibling
                    ? `Previous: ${prevSibling.code} — ${prevSibling.title}`
                    : "First TEK in this course"
                }
                className="inline-flex items-center justify-center w-11 h-11 rounded-full transition-all enabled:hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: PALETTE.linen,
                  color: PALETTE.inkSecondary,
                  border: `1px solid ${PALETTE.tagBorder}`,
                }}
              >
                <IconArrowLeft size={20} />
              </button>
              <button
                onClick={onNavNext || undefined}
                disabled={!onNavNext}
                title={
                  nextSibling
                    ? `Next: ${nextSibling.code} — ${nextSibling.title}`
                    : "Last TEK in this course"
                }
                className="inline-flex items-center justify-center w-11 h-11 rounded-full transition-all enabled:hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: "var(--accent)",
                  color: PALETTE.bone,
                  border: `1px solid var(--accent)`,
                }}
              >
                <IconArrowRight size={20} />
              </button>
            </div>

            {/* Hero strip — pill banner at the top with the TEK code */}
            <div className="flex items-center gap-3 mb-5 pr-32 sm:pr-36">
              <span
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-mono font-semibold"
                style={{
                  background: PALETTE.ink,
                  color: PALETTE.honeyGold,
                  letterSpacing: '0.04em',
                }}
              >
                {tek.code}
              </span>
              <span
                className="text-[10px] font-mono uppercase tracking-[0.22em]"
                style={{ color: PALETTE.monoGold }}
              >
                {tek.course} · {tek.substrand}
              </span>
            </div>

            {/* Title — keeps right padding to avoid colliding with the floating
                action cluster (cart button + prev/next arrows) in the corner. */}
            <h1
              className="font-semibold leading-tight pr-40 sm:pr-72"
              style={{
                color: PALETTE.inkPrimary,
                fontSize: 'clamp(1.85rem, 2.4vw + 1rem, 2.6rem)',
              }}
            >
              {tek.title}
            </h1>

            {/* Overview spans the full card width — no invisible wall. */}
            <p
              className="mt-3 text-lg leading-relaxed"
              style={{ color: PALETTE.inkSecondary }}
            >
              {tek.overview}
            </p>

            {/* Stat tiles. (Glyph strip removed — chip row below carries the
                visual fingerprint with actual words.) */}
            <div className="flex flex-wrap gap-3 mt-7 items-stretch">
              <StatTile icon={IconBrain} eyebrow="Cognitive Depth" value={`DOK ${tek.dok}`} />
              <StatTile icon={IconTarget} eyebrow="Bloom's Taxonomy" value={tek.bloom} />
              <StatTile icon={IconClock} eyebrow="Estimated Time" value={tek.estimatedTime} />
            </div>

            {/* Display tags */}
            <div className="mt-5">
              <ChipRow items={tek.displayTags} />
            </div>

            {/* Soft divider */}
            <hr className="my-8 border-0 h-px" style={{ background: PALETTE.hairline }} />

            {/* Body content continues inside the page-card */}
            <div className="page-card-body">

          {/* Column eyebrow labels — make the parallel explicit */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-3">
            <div className="flex items-center gap-2 px-2">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.28em]"
                style={{ color: PALETTE.monoGold }}
              >
                Teacher View
              </span>
              <span className="flex-1 h-px" style={{ background: PALETTE.tagBorder }} />
            </div>
            <div className="hidden lg:flex items-center gap-2 px-2">
              <span
                className="text-[10px] font-mono uppercase tracking-[0.28em]"
                style={{ color: PALETTE.monoGold }}
              >
                Student View
              </span>
              <span className="flex-1 h-px" style={{ background: PALETTE.tagBorder }} />
            </div>
          </div>

          {/* 3-row × 2-col body — left = teacher, right = student */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Row 1 LEFT — Standard Expectation (TEA verbatim) */}
            <section
              className="rounded-3xl p-7"
              style={{ background: PALETTE.bone, border: `1px solid ${PALETTE.standardBorder}` }}
            >
              <BlockHeading icon={IconBlockquote} eyebrow="TEA verbatim" title="Standard Expectation" />
              <blockquote
                className="italic text-base leading-relaxed pl-4 border-l-2"
                style={{ color: PALETTE.inkPrimary, borderColor: 'var(--accent)' }}
              >
                {tek.expectation}
              </blockquote>
            </section>

            {/* Row 1 RIGHT — Student-Friendly */}
            <section
              className="rounded-3xl p-7"
              style={{ background: PALETTE.linen, border: `1px solid ${PALETTE.standardBorder}` }}
            >
              <BlockHeading icon={IconBulb} eyebrow="Translated for the room" title="Student-Friendly Explanation" />
              <p className="text-base leading-relaxed" style={{ color: PALETTE.inkPrimary }}>
                {tek.studentFriendly}
              </p>
            </section>

            {/* Row 2 LEFT — Question Stems */}
            <section
              className="rounded-3xl p-7"
              style={{ background: PALETTE.bone, border: `1px solid ${PALETTE.standardBorder}` }}
            >
              <BlockHeading icon={IconMessageQuestion} eyebrow="STAAR-test stems" title="Question Stems" />
              <ol className="flex flex-col gap-3 text-sm">
                {visibleStems.map((stem, i) => (
                  <li
                    key={i}
                    className="leading-relaxed pl-3 border-l-2"
                    style={{ color: PALETTE.inkPrimary, borderColor: PALETTE.boneStone }}
                  >
                    <span className="font-mono text-[10px] mr-2" style={{ color: PALETTE.monoGold }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {stem}
                  </li>
                ))}
              </ol>
              {tek.questionStems.length > 4 && (
                <button
                  onClick={() => setShowAllStems((v) => !v)}
                  className="mt-4 text-xs font-medium underline-offset-2 hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  {showAllStems ? 'Show fewer' : `Show all ${tek.questionStems.length} stems`}
                </button>
              )}
            </section>

            {/* Row 2 RIGHT — What Mastery Looks Like (answering the stems) */}
            <section
              className="rounded-3xl p-7"
              style={{ background: PALETTE.linen, border: `1px solid ${PALETTE.standardBorder}` }}
            >
              <BlockHeading
                icon={IconChecks}
                eyebrow="Answering the stems"
                title="What Mastery Looks Like"
              />
              <ul className="flex flex-col gap-2.5">
                {tek.mastery.map((m, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed"
                    style={{ color: PALETTE.inkSecondary }}
                  >
                    <span
                      className="shrink-0 mt-1 w-4 h-4 rounded-full inline-flex items-center justify-center"
                      style={{ background: 'var(--accent)', color: PALETTE.bone }}
                    >
                      <IconChecks size={10} />
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </section>

            {/* Row 3 LEFT — Common Misconceptions */}
            <section
              className="rounded-3xl p-7"
              style={{ background: PALETTE.bone, border: `1px solid ${PALETTE.standardBorder}` }}
            >
              <BlockHeading icon={IconAlertTriangle} eyebrow="Watch for these" title="Common Misconceptions" />
              <MisconceptionsAccordion items={tek.misconceptions} />
            </section>

            {/* Row 3 RIGHT — Tips & Video Explainer (Mr. K explaining).
                Card is Linen so it sits naturally next to Misconceptions; only
                the video player rectangle itself is dark. */}
            <section
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{ background: PALETTE.linen, border: `1px solid ${PALETTE.standardBorder}` }}
            >
              <div className="p-7 pb-5">
                <BlockHeading
                  icon={IconPlayerPlayFilled}
                  eyebrow="Mr. K explains"
                  title="Tips & Video Explainer"
                />
              </div>

              {/* Video / placeholder. Prefer local MP4 (videoUrl), fall back to
                  YouTube embed (youtubeId), then placeholder. Local is more reliable
                  in incognito + dev — no third-party cookie or embed restriction. */}
              <div className="px-7">
                {tek.explainerVideo?.videoUrl ? (
                  <div
                    className="rounded-2xl overflow-hidden aspect-video"
                    style={{ background: PALETTE.ink, border: `1px solid ${PALETTE.tagBorder}` }}
                  >
                    <video
                      className="w-full h-full"
                      src={tek.explainerVideo.videoUrl}
                      controls
                      preload="metadata"
                      playsInline
                    />
                  </div>
                ) : tek.explainerVideo?.youtubeId ? (
                  <div
                    className="rounded-2xl overflow-hidden aspect-video"
                    style={{ background: PALETTE.ink, border: `1px solid ${PALETTE.tagBorder}` }}
                  >
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${tek.explainerVideo.youtubeId}`}
                      title={tek.explainerVideo.label}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-2xl flex items-center justify-center aspect-video"
                    style={{
                      background: PALETTE.bone,
                      border: `1px dashed ${PALETTE.tagBorder}`,
                    }}
                  >
                    <div className="text-center">
                      <span style={{ color: PALETTE.boneStone }}>
                        <IconPlayerPlayFilled size={40} />
                      </span>
                      <p
                        className="text-xs mt-2 font-mono uppercase tracking-[0.22em]"
                        style={{ color: PALETTE.stone }}
                      >
                        Video coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips bullets — just the assignment names, the explanation lives in the video */}
              <div className="p-7 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.22em]"
                    style={{ color: PALETTE.monoGold }}
                  >
                    Tips covered in this video
                  </span>
                  {tek.explainerVideo && (
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{
                        color: 'var(--accent)',
                        background: PALETTE.bone,
                        border: `1px solid ${PALETTE.tagBorder}`,
                      }}
                    >
                      {tek.explainerVideo.duration}
                    </span>
                  )}
                </div>
                <ul className="flex flex-col gap-2 text-sm" style={{ color: PALETTE.inkSecondary }}>
                  {tek.assignments.slice(0, 3).map((a, i) => (
                    <li key={i} className="flex gap-2.5 leading-relaxed">
                      <span
                        className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--accent)' }}
                      />
                      <span style={{ color: PALETTE.inkPrimary }}>{a.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Notes — last thing inside the page-card */}
          {tek.notes && tek.notes.length > 0 && (
            <section
              className="rounded-3xl p-6 mt-8"
              style={{ background: PALETTE.linen, border: `1px solid ${PALETTE.hairline}` }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.22em] mb-3"
                style={{ color: PALETTE.monoGold }}
              >
                Teacher Notes
              </p>
              <ul className="flex flex-col gap-2 text-sm" style={{ color: PALETTE.inkTertiary }}>
                {tek.notes.map((n, i) => (
                  <li key={i} className="leading-relaxed">• {n}</li>
                ))}
              </ul>
            </section>
          )}

            </div>{/* close .page-card-body */}
          </article>{/* close the page-card */}

          {/* Generators — OUTSIDE the page-card, on parchment, as the "now build something" zone */}
          <section className="mt-10 px-2">
            <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
              <div>
                <p
                  className="text-[10px] font-mono uppercase tracking-[0.22em]"
                  style={{ color: PALETTE.monoGold }}
                >
                  AI Generators · Aligned to {tek.code}
                </p>
                <h2
                  className="font-semibold leading-tight mt-1"
                  style={{
                    color: PALETTE.inkPrimary,
                    fontSize: 'clamp(1.4rem, 1.6vw + 0.8rem, 1.9rem)',
                  }}
                >
                  Build for This TEK
                </h2>
                <p
                  className="text-sm mt-2 max-w-xl"
                  style={{ color: PALETTE.inkTertiary }}
                >
                  Tap a generator to produce classroom-ready materials tuned to this standard's
                  expectation, vocabulary, and DOK level. Pulled from your TEK source-of-truth — no
                  re-teaching the AI what this skill actually means.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
                href="#"
              >
                See all generators
                <IconArrowUpRight size={14} />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GENERATORS.map((gen) => (
                <GeneratorCard key={gen.key} gen={gen} tekCode={tek.code} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
