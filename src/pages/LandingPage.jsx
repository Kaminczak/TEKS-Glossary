import stats from "../data/stats.json";
import { linkProps } from "../hooks/useRoute";
import { IconArrowUpRight, IconArrowRight } from "../components/icons/TablerIcons";

// Same parchment system as the glossary (see TEKListPage / TEKDetailParchment).
const PALETTE = {
  parchment: "#F6F2EC",
  bone: "#FFFDF7",
  linen: "#FAF6ED",
  sand: "#F1ECE3",
  inkPrimary: "#1A1713",
  inkSecondary: "#3C352D",
  inkTertiary: "#5A5148",
  monoGold: "#6B5E3C",
  stone: "#7A6E60",
  hairline: "rgba(26,23,19,0.05)",
  soft: "rgba(26,23,19,0.08)",
  standardBorder: "rgba(26,23,19,0.10)",
  tagBorder: "rgba(26,23,19,0.12)",
};

// Rust is the brand (Sidebar ELA accent); pine and plum are existing strand
// accents from TEKListPage, so the three doors stay inside the site's own palette.
const RUST = "oklch(0.52 0.12 45)";
const PINE = "oklch(0.45 0.08 150)";
const PLUM = "oklch(0.42 0.10 310)";

const GENRE_MACHINE_URL = "https://thegenremachine.com";

const DOORS = [
  {
    key: "glossary",
    number: "01",
    kicker: "The database",
    title: "TEKS Glossary",
    desc:
      `All ${stats.total} English I–IV student expectations: a plain-language overview, ` +
      "a student-facing translation, ten or more assessment-phrased question stems, " +
      "vertical alignment, and the misconceptions to watch for — tagged by DOK, " +
      "Bloom's, and strand.",
    stat: `${stats.total} entries`,
    accent: RUST,
    to: "/teks",
    cta: "Browse the glossary",
  },
  {
    key: "videos",
    number: "02",
    kicker: "Watch Mr. K unpack the standard",
    title: "Teacher Explainer Videos",
    desc:
      "A thirty-second explainer for each TEK: what the standard asks, how to teach " +
      "it, and what to listen for in the room. Rendered on a local GPU and self-hosted.",
    stat: `${stats.withVideo} of ${stats.total} TEKS`,
    accent: PINE,
    to: "/teks?video=1",
    cta: "Watch the explainers",
  },
  {
    key: "genre",
    number: "03",
    kicker: "Story lab",
    title: "The Genre Machine",
    desc:
      "Four fairy tales retold through forty-one genre lenses — 164 retellings, each " +
      "with narration, score, and illustration, in English and Spanish.",
    stat: "164 retellings · EN / ES",
    accent: PLUM,
    href: GENRE_MACHINE_URL,
    cta: "Open the Genre Machine",
    external: true,
  },
];

function Eyebrow({ children, color = PALETTE.monoGold, className = "" }) {
  return (
    <p
      className={`text-[10px] font-mono uppercase tracking-[0.22em] ${className}`}
      style={{ color }}
    >
      {children}
    </p>
  );
}

function Wordmark({ navigate }) {
  return (
    <a
      {...linkProps(navigate, "/")}
      className="font-semibold tracking-tight text-base outline-none rounded focus-visible:ring-2 focus-visible:ring-[#1A1713]"
      style={{ color: PALETTE.inkPrimary }}
      aria-label="Kaizen.School home"
    >
      Kaizen<span style={{ color: PALETTE.monoGold }}>.School</span>
    </a>
  );
}

