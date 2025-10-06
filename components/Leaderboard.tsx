
import React from 'react';
import type { LeaderboardEntry } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardProps {
    data: LeaderboardEntry[];
}

const getTodayDateString = (): string => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const adjustedToday = new Date(today.getTime() - (offset*60*1000));
    return adjustedToday.toISOString().split('T')[0];
};

const formatDate = (dateStr: string): string => {
    const today = getTodayDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const offset = yesterday.getTimezoneOffset();
    const adjustedYesterday = new Date(yesterday.getTime() - (offset*60*1000));
    const yesterdayStr = adjustedYesterday.toISOString().split('T')[0];

    if (dateStr === today) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";
    
    // Adding timezone hint for consistent parsing
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7); // Show last 7 days

    if (!data || data.length === 0) {
        return null;
    }

    const highScore = Math.max(...data.map(d => d.points), 0);

    return (
        <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700/50 shadow-md">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2 mb-4">
                <TrophyIcon className="w-7 h-7" />
                Your High Scores
            </h2>
            {sortedData.length > 0 ? (
                <ul className="space-y-2">
                    {sortedData.map((entry) => {
                        const isToday = entry.date === getTodayDateString();
                        const isHighScore = entry.points === highScore && highScore > 0;
                        return (
                            <li
                                key={entry.date}
                                className={`flex justify-between items-center p-3 rounded-md transition-colors duration-300 ${isToday ? 'bg-fuchsia-500/20 border-l-4 border-fuchsia-500' : 'bg-slate-800/50'}`}
                            >
                                <span className="font-bold text-slate-300">
                                    {formatDate(entry.date)}
                                </span>
                                <div className="flex items-center gap-3">
                                    {isHighScore && (
                                        <span title="All-Time High!" className="text-yellow-400">
                                            <TrophyIcon className="w-5 h-5"/>
                                        </span>
                                    )}
                                    <span className="text-xl font-press-start text-white">
                                        {entry.points}
                                    </span>
                                    <span className="text-slate-500 text-sm">PTS</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-slate-400">Complete tasks to see your daily scores here.</p>
            )}
        </div>
    );
};

export default Leaderboard;
