import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';
import { WEEK_DAYS, EVENT_KINDS } from '../data/calendarUi';
import AIInsightPanel from '../components/AIInsightPanel';
import AIBadge from '../components/AIBadge';
import { api } from '../services/apiClient';
import { priorityMeta } from '../utils/priority';

const MS_DAY = 86400000;

/** Stable identity so memos downstream don't re-run on every render. */
const NO_EVENTS = [];

/** Visible rows of the week grid. Wide enough that real events aren't hidden. */
const DAY_HOURS = Array.from({ length: 15 }, (_, index) => index + 7); // 7 AM – 9 PM
const FIRST_HOUR = DAY_HOURS[0];
const LAST_HOUR = DAY_HOURS[DAY_HOURS.length - 1];

/** Monday of the week `offset` weeks away from today. */
const weekStart = (offset) => {
  const now = new Date();
  const mondayIndex = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayIndex);
  return new Date(monday.getTime() + offset * 7 * MS_DAY);
};

const formatRange = (start) => {
  const end = new Date(start.getTime() + 6 * MS_DAY);
  const sameMonth = start.getMonth() === end.getMonth();
  const month = start.toLocaleDateString([], { month: 'short' });
  const endMonth = end.toLocaleDateString([], { month: 'short' });
  return sameMonth
    ? `${month} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`
    : `${month} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
};

const hourLabel = (hour) => `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const clockTime = (value) =>
  new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

/** "9:00 AM – 9:30 AM", or just the start when Google gave us no end. */
const eventTimeLabel = (event) => {
  if (event.allDay) return 'All day';
  const start = clockTime(event.start);
  return event.end ? `${start} – ${clockTime(event.end)}` : start;
};

const EventChip = ({ event }) => (
  <div
    className={cn(
      'rounded-6 border-l-4 px-6 py-4 text-[10px] font-bold leading-tight overflow-hidden',
      EVENT_KINDS[event.kind] || EVENT_KINDS.primary
    )}
    title={`${event.title} · ${eventTimeLabel(event)}${event.location ? ` · ${event.location}` : ''}`}
  >
    {event.title}
  </div>
);

const TaskCard = ({ task }) => {
  const meta = priorityMeta(task.priority);
  return (
    <div className="bg-white border border-slate-200 rounded-12 p-12 flex flex-col gap-6 shadow-sm">
      <span className={cn('tag self-start', meta.tag)}>{meta.label}</span>
      <span className="text-[12px] font-bold text-slate-800 leading-snug">{task.text}</span>
      <span className="text-[10px] font-bold text-slate-400">
        {task.origin} · {task.due}
      </span>
    </div>
  );
};

const Calendar = ({ showToast, query }) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [draftTask, setDraftTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // One atomic result object keyed by the range it belongs to, so `loading` is
  // derived rather than toggled -- no setState in the effect body.
  const [result, setResult] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const start = useMemo(() => weekStart(offset), [offset]);
  const days = useMemo(
    () =>
      WEEK_DAYS.map((label, index) => {
        const date = new Date(start.getTime() + index * MS_DAY);
        return { label, date, isToday: isSameDay(date, new Date()) };
      }),
    [start]
  );

  const timeMin = start.toISOString();
  const requestKey = `${timeMin}#${reloadToken}`;

  useEffect(() => {
    let cancelled = false;
    const timeMax = new Date(start.getTime() + 7 * MS_DAY).toISOString();

    const load = async () => {
      try {
        const response = await api.listCalendarEvents(timeMin, timeMax);
        if (cancelled) return;
        setResult({
          requestKey,
          events: response?.data || [],
          error: null,
          needsReauth: false,
          fetchedAt: new Date().getTime(),
        });
      } catch (err) {
        if (cancelled) return;
        const message = err.message || 'Could not load your calendar.';
        // Never fall back to fixtures -- an empty grid with an error beats
        // showing someone events that aren't theirs.
        setResult({
          requestKey,
          events: [],
          error: message,
          needsReauth: /sign in again|calendar access/i.test(message),
          fetchedAt: new Date().getTime(),
        });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [start, timeMin, requestKey]);

  const loading = result?.requestKey !== requestKey;
  const allEvents = result?.requestKey === requestKey ? result.events : NO_EVENTS;
  const error = result?.requestKey === requestKey ? result.error : null;
  const needsReauth = result?.requestKey === requestKey ? result.needsReauth : false;
  const fetchedAt = result?.fetchedAt ?? 0;

  const q = String(query || '').trim().toLowerCase();
  const events = useMemo(
    () => (q ? allEvents.filter((event) => event.title.toLowerCase().includes(q)) : allEvents),
    [allEvents, q]
  );

  const allDayEvents = useMemo(() => events.filter((event) => event.allDay), [events]);

  /**
   * Bucket timed events into grid cells. Anything starting outside the visible
   * hours is clamped to the first/last row rather than silently dropped.
   */
  const eventsByCell = useMemo(() => {
    const cells = new Map();

    events
      .filter((event) => !event.allDay)
      .forEach((event) => {
        const startsAt = new Date(event.start);
        const dayIndex = days.findIndex((day) => isSameDay(day.date, startsAt));
        if (dayIndex === -1) return;

        const hour = Math.min(Math.max(startsAt.getHours(), FIRST_HOUR), LAST_HOUR);
        const key = `${dayIndex}-${hour}`;
        cells.set(key, [...(cells.get(key) || []), event]);
      });

    return cells;
  }, [events, days]);

  const eventsAt = (dayIndex, hour) => eventsByCell.get(`${dayIndex}-${hour}`) || [];

  const visibleTasks = useMemo(
    () => (q ? tasks.filter((task) => task.text.toLowerCase().includes(q)) : tasks),
    [tasks, q]
  );

  const addTask = () => {
    const text = draftTask.trim();
    if (!text) return;
    setTasks((current) => [
      ...current,
      { id: `local-${current.length + 1}`, text, priority: 'later', due: 'No due date', origin: 'Self-created' },
    ]);
    setDraftTask('');
    showToast?.('Task added for this session — tasks are not persisted yet.', 'info');
  };

  /** Insights derived from the events actually loaded, not fixtures. */
  const insights = useMemo(() => {
    if (!allEvents.length) {
      return {
        summary: 'No events on your calendar this week.',
        action: 'Open an email and use Add to Calendar to create an event.',
      };
    }

    const upcoming = allEvents
      .filter((event) => new Date(event.start).getTime() >= fetchedAt)
      .sort((a, b) => new Date(a.start) - new Date(b.start))[0];

    return {
      summary: `${allEvents.length} event${allEvents.length === 1 ? '' : 's'} on your calendar this week.`,
      action: upcoming
        ? `Next up: ${upcoming.title} on ${new Date(upcoming.start).toLocaleDateString([], {
            weekday: 'long',
          })} at ${clockTime(upcoming.start)}.`
        : 'Nothing else scheduled for the rest of this week.',
    };
  }, [allEvents, fetchedAt]);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* header */}
        <div className="px-16 md:px-24 py-12 border-b border-border flex flex-wrap items-center justify-between gap-x-12 gap-y-8 shrink-0">
          <div className="flex items-center gap-10 min-w-0">
            <h1 className="text-[17px] md:text-[20px] font-black tracking-tighter text-slate-900">
              {formatRange(start)}
            </h1>
            {loading && (
              <span className="text-[11px] font-bold text-slate-400">Loading…</span>
            )}
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => setOffset((value) => value - 1)}
              aria-label="Previous week"
              className="p-8 rounded-8 border border-slate-200 text-slate-500 hover:border-primary/40 hover:text-primary transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setOffset(0)}
              className="px-12 py-6 rounded-8 bg-primary text-white text-[12px] font-bold hover:brightness-110 transition-all"
            >
              Today
            </button>
            <button
              onClick={() => setOffset((value) => value + 1)}
              aria-label="Next week"
              className="p-8 rounded-8 border border-slate-200 text-slate-500 hover:border-primary/40 hover:text-primary transition-all"
            >
              <ChevronRight size={15} />
            </button>
            <button
              onClick={() => setReloadToken((value) => value + 1)}
              aria-label="Refresh calendar"
              className="p-8 rounded-8 border border-slate-200 text-slate-500 hover:border-primary/40 hover:text-primary transition-all"
            >
              <RefreshCw size={15} className={cn(loading && 'animate-spin')} />
            </button>
            <button
              onClick={() => setIsAIPanelOpen(true)}
              className="lg:hidden flex items-center gap-6 px-10 py-6 rounded-8 bg-primary/10 text-primary font-bold text-[12px]"
            >
              <Sparkles size={12} fill="currentColor" />
              <span>AI</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row min-h-full">
            {/* week grid */}
            <div className="flex-1 p-16 min-w-0">
              {error && (
                <div className="mb-12 rounded-12 border border-red-200 bg-red-50 px-12 py-10">
                  <p className="text-[12px] font-bold text-red-700">{error}</p>
                  {needsReauth && (
                    <a
                      href="/auth"
                      className="mt-6 inline-block text-[11px] font-bold text-red-700 underline"
                    >
                      Sign in again to reconnect Google Calendar
                    </a>
                  )}
                </div>
              )}

              {!!allDayEvents.length && (
                <div className="mb-12 flex flex-wrap items-center gap-6">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    All day
                  </span>
                  {allDayEvents.map((event) => (
                    <EventChip key={event.id} event={event} />
                  ))}
                </div>
              )}

              <div className="overflow-x-auto custom-scrollbar">
                <div
                  className="grid border border-border rounded-12 overflow-hidden min-w-560"
                  style={{ gridTemplateColumns: '60px repeat(7, minmax(0, 1fr))' }}
                >
                  <div className="border-b-2 border-border bg-slate-50/60 p-8" />
                  {days.map((day) => (
                    <div
                      key={day.label}
                      className={cn(
                        'border-b-2 border-l border-border bg-slate-50/60 p-8 text-center text-[12px] font-bold',
                        day.isToday ? 'text-primary' : 'text-slate-500'
                      )}
                    >
                      {day.label} {day.date.getDate()}
                    </div>
                  ))}

                  {DAY_HOURS.map((hour) => (
                    <React.Fragment key={hour}>
                      <div className="border-b border-border p-6 text-[10px] font-bold text-slate-300">
                        {hourLabel(hour)}
                      </div>
                      {days.map((day, dayIndex) => {
                        const cellEvents = eventsAt(dayIndex, hour);
                        return (
                          <div
                            key={`${day.label}-${hour}`}
                            className={cn(
                              'relative border-b border-l border-border min-h-56 p-2 flex flex-col gap-2',
                              day.isToday && 'bg-accent-light/40'
                            )}
                          >
                            {cellEvents.map((event) => (
                              <EventChip key={event.id} event={event} />
                            ))}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {!loading && !error && !events.length && (
                <p className="text-[12px] font-bold text-slate-400 mt-12">
                  {q ? `No events match "${query}".` : 'No events scheduled this week.'}
                </p>
              )}
            </div>

            {/* tasks sidebar */}
            <div className="w-full md:w-220 border-t md:border-t-0 md:border-l-2 border-border p-16 flex flex-col gap-12 shrink-0">
              <div className="flex items-center justify-between gap-8">
                <h2 className="text-[15px] font-black tracking-tight text-slate-900">Tasks</h2>
                <AIBadge>AI</AIBadge>
              </div>

              <div className="flex flex-col gap-10">
                {visibleTasks.map((task) => (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <TaskCard task={task} />
                  </motion.div>
                ))}
                {!visibleTasks.length && (
                  <p className="text-[11px] font-bold text-slate-300 text-center py-12 border border-dashed border-slate-200 rounded-12">
                    No tasks yet — tasks are kept for this session only.
                  </p>
                )}
              </div>

              <div className="mt-auto flex flex-col gap-8 pt-12">
                <div className="flex items-center gap-8 border border-dashed border-slate-200 rounded-12 px-10 py-8 bg-slate-50/50">
                  <Plus size={14} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={draftTask}
                    onChange={(event) => setDraftTask(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && addTask()}
                    placeholder="Add a task..."
                    className="bg-transparent border-none outline-none text-[13px] font-medium text-slate-600 flex-1 min-w-0"
                  />
                </div>
                <button
                  onClick={addTask}
                  className="w-full bg-primary text-white py-8 rounded-12 font-bold text-[12px] hover:brightness-110 transition-all shadow-md shadow-primary/20"
                >
                  + Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIInsightPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        mode="detail"
        insights={insights}
        onAddToCalendar={() =>
          showToast?.('Open an email and use Add to Calendar to create a real event.', 'info')
        }
      />
    </div>
  );
};

export default Calendar;
