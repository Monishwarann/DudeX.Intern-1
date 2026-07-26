import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { GlassModal } from '../../components/glass/GlassModal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { TaskCommentsSection } from '../comments/TaskCommentsSection';
import { TaskAttachmentsSection } from '../attachments/TaskAttachmentsSection';
import { updateTask, updateTaskStatus, deleteTask } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { UserAvatar } from '../../components/ui/UserAvatar';

import { 
  Calendar, 
  Clock, 
  CheckSquare, 
  Trash2, 
  Edit, 
  Tag, 
  User,
  AlertTriangle
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const { currentUser, userProfile } = useAuth();
  const { users } = useRealtimeData();

  if (!task) return null;

  const assignees = users.filter((u) => task.assignedTo?.includes(u.uid));

  const handleToggleChecklist = async (checkId: string) => {
    if (!currentUser || !task) return;

    const updatedChecklist = (task.checklist || []).map((c) =>
      c.id === checkId ? { ...c, completed: !c.completed } : c
    );

    const completedCount = updatedChecklist.filter((c) => c.completed).length;
    const totalCount = updatedChecklist.length;
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : task.progress;

    await updateTask(
      task.taskId,
      {
        checklist: updatedChecklist,
        progress: newProgress,
      },
      currentUser.uid,
      userProfile?.fullName || 'User'
    );
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!currentUser) return;
    await updateTaskStatus(
      task.taskId,
      newStatus,
      currentUser.uid,
      userProfile?.fullName || 'User',
      task.title
    );
  };

  const handleDeleteTask = async () => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.taskId, currentUser.uid, userProfile?.fullName || 'User');
      onClose();
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header Status & Priority */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              {task.department || 'Engineering'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteTask}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{task.title}</h2>
          <p className="text-xs text-slate-400 mt-1">Created on {new Date(task.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Status Switcher Bar */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Update Task Status
          </span>
          <div className="flex flex-wrap gap-2">
            {(['pending', 'in_progress', 'review', 'completed'] as TaskStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  task.status === st
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="p-4 rounded-2xl glass-panel border border-white/10">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {/* Task Meta Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block">Due Date</span>
            <span className="text-xs font-bold text-white flex items-center gap-1 mt-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{task.dueDate || 'No deadline'}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block">Est. Hours</span>
            <span className="text-xs font-bold text-white flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{task.estimatedHours || 8} hrs</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 font-medium block">Progress</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${task.progress}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-400">{task.progress}%</span>
            </div>
          </div>
        </div>

        {/* Assignees */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            Assigned Team Members
          </h4>
          <div className="flex flex-wrap gap-2">
            {assignees.map((u) => (
              <div key={u.uid} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <UserAvatar name={u.fullName} photoURL={u.photoURL} online={u.online} size="xs" />
                <span className="text-xs font-semibold text-white">{u.fullName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        {task.checklist && task.checklist.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              Checklist Subtasks ({task.checklist.filter((c) => c.completed).length}/{task.checklist.length})
            </h4>
            <div className="space-y-2">
              {task.checklist.map((item) => (
                <label
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-white/10 border-white/20"
                  />
                  <span className={`text-xs font-medium ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {item.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* File Attachments Section */}
        <TaskAttachmentsSection taskId={task.taskId} />

        {/* Realtime Comments Section */}
        <TaskCommentsSection taskId={task.taskId} />
      </div>
    </GlassModal>
  );
};
