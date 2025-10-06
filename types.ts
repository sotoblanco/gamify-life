export interface Character {
  name: string;
  description: string;
}

export interface Task {
  id: string;
  description: string; 
  story: string;
  points: number;
  completed: boolean;
  dueDate: string; // ISO string format: YYYY-MM-DDTHH:mm
}

export interface LeaderboardEntry {
  date: string;
  points: number;
}
