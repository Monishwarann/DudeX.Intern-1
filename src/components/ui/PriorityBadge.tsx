import React from 'react';
import { TaskPriority } from '../../types';
import { AlertCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const configs: Record<TaskPriority, { label: string; bg: string; text: string; icon: any }> = {
    low: {
      label: 'Low',
      bg: 'bg-slate-500/15 border-slate-500/30',
      text: 'text-slate-300',
      icon: ArrowDown,
    },
    medium: {
      label: 'Medium',
      bg: 'bg-blue-500/15 border-blue-500/30',
      text: 'text-blue-400',
      icon: ArrowUp,
    },
    high: {
      label: 'High',
      bg: 'bg-amber-500/15 border-amber-500/30',
      text: 'text-amber-400',
      icon: AlertTriangle,
    },
    critical: {
      label: 'Critical',
      bg: 'bg-rose-500/20 border-rose-500/40 animate-pulse',
      text: 'text-rose-400 font-bold',
      icon: AlertCircle,
    },
  };

  const config = configs[priority] || configs.medium;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1 rounded-lg border backdrop-blur-md ${config.bg} ${config.text} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
