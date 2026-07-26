import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, LogOut, Plus, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { UserAvatar } from '../ui/UserAvatar';
import { SeedDataButton } from '../ui/SeedDataButton';

interface NavbarProps {
  onOpenCreateTask: () => void;
  onToggleNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateTask, onToggleNotifications }) => {
  const { userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { searchQuery, setSearchQuery, unreadCount } = useRealtimeData();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-4 z-40 mx-4 mt-4 glass-panel rounded-3xl px-4 py-3 border border-white/10 shadow-xl flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks, departments, employees, tags..."
          className="w-full pl-10 pr-4 py-2 rounded-2xl glass-input text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Seed Enterprise Demo Data Button */}
        <div className="hidden md:block">
          <SeedDataButton />
        </div>

        {/* Quick Create Task (Mobile / Small screen) */}
        <button
          onClick={onOpenCreateTask}
          className="lg:hidden p-2 rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-500"
          title="Create Task"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Notifications Button */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2.5 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <UserAvatar
              name={userProfile?.fullName || 'User'}
              photoURL={userProfile?.photoURL}
              online={userProfile?.online}
              size="sm"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 glass-panel rounded-2xl p-3 border border-white/15 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-white/10 mb-2">
                <p className="text-sm font-bold text-white truncate">{userProfile?.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{userProfile?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online Presence</span>
                </div>
              </div>

              <div className="space-y-1">
                <a
                  href="/settings"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile Settings</span>
                </a>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
