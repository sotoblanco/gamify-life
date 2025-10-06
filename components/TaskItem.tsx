import React from 'react';
import type { Task } from '../types';
import { StarIcon, CheckIcon, ClockIcon } from './icons';

interface TaskItemProps {
  task: Task;
  onCompleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onCompleteTask }) => {
  const taskTime = new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`
      p-5 rounded-lg border transition-all duration-500
      ${task.completed 
        ? 'bg-slate-800/30 border-green-500/30 opacity-60' 
        : 'bg-slate-800/70 border-slate-700/80 shadow-lg hover:border-cyan-500/50 hover:shadow-cyan-500/10'
      }
    `}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 text-sm text-slate-400 ${task.completed ? 'line-through' : ''}`}>
              <ClockIcon className="w-4 h-4" /> {taskTime}
            </span>
          </div>
          <h3 className={`mt-1 text-xl font-bold text-slate-300 ${task.completed ? 'line-through' : ''}`}>
            Quest: {task.description}
          </h3>
          <p className="mt-2 text-slate-300 whitespace-pre-wrap">{task.story}</p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0 flex flex-col items-start sm:items-end gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-300 font-bold">
            <StarIcon className="w-5 h-5"/>
            <span>{task.points} PTS</span>
          </div>
          <button
            onClick={() => onCompleteTask(task.id)}
            disabled={task.completed}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md font-bold transition-colors duration-300 disabled:cursor-not-allowed
            ${task.completed
              ? 'bg-green-500/20 text-green-400'
              : 'bg-green-600 hover:bg-green-500 text-white'
            }"
          >
            <CheckIcon className="w-6 h-6"/>
            {task.completed ? 'Completed!' : 'Complete Quest'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
