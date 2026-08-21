/**
 * Presentation constants for the calendar grid.
 *
 * This file deliberately holds no event data. Calendar content comes from
 * GET /api/mail/calendar/events; demo fixtures live server-side behind the
 * `isDemo` branch so they can never render for a real account.
 */

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Colour buckets keyed by the `kind` the calendar service assigns. */
export const EVENT_KINDS = {
  primary: 'bg-accent-light border-l-primary text-primary',
  important: 'bg-amber-50 border-l-important text-amber-700',
  success: 'bg-emerald-50 border-l-secondary text-emerald-700',
  urgent: 'bg-red-50 border-l-urgent text-urgent',
};
