
export interface Session {
  id: string;
  date: string; // ISO string
  duration: number; // in seconds
  notes?: string;
  mood?: 'calm' | 'focused' | 'tired' | 'energized';
}

export interface UserStats {
  totalMinutes: number;
  totalSessions: number;
  streak: number;
  lastSessionDate: string | null;
}

export enum AppTab {
  TIMER = 'timer',
  HISTORY = 'history',
  STATS = 'stats',
  GUIDANCE = 'guidance'
}
