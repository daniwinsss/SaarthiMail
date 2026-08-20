import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Target, Calendar as CalendarIcon } from 'lucide-react';
import { api, API_BASE_URL } from '../services/apiClient';

const DEMO_LOGIN_ENABLED = import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';

const BrandFeature = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-12">
    <div className="w-32 h-32 bg-white/20 rounded-8 flex items-center justify-center text-white shrink-0">
      <Icon size={16} />
    </div>
    <span className="text-[14px] font-semibold text-white/90">{label}</span>
  </div>
);

/** Decorative in a Google-OAuth-only product — shown disabled so nobody types into a dead form. */
const DisabledField = ({ label, value, type = 'text' }) => (
  <div className="flex flex-col gap-6">
    <span className="text-[12px] font-bold text-slate-500">{label}</span>
    <input
      type={type}
      value={value}
      disabled
      readOnly
      aria-describedby="google-only-note"
      className="h-44 px-14 bg-slate-50 border border-border rounded-12 text-[14px] text-slate-400 font-medium cursor-not-allowed"
    />
  </div>
);

const Auth = ({ showToast }) => {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!API_BASE_URL) {
      showToast?.('Missing API base URL', 'error');
      return;
    }
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      await api.demoLogin();
      navigate('/inbox');
    } catch (err) {
      showToast?.(err.message || 'Could not start the demo', 'error');
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-16 md:p-24 font-['Inter']">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-960 bg-white border border-slate-100 rounded-32 shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Brand panel */}
        <div className="w-full md:w-360 bg-primary p-32 md:p-40 flex flex-col justify-center gap-24 shrink-0">
          <div className="flex items-center gap-12">
            <div className="w-44 h-44 bg-white/20 rounded-12 flex items-center justify-center text-white">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <h1 className="text-[26px] md:text-[30px] font-black tracking-tighter text-white">Saarthi Mail</h1>
          </div>
          <p className="text-[15px] leading-relaxed text-white/80 font-medium max-w-280">
            Your AI-powered email assistant. Smart inbox, priority sorting, calendar extraction — all in one.
          </p>
          <div className="flex flex-col gap-12 mt-4">
            <BrandFeature icon={Sparkles} label="AI-powered email summaries" />
            <BrandFeature icon={CalendarIcon} label="Calendar extraction" />
            <BrandFeature icon={Target} label="Smart priority sorting" />
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 p-32 md:p-48 flex flex-col justify-center gap-20">
          <div>
            <h2 className="text-[26px] md:text-[28px] font-black tracking-tighter text-slate-900 mb-6">Welcome back</h2>
            <p className="text-[14px] text-slate-500 font-medium">Sign in to your account</p>
          </div>

          <div className="flex flex-col gap-14">
            <DisabledField label="Email" value="you@gmail.com" type="email" />
            <DisabledField label="Password" value="••••••••" type="password" />
            <p id="google-only-note" className="flex items-center gap-8 text-[12px] font-bold text-slate-400">
              <Lock size={12} />
              <span>Google sign-in only — Saarthi Mail never stores a password.</span>
            </p>
          </div>

          <div className="flex items-center gap-12">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-tighter">or</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-white border border-slate-200 py-14 rounded-16 font-bold text-[15px] text-slate-700 flex items-center justify-center gap-12 hover:bg-slate-50 transition-all shadow-sm"
          >
            <span className="w-20 h-20 relative">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </span>
            <span>Sign in with Google</span>
          </button>

          {DEMO_LOGIN_ENABLED && (
            <div className="flex flex-col gap-8">
              <button
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full bg-primary text-white py-14 rounded-16 font-bold text-[15px] flex items-center justify-center gap-8 hover:brightness-110 shadow-lg shadow-primary/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{demoLoading ? 'Starting demo…' : 'Explore the live demo'}</span>
                {!demoLoading && <ArrowRight size={16} />}
              </button>
              <p className="text-center text-[12px] font-bold text-slate-400">
                Read-only · no Google account needed
              </p>
            </div>
          )}

          <p className="text-[12px] text-slate-400 font-medium text-center">
            We only request Gmail read access. Your data stays private.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
