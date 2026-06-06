import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, RotateCcw, X } from 'lucide-react';
import { cn } from '../utils/cn';

const AIInsightPanel = ({
  isOpen,
  onClose,
  mode = 'inbox',
  insights = {},
  onAddToCalendar,
  onUseReply,
  onRegenerateReply,
  replyLoading = false,
}) => {
  const hasReply =
    Boolean(insights.reply) &&
    !insights.reply.startsWith("No suggested reply") &&
    !insights.reply.startsWith("Generating suggested reply");
  const content = (
    <div className="flex flex-col gap-24 h-full">
      <div>
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-8 text-primary">
            <Sparkles size={20} fill="currentColor" />
            <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
              {mode === 'inbox' ? 'AI Insight' : 'AI Assistant'}
            </h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-8 hover:bg-slate-100 rounded-full text-slate-400">
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="bg-slate-50 border border-slate-100 p-16 rounded-16 relative overflow-hidden shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {mode === 'inbox' ? 'Summary' : 'AI Summary'}
              </span>
              {mode === 'detail' && (
                <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-8 py-2 rounded-full uppercase tracking-tight">High Priority</span>
              )}
           </div>
           <p className="text-[14px] leading-relaxed text-slate-700 font-medium">
             {insights.summary || "No summary available."}
           </p>
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-12 px-4">AI Suggested Action</h3>
        <div className="flex flex-col gap-8">
           <div className="bg-white border border-slate-200 p-12 rounded-12 flex items-start gap-10">
              <div className="mt-2 text-primary">
                 <ArrowRight size={14} />
              </div>
              <span className="text-[13px] font-bold text-slate-700 leading-tight">
                {insights.action || "No action suggested."}
              </span>
           </div>
           <button
             className="flex items-center gap-10 bg-white border border-slate-200 p-12 rounded-12 text-[13px] font-bold text-slate-700 hover:border-primary transition-all"
             onClick={onAddToCalendar}
           >
              <Calendar size={16} className="text-slate-400" />
              <span>Add to Calendar</span>
           </button>
        </div>
      </div>

      <div className={cn(mode === 'inbox' ? 'mt-auto' : '')}>
         <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-12 px-4">Suggested Reply</h3>
         <div className="bg-white border border-slate-200 p-16 rounded-16 shadow-sm">
            <p className="text-[12px] text-slate-500 leading-relaxed italic mb-12">
              {insights.reply || "Hi Aarav, thanks for sending this over. I'll review slides 4-9 tonight."}
            </p>
            <div className="flex gap-8">
               <button
                 className="flex-1 bg-primary text-white py-10 rounded-12 font-bold text-[13px] hover:brightness-110 shadow-md shadow-primary/10 flex items-center justify-center gap-8"
                 onClick={() => onUseReply?.(hasReply ? insights.reply : undefined)}
               >
                  <Sparkles size={14} fill="currentColor" />
                  <span>Use Reply</span>
               </button>
                {mode === 'detail' && (
                  <button
                    type="button"
                    onClick={() => onRegenerateReply?.()}
                    disabled={replyLoading}
                    aria-label="Regenerate reply"
                    title="Regenerate reply"
                    className="bg-slate-100 p-10 rounded-12 text-slate-500 hover:bg-slate-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <RotateCcw
                      size={16}
                      className={cn(replyLoading && "animate-spin text-primary")}
                    />
                  </button>
                )}
            </div>
         </div>
         {mode === 'inbox' && <p className="text-[10px] text-slate-400 text-center mt-12">All insights are private and processed securely.</p>}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Version */}
      <div className={cn(
        "hidden lg:flex flex-col border-l border-border bg-white p-24 shrink-0 overflow-y-auto custom-scrollbar",
        mode === 'inbox' ? 'w-340' : 'w-360 bg-slate-50/30 backdrop-blur-sm'
      )}>
        {content}
      </div>

      {/* Mobile Version (Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[320px] max-w-[85%] bg-white h-full shadow-2xl p-24 overflow-y-auto"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIInsightPanel;
