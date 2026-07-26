import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { updateTaskStatus } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Clock, PlayCircle, Eye, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KanbanViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({ tasks, onSelectTask }) => {
  const { currentUser, userProfile } = useAuth();

  const columns: { id: TaskStatus; title: string; icon: any; color: string; border: string }[] = [
    { id: 'pending', title: 'Pending', icon: Clock, color: 'text-amber-400', border: 'border-amber-500/30' },
    { id: 'in_progress', title: 'In Progress', icon: PlayCircle, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { id: 'review', title: 'In Review', icon: Eye, color: 'text-purple-400', border: 'border-purple-500/30' },
    { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  ];

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    const task = tasks.find((t) => t.taskId === draggableId);

    if (task && currentUser) {
      if (newStatus === 'completed') {
        // Trigger celebratory confetti on completion!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      await updateTaskStatus(
        draggableId,
        newStatus,
        currentUser.uid,
        userProfile?.fullName || 'User',
        task.title
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className={`glass-panel rounded-3xl p-4 flex flex-col min-h-[500px] border ${col.border}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${col.color}`} />
                  <h3 className="font-extrabold text-sm text-white">{col.title}</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {colTasks.length}
                </span>
              </div>

              {/* Droppable Container */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 transition-colors rounded-2xl p-1 ${
                      snapshot.isDraggingOver ? 'bg-indigo-500/10 border border-dashed border-indigo-500/40' : ''
                    }`}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={task.taskId} draggableId={task.taskId} index={index}>
                        {(providedDraggable) => (
                          <TaskCard
                            task={task}
                            onClick={() => onSelectTask(task)}
                            innerRef={providedDraggable.innerRef}
                            draggableProps={providedDraggable.draggableProps}
                            dragHandleProps={providedDraggable.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
