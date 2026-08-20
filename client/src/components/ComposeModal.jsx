import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Save, Sparkles, Paperclip, Link2, Calendar } from 'lucide-react';
import { cn } from '../utils/cn';
import { api } from '../services/apiClient';

const TONES = ['Professional', 'Friendly', 'Concise'];

const NO_REWRITE_ENDPOINT = 'Not available yet - the API has no rewrite endpoint.';
const NO_SEND_ENDPOINT = 'Not available yet - the API has no send endpoint.';

const Row = ({ label, children }) => (
  <div className="flex items-center gap-12 border-b border-slate-100 pb-10">
    <span className="text-[13px] font-bold text-slate-400 w-44 md:w-56 shrink-0">{label}</span>
    {children}
  </div>
);

const AssistButton = ({ children, onClick, disabled, title, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    title={title}
    className={cn(
      'px-10 py-4 rounded-8 border text-[11px] font-bold whitespace-nowrap transition-all',
      'border-primary/30 text-primary hover:bg-primary/10',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent'
    )}
  >
    {loading ? 'Drafting...' : children}
  </button>
);

/**
 * Form state lives in this inner component so that opening the modal - or opening
 * it against a different context - remounts it via `key` and starts from fresh
 * initial state, with no reset-on-open effect.
 */
const ComposeForm = ({ onClose, context, showToast }) => {
  const [tone, setTone] = useState(TONES[0]);
  const [to, setTo] = useState(context?.to || '');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState(context?.subject || '');
  const [body, setBody] = useState(context?.body || '');
  const [drafting, setDrafting] = useState(false);

  const handleDraftReply = async () => {
    const source = context?.emailText || body || subject;
    if (!source.trim()) {
      showToast?.('Add a subject or some context first, then AI can draft a reply.', 'info');
      return;
    }
    try {
      setDrafting(true);
      const response = await api.generateReply(source, context?.mailId);
      const reply = response?.reply || '';
      if (reply) {
        setBody(reply);
        showToast?.('Draft generated', 'success');
      } else {
        showToast?.('AI returned an empty draft', 'error');
      }
    } catch (err) {
      showToast?.(err.message || 'Failed to generate draft', 'error');
    } finally {
      setDrafting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 20 }}
      className="w-full h-full md:h-auto md:max-h-[88vh] md:max-w-720 bg-white md:rounded-24 shadow-2xl overflow-hidden flex flex-col relative z-10"
    >
      <div className="h-56 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between px-20 shrink-0">
        <h3 className="text-[15px] font-black tracking-tight text-slate-900">New Message</h3>
        <button onClick={onClose} className="p-8 hover:bg-slate-100 rounded-full transition-all text-slate-400">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-20 flex flex-col gap-12 custom-scrollbar">
        <Row label="To">
          <input
            type="text"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="border-none outline-none flex-1 text-[14px] font-medium text-slate-700 min-w-0"
            placeholder="recipient@email.com"
          />
        </Row>
        <Row label="Cc">
          <input
            type="text"
            value={cc}
            onChange={(event) => setCc(event.target.value)}
            className="border-none outline-none flex-1 text-[14px] font-medium text-slate-700 min-w-0"
            placeholder="Add recipients..."
          />
        </Row>
        <Row label="Subject">
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="border-none outline-none flex-1 text-[14px] font-bold text-slate-900 min-w-0"
            placeholder="Subject"
          />
        </Row>

        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write your message..."
          className="w-full resize-none border border-slate-200 rounded-12 p-12 outline-none focus:border-primary/40 transition-colors text-[15px] leading-relaxed text-slate-700 min-h-[180px] md:min-h-[240px]"
        />

        {/* AI Assist bar - wireframe 6a */}
        <div className="ai-surface rounded-12 p-10 flex flex-wrap items-center gap-8">
          <span className="ai-badge shadow-sm shadow-primary/20">
            <Sparkles size={11} fill="currentColor" />
            <span>AI Assist</span>
          </span>
          <AssistButton onClick={handleDraftReply} loading={drafting}>
            Draft reply
          </AssistButton>
          <AssistButton disabled title={NO_REWRITE_ENDPOINT}>Improve tone</AssistButton>
          <AssistButton disabled title={NO_REWRITE_ENDPOINT}>Shorter</AssistButton>
          <AssistButton disabled title={NO_REWRITE_ENDPOINT}>More formal</AssistButton>

          <div className="flex items-center gap-6 ml-auto">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Tone</span>
            {TONES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTone(option)}
                className={cn(
                  'px-8 py-4 rounded-8 text-[11px] font-bold transition-all',
                  tone === option
                    ? 'bg-primary text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-primary/40'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-16 md:p-20 border-t border-slate-100 bg-white flex items-center gap-10 shrink-0">
        <button
          disabled
          title={NO_SEND_ENDPOINT}
          className="bg-slate-100 text-slate-400 px-20 py-10 rounded-12 font-bold text-[14px] flex items-center gap-8 cursor-not-allowed"
        >
          <Send size={16} />
          <span>Send</span>
        </button>
        <button className="bg-primary text-white px-16 py-10 rounded-12 font-bold text-[14px] hover:brightness-110 transition-all flex items-center gap-8 shadow-md shadow-primary/20">
          <Save size={16} />
          <span>Save Draft</span>
        </button>

        <div className="ml-auto flex items-center gap-4 text-slate-400">
          <button disabled title="Attachments are not supported yet." className="p-8 rounded-8 disabled:opacity-50 disabled:cursor-not-allowed">
            <Paperclip size={16} />
          </button>
          <button disabled title="Links are not supported yet." className="p-8 rounded-8 disabled:opacity-50 disabled:cursor-not-allowed">
            <Link2 size={16} />
          </button>
          <button disabled title="Scheduled send is not supported yet." className="p-8 rounded-8 disabled:opacity-50 disabled:cursor-not-allowed">
            <Calendar size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ComposeModal = ({ isOpen, onClose, context, showToast }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <ComposeForm
          key={context?.mailId || context?.subject || 'blank'}
          onClose={onClose}
          context={context}
          showToast={showToast}
        />
      </div>
    )}
  </AnimatePresence>
);

export default ComposeModal;
