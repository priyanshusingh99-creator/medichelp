import React, { useState, useEffect } from 'react';
import { Bookmark, User, LogOut, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

export const Navbar = ({ onOpenBookmarks, onOpenAuth }) => {
  const { user, logout, savedConditions } = useAuth();
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axiosClient.get('/api/health');
        if (res.data.status === 'online') {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (e) {
        setServerStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">Medi<span className="text-cyan-400">Help</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                Medical Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${serverStatus === 'online' ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-rose-500'}`} />
              <span className={`text-[11px] font-semibold ${serverStatus === 'online' ? 'text-emerald-400' : 'text-slate-400'}`}>
                System: {serverStatus === 'online' ? 'Connected' : 'Connecting...'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Bookmarks Quick-Drawer Toggle */}
          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 transition-all cursor-pointer text-sm"
            title="Saved Conditions"
          >
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline font-semibold">Saved Bookmarks</span>
            {savedConditions.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-cyan-500 text-slate-950 rounded-full">
                {savedConditions.length}
              </span>
            )}
          </button>

          {/* User Auth Profile Toggle */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/30">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white max-w-[100px] truncate">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-800 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer text-sm"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
