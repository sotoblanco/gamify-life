import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, Character, LeaderboardEntry } from './types';
import { generateCharacter, generateStoryForTask } from './services/geminiService';
import Header from './components/Header';
import CharacterCard from './components/CharacterCard';
import TaskInputForm from './components/TaskInputForm';
import TaskList from './components/TaskList';
import { ErrorDisplay } from './components/ErrorDisplay';
import Leaderboard from './components/Leaderboard';
import { Calendar } from './components/Calendar';

// Helper function to get today's date as YYYY-MM-DD, adjusted for local timezone
const getTodayDateString = (): string => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const adjustedToday = new Date(today.getTime() - (offset * 60 * 1000));
  return adjustedToday.toISOString().split('T')[0];
};

const isSameDay = (d1: Date, d2: Date): boolean =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const initializeApp = async () => {
      setError(null);

      try {
        // Load all tasks
        const savedTasks = localStorage.getItem('taskQuestTasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }

        // Load leaderboard and set today's points
        const savedLeaderboard = localStorage.getItem('taskQuestLeaderboard');
        const allEntries: LeaderboardEntry[] = savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
        setLeaderboardData(allEntries);
        const todayEntry = allEntries.find(entry => entry.date === getTodayDateString());
        if (todayEntry) {
            setTotalPoints(todayEntry.points);
        } else {
            setTotalPoints(0);
        }
      } catch (e) {
        console.error("Failed to parse data from localStorage", e);
        localStorage.clear(); // Clear potentially corrupted data
      }
      
      try {
        const newCharacter = await generateCharacter();
        setCharacter(newCharacter);
      } catch (e) {
        console.error(e);
        setError('Failed to summon a quest giver. Please check your API key and refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Persist all tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskQuestTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = useCallback(async (description: string, time: string) => {
    if (!character) {
        setError("Your quest giver hasn't arrived yet! Please wait.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const { story, points } = await generateStoryForTask(description, character);
        
        const [hours, minutes] = time.split(':');
        const dueDate = new Date(selectedDate);
        dueDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const newTask: Task = {
            id: crypto.randomUUID(),
            description,
            story,
            points,
            completed: false,
            dueDate: dueDate.toISOString(),
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (e) {
        console.error(e);
        setError('The quest scroll caught fire! Failed to create a new quest. Please try again.');
    } finally {
        setIsLoading(false);
    }
  }, [character, selectedDate]);

  const handleCompleteTask = useCallback((taskId: string) => {
    const taskToComplete = tasks.find(t => t.id === taskId && !t.completed);

    if (!taskToComplete) {
      return;
    }

    const pointsEarned = taskToComplete.points;

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );

    if (pointsEarned > 0) {
      setTotalPoints(prevTotalPoints => {
        const newTotalPoints = prevTotalPoints + pointsEarned;
        
        setLeaderboardData(prevLeaderboard => {
          const todayDateString = getTodayDateString();
          const updatedLeaderboard = [...prevLeaderboard];
          const todayEntryIndex = updatedLeaderboard.findIndex(
            entry => entry.date === todayDateString
          );

          if (todayEntryIndex > -1) {
            updatedLeaderboard[todayEntryIndex].points = newTotalPoints;
          } else {
            updatedLeaderboard.unshift({ date: todayDateString, points: newTotalPoints });
          }

          localStorage.setItem('taskQuestLeaderboard', JSON.stringify(updatedLeaderboard));
          return updatedLeaderboard;
        });

        return newTotalPoints;
      });
    }
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => isSameDay(new Date(task.dueDate), selectedDate));
  }, [tasks, selectedDate]);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen p-4 sm:p-8 text-lg selection:bg-cyan-400 selection:text-slate-900">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center" 
        style={{backgroundImage: "url('https://picsum.photos/seed/taskquestbg/1920/1080')", filter: 'blur(8px) brightness(0.4)'}}
      ></div>
      <div className="relative z-10 container mx-auto max-w-7xl space-y-8">
        <Header totalPoints={totalPoints} />
        
        <main className="space-y-8 p-4 sm:p-6 bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg shadow-2xl shadow-cyan-500/10">
          <CharacterCard character={character} isLoading={isLoading && !character} />

          <Leaderboard data={leaderboardData} />
          
          <hr className="border-slate-700/50" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Calendar 
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                tasks={tasks}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
              />
            </div>

            <div className="lg:col-span-2 space-y-6">
                <TaskInputForm onAddTask={handleAddTask} isLoading={isLoading} />
                
                {error && <ErrorDisplay message={error} />}

                <TaskList tasks={filteredTasks} onCompleteTask={handleCompleteTask} selectedDate={selectedDate}/>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