function DoorCard({ door, navigate }) {
  const anchorProps = door.external
    ? { href: door.href }
    : linkProps(navigate, door.to);
  const Arrow = door.external ? IconArrowUpRight : IconArrowRight;

  return (
    <a
      {...anchorProps}
      className="group flex flex-col gap-3 p-6 rounded-2xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#1A1713] hover:-translate-y-0.5"
      style={{
        background: PALETTE.bone,
        borderTop: `1px solid ${PALETTE.tagBorder}`,
        borderRight: `1px solid ${PALETTE.tagBorder}`,
        borderBottom: `1px solid ${PALETTE.tagBorder}`,
        borderLeft: `6px solid ${door.accent}`,
        boxShadow: "0 1px 0 rgba(255,253,247,0.6) inset, 0 2px 10px -4px rgba(26,23,19,0.14)",
        color: PALETTE.inkPrimary,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 0 rgba(255,253,247,0.6) inset, 0 10px 26px -10px rgba(26,23,19,0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 0 rgba(255,253,247,0.6) inset, 0 2px 10px -4px rgba(26,23,19,0.14)";
      }}
    >
      <Eyebrow>
        {door.number} · {door.kicker}
      </Eyebrow>
      <h2 className="text-[1.35rem] font-semibold leading-snug tracking-tight">
        {door.title}
      </h2>
      <p className="text-[0.95rem] leading-relaxed" style={{ color: PALETTE.inkSecondary }}>
        {door.desc}
      </p>
      <div
        className="mt-auto pt-4 flex items-center justify-between gap-3"
        style={{ borderTop: `1px solid ${PALETTE.hairline}` }}
      >
        <span
          className="text-[11px] font-mono uppercase tracking-[0.12em] font-semibold"
          style={{ color: door.accent }}
        >
          {door.stat}
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:underline underline-offset-4"
          style={{ color: PALETTE.inkPrimary }}
        >
          {door.cta}
          <Arrow size={16} />
        </span>
      </div>
    </a>
  );
}

export default function LandingPage({ navigate }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: PALETTE.parchment,
        color: PALETTE.inkPrimary,
        fontFamily: '"Manrope", system-ui, sans-serif',
      }}
    >
      <header
        className="flex items-center gap-4 px-6 lg:px-10 h-14"
        style={{ background: PALETTE.bone, borderBottom: `1px solid ${PALETTE.standardBorder}` }}
      >
        <Wordmark navigate={navigate} />
        <nav aria-label="Primary" className="ml-auto flex items-center gap-5 text-sm">
          <a
            {...linkProps(navigate, "/teks")}
            className="hover:underline underline-offset-4 outline-none rounded focus-visible:ring-2 focus-visible:ring-[#1A1713]"
            style={{ color: PALETTE.inkSecondary }}
          >
            TEKS Glossary
          </a>
          <a
            {...linkProps(navigate, "/teks?video=1")}
            className="hover:underline underline-offset-4 outline-none rounded focus-visible:ring-2 focus-visible:ring-[#1A1713]"
            style={{ color: PALETTE.inkSecondary }}
          >
            Videos
          </a>
          <a
            href={GENRE_MACHINE_URL}
            className="hidden sm:inline-flex items-center gap-1 hover:underline underline-offset-4 outline-none rounded focus-visible:ring-2 focus-visible:ring-[#1A1713]"
            style={{ color: PALETTE.inkSecondary }}
          >
            Genre Machine
            <IconArrowUpRight size={14} />
          </a>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 lg:px-10">
        <section className="pt-12 pb-10 md:pt-16 md:pb-14">
          <Eyebrow>Steve Kaminczak · English language arts</Eyebrow>
          <h1
            className="font-semibold leading-[1.1] tracking-tight mt-3 max-w-4xl"
            style={{ fontSize: "clamp(1.9rem, 3.2vw + 1rem, 3.4rem)" }}
          >
            I design English language arts curriculum — and I build the tools it runs on.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {DOORS.map((door) => (
              <DoorCard key={door.key} door={door} navigate={navigate} />
            ))}
          </div>
        </section>

        <section
          className="rounded-3xl p-7 md:p-9 mb-14"
          style={{ background: PALETTE.bone, border: `1px solid ${PALETTE.standardBorder}` }}
        >
          <Eyebrow>About</Eyebrow>
          <p
            className="mt-3 text-[1.05rem] leading-relaxed max-w-3xl"
            style={{ color: PALETTE.inkSecondary }}
          >
            I've spent 25 years teaching English language arts, and I still write for the
            teacher who has to stand up and teach the standard tomorrow. Every glossary entry
            reads the way a veteran briefs a new colleague: what the standard actually asks,
            what mastery looks like in the room, and how the test will phrase it. The database,
            the videos, and the site that serves them are all built and maintained by me.
          </p>
        </section>
      </main>

      <footer
        className="px-6 lg:px-10 py-6"
        style={{ background: PALETTE.sand, borderTop: `1px solid ${PALETTE.standardBorder}` }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a
            href="mailto:kaminczak@gmail.com"
            className="hover:underline underline-offset-4 outline-none rounded focus-visible:ring-2 focus-visible:ring-[#1A1713]"
            style={{ color: PALETTE.inkSecondary }}
          >
            kaminczak@gmail.com
          </a>
          <a
            href="https://sk.md"
            className="inline-flex items-center gap-1 hover:underline underline-offset-4 outline-none rounded focus-visible:ring-2 focus-visible:ring-[#1A1713]"
            style={{ color: PALETTE.inkSecondary }}
          >
            sk.md
            <IconArrowUpRight size={14} />
          </a>
          <span className="ml-auto text-xs" style={{ color: PALETTE.stone }}>
            © {new Date().getFullYear()} Steve Kaminczak
          </span>
        </div>
      </footer>
    </div>
  );
}
