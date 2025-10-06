import React, { useMemo } from 'react';
import type { Task } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, GemIcon } from './icons';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
}

const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, tasks, currentMonth, setCurrentMonth }) => {
  const daysInMonth = useMemo(() => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const days: Date[] = [];
    while (date.getMonth() === currentMonth.getMonth()) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const startDayOfMonth = daysInMonth[0].getDay();
  const endDayOfMonth = daysInMonth[daysInMonth.length - 1].getDay();
  
  const tasksByDay = useMemo(() => {
      const map = new Map<string, number>();
      tasks.forEach(task => {
          const taskDate = new Date(task.dueDate).toDateString();
          map.set(taskDate, (map.get(taskDate) || 0) + 1);
      });
      return map;
  }, [tasks]);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const today = new Date();

  return (
    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-700 transition-colors"><ChevronLeftIcon className="w-6 h-6" /></button>
        <h2 className="font-press-start text-lg text-cyan-400">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-700 transition-colors"><ChevronRightIcon className="w-6 h-6" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-400 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDayOfMonth }).map((_, i) => <div key={`empty-start-${i}`} />)}
        {daysInMonth.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const hasTasks = tasksByDay.has(day.toDateString());

          return (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`
                relative h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200
                ${isToday ? 'text-fuchsia-400 font-bold' : ''}
                ${isSelected ? 'bg-cyan-500 text-slate-900 scale-110 shadow-lg' : 'hover:bg-slate-700/50'}
              `}
            >
              <span>{day.getDate()}</span>
              {hasTasks && (
                <GemIcon className="absolute bottom-1 right-1 w-3 h-3 text-yellow-500 opacity-80" />
              )}
            </button>
          )
        })}
        {Array.from({ length: 6 - endDayOfMonth }).map((_, i) => <div key={`empty-end-${i}`} />)}
      </div>
    </div>
  );
};
