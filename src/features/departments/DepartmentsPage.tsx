import React, { useState } from 'react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassModal } from '../../components/glass/GlassModal';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { createDepartment } from '../../firebase/firestore';
import { Building2, Plus, Users, CheckSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DepartmentsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const { departments, tasks, users } = useRealtimeData();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('indigo');
  const [loading, setLoading] = useState(false);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    try {
      setLoading(true);
      await createDepartment({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        color,
        memberCount: 1,
      });
      setName('');
      setCode('');
      setIsOpen(false);
    } catch (err) {
      console.error('Create department error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isAdminOrManager = userProfile?.role === 'admin' || userProfile?.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Enterprise Departments</h1>
            <p className="text-xs text-slate-400">
              Departmental structure, team allocation, and project velocity
            </p>
          </div>
        </div>

        {isAdminOrManager && (
          <button
            onClick={() => setIsOpen(true)}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        )}
      </GlassCard>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptTasks = tasks.filter((t) => t.department === dept.name);
          const deptMembers = users.filter((u) => u.department === dept.name);
          const completedCount = deptTasks.filter((t) => t.status === 'completed').length;
          const rate = deptTasks.length > 0 ? Math.round((completedCount / deptTasks.length) * 100) : 100;

          return (
            <GlassCard key={dept.departmentId} className="p-6 flex flex-col justify-between" glowColor="indigo">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    {dept.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{deptMembers.length || dept.memberCount || 5} Members</span>
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white mb-2">{dept.name}</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Managing active projects and engineering deliverables across the organization.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span>Tasks Completed</span>
                  <span className="font-bold text-emerald-400">
                    {completedCount} / {deptTasks.length} ({rate}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${rate}%` }} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add Department Modal */}
      <GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Department" maxWidth="max-w-md">
        <form onSubmit={handleCreateDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Science & AI"
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Department Code *
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. DSAI"
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs uppercase focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-2xl bg-white/5 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-6 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
