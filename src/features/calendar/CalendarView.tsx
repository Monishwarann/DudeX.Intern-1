import React, { useState } from 'react';
import { Task } from '../../types';
import { GlassCard } from '../../components/glass/GlassCard';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dayCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    dayCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    dayCells.push(d);
  }

  const getTasksForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return tasks.filter((t) => t.dueDate === dateStr);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Calendar Header Bar */}
      <GlassCard className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">Enterprise Task Deadlines & Milestones</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      {/* Calendar Grid */}
      <div className="glass-panel rounded-3xl p-4 border border-white/10 overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
              {day}
            </div>
          ))}

          {dayCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-32 bg-white/[0.01] rounded-2xl border border-transparent" />;
            }

            const dayTasks = getTasksForDay(day);
            const formattedDay = day < 10 ? `0${day}` : `${day}`;
            const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
            const isToday = dateStr === todayStr;

            return (
              <div
                key={`day-${day}`}
                className={`h-32 p-2 rounded-2xl border flex flex-col justify-start overflow-hidden transition-colors ${
                  isToday
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-inner'
                    : 'bg-white/[0.03] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${isToday ? 'bg-indigo-500 text-white' : 'text-slate-300'}`}>
                    {day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-indigo-400">
                      {dayTasks.length} tasks
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto pr-0.5 flex-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.taskId}
                      onClick={() => onSelectTask(task)}
                      className="p-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-[10px] text-white cursor-pointer truncate font-medium flex items-center justify-between"
                    >
                      <span className="truncate">{task.title}</span>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.priority === 'critical' ? 'bg-rose-400' : 'bg-indigo-400'}`} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
