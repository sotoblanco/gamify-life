import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { PlusIcon } from './icons';

interface TaskInputFormProps {
  onAddTask: (description: string, time: string) => void;
  isLoading: boolean;
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({ onAddTask, isLoading }) => {
  const [description, setDescription] = useState('');
  // Default to current time for user convenience
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const [time, setTime] = useState(currentTime);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && time && !isLoading) {
      onAddTask(description.trim(), time);
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What is your next quest?"
        className="flex-grow bg-slate-900 border-2 border-slate-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 rounded-md px-4 py-3 text-lg text-slate-200 placeholder-slate-500 transition-colors duration-300"
        disabled={isLoading}
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="bg-slate-900 border-2 border-slate-700 focus:border-fuchsia-500 focus:ring-fuchsia-500 rounded-md px-4 py-3 text-lg text-slate-200 placeholder-slate-500 transition-colors duration-300"
        disabled={isLoading}
        required
      />
      <button
        type="submit"
        disabled={isLoading || !description.trim() || !time}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold text-lg rounded-md transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-lg shadow-fuchsia-600/20"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Forging...</span>
          </>
        ) : (
           <>
            <PlusIcon className="w-6 h-6"/>
            <span>New Quest</span>
          </>
        )}
      </button>
    </form>
  );
};

export default TaskInputForm;
