import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Trash2, 
  Archive, 
  Mail, 
  MoreVertical, 
  Sparkles,
  Calendar,
  Flag,
  RotateCcw,
  Send,
  Save
} from 'lucide-react';
import AIInsightPanel from '../components/AIInsightPanel';
import { api } from '../services/apiClient';
import { cn } from '../utils/cn';

const MailDetail = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyDraft, setReplyDraft] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [meetingInfo, setMeetingInfo] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const replyGeneratedForRef = useRef('');
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

  const uiEmail = useMemo(() => {
    if (!email) return null;
    const sender = email.sender || 'Unknown Sender';
    const initials = sender
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return {
      id: email._id || email.gmailId || id,
      sender,
      senderEmail: email.senderEmail || 'unknown@email.com',
      subject: email.subject || email.snippet || 'No subject',
      snippet: email.snippet || 'No preview available',
      content: email.body || email.content || email.snippet || 'No content available',
      priority: email.priority || 'low',
      initials: initials || 'NA',
      summary: email.summary || '',
      action: email.action || '',
      reply: email.reply || '',
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
      return;
    }
    await handleGenerateReply();
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
    } catch {
      showToast?.('Calendar creation failed', 'error');
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

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-64 border-b border-border flex items-center justify-between px-16 md:px-24 shrink-0 bg-white">
          <div className="flex items-center gap-8 md:gap-16">
            <button 
              onClick={() => navigate(-1)}
              className="p-8 md:p-10 hover:bg-slate-100 rounded-12 transition-all"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-8 md:p-10 hover:bg-slate-100 rounded-12 transition-all text-slate-500">
                <Archive size={18} />
              </button>
              <button className="p-8 md:p-10 hover:bg-slate-100 rounded-12 transition-all text-slate-500">
                <Trash2 size={18} />
              </button>
              <button className="p-8 md:p-10 hover:bg-slate-100 rounded-12 transition-all text-slate-500 hidden sm:block">
                <Mail size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsAIPanelOpen(true)}
              className="lg:hidden flex items-center gap-6 px-12 py-8 rounded-12 bg-primary text-white font-bold text-[13px] shadow-lg shadow-primary/20"
            >
              <Sparkles size={14} fill="currentColor" />
              <span>AI</span>
            </button>
            <button className="p-10 hover:bg-slate-100 rounded-12 transition-all text-slate-500">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-16 md:px-40 py-24 md:py-32 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-720 mx-auto"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-32 gap-16">
               <div>
                  <div className="flex items-center gap-12 mb-8">
                     <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-8 py-2 rounded-full uppercase tracking-tighter">Inbox</span>
                     <ArrowLeft size={12} className="text-slate-400 rotate-180" />
                      <span className="text-[14px] font-bold text-slate-900 truncate max-w-[200px] md:max-w-none">{uiEmail.subject}</span>
                  </div>
                  <h1 className="text-[24px] md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
                    {uiEmail.subject}
                  </h1>
                </div>
                <div className="flex items-center gap-8 shrink-0">
                  {uiEmail.priority === 'high' && (
                    <span className="text-amber-600 bg-amber-50 px-10 py-4 rounded-full text-[11px] font-bold border border-amber-100 flex items-center gap-6">
                       <Flag size={12} fill="currentColor" />
                       Priority: High
                    </span>
                  )}
                  {(uiEmail.meetingDate || meetingInfo?.hasMeeting) && (
                    <span className="text-emerald-600 bg-emerald-50 px-10 py-4 rounded-full text-[11px] font-bold border border-emerald-100 flex items-center gap-6">
                       <Calendar size={12} />
                       Meeting Detected
                    </span>
                  )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-32 p-12 md:p-16 bg-slate-50/50 rounded-16 border border-slate-100 gap-12">
              <div className="flex items-center gap-12">
                <div className="w-40 h-40 md:w-44 md:h-44 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-[14px] md:text-[15px]">
                  {uiEmail.initials}
                </div>
                <div>
                  <div className="flex items-center gap-8">
                     <h4 className="font-bold text-[14px] md:text-[15px] text-slate-900">{uiEmail.sender}</h4>
                     <span className="text-[11px] md:text-[12px] text-slate-400 hidden sm:block">&lt;{uiEmail.senderEmail}&gt;</span>
                  </div>
                  <p className="text-[12px] md:text-[13px] text-slate-500">To: You &lt;alex@saarthimail.com&gt;</p>
                </div>
              </div>
               <div className="text-[12px] md:text-[13px] text-slate-400 font-bold sm:text-right">
                 {email?.createdAt ? new Date(email.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'}
               </div>
            </div>

            <div className="text-[14px] md:text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap break-words mb-48 pl-2 md:pl-4">
              {uiEmail.content}
            </div>

            <div className="border border-slate-200 rounded-20 p-16 md:p-24 bg-white shadow-sm mb-40">
                <textarea 
                   placeholder="Write a reply..."
                   value={replyDraft}
                   onChange={(event) => setReplyDraft(event.target.value)}
                   className="w-full h-100 md:h-120 resize-none border-none outline-none text-[14px] md:text-[15px] text-slate-700 placeholder:text-slate-400"
                />
               <div className="flex items-center justify-between mt-12 md:mt-16 pt-12 md:pt-16 border-t border-slate-100">
                  <div className="flex gap-8 md:gap-10">
                      <button className="flex items-center gap-6 md:gap-8 bg-primary text-white px-16 md:px-20 py-8 md:py-10 rounded-12 font-bold text-[13px] md:text-[14px] hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
                         <Send size={16} />
                         <span>Send</span>
                      </button>
                     <button className="flex items-center gap-6 md:gap-8 bg-white border border-slate-200 text-slate-700 px-12 md:px-16 py-8 md:py-10 rounded-12 font-bold text-[13px] md:text-[14px] hover:bg-slate-50 transition-all">
                        <Save size={16} />
                        <span className="hidden sm:inline">Save Draft</span>
                        <span className="sm:hidden">Save</span>
                     </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateReply}
                    disabled={replyLoading}
                    aria-label="Regenerate reply"
                    title="Regenerate reply"
                    className="p-8 md:p-10 hover:bg-slate-100 rounded-12 text-slate-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                     <RotateCcw
                       size={18}
                       className={cn(replyLoading && "animate-spin text-primary")}
                     />
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
      />
    </div>
  );
};

export default MailDetail;
