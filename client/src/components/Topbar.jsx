import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { api } from '../services/apiClient';

const Topbar = ({ showToast }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.checkAuth()
      .then(res => {
        if (res.isAuthenticated && res.user) {
          setUser(res.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      window.location.href = '/auth';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="h-64 md:h-72 border-b border-border bg-white/80 backdrop-blur-md flex items-center justify-end px-16 md:px-24 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-4 md:gap-12 ml-12 md:ml-24">
        <div className="flex items-center gap-8 md:gap-10 hover:bg-slate-50 p-4 md:p-6 rounded-10 md:rounded-12 transition-colors group relative cursor-pointer group-hover:bg-slate-50">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden group-hover:border-primary/30">
            {user?.picture ? (
              <img src={user.picture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={16} />
            )}
          </div>
          <div className="hidden lg:flex flex-col">
            <p className="text-[13px] font-bold text-slate-700 leading-none">{user?.name || "User"}</p>
          </div>
          <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
             <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
