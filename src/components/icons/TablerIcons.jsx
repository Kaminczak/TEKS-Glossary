// Inline Tabler icons (MIT license). Each is a tiny React component.
// We don't install @tabler/icons-react because we only need a few — keeping
// the bundle small and the dependency surface flat.
//
// All icons share the same baseline: 24x24 viewBox, stroke-based, currentColor.

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

const make = (paths) => ({ size = 24, className = '', ...rest } = {}) =>
  (
    <svg {...base} width={size} height={size} className={className} {...rest}>
      {paths}
    </svg>
  );

export const IconEar = make(
  <>
    <path d="M6 10c0 -3.5 2.667 -6 6 -6c3.333 0 6 2.5 6 6c0 1.667 -.667 3 -2 4c-1.333 1 -2 2 -2 3c0 1.5 -1 3 -3 3" />
    <path d="M10 10a2 2 0 1 1 4 0c0 1.387 -.81 2.117 -1.435 2.633" />
  </>
);

export const IconMessageQuestion = make(
  <>
    <path d="M8 9h8" />
    <path d="M8 13h6" />
    <path d="M14 19l-3 3l-3 -3h-3a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h13a2 2 0 0 1 2 2v6" />
    <path d="M19 22v.01" />
    <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
  </>
);

export const IconListNumbers = make(
  <>
    <path d="M11 6h9" />
    <path d="M11 12h9" />
    <path d="M12 18h8" />
    <path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" />
    <path d="M6 10v-6l-2 2" />
  </>
);

export const IconBulb = make(
  <>
    <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
    <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
    <path d="M9.7 17l4.6 0" />
  </>
);

export const IconTarget = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </>
);

export const IconBlockquote = make(
  <>
    <path d="M6 15h15" />
    <path d="M21 19h-15" />
    <path d="M15 11h6" />
    <path d="M21 7h-6" />
    <path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
    <path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" />
  </>
);

export const IconAlertTriangle = make(
  <>
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
    <path d="M12 16h.01" />
  </>
);

export const IconChecks = make(
  <>
    <path d="M7 12l5 5l10 -10" />
    <path d="M2 12l5 5m5 -5l5 -5" />
  </>
);

export const IconNotebook = make(
  <>
    <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
    <path d="M13 8l2 0" />
    <path d="M13 12l2 0" />
  </>
);

export const IconPlayerPlayFilled = make(
  <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" fill="currentColor" />
);

export const IconArrowLeft = make(
  <>
    <path d="M5 12l14 0" />
    <path d="M5 12l6 6" />
    <path d="M5 12l6 -6" />
  </>
);

export const IconArrowRight = make(
  <>
    <path d="M5 12l14 0" />
    <path d="M13 18l6 -6" />
    <path d="M13 6l6 6" />
  </>
);

export const IconSearch = make(
  <>
    <circle cx="10" cy="10" r="7" />
    <path d="M21 21l-6 -6" />
  </>
);

export const IconClock = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </>
);

export const IconBrain = make(
  <>
    <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
    <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
    <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
    <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
    <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
    <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
  </>
);

export const IconLayoutList = make(
  <>
    <path d="M4 4h6v6h-6z" />
    <path d="M4 14h6v6h-6z" />
    <path d="M14 4h6v6h-6z" />
    <path d="M14 14h6v6h-6z" />
  </>
);

export const IconFilePencil = make(
  <>
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M18.42 14.61a2.1 2.1 0 1 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
    <path d="M19 13.5v-5.5l-5 -5h-7a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h7" />
  </>
);

export const IconClipboardCheck = make(
  <>
    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
    <path d="M9 3a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
    <path d="M9 14l2 2l4 -4" />
  </>
);

export const IconSunrise = make(
  <>
    <path d="M3 17h1m16 0h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7m-9.7 5.7a4 4 0 0 1 8 0" />
    <path d="M3 21l18 0" />
    <path d="M12 9v-6l3 3m-6 0l3 -3" />
  </>
);

export const IconListCheck = make(
  <>
    <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
    <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
    <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
    <path d="M11 6l9 0" />
    <path d="M11 12l9 0" />
    <path d="M11 18l9 0" />
  </>
);

export const IconBook = make(
  <>
    <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
    <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
    <path d="M3 6l0 13" />
    <path d="M12 6l0 13" />
    <path d="M21 6l0 13" />
  </>
);

export const IconUsersGroup = make(
  <>
    <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
    <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M17 10h2a2 2 0 0 1 2 2v1" />
    <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
  </>
);

export const IconWand = make(
  <>
    <path d="M6 21l15 -15l-3 -3l-15 15l3 3" />
    <path d="M15 6l3 3" />
    <path d="M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
    <path d="M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
  </>
);

export const IconArrowUpRight = make(
  <>
    <path d="M17 7l-10 10" />
    <path d="M8 7l9 0l0 9" />
  </>
);

export const IconChevronRight = make(
  <path d="M9 6l6 6l-6 6" />
);

export const IconCalendarTime = make(
  <>
    <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />
    <path d="M18 16.496v1.504l1 1" />
    <circle cx="18" cy="18" r="4" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 11h16" />
  </>
);

export const IconCalculator = make(
  <>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 7h8m-8 4h8m-8 4h2m6 0h-2v4" />
  </>
);

export const IconFlask = make(
  <>
    <path d="M9 3l6 0" />
    <path d="M10 9l4 0" />
    <path d="M10 3v6l-4 11a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-4 -11v-6" />
  </>
);

export const IconWorld = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.6 9h16.8" />
    <path d="M3.6 15h16.8" />
    <path d="M11.5 3a17 17 0 0 0 0 18" />
    <path d="M12.5 3a17 17 0 0 1 0 18" />
  </>
);

export const IconSpeakerphone = make(
  <>
    <path d="M18 8a3 3 0 0 1 0 6" />
    <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5" />
    <path d="M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8" />
  </>
);

export const IconHome = make(
  <>
    <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
  </>
);

// Map glyph slugs (from frontmatter) -> components for dynamic lookup.
export const GLYPH = {
  ear: IconEar,
  'message-question': IconMessageQuestion,
  'list-numbers': IconListNumbers,
  bulb: IconBulb,
  target: IconTarget,
  blockquote: IconBlockquote,
  'alert-triangle': IconAlertTriangle,
  checks: IconChecks,
  notebook: IconNotebook,
  brain: IconBrain,
  'layout-list': IconLayoutList,
  speakerphone: IconSpeakerphone,
};
