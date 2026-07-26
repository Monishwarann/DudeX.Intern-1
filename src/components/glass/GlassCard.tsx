import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'indigo' | 'purple' | 'cyan' | 'emerald' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  glowColor = 'none',
  onClick,
}) => {
  const glowStyles = {
    indigo: 'hover:shadow-glow-purple hover:border-indigo-500/30',
    purple: 'hover:shadow-glow-purple hover:border-purple-500/30',
    cyan: 'hover:shadow-glow-cyan hover:border-cyan-500/30',
    emerald: 'hover:shadow-glow-emerald hover:border-emerald-500/30',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={clsx(
        'glass-card rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl border border-white/10 dark:border-white/10 light:border-slate-200',
        hoverEffect && 'hover:-translate-y-1 hover:bg-white/[0.06] cursor-pointer',
        glowStyles[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
};
