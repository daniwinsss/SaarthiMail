import { useEffect, useMemo, useState } from 'react';
import {
  Sparkles,
  Calendar as CalendarIcon,
  Bell,
  Palette,
  Bot,
  Mail,
  Check,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../utils/cn';
import AIInsightPanel from '../components/AIInsightPanel';
import AIBadge from '../components/AIBadge';
import Tabs from '../components/Tabs';
import { api } from '../services/apiClient';

const TABS = [
  { key: 'account', label: 'Account' },
  { key: 'ai', label: 'AI Settings' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'appearance', label: 'Appearance' },
];

const SettingToggle = ({ icon: Icon, label, description, checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={checked}
    className={cn(
      "group w-full",
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
      <div className="w-40 h-40 bg-slate-50 rounded-12 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-[14px] text-slate-800 truncate">{label}</h4>
        <p className="text-[12px] text-slate-500 font-medium">{description}</p>
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

const Field = ({ label, value, onChange, placeholder, textarea, disabled }) => (
  <label className="flex flex-col gap-6">
    <span className="text-[12px] font-bold text-slate-500">{label}</span>
    {textarea ? (
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="px-14 py-10 bg-white border border-border rounded-12 text-[14px] font-medium text-slate-700 outline-none resize-none focus:border-primary/40 transition-colors"
      />
    ) : (
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-44 px-14 border border-border rounded-12 text-[14px] font-medium outline-none focus:border-primary/40 transition-colors",
          disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "bg-white text-slate-700"
        )}
      />
    )}
  </label>
);

const ServiceRow = ({ icon: Icon, name, status, active }) => (
  <div className="flex items-center gap-10 py-6">
    <div className="w-28 h-28 bg-white border border-border rounded-8 flex items-center justify-center text-slate-500 shrink-0">
      <Icon size={14} />
    </div>
    <span className="text-[13px] font-bold text-slate-700 flex-1 min-w-0 truncate">{name}</span>
    <span
      className={cn(
        'tag shrink-0',
        active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'tag-neutral'
      )}
    >
      {active && <Check size={10} />}
      {status}
    </span>
  </div>
);

/**
 * Own component (keyed on the signed-in address by its caller) so the form
 * re-initialises when the profile arrives, without a setState-in-effect reset.
 */
const AccountTab = ({ defaults, isConnected, onSave }) => {
  const [form, setForm] = useState(defaults);

  return (
    <>
      <div className="flex flex-col gap-16">
        <Field label="Display Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Email" value={form.email} disabled />
        <Field
          label="Signature"
          value={form.signature}
          onChange={(v) => setForm({ ...form, signature: v })}
          placeholder="Sent from Saarthi Mail"
          textarea
        />
      </div>

      <div className="flex flex-col gap-16">
        <div className="ai-surface rounded-16 p-16 flex flex-col gap-4">
          <div className="flex items-center gap-8 mb-6">
            <AIBadge>AI</AIBadge>
            <span className="text-[14px] font-bold text-slate-800">Connected Services</span>
          </div>
          <ServiceRow
            icon={Mail}
            name={isConnected ? 'Gmail - Connected' : 'Gmail - Demo session'}
            status={isConnected ? 'Active' : 'Read-only'}
            active={isConnected}
          />
          <ServiceRow
            icon={CalendarIcon}
            name="Google Calendar"
            status={isConnected ? 'Active' : 'Read-only'}
            active={isConnected}
          />
          {/* The wireframe labels this "Gemini AI"; the server actually calls Groq
              via server/src/config/ai.js, so we label the truth. */}
          <ServiceRow icon={Bot} name="Groq (AI provider)" status="Configured" active />
        </div>

        <div className="flex gap-8">
          <button
            onClick={onSave}
            className="bg-primary text-white px-16 py-10 rounded-12 font-bold text-[13px] hover:brightness-110 shadow-md shadow-primary/20 transition-all"
          >
            Save Changes
          </button>
          <button
            onClick={() => setForm(defaults)}
            className="bg-white border border-slate-200 text-slate-600 px-16 py-10 rounded-12 font-bold text-[13px] hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

const Settings = ({ showToast, user }) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [tab, setTab] = useState('account');
  const [account, setAccount] = useState(null);
  const [toggles, setToggles] = useState({
    calendar: true,
    autoSummarize: true,
    autoDraft: false,
    extractEvents: true,
    emailDigest: true,
    soundAlerts: false,
    compactDensity: false,
  });

  useEffect(() => {
    let active = true;
    api.checkAuth()
      .then((res) => {
        if (!active) return;
        if (res?.isAuthenticated && res.user) setAccount(res.user);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const profile = account || user;

  const defaults = useMemo(
    () => ({
      name: profile?.name || 'Saarthi User',
      email: profile?.email || 'user@gmail.com',
      signature: '',
    }),
    [profile]
  );

  const setToggle = (key) => () => setToggles((current) => ({ ...current, [key]: !current[key] }));

  const handleSave = () =>
    showToast?.('Saved for this session — the API has no settings endpoint yet.', 'info');

  const isConnected = Boolean(profile) && !profile?.isDemo;

  const tabContent = {
    account: (
      <AccountTab key={defaults.email} defaults={defaults} isConnected={isConnected} onSave={handleSave} />
    ),
    ai: (
      <>
        <div className="flex flex-col gap-12">
          <SettingToggle
            icon={Sparkles}
            label="Auto-summarize on sync"
            description="Summarize every email as it arrives"
            checked={toggles.autoSummarize}
            onToggle={setToggle('autoSummarize')}
          />
          <SettingToggle
            icon={Bot}
            label="Auto-draft replies"
            description="Prepare a suggested reply for each thread"
            checked={toggles.autoDraft}
            onToggle={setToggle('autoDraft')}
          />
        </div>
        <div className="ai-surface rounded-16 p-16">
          <div className="flex items-center gap-8 mb-8">
            <AIBadge>AI</AIBadge>
            <span className="text-[14px] font-bold text-slate-800">How sorting works</span>
          </div>
          <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
            Each email is scored into Urgent / Important / Later. Raising sensitivity surfaces urgent
            mail faster; auto-draft saves time on routine replies.
          </p>
        </div>
      </>
    ),
    calendar: (
      <>
        <div className="flex flex-col gap-12">
          <SettingToggle
            icon={CalendarIcon}
            label="Google Calendar"
            description="Automatically detect and create events"
            checked={toggles.calendar}
            onToggle={setToggle('calendar')}
          />
          <SettingToggle
            icon={Sparkles}
            label="Extract events from email"
            description="Pull dates and deadlines out of message bodies"
            checked={toggles.extractEvents}
            onToggle={setToggle('extractEvents')}
          />
        </div>
        <div className="ai-surface rounded-16 p-16 flex items-start gap-10">
          <ArrowRight size={16} className="text-primary mt-2 shrink-0" />
          <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
            Events are created through <span className="font-bold">Add to Calendar</span> on an open
            email. Read-only demo sessions cannot write to Calendar.
          </p>
        </div>
      </>
    ),
    notifications: (
      <>
        <div className="flex flex-col gap-12">
          <SettingToggle
            icon={Bell}
            label="Daily digest"
            description="One AI summary of the day's inbox"
            checked={toggles.emailDigest}
            onToggle={setToggle('emailDigest')}
          />
          <SettingToggle
            icon={Bell}
            label="Sound alerts"
            description="Play a sound for urgent mail"
            checked={toggles.soundAlerts}
            onToggle={setToggle('soundAlerts')}
          />
        </div>
        <div />
      </>
    ),
    appearance: (
      <>
        <div className="flex flex-col gap-12">
          <SettingToggle
            icon={Palette}
            label="Compact density"
            description="Tighter rows in the inbox list"
            checked={toggles.compactDensity}
            onToggle={setToggle('compactDensity')}
          />
        </div>
        <div />
      </>
    ),
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-960 mx-auto px-16 py-20 md:px-32 md:py-32">
          <div className="flex items-start justify-between gap-16 mb-20">
            <h1 className="text-[24px] md:text-[28px] font-black tracking-tighter text-slate-900">Settings</h1>
            <button
              onClick={() => setIsAIPanelOpen(true)}
              className="lg:hidden flex items-center gap-6 px-12 py-8 rounded-12 bg-primary/10 text-primary font-bold text-[13px] shrink-0"
            >
              <Sparkles size={14} fill="currentColor" />
              <span>Tips</span>
            </button>
          </div>

          <Tabs items={TABS} value={tab} onChange={setTab} className="mb-24" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-start">
            {tabContent[tab]}
          </div>
        </div>
      </div>

      <AIInsightPanel
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        mode="detail"
        insights={{
          summary:
            "Raising Priority Sensitivity helps surface urgent email faster, while Auto-Draft saves time on routine replies.",
          reply: "You can also teach the AI by marking emails as Priority manually.",
        }}
      />
    </div>
  );
};

export default Settings;
