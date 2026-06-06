import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Archive, Flag } from 'lucide-react';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';
import AIInsightPanel from '../components/AIInsightPanel';
import { api } from '../services/apiClient';

const EmailRow = ({ email }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      onClick={() => navigate(`/mail/${email.id}`)}
      className="flex items-center gap-20 p-16 border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-all relative group h-80"
    >
      <div className="flex items-center gap-16 shrink-0 ml-4">
        <div className="w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-[13px] overflow-hidden border border-slate-200">
           {email.initials}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-10">
            <span className={cn("text-[14px] font-bold transition-colors", email.priority === 'high' ? "text-slate-900" : "text-slate-700")}>
              {email.sender}
            </span>
            {email.priority === 'high' && (
              <span className="w-6 h-6 bg-primary rounded-full" />
            )}
          </div>
          <span className="text-[12px] text-slate-400 font-medium">{email.timestamp}</span>
        </div>
        <div className="flex items-center gap-10">
           <h3 className="text-[14px] font-semibold text-slate-800 truncate">{email.subject}</h3>
        </div>
        <p className="text-[13px] text-slate-500 truncate mt-2 leading-relaxed">{email.snippet}</p>
      </div>

      <div className="flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-8 hover:bg-white rounded-8 border border-transparent hover:border-slate-200 text-slate-400 hover:text-primary transition-all shadow-sm">
          <Archive size={16} />
        </button>
        <button className="p-8 hover:bg-white rounded-8 border border-transparent hover:border-slate-200 text-slate-400 hover:text-primary transition-all shadow-sm">
          <Flag size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const Inbox = ({ showToast }) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.getMail();
        if (!active) return;
        const list = Array.isArray(response?.data) ? response.data : [];
        setEmails(list);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load inbox');
        showToast?.('Failed to load inbox', 'error');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  const mappedEmails = useMemo(() => {
    return emails.map((email, index) => {
      const senderFallback = 'Unknown Sender';
      const sender = email.sender || senderFallback;
      const initials = sender
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
      const createdAt = email.createdAt ? new Date(email.createdAt) : null;
      return {
        id: email._id || email.gmailId || String(index),
        sender,
        senderEmail: email.senderEmail || 'unknown@email.com',
        subject: email.subject || email.snippet || 'No subject',
        snippet: email.snippet || 'No preview available',
        timestamp: createdAt ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
        priority: email.priority || 'low',
        initials: initials || 'NA',
        aiSummary: email.summary || email.ai?.summary || '',
        action: email.action || email.ai?.action || '',
        reply: email.reply || email.ai?.reply || '',
        rawDate: createdAt?.getTime() || 0,
      };
    });
  }, [emails]);

  const aiSummary = mappedEmails[0]?.aiSummary || 'No AI summary available.';
  const aiReply = mappedEmails[0]?.reply || 'No suggested reply yet.';
  const suggestedActions = mappedEmails
    .filter((email) => email.action)
    .slice(0, 3)
    .map((email) => email.action);

  return (
    <div className="flex h-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-16 md:px-24 py-12 md:py-16 border-b border-border flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-16 md:gap-24">
            <h2 className="text-[16px] md:text-[18px] font-bold text-slate-900">Inbox</h2>
            <div className="flex gap-4">
               <button 
                  onClick={async () => {
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
                  }}
                  className="px-10 md:px-14 py-4 md:py-6 rounded-full text-[12px] md:text-[13px] font-bold transition-all bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2"
               >
                 <Sparkles size={12} fill="currentColor" />
                 Sync Gmail
               </button>
               {['All', 'Unread'].map((tab, i) => (
                 <button 
                  key={tab} 
                  className={cn(
                    "px-10 md:px-14 py-4 md:py-6 rounded-full text-[12px] md:text-[13px] font-bold transition-all",
                    i === 0 ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-slate-500 hover:bg-slate-100"
                  )}
                 >
                   {tab}
                 </button>
               ))}
               <button 
                  onClick={() => setIsAIPanelOpen(true)}
                  className="lg:hidden flex items-center gap-6 px-10 py-4 rounded-full text-[12px] font-bold bg-primary/10 text-primary"
               >
                  <Sparkles size={12} fill="currentColor" />
                  <span>AI</span>
               </button>
            </div>
          </div>
          <div className="hidden sm:block text-[12px] text-slate-400 font-medium">
            {mappedEmails.length ? `1-${mappedEmails.length} of ${mappedEmails.length}` : '0 of 0'}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="p-24 space-y-12">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-64 rounded-16 bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}
          {!loading && mappedEmails
            .slice()
            .sort((a, b) => b.rawDate - a.rawDate)
            .map(email => (
            <EmailRow key={email.id} email={email} />
          ))}
          {!loading && !mappedEmails.length && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-16">
              <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center">
                <Sparkles size={32} />
              </div>
              <p className="font-bold">No emails found.</p>
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
          action: mappedEmails[0]?.action || '',
        }}
        onAddToCalendar={() => showToast?.('Select an email to create a calendar event.', 'info')}
        onUseReply={() => showToast?.('Open an email to use the suggested reply.', 'info')}
        suggestedActions={suggestedActions}
      />
    </div>
  );
};

export default Inbox;
