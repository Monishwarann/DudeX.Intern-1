import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Building2, 
  Users, 
  Settings, 
  Plus, 
  Zap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../ui/UserAvatar';

interface SidebarProps {
  onOpenCreateTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreateTask }) => {
  const { userProfile } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks & Kanban', path: '/tasks', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Departments', path: '/departments', icon: Building2 },
    { label: 'Team Members', path: '/team', icon: Users },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const roleColor = {
    admin: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    manager: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    employee: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-2rem)] sticky top-4 my-4 ml-4 glass-panel rounded-3xl p-4 border border-white/10 shadow-2xl z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-2 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-black text-xl">
          ⚡
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            NexusTask
          </h1>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Enterprise v2.0
          </span>
        </div>
      </div>

      {/* Quick Action Button */}
      <button
        onClick={onOpenCreateTask}
        className="w-full mb-6 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Create Task</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/40 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Card */}
      <div className="pt-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/[0.04] border border-white/5">
          <UserAvatar
            name={userProfile?.fullName || 'User'}
            photoURL={userProfile?.photoURL}
            online={userProfile?.online}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">{userProfile?.fullName || 'User'}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold capitalize ${roleColor[userProfile?.role || 'employee']}`}>
                {userProfile?.role || 'employee'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
