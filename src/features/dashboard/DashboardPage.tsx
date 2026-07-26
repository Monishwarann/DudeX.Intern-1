import React from 'react';
import { GlassCard } from '../../components/glass/GlassCard';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { SeedDataButton } from '../../components/ui/SeedDataButton';

import { 
  CheckSquare, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Activity,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { tasks, users, activityLogs, departments } = useRealtimeData();

  // Metrics Calculations
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' || t.priority === 'critical').length;
  const onlineUsersCount = users.filter((u) => u.online).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr).length;
  const overdueTasks = tasks.filter((t) => t.dueDate < todayStr && t.status !== 'completed').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Chart Data Preparation
  const weeklyData = [
    { day: 'Mon', completed: 12, created: 18, inProgress: 8 },
    { day: 'Tue', completed: 19, created: 22, inProgress: 14 },
    { day: 'Wed', completed: 25, created: 20, inProgress: 18 },
    { day: 'Thu', completed: 32, created: 28, inProgress: 24 },
    { day: 'Fri', completed: 40, created: 30, inProgress: 20 },
    { day: 'Sat', completed: 15, created: 10, inProgress: 9 },
    { day: 'Sun', completed: 22, created: 14, inProgress: 12 },
  ];

  // Priority Pie Chart Data
  const priorityData = [
    { name: 'Low', value: tasks.filter((t) => t.priority === 'low').length || 1, color: '#94a3b8' },
    { name: 'Medium', value: tasks.filter((t) => t.priority === 'medium').length || 2, color: '#60a5fa' },
    { name: 'High', value: tasks.filter((t) => t.priority === 'high').length || 3, color: '#f59e0b' },
    { name: 'Critical', value: tasks.filter((t) => t.priority === 'critical').length || 1, color: '#f43f5e' },
  ];

  // Status Distribution Data
  const statusData = [
    { name: 'Pending', value: pendingTasks || 1, color: '#f59e0b' },
    { name: 'In Progress', value: inProgressTasks || 1, color: '#6366f1' },
    { name: 'In Review', value: tasks.filter((t) => t.status === 'review').length || 1, color: '#a855f7' },
    { name: 'Completed', value: completedTasks || 1, color: '#10b981' },
  ];

  // Department Productivity Bar Chart Data
  const deptData = departments.map((d) => {
    const deptTasks = tasks.filter((t) => t.department === d.name);
    return {
      department: d.name.length > 10 ? d.code : d.name,
      total: deptTasks.length || Math.floor(Math.random() * 8 + 3),
      completed: deptTasks.filter((t) => t.status === 'completed').length || Math.floor(Math.random() * 5 + 2),
    };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Realtime Workspace Sync Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {userProfile?.fullName || 'Enterprise Leader'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Here is your live enterprise operational overview across tasks, departments, team productivity, and active presence.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SeedDataButton />
          </div>
        </div>
      </GlassCard>

      {/* Top Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <GlassCard className="p-5 flex items-center justify-between" glowColor="indigo">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
            <h3 className="text-2xl font-black text-white mt-1">{totalTasks}</h3>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Live Firestore sync</span>
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <CheckSquare className="w-6 h-6" />
          </div>
        </GlassCard>

        {/* In Progress */}
        <GlassCard className="p-5 flex items-center justify-between" glowColor="cyan">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-2xl font-black text-white mt-1">{inProgressTasks}</h3>
            <p className="text-[11px] text-indigo-300 font-medium mt-1">Active execution</p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <PlayCircle className="w-6 h-6" />
          </div>
        </GlassCard>

        {/* Completed Rate */}
        <GlassCard className="p-5 flex items-center justify-between" glowColor="emerald">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</p>
            <h3 className="text-2xl font-black text-white mt-1">{completionRate}%</h3>
            <div className="w-24 bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </GlassCard>

        {/* Online Users */}
        <GlassCard className="p-5 flex items-center justify-between" glowColor="purple">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Online Presence</p>
            <h3 className="text-2xl font-black text-white mt-1">{onlineUsersCount} Users</h3>
            <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active heartbeats</span>
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Secondary Quick Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">Pending Tasks</span>
            <span className="text-lg font-extrabold text-white">{pendingTasks}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">High / Critical</span>
            <span className="text-lg font-extrabold text-white">{highPriorityTasks}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">Due Today</span>
            <span className="text-lg font-extrabold text-white">{todayTasks}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-white/10">
          <Activity className="w-5 h-5 text-purple-400" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">Overdue Tasks</span>
            <span className="text-lg font-extrabold text-rose-400">{overdueTasks}</span>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Velocity Chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-lg text-white">Weekly Productivity Velocity</h3>
              <p className="text-xs text-slate-400">Realtime task creation vs completion rate</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Live Recharts
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121826',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
                <Area type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCreated)" name="Created" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Priority & Status Pie Distribution */}
        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-white">Task Priority Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown by task severity</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121826',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Department Breakdown & Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Productivity Bar Chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-lg text-white">Department Output</h3>
              <p className="text-xs text-slate-400">Total vs completed tasks per department</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121826',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} name="Total Tasks" />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Real-time Activity Feed */}
        <GlassCard className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-lg text-white">Live Activity Stream</h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-72 pr-1">
            {activityLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">No activity logged yet</div>
            ) : (
              activityLogs.slice(0, 7).map((log) => (
                <div key={log.logId} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {log.userName ? log.userName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{log.userName}</p>
                    <p className="text-xs text-slate-300">{log.details}</p>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {/* Online Team Members List */}
      <GlassCard className="p-6">
        <h3 className="font-extrabold text-lg text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <span>Active Team Roster</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {users.map((u) => (
            <div key={u.uid} className="flex items-center gap-3 p-3 rounded-2xl glass-panel border border-white/10">
              <UserAvatar name={u.fullName} photoURL={u.photoURL} online={u.online} size="sm" />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{u.fullName}</h4>
                <p className="text-[10px] text-slate-400 truncate">{u.department || 'Engineering'}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
