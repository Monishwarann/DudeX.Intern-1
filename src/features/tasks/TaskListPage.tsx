import React, { useState } from 'react';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { Task, TaskStatus } from '../../types';
import { KanbanView } from './KanbanView';
import { CalendarView } from '../calendar/CalendarView';
import { TaskDetailModal } from './TaskDetailModal';
import { GlassCard } from '../../components/glass/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { updateTaskStatus } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';

import { 
  Kanban, 
  Table as TableIcon, 
  Calendar as CalendarIcon, 
  Filter, 
  Plus, 
  CheckSquare, 
  Clock, 
  ArrowUpDown,
  Search
} from 'lucide-react';

export const TaskListPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const { 
    tasks, 
    departments, 
    users,
    searchQuery, 
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    departmentFilter,
    setDepartmentFilter
  } = useRealtimeData();

  const [activeView, setActiveView] = useState<'kanban' | 'table' | 'calendar'>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Apply Search and Filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesDept = departmentFilter === 'all' || task.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDept;
  });

  const handleToggleTaskComplete = async (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const newStatus: TaskStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    await updateTaskStatus(
      task.taskId,
      newStatus,
      currentUser.uid,
      userProfile?.fullName || 'User',
      task.title
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Switcher */}
      <GlassCard className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Enterprise Task Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Realtime multi-view workspace ({filteredTasks.length} tasks matching criteria)
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveView('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'kanban'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setActiveView('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'table'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Table List</span>
          </button>

          <button
            onClick={() => setActiveView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === 'calendar'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
      </GlassCard>

      {/* Filter Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tasks by name or tag..."
            className="w-full pl-10 pr-3 py-2 rounded-2xl glass-input text-xs focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-2xl glass-input text-xs font-medium bg-[#121826]"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-2xl glass-input text-xs font-medium bg-[#121826]"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="critical">Critical Priority</option>
        </select>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-2xl glass-input text-xs font-medium bg-[#121826]"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d.departmentId} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main View Render */}
      {activeView === 'kanban' && (
        <KanbanView tasks={filteredTasks} onSelectTask={(task) => setSelectedTask(task)} />
      )}

      {activeView === 'calendar' && (
        <CalendarView tasks={filteredTasks} onSelectTask={(task) => setSelectedTask(task)} />
      )}

      {activeView === 'table' && (
        <div className="glass-panel rounded-3xl p-4 border border-white/10 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Done</th>
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assignees</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No tasks match the selected filter criteria
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const assignees = users.filter((u) => task.assignedTo?.includes(u.uid));
                  return (
                    <tr
                      key={task.taskId}
                      onClick={() => setSelectedTask(task)}
                      className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={() => {}}
                          onClick={(e) => handleToggleTaskComplete(task, e)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-white/10 border-white/20 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-white max-w-xs truncate">
                        {task.title}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={task.status} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={task.priority} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {task.department || 'Engineering'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center -space-x-2">
                          {assignees.slice(0, 3).map((u) => (
                            <UserAvatar key={u.uid} name={u.fullName} photoURL={u.photoURL} online={u.online} size="xs" />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-medium">
                        {task.dueDate || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
