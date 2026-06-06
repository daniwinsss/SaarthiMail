import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Archive, Flag, ArrowRight, Star } from 'lucide-react';
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
        <div className="w-40 h-40 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-[13px] border border-primary/20">
           {email.initials}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-10">
            <span className="text-[14px] font-bold text-slate-900">
              {email.sender}
            </span>
            <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-6 py-1 rounded-full uppercase tracking-tighter">AI Priority</span>
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
          <Star size={16} fill="#EAB308" className="text-amber-500" />
        </button>
      </div>
    </motion.div>
  );
};

const Priority = ({ showToast }) => {
  const navigate = useNavigate();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.getPriorityMail();
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

  const priorityEmails = useMemo(() => {
    return emails.map((email, index) => {
      const senderFallback = 'Priority Sender';
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
        subject: email.subject || email.snippet || 'No subject',
        snippet: email.snippet || 'No preview available',
        timestamp: createdAt ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
        priority: email.priority || 'high',
        initials: initials || 'PR',
        aiSummary: email.summary || '',
        action: email.action || '',
        rawDate: createdAt?.getTime() || 0,
      };
    });
  }, [emails]);

  const aiSummary = priorityEmails[0]?.aiSummary || 'No AI summary available.';
  const aiReply = priorityEmails[0]?.action || 'No suggested reply yet.';

  return (
    <div className="flex h-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-16 md:px-24 py-12 md:py-16 border-b border-border flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-16 md:gap-24">
            <h2 className="text-[16px] md:text-[18px] font-bold text-slate-900 flex items-center gap-8">
               <Star size={20} fill="#EAB308" className="text-amber-500" />
               <span>Priority Inbox</span>
            </h2>
          </div>
          <button 
            onClick={() => setIsAIPanelOpen(true)}
            className="lg:hidden flex items-center gap-6 px-12 py-8 rounded-12 bg-primary/10 text-primary font-bold text-[13px]"
          >
            <Sparkles size={14} fill="currentColor" />
            <span>AI Insight</span>
          </button>
        </div>
        
        <div className="bg-slate-50/50 p-12 md:p-16 border-b border-slate-100 flex items-center gap-12">
           <Sparkles size={16} className="text-primary" fill="currentColor" />
           <p className="text-[12px] md:text-[13px] text-slate-600 font-medium italic">
              "AI has identified {priorityEmails.length} urgent threads requiring your attention today."
           </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="p-24 space-y-12">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-64 rounded-16 bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}
          {!loading && priorityEmails
            .slice()
            .sort((a, b) => b.rawDate - a.rawDate)
            .map(email => (
            <EmailRow key={email.id} email={email} />
          ))}
          {!loading && priorityEmails.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-16">
               <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center">
                  <Star size={32} />
               </div>
               <p className="font-bold">No priority emails right now.</p>
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
