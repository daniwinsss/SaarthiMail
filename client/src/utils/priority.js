/**
 * The AI prompt (server/src/prompts/summarise.prompt.js) emits "high" | "medium" | "low".
 * The wireframes speak in Urgent / Important / Later. This is the single place that
 * bridges the two, so pages never disagree on what an unlabelled email is.
 */
export const PRIORITY_KEYS = ['urgent', 'important', 'later'];

export const PRIORITY_META = {
  urgent: {
    key: 'urgent',
    label: 'Urgent',
    dot: 'bg-urgent',
    rule: 'border-urgent',
    edge: 'border-l-urgent',
    tag: 'tag-urgent',
    weight: 3,
  },
  important: {
    key: 'important',
    label: 'Important',
    dot: 'bg-important',
    rule: 'border-important',
    edge: 'border-l-important',
    tag: 'tag-important',
    weight: 2,
  },
  later: {
    key: 'later',
    label: 'Later',
    dot: 'bg-later',
    rule: 'border-later',
    edge: 'border-l-later',
    tag: 'tag-later',
    weight: 1,
  },
};

const ALIASES = {
  high: 'urgent',
  urgent: 'urgent',
  critical: 'urgent',
  medium: 'important',
  important: 'important',
  normal: 'important',
  low: 'later',
  later: 'later',
  none: 'later',
};

/** Anything unrecognised (including undefined) falls back to "later". */
export const normalizePriority = (raw) =>
  ALIASES[String(raw || '').trim().toLowerCase()] || 'later';

export const priorityMeta = (raw) => PRIORITY_META[normalizePriority(raw)];
