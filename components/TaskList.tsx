import React from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';
import { CalendarIcon } from './icons';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  selectedDate: Date;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onCompleteTask, selectedDate }) => {
  
  const formatDateHeader = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today's Quests";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday's Quests";

    return `Quests for ${date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-3 border-b-2 border-slate-700 pb-2">
        <CalendarIcon className="w-7 h-7" />
        {formatDateHeader(selectedDate)}
      </h2>
      {tasks.length === 0 ? (
        <div className="text-center py-10 px-6 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700">
          <h3 className="text-xl text-slate-400">Your quest log is empty for this day.</h3>
          <p className="text-slate-500 mt-2">Add a new quest to begin your adventure!</p>
        </div>
      ) : (
        tasks
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .map(task => (
            <TaskItem key={task.id} task={task} onCompleteTask={onCompleteTask} />
          ))
      )}
    </div>
  );
};

export default TaskList;
