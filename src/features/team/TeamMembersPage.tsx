import React, { useState } from 'react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassModal } from '../../components/glass/GlassModal';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { updateUserRoleAndDept } from '../../firebase/firestore';
import { Users, ShieldCheck, Mail, Phone, Building2, Edit2 } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

export const TeamMembersPage: React.FC = () => {
  const { userProfile: currentUserProfile } = useAuth();
  const { users, departments } = useRealtimeData();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('employee');
  const [editDept, setEditDept] = useState('Engineering');
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = (u: UserProfile) => {
    setSelectedUser(u);
    setEditRole(u.role || 'employee');
    setEditDept(u.department || 'Engineering');
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      setSaving(true);
      await updateUserRoleAndDept(selectedUser.uid, editRole, editDept);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating role:', err);
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = currentUserProfile?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Team Members & Role Access</h1>
            <p className="text-xs text-slate-400">
              Enterprise member directory, live presence telemetries, and role-based permissions
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <GlassCard key={u.uid} className="p-6 flex flex-col justify-between" glowColor="purple">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <UserAvatar name={u.fullName} photoURL={u.photoURL} online={u.online} size="lg" />
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    u.role === 'admin'
                      ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                      : u.role === 'manager'
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                      : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  }`}>
                    {u.role || 'employee'}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                      title="Edit Member Role"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-white">{u.fullName}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{u.department || 'Engineering'}</span>
              </p>

              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{u.email}</span>
                </div>
                {u.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Live Status:</span>
              <span className={`font-semibold flex items-center gap-1 ${u.online ? 'text-emerald-400' : 'text-slate-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${u.online ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{u.online ? 'Active Now' : 'Offline'}</span>
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Edit Role Modal */}
      <GlassModal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Manage Member Role & Access" maxWidth="max-w-md">
        <form onSubmit={handleSaveRole} className="space-y-4">
          <div>
            <p className="text-xs text-slate-400 mb-2">Member: <strong className="text-white">{selectedUser?.fullName}</strong></p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Role Tier
            </label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-2xl glass-input text-xs font-medium bg-[#121826]"
            >
              <option value="employee">Employee (View assigned, update progress, comment)</option>
              <option value="manager">Manager (Manage team, view department tasks & reports)</option>
              <option value="admin">Admin (Full administrative control across organization)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={editDept}
              onChange={(e) => setEditDept(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl glass-input text-xs font-medium bg-[#121826]"
            >
              {departments.map((d) => (
                <option key={d.departmentId} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="px-4 py-2 rounded-2xl bg-white/5 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
