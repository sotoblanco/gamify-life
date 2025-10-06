
import React from 'react';
import { StarIcon } from './icons';

interface HeaderProps {
  totalPoints: number;
}

const Header: React.FC<HeaderProps> = ({ totalPoints }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-900/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg shadow-lg">
      <h1 className="font-press-start text-3xl sm:text-4xl text-cyan-400 drop-shadow-[0_2px_2px_rgba(0,255,255,0.4)]">
        TaskQuest RPG
      </h1>
      <div className="mt-4 sm:mt-0 flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-md border border-slate-700">
        <StarIcon className="w-6 h-6 text-yellow-400" />
        <span className="text-2xl font-bold text-white">{totalPoints}</span>
        <span className="text-slate-400">Points</span>
      </div>
    </header>
  );
};

export default Header;
