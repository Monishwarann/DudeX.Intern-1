import React, { useState } from 'react';
import { GlassModal } from '../../components/glass/GlassModal';
import { createTask } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { TaskPriority, TaskStatus } from '../../types';
import { Plus, Trash2, Calendar, Tag, User } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, userProfile } = useAuth();
  const { users, departments } = useRealtimeData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [department, setDepartment] = useState(userProfile?.department || 'Engineering');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [estimatedHours, setEstimatedHours] = useState<number>(8);
  const [dueDate, setDueDate] = useState<string>(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Frontend', 'Feature']);
  const [checklistItems, setChecklistItems] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [checkInput, setCheckInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddChecklist = () => {
    if (checkInput.trim()) {
      setChecklistItems([...checklistItems, { id: Date.now().toString(), title: checkInput.trim(), completed: false }]);
      setCheckInput('');
    }
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const handleToggleAssignee = (uid: string) => {
    if (assignedTo.includes(uid)) {
      setAssignedTo(assignedTo.filter((id) => id !== uid));
    } else {
      setAssignedTo([...assignedTo, uid]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;

    try {
      setSubmitting(true);
      await createTask(
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
          assignedTo: assignedTo.length > 0 ? assignedTo : [currentUser.uid],
          createdBy: currentUser.uid,
          department,
          progress: status === 'completed' ? 100 : 0,
          estimatedHours: Number(estimatedHours),
          actualHours: 0,
          dueDate,
          checklist: checklistItems,
          tags,
        },
        userProfile?.fullName || 'User'
      );

      // Reset and close
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error('Task creation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Create Enterprise Task" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement Real-time Drag & Drop Kanban Sync"
            className="w-full px-4 py-2.5 rounded-2xl glass-input text-sm focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail scope of work, requirements, and deliverables..."
            className="w-full px-4 py-2.5 rounded-2xl glass-input text-sm focus:outline-none"
          />
        </div>

        {/* Grid Controls: Priority, Status, Department, Hours, Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 rounded-2xl glass-input text-xs font-medium bg-[#121826]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical font-bold text-rose-400">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 rounded-2xl glass-input text-xs font-medium bg-[#121826]"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl glass-input text-xs font-medium bg-[#121826]"
            >
              {departments.map((d) => (
                <option key={d.departmentId} value={d.name}>
                  {d.name}
                </option>
              ))}
              {departments.length === 0 && (
                <>
                  <option value="Engineering">Engineering</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Product Management">Product Management</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Est. Hours
            </label>
            <input
              type="number"
              min={1}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-2xl glass-input text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl glass-input text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Assignees Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Assign Team Members
          </label>
          <div className="flex flex-wrap gap-2 p-3 rounded-2xl glass-panel border border-white/10 max-h-32 overflow-y-auto">
            {users.map((u) => {
              const selected = assignedTo.includes(u.uid);
              return (
                <button
                  type="button"
                  key={u.uid}
                  onClick={() => handleToggleAssignee(u.uid)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${u.online ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                  <span>{u.fullName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Tags
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tag and press Enter"
              className="flex-1 px-3 py-2 rounded-2xl glass-input text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
              >
                #{t}
                <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-rose-400">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Checklist Items
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={checkInput}
              onChange={(e) => setCheckInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddChecklist();
                }
              }}
              placeholder="Add checklist item..."
              className="flex-1 px-3 py-2 rounded-2xl glass-input text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddChecklist}
              className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
            >
              Add
            </button>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs text-slate-200">
                <span>{item.title}</span>
                <button type="button" onClick={() => handleRemoveChecklist(item.id)} className="text-slate-400 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'Creating Task...' : 'Create Task'}
          </button>
        </div>
      </form>
    </GlassModal>
  );
};
