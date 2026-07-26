import React from 'react';
import { Task } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { Calendar, CheckSquare, MessageSquare, Paperclip, MoreVertical } from 'lucide-react';
import { useRealtimeData } from '../../context/RealtimeDataContext';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  innerRef?: any;
  draggableProps?: any;
  dragHandleProps?: any;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  innerRef,
  draggableProps,
  dragHandleProps,
}) => {
  const { users } = useRealtimeData();

  const assignees = users.filter((u) => task.assignedTo?.includes(u.uid));
  const completedChecklistCount = task.checklist?.filter((c) => c.completed).length || 0;
  const totalChecklistCount = task.checklist?.length || 0;

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      onClick={onClick}
      className="glass-card rounded-2xl p-4 border border-white/10 hover:border-indigo-500/40 cursor-pointer shadow-lg backdrop-blur-xl group transition-all"
    >
      {/* Top Header: Priority & Department */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <PriorityBadge priority={task.priority} size="sm" />
        <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
          {task.department || 'ENG'}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1.5">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
          <span>Progress</span>
          <span className="text-white font-bold">{task.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              task.progress === 100
                ? 'bg-emerald-400'
                : task.progress > 50
                ? 'bg-indigo-500'
                : 'bg-amber-400'
            }`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-medium"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer: Assignees, Checklist count, Due date */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        {/* Assignees */}
        <div className="flex items-center -space-x-2">
          {assignees.slice(0, 3).map((u) => (
            <UserAvatar key={u.uid} name={u.fullName} photoURL={u.photoURL} online={u.online} size="xs" />
          ))}
          {assignees.length === 0 && (
            <span className="text-[10px] text-slate-500 font-medium italic">Unassigned</span>
          )}
        </div>

        {/* Due date & checklist */}
        <div className="flex items-center gap-2.5 text-[11px]">
          {totalChecklistCount > 0 && (
            <span className="flex items-center gap-1 text-slate-300 font-semibold">
              <CheckSquare className="w-3 h-3 text-indigo-400" />
              <span>{completedChecklistCount}/{totalChecklistCount}</span>
            </span>
          )}

          {task.dueDate && (
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3 text-cyan-400" />
              <span>{task.dueDate}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
