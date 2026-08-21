import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, SearchX } from 'lucide-react';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';
import AIInsightPanel from '../components/AIInsightPanel';
import PriorityTag from '../components/PriorityTag';
import { api } from '../services/apiClient';
import { mapEmails, matchesQuery } from '../utils/mapEmail';

const Checkbox = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    onClick={(event) => {
      event.stopPropagation();
      onChange();
    }}
    className={cn(
      'w-16 h-16 rounded-4 border shrink-0 flex items-center justify-center transition-colors',
      checked ? 'bg-primary border-primary' : 'bg-white border-slate-300 hover:border-slate-400'
    )}
  >
    {checked && (
      <svg viewBox="0 0 12 12" className="w-10 h-10 text-white">
        <path d="M2 6.5 4.5 9 10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);

const ToolbarAction = ({ children, disabled, title }) => (
  <button
    type="button"
    disabled={disabled}
    title={title}
    className="px-10 py-4 rounded-8 border border-slate-200 text-[11px] font-bold text-slate-500 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

const EmailRow = ({ email, selected, onSelect, starred, onStar }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/mail/${email.id}`)}
      className={cn(
        'flex items-center gap-12 px-16 py-12 border-b border-slate-100 cursor-pointer transition-all group',
        email.isUnread ? 'bg-ai-surface hover:bg-accent-light' : 'bg-white hover:bg-slate-50/80'
      )}
    >
      <Checkbox checked={selected} onChange={onSelect} label={`Select mail from ${email.sender}`} />

      <button
        type="button"
        aria-label={starred ? 'Remove star' : 'Add star'}
        onClick={(event) => {
          event.stopPropagation();
          onStar();
        }}
        className="shrink-0 text-slate-300 hover:text-amber-500 transition-colors"
      >
        <Star size={15} fill={starred ? '#F59E0B' : 'none'} className={cn(starred && 'text-amber-500')} />
      </button>

      <div className="w-32 h-32 bg-accent-light border border-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-[11px] shrink-0">
        {email.initials}
      </div>

      <div className="flex-1 min-w-0">
        {/* One dense line on sm+ (wireframe 2a); stacked below it, where a single
            line squeezes the subject down to a couple of characters. */}
        <div className="min-w-0 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-10">
          <div className="flex items-center gap-8 min-w-0">
            <span className={cn('text-[13px] shrink-0', email.isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-700')}>
              {email.sender}
            </span>
            {email.priority !== 'later' && (
              <PriorityTag priority={email.priority} className="shrink-0 sm:hidden" />
            )}
          </div>
          <span className={cn('text-[13px] truncate', email.isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700')}>
            {email.subject}
          </span>
          {email.priority !== 'later' && (
            <PriorityTag priority={email.priority} className="shrink-0 hidden sm:inline-flex" />
          )}
        </div>
        <p className="text-[12px] text-slate-500 truncate mt-2">{email.snippet}</p>
      </div>

      <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap shrink-0">{email.timestamp}</span>
    </motion.div>
  );
};

const NO_BULK_ENDPOINT = 'Not available yet - the API has no bulk mail endpoint.';

const Inbox = ({ showToast, query, onCompose }) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const [starred, setStarred] = useState(() => new Set());

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.getMail();
        if (!active) return;
        const list = Array.isArray(response?.data) ? response.data : [];
        if (list.length) {
          setEmails(list);
          setError(null);
          return;
        }

        const auth = await api.checkAuth();
        if (!active) return;

        if (!auth?.isAuthenticated || auth.user?.isDemo) {
          setEmails(list);
          setError(null);
          return;
        }

        const syncKey = `saarthi:auto-sync:${auth.user.email}`;
        if (sessionStorage.getItem(syncKey)) {
          setEmails(list);
          setError(null);
          return;
        }

        sessionStorage.setItem(syncKey, '1');
        await api.getGmail();
        const refreshed = await api.getMail();
        if (!active) return;
        setEmails(Array.isArray(refreshed?.data) ? refreshed.data : []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load inbox');
        showToast?.(err.message || 'Failed to load inbox', 'error');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  const mappedEmails = useMemo(
    () => mapEmails(emails).sort((a, b) => b.rawDate - a.rawDate),
    [emails]
  );

  const visibleEmails = useMemo(
    () => mappedEmails.filter((email) => matchesQuery(email, query)),
    [mappedEmails, query]
  );

  const unreadCount = visibleEmails.filter((email) => email.isUnread).length;
  const allSelected = visibleEmails.length > 0 && visibleEmails.every((email) => selected.has(email.id));

  const toggleIn = (setter) => (id) =>
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSelected = toggleIn(setSelected);
  const toggleStarred = toggleIn(setStarred);

  const toggleSelectAll = () =>
    setSelected(allSelected ? new Set() : new Set(visibleEmails.map((email) => email.id)));

  const handleSync = async () => {
    try {
      setLoading(true);
      await api.getGmail();
      const response = await api.getMail();
      setEmails(Array.isArray(response?.data) ? response.data : []);
      showToast?.('Successfully synced and analyzed emails!', 'success');
    } catch (err) {
      showToast?.(err.message || 'Failed to sync emails', 'error');
    } finally {
      setLoading(false);
    }
  };

  const aiSummary = visibleEmails[0]?.aiSummary || 'No AI summary available.';
  const aiReply = visibleEmails[0]?.reply || 'No suggested reply yet.';
  const suggestedActions = visibleEmails
    .filter((email) => email.action)
    .slice(0, 3)
    .map((email) => email.action);

  return (
    <div className="flex h-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-16 md:px-24 py-12 border-b border-border flex items-center justify-between gap-12 bg-white shrink-0">
          <div className="flex items-center gap-16">
            <h2 className="text-[16px] md:text-[18px] font-black tracking-tighter text-slate-900">Inbox</h2>
            <button
              onClick={handleSync}
              className="px-12 py-4 rounded-full text-[12px] font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-6"
            >
              <Sparkles size={12} fill="currentColor" />
              Sync Gmail
            </button>
          </div>
          <div className="flex items-center gap-8">
            {onCompose && (
              <button
                onClick={() => onCompose()}
                className="md:hidden px-12 py-4 rounded-full text-[12px] font-bold bg-primary text-white"
              >
                Compose
              </button>
            )}
            <button
              onClick={() => setIsAIPanelOpen(true)}
              className="lg:hidden flex items-center gap-6 px-10 py-4 rounded-full text-[12px] font-bold bg-primary/10 text-primary"
            >
              <Sparkles size={12} fill="currentColor" />
              <span>AI</span>
            </button>
          </div>
        </div>

        {/* bulk toolbar - wireframe 2a */}
        <div className="px-16 md:px-24 py-8 border-b border-slate-100 bg-slate-50/60 flex items-center gap-10 shrink-0 overflow-x-auto custom-scrollbar">
          <Checkbox checked={allSelected} onChange={toggleSelectAll} label="Select all mail" />
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
            {selected.size ? `${selected.size} selected` : 'Select all'}
          </span>
          <div className="flex items-center gap-4 ml-8">
            <ToolbarAction disabled title={NO_BULK_ENDPOINT}>Archive</ToolbarAction>
            <ToolbarAction disabled title={NO_BULK_ENDPOINT}>Delete</ToolbarAction>
            <ToolbarAction disabled title={NO_BULK_ENDPOINT}>Mark Read</ToolbarAction>
          </div>
          <span className="ml-auto text-[11px] font-bold text-slate-400 whitespace-nowrap">
            {visibleEmails.length
              ? `1-${visibleEmails.length} of ${mappedEmails.length}${unreadCount ? ` · ${unreadCount} unread` : ''}`
              : '0 of 0'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="p-24 space-y-12">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-64 rounded-16 bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {!loading &&
            visibleEmails.map((email) => (
              <EmailRow
                key={email.id}
                email={email}
                selected={selected.has(email.id)}
                onSelect={() => toggleSelected(email.id)}
                starred={starred.has(email.id)}
                onStar={() => toggleStarred(email.id)}
              />
            ))}

          {!loading && !visibleEmails.length && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-16">
              <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center">
                {query ? <SearchX size={28} /> : <Sparkles size={32} />}
              </div>
              <p className="font-bold">{query ? `No emails match "${query}".` : 'No emails found.'}</p>
            </div>
          )}

          {error && !loading && (
            <div className="px-24 py-12 text-[12px] text-rose-500 font-bold">{error}</div>
          )}
        </div>
      </div>

      <AIInsightPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        mode="inbox"
        insights={{
          summary: aiSummary,
          reply: aiReply,
          action: visibleEmails[0]?.action || '',
        }}
        onAddToCalendar={() => showToast?.('Select an email to create a calendar event.', 'info')}
        onUseReply={() => showToast?.('Open an email to use the suggested reply.', 'info')}
        suggestedActions={suggestedActions}
      />
    </div>
  );
};

export default Inbox;
