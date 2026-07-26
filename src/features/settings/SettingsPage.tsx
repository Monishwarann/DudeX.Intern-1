import React, { useState } from 'react';
import { GlassCard } from '../../components/glass/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { SeedDataButton } from '../../components/ui/SeedDataButton';
import { Settings as SettingsIcon, User, Database, Shield, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    try {
      setSaving(true);
      await updateDoc(doc(db, 'users', userProfile.uid), {
        fullName: fullName.trim(),
        phone: phone.trim(),
        photoURL: photoURL.trim(),
        updatedAt: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">System & Account Settings</h1>
            <p className="text-xs text-slate-400">
              Manage profile attributes, role security, and enterprise database seeding
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Profile Form Card */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          <span>User Profile Information</span>
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Avatar Photo URL
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Role: <strong className="text-indigo-400 uppercase">{userProfile?.role}</strong></span>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? 'Saving...' : saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Profile Saved!</span>
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Enterprise Seed Data Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <span>Enterprise Demo Data Seeder</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-lg">
              Instantly populate Cloud Firestore with realistic enterprise departments, team members, tasks across all statuses/priorities, checklists, comments, and notifications.
            </p>
          </div>
          <SeedDataButton />
        </div>
      </GlassCard>
    </div>
  );
};
