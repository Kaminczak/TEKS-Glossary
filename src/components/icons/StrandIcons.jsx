// One icon per ELA strand, plus the framed-chip wrapper that renders it.
//
// WHY ICONS. There are 7 strands. Evenly spaced that is ~51 degrees of hue apart,
// which is near the limit of what reads as distinct at chip size — the original
// palette had two pairs closer than 15 degrees and they were indistinguishable.
// An icon is unmistakable at 16px, survives colourblindness, and still works in a
// photocopied worksheet. Colour is now the second signal, not the only one.
//
// Same baseline as TablerIcons.jsx: 24x24 viewBox, stroke-based, currentColor —
// so a chip inherits the strand colour by setting `color` on the wrapper.

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const make = (paths) => ({ size = 24, className = '', ...rest } = {}) => (
  <svg {...base} width={size} height={size} className={className} {...rest}>
    {paths}
  </svg>
);

// Foundational Language Skills — "Aa". Letterforms: the alphabet itself.
export const IconFoundational = make(
  <>
    <path d="M3 18l4.5 -12l4.5 12" />
    <path d="M4.5 14h6" />
    <path d="M20 12.5a2.5 2.5 0 0 0 -2.5 -2.5h-.5a2.5 2.5 0 0 0 -2.5 2.5" />
    <path d="M20 10v8" />
    <path d="M20 15.5a2.5 2.5 0 0 1 -2.5 2.5h-.5a2 2 0 0 1 0 -4h3" />
  </>
);

// Comprehension Skills — a brain. Understanding, not decoding.
export const IconComprehension = make(
  <>
    <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
    <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
    <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
    <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
    <path d="M12 4a2.5 2.5 0 0 0 -2.5 2.5v10" />
    <path d="M12 4a2.5 2.5 0 0 1 2.5 2.5v10" />
  </>
);

// Response Skills — a person speaking. Responding aloud and in writing.
export const IconResponse = make(
  <>
    <path d="M10 8a2.5 2.5 0 1 0 0 -5a2.5 2.5 0 0 0 0 5" />
    <path d="M4 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    <path d="M17 7a4 4 0 0 1 0 6" />
    <path d="M20 5a7 7 0 0 1 0 10" />
  </>
);

// Multiple Genres — a collection card marked with a star. Many forms of text.
export const IconGenres = make(
  <>
    <path d="M4 5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
    <path d="M8 7h3" />
    <path d="M8 11h3" />
    <path d="M8 15h3" />
    <path d="M15.2 9.5l.9 1.9l2 .3l-1.45 1.45l.35 2.05l-1.8 -.95l-1.8 .95l.35 -2.05l-1.45 -1.45l2 -.3z" />
  </>
);

// Author's Purpose and Craft — a target. Why the author chose what they chose.
export const IconCraft = make(
  <>
    <path d="M12 21a9 9 0 1 0 0 -18a9 9 0 0 0 0 18" />
    <path d="M12 16a4 4 0 1 0 0 -8a4 4 0 0 0 0 8" />
    <path d="M12 13a1 1 0 1 0 0 -2a1 1 0 0 0 0 2" />
  </>
);

// Composition — a page being written on. Producing text, not receiving it.
export const IconComposition = make(
  <>
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v3.5" />
    <path d="M8 12h4" />
    <path d="M8 16h2.5" />
    <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3z" />
  </>
);

// Inquiry & Research — a magnifier. Searching, sourcing, investigating.
export const IconInquiry = make(
  <>
    <path d="M10 18a8 8 0 1 0 0 -16a8 8 0 0 0 0 16" />
    <path d="M21 21l-5.2 -5.2" />
  </>
);

// Strand name -> icon. Keys must match the `strand` values in teksData.json exactly.
export const STRAND_ICONS = {
  'Foundational Language Skills': IconFoundational,
  'Comprehension Skills': IconComprehension,
  'Response Skills': IconResponse,
  'Multiple Genres': IconGenres,
  "Author's Purpose and Craft": IconCraft,
  Composition: IconComposition,
  'Inquiry & Research': IconInquiry,
};

/**
 * Framed chip — the icon in a soft rounded square, per the Row D design.
 * `color` sets the stroke, so pass the strand colour and the glyph follows.
 * Deliberately no border: the site's "No-Line" rule says boundaries come from
 * background shifts, so the frame is a tinted fill rather than a 1px outline.
 */
export function StrandChip({ strand, color, size = 26, title, solid = false, glyph = '#FFFDF7' }) {
  const Icon = STRAND_ICONS[strand];
  if (!Icon) return null;
  const inner = Math.round(size * (solid ? 0.55 : 0.62));
  return (
    <span
      title={title ?? strand}
      aria-label={strand}
      role="img"
      style={{
        // solid: filled tile, light glyph — the tile is the card's only accent mass,
        // so it carries the course colour and the glyph shape carries the strand.
        // tinted (default): 10% wash of the passed colour over bone, for lighter contexts.
        color: solid ? glyph : color,
        background: solid ? color : 'color-mix(in oklab, currentColor 10%, #FFFDF7)',
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <Icon size={inner} strokeWidth={solid ? 2.2 : 1.9} />
    </span>
  );
}
