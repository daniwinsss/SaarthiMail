import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Archive,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  Sparkles,
  Calendar,
  RotateCcw,
  Send,
  Save
} from 'lucide-react';
import AIInsightPanel from '../components/AIInsightPanel';
import PriorityTag from '../components/PriorityTag';
import { api } from '../services/apiClient';
import { cn } from '../utils/cn';
import { mapEmail } from '../utils/mapEmail';
import { ATTACHMENTS, RELATED_THREADS, SENTIMENT } from '../data/mockData';

const MailDetail = ({ showToast, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyDraft, setReplyDraft] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const replyGeneratedForRef = useRef('');
  const replyBoxRef = useRef(null);
  const [isLiveEmailReady, setIsLiveEmailReady] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.getMailById(id);
        if (!active) return;
        const dbEmail = response?.data || null;
        setEmail(dbEmail);
        setReplyDraft('');
        setAiReply('');
        setMeetingInfo(null);
        setReplyLoading(false);
        replyGeneratedForRef.current = '';
        setIsLiveEmailReady(false);

        const gmailMessageId = dbEmail?.gmailId;
        if (gmailMessageId) {
          try {
            const gmailResponse = await api.getGmailMessage(gmailMessageId);
            if (!active) return;
            const liveEmail = gmailResponse?.data || {};
            setEmail((current) => {
              if (!current) return liveEmail;
              return {
                ...current,
                ...liveEmail,
                body: liveEmail.body || current.body,
                snippet: liveEmail.snippet || current.snippet,
              };
            });
            setIsLiveEmailReady(true);
          } catch {
            if (!active) return;
            setIsLiveEmailReady(true);
          }
        } else {
          setIsLiveEmailReady(true);
        }
      } catch {
        if (!active) return;
        showToast?.('Failed to load email', 'error');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, showToast]);

  /* "N of M" in the wireframe header - real position within the stored inbox. */
  useEffect(() => {
    let active = true;
    api.getMail()
      .then((response) => {
        if (!active) return;
        const list = Array.isArray(response?.data) ? response.data : [];
        const sorted = list
          .map((item, index) => mapEmail(item, index))
          .sort((a, b) => b.rawDate - a.rawDate);
        const index = sorted.findIndex((item) => item.id === id);
        setPosition(index >= 0 ? { index: index + 1, total: sorted.length } : null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [id]);

  const uiEmail = useMemo(() => {
    if (!email) return null;
    const mapped = mapEmail({ ...email, _id: email._id || id });
    return {
      ...mapped,
      content: mapped.content || 'No content available',
      summary: email.summary || '',
      meetingDate: email.meetingDate,
      meetingTime: email.meetingTime,
      calendarEventCreated: email.calendarEventCreated,
    };
  }, [email, id]);

  const handleGenerateReply = async () => {
    try {
      setReplyLoading(true);
      showToast?.('Generating reply...', 'info');
      const response = await api.generateReply(uiEmail.content, uiEmail.id);
      const reply = response?.reply || '';
      setAiReply(reply);
      setReplyDraft(reply);
      showToast?.('Reply generated', 'success');
    } catch {
      showToast?.('Failed to generate reply', 'error');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleUseReply = async (reply) => {
    if (reply) {
      setReplyDraft(reply);
      focusReply();
      return;
    }
    await handleGenerateReply();
  };

  const focusReply = () => {
    replyBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    replyBoxRef.current?.querySelector('textarea')?.focus();
  };

  const handleMeetingDetect = useCallback(async () => {
    try {
      showToast?.('Checking for meetings...', 'info');
      const response = await api.detectMeeting(uiEmail.content);
      setMeetingInfo(response?.data || null);
      if (response?.data?.hasMeeting) {
        showToast?.('Meeting detected', 'success');
      } else {
        showToast?.('No meeting detected', 'info');
      }
    } catch {
      showToast?.('Meeting detection failed', 'error');
    }
  }, [showToast, uiEmail]);

  const handleCalendarCreate = async () => {
    try {
      showToast?.('Creating calendar event...', 'info');
      const response = await api.createCalendarEvent(uiEmail.content);
      const eventLabel = response?.data?.summary || 'Calendar event created';
      showToast?.(eventLabel, 'success');
    } catch (err) {
      showToast?.(err.message || 'Calendar creation failed', 'error');
    }
  };

  useEffect(() => {
    if (!isLiveEmailReady) return;
    if (!uiEmail?.content) return;
    if (replyGeneratedForRef.current === uiEmail.content) return;
    let active = true;
    replyGeneratedForRef.current = uiEmail.content;
    const loadReply = async () => {
      try {
        setReplyLoading(true);
        const response = await api.generateReply(uiEmail.content, uiEmail.id);
        if (!active) return;
        const reply = response?.reply || '';
        setAiReply(reply);
      } catch {
        if (!active) return;
      } finally {
        if (active) setReplyLoading(false);
      }
    };
    loadReply();
    return () => {
      active = false;
    };
  }, [isLiveEmailReady, uiEmail?.content, uiEmail?.id]);

  useEffect(() => {
    if (!isAIPanelOpen) return;
    if (!uiEmail) return;
    if (meetingInfo || uiEmail.meetingDate) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleMeetingDetect();
  }, [isAIPanelOpen, uiEmail, meetingInfo, handleMeetingDetect]);

  if (loading) {
    return (
      <div className="flex h-full bg-white overflow-hidden items-center justify-center text-slate-400 font-bold">
        Loading email...
      </div>
    );
  }

  if (!uiEmail) return <div className="p-24">Mail not found</div>;

  const receivedAt = email?.createdAt || email?.date;
  const meetingDetected = Boolean(uiEmail.meetingDate || meetingInfo?.hasMeeting);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-16 md:px-32 py-20 md:py-24 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-720 mx-auto flex flex-col gap-16"
          >
            {/* Back / position */}
            <div className="flex items-center gap-10">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-6 px-10 py-6 rounded-8 border border-slate-200 text-[12px] font-bold text-slate-600 hover:border-primary/40 hover:text-primary transition-all"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                onClick={() => setIsAIPanelOpen(true)}
                className="lg:hidden flex items-center gap-6 px-10 py-6 rounded-8 bg-primary text-white font-bold text-[12px]"
              >
                <Sparkles size={12} fill="currentColor" />
                <span>AI</span>
              </button>
              {position && (
                <span className="ml-auto text-[11px] font-bold text-slate-400">
                  {position.index} of {position.total}
                </span>
              )}
            </div>

            {/* Sender block */}
            <div className="flex items-start gap-14">
              <div className="w-44 h-44 bg-accent-light border border-primary/20 rounded-full flex items-center justify-center text-primary font-black text-[14px] shrink-0">
                {uiEmail.initials}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-6">
                <h1 className="text-[19px] md:text-[22px] font-black tracking-tight text-slate-900 leading-snug">
                  {uiEmail.subject}
                </h1>
                <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
                  <span className="text-[13px] font-bold text-slate-600">
                    {uiEmail.sender} &lt;{uiEmail.senderEmail}&gt;
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    to {user?.email ? user.email : 'me'}
                  </span>
                  <span className="ml-auto text-[11px] font-bold text-slate-400">
                    {receivedAt
                      ? new Date(receivedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Today'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-2">
                  <PriorityTag priority={uiEmail.priority} />
                  {meetingDetected && (
                    <span className="tag bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Calendar size={10} />
                      Meeting detected
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Body */}
            <div className="md:pl-56 text-[14px] md:text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap break-words">
              {uiEmail.content}
            </div>

            {/* Attachments */}
            <div className="md:pl-56 flex flex-col gap-6">
              <span className="demo-note">Attachments · demo data</span>
              <div className="flex flex-wrap gap-8">
                {ATTACHMENTS.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-10 border border-slate-200 rounded-12 px-12 py-8 bg-white shadow-sm"
                  >
                    <FileText size={16} className="text-slate-400" />
                    <div className="leading-tight">
                      <p className="text-[12px] font-bold text-slate-700">{file.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{file.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Action row */}
            <div className="md:pl-56 flex flex-wrap gap-8">
              <button
                onClick={focusReply}
                className="flex items-center gap-8 bg-primary text-white px-16 py-8 rounded-12 font-bold text-[13px] hover:brightness-110 shadow-md shadow-primary/20 transition-all"
              >
                <CornerUpLeft size={15} />
                <span>Reply</span>
              </button>
              <button
                disabled
                title="Not available yet - the API has no send endpoint."
                className="flex items-center gap-8 bg-white border border-slate-200 text-slate-600 px-14 py-8 rounded-12 font-bold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CornerUpRight size={15} />
                <span>Forward</span>
              </button>
              <button
                disabled
                title="Not available yet - the API has no archive endpoint."
                className="flex items-center gap-8 bg-white border border-slate-200 text-slate-600 px-14 py-8 rounded-12 font-bold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Archive size={15} />
                <span>Archive</span>
              </button>
            </div>

            {/* Reply composer */}
            <div
              ref={replyBoxRef}
              className="md:ml-56 border border-slate-200 rounded-20 p-16 md:p-20 bg-white shadow-sm mt-8"
            >
              <textarea
                placeholder="Write a reply..."
                value={replyDraft}
                onChange={(event) => setReplyDraft(event.target.value)}
                className="w-full h-120 resize-none border-none outline-none text-[14px] md:text-[15px] text-slate-700 placeholder:text-slate-400"
              />
              <div className="flex items-center justify-between mt-12 pt-12 border-t border-slate-100">
                <div className="flex gap-8">
                  <button
                    disabled
                    title="Not available yet - the API has no send endpoint."
                    className="flex items-center gap-8 bg-slate-100 text-slate-400 px-16 py-8 rounded-12 font-bold text-[13px] cursor-not-allowed"
                  >
                    <Send size={15} />
                    <span>Send</span>
                  </button>
                  <button className="flex items-center gap-8 bg-white border border-slate-200 text-slate-700 px-14 py-8 rounded-12 font-bold text-[13px] hover:bg-slate-50 transition-all">
                    <Save size={15} />
                    <span>Save Draft</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateReply}
                  disabled={replyLoading}
                  aria-label="Regenerate reply"
                  title="Regenerate reply"
                  className="p-8 hover:bg-slate-100 rounded-12 text-slate-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RotateCcw size={18} className={cn(replyLoading && 'animate-spin text-primary')} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AIInsightPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        mode="detail"
        insights={{
          summary: uiEmail.summary || uiEmail.snippet,
          reply: aiReply || uiEmail.reply || (replyLoading ? 'Generating suggested reply…' : 'No suggested reply'),
          action: uiEmail.action || '',
        }}
        onAddToCalendar={handleCalendarCreate}
        onUseReply={handleUseReply}
        onRegenerateReply={handleGenerateReply}
        replyLoading={replyLoading}
        relatedThreads={RELATED_THREADS}
        sentiment={SENTIMENT}
      />
    </div>
  );
};

export default MailDetail;
