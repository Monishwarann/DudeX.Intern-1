import React from 'react';
import { GlassCard } from '../../components/glass/GlassCard';
import { useRealtimeData } from '../../context/RealtimeDataContext';

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
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

import { BarChart3, TrendingUp, Award, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { tasks, departments, users } = useRealtimeData();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter((t) => t.status === 'review').length;

  const totalEstHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 8), 0);
  const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 6), 0);

  // Velocity monthly data
  const velocityData = [
    { month: 'Jan', velocity: 45, target: 50 },
    { month: 'Feb', velocity: 60, target: 55 },
    { month: 'Mar', velocity: 78, target: 70 },
    { month: 'Apr', velocity: 85, target: 75 },
    { month: 'May', velocity: 92, target: 80 },
    { month: 'Jun', velocity: 110, target: 95 },
  ];

  // Radar Efficiency Data
  const radarData = [
    { subject: 'On-Time Delivery', A: 92, fullMark: 100 },
    { subject: 'Code Quality', A: 88, fullMark: 100 },
    { subject: 'Team Collaboration', A: 95, fullMark: 100 },
    { subject: 'Checklist Completion', A: 85, fullMark: 100 },
    { subject: 'Response Speed', A: 90, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Enterprise Operations & Analytics</h1>
            <p className="text-xs text-slate-400">
              Realtime performance benchmarks, task velocity, and team workload telemetry
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <p className="text-xs text-slate-400 uppercase font-semibold">Total Estimated Effort</p>
          <h3 className="text-2xl font-black text-white mt-1">{totalEstHours} Hours</h3>
          <span className="text-[11px] text-indigo-400 font-medium">Calculated across backlog</span>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-xs text-slate-400 uppercase font-semibold">Actual Logged Hours</p>
          <h3 className="text-2xl font-black text-white mt-1">{totalActualHours} Hours</h3>
          <span className="text-[11px] text-emerald-400 font-medium">92% Estimation Accuracy</span>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-xs text-slate-400 uppercase font-semibold">Average Velocity</p>
          <h3 className="text-2xl font-black text-white mt-1">94 Pts / Sprint</h3>
          <span className="text-[11px] text-purple-400 font-medium">+15% over last month</span>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="text-xs text-slate-400 uppercase font-semibold">Quality Index</p>
          <h3 className="text-2xl font-black text-white mt-1">98.4 / 100</h3>
          <span className="text-[11px] text-cyan-400 font-medium">Zero critical SLA breaches</span>
        </GlassCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Velocity Chart */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-extrabold text-white mb-2">Completion Velocity vs Target</h3>
          <p className="text-xs text-slate-400 mb-6">Sprint velocity trend benchmarked against enterprise OKRs</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121826',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                  }}
                />
                <Area type="monotone" dataKey="velocity" stroke="#818cf8" strokeWidth={3} fill="url(#colorVel)" name="Velocity" />
                <Area type="monotone" dataKey="target" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Target OKR" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Radar Performance Benchmark */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-extrabold text-white mb-2">Team Efficiency Radar</h3>
          <p className="text-xs text-slate-400 mb-6">Multi-dimensional operational capability index</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                <Radar name="Operational Score" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.5} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121826',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
