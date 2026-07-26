import React, { useState } from 'react';
import { Database, Sparkles, Check } from 'lucide-react';
import { seedEnterpriseData } from '../../utils/seedData';
import { useAuth } from '../../context/AuthContext';

export const SeedDataButton: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);
      await seedEnterpriseData(currentUser?.uid);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (e) {
      console.error('Seeding error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Seeding Demo Data...</span>
        </>
      ) : done ? (
        <>
          <Check className="w-4 h-4 text-emerald-300" />
          <span>Demo Data Loaded!</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <Database className="w-4 h-4 text-indigo-200" />
          <span>Seed Enterprise Demo Data</span>
        </>
      )}
    </button>
  );
};
