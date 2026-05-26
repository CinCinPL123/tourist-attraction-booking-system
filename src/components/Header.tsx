'use client';

import { Search, Building, ShieldCheck, LogOut, Info, Lock } from 'lucide-react';
import { User } from '@/types';

interface HeaderProps {
  loggedInUser: User | null;
  currentRole: 'tourist' | 'provider' | 'admin';
  setCurrentRole: (role: 'tourist' | 'provider' | 'admin') => void;
  handleLogout: () => void;
  showSystemToast: (msg: string) => void;
}

export default function Header({
  loggedInUser,
  currentRole,
  setCurrentRole,
  handleLogout,
  showSystemToast
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-emerald-400 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
            T
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 to-slate-700 bg-clip-text text-transparent">
              Tourist Attraction Booking System
            </span>
          </div>
        </div>

        {/* NAVIGATION TABS FOR LOGGED IN USERS */}
        {loggedInUser && (
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setCurrentRole('tourist')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                currentRole === 'tourist'
                  ? 'bg-white text-brand-700 shadow-xs border border-slate-200/10'
                  : 'text-slate-500 hover:text-slate-900 border border-transparent'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search Attractions</span>
              <span className="md:hidden">Search</span>
            </button>
            {loggedInUser.role === 'provider' && (
              <button
                onClick={() => setCurrentRole('provider')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'provider'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/10'
                    : 'text-slate-500 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Organizer Panel</span>
                <span className="md:hidden">Organizer</span>
              </button>
            )}
            {loggedInUser.role === 'admin' && (
              <button
                onClick={() => setCurrentRole('admin')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-white text-amber-700 shadow-xs border border-slate-200/10'
                    : 'text-slate-500 hover:text-slate-900 border border-transparent'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin Panel</span>
                <span className="md:hidden">Admin</span>
              </button>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {loggedInUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">{loggedInUser.name}</span>
                <span className="text-[10px] text-slate-400 block leading-none">{loggedInUser.email}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Please Sign In
            </div>
          )}
          <button
            onClick={() => showSystemToast('Demo version. Data is saved in a local SQLite database.')}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
