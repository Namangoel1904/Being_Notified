export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  degree: string;
  goal: 'curricular' | 'curricular-extra' | 'all-round';
  college?: string;
  points: number;
  completedChallenges: string[];
}

export interface MoodLog {
  id: string;
  userId: string;
  feeling: 'good' | 'very-good' | 'okay' | 'bad';
  emotions: string[];
  factors: string[];
  timestamp: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'educational' | 'hobby' | 'health';
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completionCriteria: string;
}

export interface TimeTableEntry {
  id: string;
  userId: string;
  day: string;
  startTime: string;
  endTime: string;
  activity: string;
  category: string;
}

export interface AcademicPath {
  id: string;
  title: string;
  domain: string;
  difficulty: string;
  roadmap: RoadmapStep[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  resources: string[];
  estimatedDuration: string;
  completed: boolean;
}