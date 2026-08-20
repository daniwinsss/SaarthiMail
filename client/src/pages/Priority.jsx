import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';
import AIInsightPanel from '../components/AIInsightPanel';
import AIBadge from '../components/AIBadge';
import { api } from '../services/apiClient';
import { mapEmails, matchesQuery } from '../utils/mapEmail';
import { PRIORITY_KEYS, PRIORITY_META } from '../utils/priority';
import { AI_SCORES } from '../data/mockData';

const PriorityCard = ({ email, accent }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/mail/${email.id}`)}
      className={cn(
        'w-full text-left bg-white border border-slate-200 border-l-4 rounded-12 p-12 shadow-sm',
        'hover:border-primary/30 hover:shadow-md transition-all flex flex-col gap-6',
        accent
      )}
    >
      <div className="flex items-center gap-8">
        <div className="w-24 h-24 bg-accent-light border border-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-[9px] shrink-0">
          {email.initials}
        </div>
        <span className="text-[13px] font-bold text-slate-900 truncate">{email.sender}</span>
        <span
          className="ml-auto text-[10px] font-black text-slate-400 shrink-0"
          title="AI confidence - demo data"
        >
          {AI_SCORES[email.priority]}
        </span>
      </div>
      <span className="text-[12px] font-semibold text-slate-700 line-clamp-2">{email.subject}</span>
      <span className="text-[10px] font-bold text-slate-400">{email.relative}</span>
    </motion.button>
  );
};

const Column = ({ meta, emails, loading }) => (
  <div className="flex flex-col gap-8 min-w-0">
    <div className={cn('flex items-center gap-8 pb-8 border-b-2', meta.rule)}>
      <span className={cn('w-8 h-8 rounded-full shrink-0', meta.dot)} />
      <span className="text-[14px] font-black tracking-tight text-slate-900">{meta.label}</span>
      <span className="ml-auto text-[12px] font-bold text-slate-400">{emails.length}</span>
    </div>

    {loading
      ? Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="h-72 rounded-12 bg-slate-100 animate-pulse" />
        ))
      : emails.map((email) => (
          <PriorityCard key={email.id} email={email} accent={meta.edge} />
        ))}

    {!loading && !emails.length && (
      <p className="text-[11px] font-bold text-slate-300 py-12 text-center border border-dashed border-slate-200 rounded-12">
        Nothing here
      </p>
    )}
  </div>
);

const Priority = ({ showToast, query }) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        /* getMail(), not getPriorityMail(): the /api/mail/priority endpoint
           hard-filters priority:"high" (server/src/controllers/mail.controller.js),
           so it can never fill the Important and Later columns this board needs. */
        const response = await api.getMail();
        if (!active) return;
        const list = Array.isArray(response?.data) ? response.data : [];
        setEmails(list);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load priority inbox');
        showToast?.('Failed to load priority inbox', 'error');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  const priorityEmails = useMemo(
    () =>
      mapEmails(emails)
        .filter((email) => matchesQuery(email, query))
        .sort((a, b) => b.rawDate - a.rawDate),
    [emails, query]
  );

  const columns = useMemo(
    () =>
      PRIORITY_KEYS.map((key) => ({
        meta: PRIORITY_META[key],
        emails: priorityEmails.filter((email) => email.priority === key),
      })),
    [priorityEmails]
  );

  const aiSummary = priorityEmails[0]?.aiSummary || 'No AI summary available.';
  const aiReply = priorityEmails[0]?.action || 'No suggested reply yet.';

  return (
    <div className="flex h-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-16 md:px-24 py-12 md:py-16 border-b border-border flex items-center justify-between gap-12 bg-white shrink-0">
          <div className="flex items-center gap-12">
            <h2 className="text-[18px] md:text-[22px] font-black tracking-tighter text-slate-900 flex items-center gap-8">
              <Star size={20} fill="#EAB308" className="text-amber-500" />
              <span>Priority Inbox</span>
            </h2>
            <AIBadge>AI Sorted</AIBadge>
          </div>
          <button
            onClick={() => setIsAIPanelOpen(true)}
            className="lg:hidden flex items-center gap-6 px-12 py-8 rounded-12 bg-primary/10 text-primary font-bold text-[13px] shrink-0"
          >
            <Sparkles size={14} fill="currentColor" />
            <span>AI Insight</span>
          </button>
        </div>

        <div className="bg-ai-surface border-b border-ai-border px-16 md:px-24 py-10 flex items-center gap-10 shrink-0">
          <Sparkles size={14} className="text-primary shrink-0" fill="currentColor" />
          <p className="text-[12px] text-slate-600 font-medium">
            AI grouped {priorityEmails.length} thread{priorityEmails.length === 1 ? '' : 's'} by how
            soon they need you.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-16 md:p-24">
          {!loading && !priorityEmails.length ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-16">
              <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center">
                <Star size={32} />
              </div>
              <p className="font-bold">
                {query ? `No priority emails match "${query}".` : 'No priority emails right now.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 items-start">
              {columns.map(({ meta, emails: columnEmails }) => (
                <Column key={meta.key} meta={meta} emails={columnEmails} loading={loading} />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="px-8 py-12 text-[12px] text-rose-500 font-bold">{error}</div>
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
          action: priorityEmails[0]?.action || '',
        }}
        onAddToCalendar={() => showToast?.('Open a priority email to create a calendar event.', 'info')}
        onUseReply={() => showToast?.('Open a priority email to use the suggested reply.', 'info')}
        suggestedActions={priorityEmails.filter((email) => email.action).slice(0, 3).map((email) => email.action)}
      />
    </div>
  );
};

export default Priority;
