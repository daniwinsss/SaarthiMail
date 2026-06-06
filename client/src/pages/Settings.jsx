import { useState } from 'react';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../utils/cn';
import AIInsightPanel from '../components/AIInsightPanel';

const SettingToggle = ({ icon: Icon, label, description, checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={checked}
    className={cn(
      "group w-full min-h-[88px] md:min-h-[96px]",
      "flex items-center justify-between gap-12 md:gap-16",
      "px-16 py-12 md:px-20 md:py-16",
      "bg-white border border-slate-200 rounded-16",
      "hover:border-primary/40 hover:shadow-md hover:-translate-y-[1px]",
      "transition-all duration-150 ease-out",
      "text-left outline-none appearance-none",
      "focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    )}
  >
    <div className="flex items-center gap-12 md:gap-16 min-w-0 flex-1">
      <div className="w-40 h-40 md:w-44 md:h-44 bg-slate-50 rounded-12 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-[14px] md:text-[15px] text-slate-800 truncate">{label}</h4>
        <p className="text-[12px] md:text-[13px] text-slate-500 font-medium truncate">{description}</p>
      </div>
    </div>
    <div className={cn(
      "relative shrink-0",
      "w-44 h-24 rounded-full transition-colors duration-200",
      checked ? "bg-primary" : "bg-slate-200"
    )}>
      <div
        className={cn(
          "absolute w-20 h-20 bg-white rounded-full shadow-sm",
          "transition-transform duration-200 ease-out",
          checked ? "translate-x-20" : "translate-x-0"
        )}
        style={{ top: '2px', left: '2px' }}
      />
    </div>
  </button>
);

const Settings = () => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [calendarEnabled, setCalendarEnabled] = useState(true);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-3xl mx-auto px-16 py-24 md:px-32 md:py-40">
          <div className="flex items-start justify-between gap-16 mb-32 md:mb-40">
            <div>
              <h1 className="text-[24px] md:text-[28px] font-bold text-slate-900 tracking-tight mb-4">Settings</h1>
              <p className="text-[13px] md:text-[15px] text-slate-500">Customize your AI assistant</p>
            </div>
            <button
              onClick={() => setIsAIPanelOpen(true)}
              className="lg:hidden flex items-center gap-6 px-12 py-8 rounded-12 bg-primary/10 text-primary font-bold text-[13px] shrink-0"
            >
              <Sparkles size={14} fill="currentColor" />
              <span>Tips</span>
            </button>
          </div>

          <div className="space-y-32 md:space-y-40">
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-16 px-2">Integrations</h2>
              <div className="space-y-12 md:space-y-16">
                <SettingToggle
                  icon={CalendarIcon}
                  label="Google Calendar"
                  description="Automatically detect and create events"
                  checked={calendarEnabled}
                  onToggle={() => setCalendarEnabled((value) => !value)}
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      <AIInsightPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        mode="detail"
        insights={{
          summary: "Raising Priority Sensitivity helps surface urgent email faster, while Auto-Draft saves time on routine replies.",
          reply: "You can also teach the AI by marking emails as Priority manually."
        }}
      />
    </div>
  );
};

export default Settings;
