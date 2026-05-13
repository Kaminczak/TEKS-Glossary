// Real TEK content for 110.36(1)(B) — Follow and Give Complex Oral Instructions
// Pulled from D:\Kaizen\Projects\TEKs Database\English TEKS\English III - Individual\110 36 1B.md
// (filename uses 110 38 folder but the file is the English I 1B vault entry).
// Video ID matches the published explainer at kaminczak.github.io/tek-example/

export const SAMPLE_VAULT_TEK = {
  code: '110.36(1)(B)',
  title: 'Follow and Give Complex Oral Instructions',
  course: 'English I',
  courseCode: '110.36',
  strand: 'Foundational Language Skills',
  substrand: 'Oral Language',
  letter: '1B',
  standardNumber: 1,
  expectationLetter: 'B',
  dok: 3,
  bloom: 'Apply / Analyze',
  estimatedTime: 'Ongoing',
  verticalPrev: { code: '110.35(1)(B)', course: 'Grade 8' },
  verticalNext: { code: '110.37(1)(B)', course: 'English II' },
  related: [
    { code: '110.36(1)(A)', short: 'Engage in respectful discourse' },
    { code: '110.36(1)(C)', short: 'Give a formal presentation' },
    { code: '110.36(1)(D)', short: 'Participate collaboratively' },
    { code: '110.36(11)(A)', short: 'Inquiry questioning' },
  ],
  glyphs: ['ear', 'list-numbers', 'message-question', 'speakerphone'],
  displayTags: [
    'Oral Instructions',
    'Active Listening',
    'Multi-Step Processing',
    'Clarification',
    'Procedural Communication',
  ],

  expectation:
    'Follow and give complex oral instructions to perform specific tasks, answer questions, or solve problems and complex processes.',

  overview:
    "Students learn to receive multi-step verbal information and execute on it — and, just as critically, to package their own thinking into instructions another person can actually follow. This is the oral-language version of \"show your work\": clarity under spoken pressure, with no chance to re-read.",

  studentFriendly:
    "You can listen to a multi-step set of spoken instructions, hold the steps in your head long enough to act on them, and ask the right question if something's missing — and you can give instructions clearly enough that someone else can do the task without having to guess what you meant.",

  questionStems: [
    "I just gave you that direction once. Walk me back through it in your own words — what's step one?",
    "Where in that set of instructions did you start to lose the thread? What would have kept you anchored?",
    "You're explaining this process to a sub who's never seen it. What's the order, and what would you have to say out loud that we usually don't?",
    "Someone follows your instructions and gets the wrong result. Was the problem in their listening or in your wording? How can you tell?",
    "What's the difference between \"I heard you\" and \"I can do what you said\"? Show me with this task.",
    "A direction had a step you didn't understand. What's the question that would actually unstick you — not just \"huh?\"",
    "Re-give those instructions, but assume the listener is rushed and stressed. What changes about how you say them?",
    "When does writing it down help, and when is the act of writing it down what's making you fall behind on listening?",
    "You're giving a procedure with seven steps. Which two are most likely to get skipped, and what do you do to protect them?",
    "Listen to a classmate's instructions and execute exactly what they said — no improvising. Where did the gap between their words and your action show up?",
  ],

  misconceptions: [
    {
      title: '"Heard it" equals "got it"',
      body:
        "Students conflate auditory reception with comprehension. They nod through a six-step direction and then freeze on step three. Teach them that the move after listening is rehearsal — silently repeat the steps in your head, or paraphrase to a partner — before acting. Reception isn't the skill; processing is.",
    },
    {
      title: 'Asking a question makes you look unprepared',
      body:
        "Many students will guess and execute incorrectly rather than ask \"wait, before step two or after?\" because asking feels like admitting weakness. Reframe it: a clarifying question is the move that prevents wasted work. Model it yourself in front of them — interrupt your own instructions and ask whether anyone needs you to back up.",
    },
    {
      title: 'Giving instructions is just listing steps in order',
      body:
        "Students think procedural speech is mechanical — you just say what comes first, then next. Real instruction-giving is anticipatory: it warns about the part where people usually get stuck, names what success looks like, and uses tone and pace to mark which steps matter most. Teach them that \"what\" without \"watch out for\" is half a direction.",
    },
    {
      title: 'The listener is responsible for keeping up',
      body:
        "When a classmate doesn't follow their instructions, students blame the listener. Push them to audit their own delivery — Were the steps grouped logically? Did you pause between them? Did you use vague pronouns (\"put it there\") that assumed shared context? The speaker's job is to make following possible.",
    },
    {
      title: 'Notes are for reading, not for listening',
      body:
        "Students treat notetaking as a written-text skill and fail to deploy it during oral instructions. Show them shorthand strategies — numbered list, arrows, single keywords — that capture sequence without slowing them down enough to miss the next step. The goal isn't transcription; it's a memory hook.",
    },
  ],

  assignments: [
    {
      name: 'Blind Build',
      body:
        'One student gives oral instructions; partner builds something (LEGO, origami, drawing) without seeing the model. Debrief: where did the instructions break down?',
    },
    {
      name: 'Sub Plans, Verbally',
      body:
        'Students record a 3-minute audio explaining a class procedure (turn-in routine, lab setup) for a hypothetical substitute teacher. Peer-grade for completeness and clarity.',
    },
    {
      name: 'Recipe Telephone',
      body:
        'Pass a multi-step procedure orally through 4 students. Compare original to final version. Analyze where information got lost.',
    },
    {
      name: 'Process Interview',
      body:
        'Students interview a peer about how they do something complex (a sport move, video game strategy, hobby). Transcribe instructions; give back to interviewee for accuracy check.',
    },
    {
      name: 'Listen-and-Reproduce Quiz',
      body:
        'Read a 5-step process aloud once. Students execute or write back. Score not just accuracy but where errors clustered (early steps, late, transitions).',
    },
  ],

  mastery: [
    'Follows a 5+ step oral direction the first time, with no repetition needed, and executes accurately.',
    'Asks targeted clarifying questions ("did you mean before or after step 3?") instead of vague ones ("what?") when a step is unclear.',
    'Gives verbal instructions that another novice can follow to completion without intervention.',
    'Adjusts delivery (pace, grouping, emphasis) when the listener signals they\'re losing the thread.',
    'Uses appropriate notetaking shorthand during long oral processes without losing input.',
  ],

  notes: [
    'Vertical alignment: B-letter through Grade 8 → English I → English II is the same expectation almost verbatim. By Grade 11 (110.38(1)(B)) it adds "clarify meaning by asking pertinent questions" — the asking-questions piece becomes explicit later, but it\'s already implied here.',
    'Voice approved: veteran ELA teacher briefing a new one (per HANDOFF.md).',
  ],

  // Real published explainer video for this TEK.
  // BASE_URL is '/' in dev and '/TEKS-Glossary/' in the GitHub Pages build,
  // so the file resolves correctly in both environments.
  explainerVideo: {
    videoUrl: `${import.meta.env.BASE_URL}videos/110-36-1B.mp4`,
    youtubeId: 'VqG7RZ4Gnms',
    label: 'Teacher Explainer',
    duration: '2 min',
  },
};

// Subject palette accents.
export const SUBJECT_ACCENTS = {
  ela: 'oklch(0.45 0.08 150)',
  math: 'oklch(0.45 0.10 30)',
  science: 'oklch(0.45 0.10 260)',
  social: 'oklch(0.45 0.08 70)',
};
