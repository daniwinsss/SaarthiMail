import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Inbox, 
  Star, 
  Settings, 
  Plus,
  Sparkles
} from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, badge }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => cn(
      "sidebar-link group",
      isActive ? "bg-accent-light text-primary" : "text-text-secondary hover:bg-slate-50"
    )}
  >
    {({ isActive }) => (
      <>
        <Icon size={18} className={cn("shrink-0", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
        <span className="flex-1">{label}</span>
        {badge && <span className="text-[11px] bg-slate-100 text-slate-500 px-6 py-1 rounded-full font-bold">{badge}</span>}
      </>
    )}
  </NavLink>
);

const Sidebar = ({ onCompose }) => {
  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-260 border-r border-border h-full flex flex-col p-20 bg-white shrink-0"
    >
      <div className="flex items-center gap-10 px-4 mb-32">
        <div className="w-32 h-32 bg-primary rounded-8 flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Sparkles size={18} fill="currentColor" />
        </div>
        <h1 className="text-[18px] font-bold tracking-tight text-slate-900">Saarthi Mail</h1>
      </div>

      <button 
        onClick={onCompose}
        className="flex items-center gap-10 bg-primary text-white w-full py-12 px-16 rounded-12 font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mb-24"
      >
        <Plus size={20} strokeWidth={3} />
        <span>Compose</span>
      </button>

      <div className="space-y-32 flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <nav className="flex flex-col gap-2">
          <SidebarItem icon={Inbox} label="Inbox" to="/inbox" />
          <SidebarItem icon={Star} label="Priority" to="/priority" />
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
