
import React from 'react';
import type { Character } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { UserCircleIcon } from './icons';

interface CharacterCardProps {
  character: Character | null;
  isLoading: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 bg-slate-900/50 rounded-lg animate-pulse">
        <LoadingSpinner />
        <span className="ml-4 text-slate-400">Summoning a Quest Giver...</span>
      </div>
    );
  }
  
  if (!character) {
    return null;
  }

  return (
    <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50 shadow-md">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <img 
            src={`https://picsum.photos/seed/${character.name.replace(/\s/g, '')}/128/128`} 
            alt={character.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-500 shadow-lg shadow-cyan-500/20"
          />
        </div>
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 flex items-center gap-2">
                <UserCircleIcon className="w-8 h-8"/> Your Quest Giver
            </h2>
          <h3 className="font-press-start text-xl sm:text-2xl text-white mt-2">{character.name}</h3>
          <p className="mt-2 text-slate-300 italic">"{character.description}"</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
