import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, Star, RotateCcw } from 'lucide-react';
import { API_BASE_URL } from '../services/apiClient';

const FeatureCard = ({ icon: Icon, label }) => (
  <div className="bg-white/50 border border-slate-200 p-16 rounded-20 flex flex-col items-center gap-12 w-120">
    <div className="text-primary">
       <Icon size={24} />
    </div>
    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter text-center">{label}</span>
  </div>
);

const Auth = ({ showToast }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    if (!API_BASE_URL) {
      showToast?.('Missing API base URL', 'error');
      return;
    }
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center p-24 overflow-hidden relative font-['Inter']">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tertiary rounded-full blur-[160px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-480 bg-white border border-slate-100 p-48 rounded-32 shadow-2xl z-10 relative"
      >
        <div className="flex flex-col items-center mb-40 text-center">
          <div className="w-64 h-64 bg-primary rounded-20 flex items-center justify-center text-white mb-24 shadow-xl shadow-primary/30">
            <Sparkles size={32} fill="currentColor" />
          </div>
          <h1 className="text-[32px] font-black tracking-tighter text-slate-900 mb-8">Saarthi Mail</h1>
          <p className="text-[15px] font-medium text-slate-500 max-w-280 leading-relaxed">
             Your AI-powered inbox. Understand, prioritize, and act on email — effortlessly.
          </p>
        </div>

        <div className="space-y-32">
           <button 
              onClick={handleLogin}
              className="w-full bg-white border border-slate-200 py-14 rounded-20 font-bold text-[15px] text-slate-700 flex items-center justify-center gap-12 hover:bg-slate-50 transition-all shadow-sm group"
           >
             <div className="w-20 h-20 relative">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
             </div>
             <span>Sign in with Google</span>
           </button>

           <div className="flex justify-center gap-12">
              <FeatureCard icon={Sparkles} label="AI Summaries" />
              <FeatureCard icon={Star} label="Smart Priority" />
              <FeatureCard icon={RotateCcw} label="Suggested Replies" />
           </div>

           <div className="flex items-center justify-center gap-8 text-[12px] font-bold text-slate-400">
              <Lock size={12} />
              <span>Secure sign-in · We never share your data</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
