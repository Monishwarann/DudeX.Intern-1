import React from 'react';
import { TaskStatus } from '../../types';
import { Clock, PlayCircle, Eye, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<TaskStatus, { label: string; bg: string; text: string; icon: any; dot: string }> = {
    pending: {
      label: 'Pending',
      bg: 'bg-amber-500/10 border-amber-500/30',
      text: 'text-amber-400',
      icon: Clock,
      dot: 'bg-amber-400',
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
      text: 'text-indigo-400',
      icon: PlayCircle,
      dot: 'bg-indigo-400 animate-pulse',
    },
    review: {
      label: 'In Review',
      bg: 'bg-purple-500/10 border-purple-500/30',
      text: 'text-purple-400',
      icon: Eye,
      dot: 'bg-purple-400',
    },
    completed: {
      label: 'Completed',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      text: 'text-emerald-400',
      icon: CheckCircle2,
      dot: 'bg-emerald-400',
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-500/10 border-rose-500/30',
      text: 'text-rose-400',
      icon: XCircle,
      dot: 'bg-rose-400',
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
