import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Search, PenLine, X } from 'lucide-react';
import { api } from '../services/apiClient';

const Topbar = ({ showToast, onCompose, query, onQueryChange, searchPlaceholder }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const searchable = typeof onQueryChange === 'function';

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
    setUser(null);
    try {
      await api.logout();
    } catch (err) {
      // A failed request must not strand the user in a logged-in-looking UI.
      console.error('Logout failed', err);
      showToast?.('Logout failed', 'error');
    } finally {
      // Stay inside the SPA so hosts without an /auth rewrite do not 404.
      navigate('/auth', { replace: true });
    }
  };

  return (
    <header className="h-64 md:h-72 border-b border-border bg-white/80 backdrop-blur-md flex items-center gap-12 md:gap-16 px-16 md:px-24 sticky top-0 z-10 shrink-0">
      {searchable && (
        <label className="flex items-center gap-8 flex-1 max-w-440 bg-slate-50 border border-border rounded-12 px-12 py-8 focus-within:border-primary/40 focus-within:bg-white transition-colors">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            type="search"
            value={query || ''}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={searchPlaceholder || 'Search mail...'}
            className="bg-transparent border-none outline-none text-[13px] font-medium text-slate-700 placeholder:text-slate-400 flex-1 min-w-0 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="text-slate-400 hover:text-slate-600 shrink-0"
            >
              <X size={14} />
            </button>
          ) : null}
        </label>
      )}

      {user?.isDemo && (
        <span className="hidden sm:inline text-[11px] font-black uppercase tracking-tighter text-primary bg-primary/10 border border-primary/20 px-10 py-4 rounded-full shrink-0">
          Demo · read-only
        </span>
      )}

      <div className="flex items-center gap-4 md:gap-12 ml-auto shrink-0">
        {onCompose && (
          <button
            onClick={() => onCompose()}
            className="hidden md:flex items-center gap-8 bg-primary text-white px-14 py-8 rounded-12 font-bold text-[13px] hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
          >
            <PenLine size={15} />
            <span>Compose</span>
          </button>
        )}
        <div className="flex items-center gap-8 md:gap-10 hover:bg-slate-50 p-4 md:p-6 rounded-10 md:rounded-12 transition-colors group relative cursor-pointer">
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
