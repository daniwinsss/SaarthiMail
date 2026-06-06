import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Inbox from './pages/Inbox';
import Auth from './pages/Auth';
import MailDetail from './pages/MailDetail';
import Priority from './pages/Priority';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ComposeModal from './components/ComposeModal';
import Toast from './components/Toast';
import { Inbox as InboxIcon, Star, Settings as SettingsIcon, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from './utils/cn';
import { api } from './services/apiClient';

const MobileNavItem = ({ to, icon: Icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex flex-col items-center gap-4 transition-colors",
      isActive ? "text-primary" : "text-slate-400"
    )}
  >
    <Icon size={20} />
    <span className="text-[10px] font-bold tracking-tight">{label}</span>
  </NavLink>
);

const MainLayout = ({ children, onCompose, showToast }) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden flex-col md:flex-row">
      <div className="hidden md:block">
        <Sidebar onCompose={onCompose} />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar showToast={showToast} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
        {/* Mobile Bottom Nav */}
        <div className="md:hidden h-64 border-t border-border bg-white flex items-center justify-around px-16 shrink-0 z-20">
           <MobileNavItem to="/inbox" icon={InboxIcon} label="Inbox" />
           <MobileNavItem to="/priority" icon={Star} label="Priority" />
           <MobileNavItem to="/calendar" icon={CalendarIcon} label="Events" />
           <MobileNavItem to="/settings" icon={SettingsIcon} label="Settings" />
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, setUser }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    api.checkAuth()
      .then(res => {
        if (res?.isAuthenticated) {
          setAuthenticated(true);
          setUser?.(res.user);
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="w-40 h-40 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function App() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  const dismissToast = () => setToast(null);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth showToast={showToast} />} />
        <Route 
          path="/inbox" 
          element={
            <ProtectedRoute setUser={setUser}>
              <MainLayout onCompose={() => setIsComposeOpen(true)} showToast={showToast}>
                <Inbox showToast={showToast} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mail/:id" 
          element={
            <ProtectedRoute setUser={setUser}>
              <MainLayout onCompose={() => setIsComposeOpen(true)} showToast={showToast}>
                <MailDetail showToast={showToast} user={user} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/priority" 
          element={
            <ProtectedRoute setUser={setUser}>
              <MainLayout onCompose={() => setIsComposeOpen(true)} showToast={showToast}>
                <Priority showToast={showToast} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute setUser={setUser}>
              <MainLayout onCompose={() => setIsComposeOpen(true)} showToast={showToast}>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/inbox" replace />} />
      </Routes>
      <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
      <Toast toast={toast} onDismiss={dismissToast} />
    </Router>
  );
}

export default App;
