// ... autres types existants

export interface ReadingSession {
  id: string;
  bookId: string;
  userId: string;
  date: Date;
  duration: number; // en minutes
  pagesRead: number;
  notes?: string;
  mood?: 'focused' | 'distracted' | 'tired' | 'energetic';
  location?: string;
  book?: Book;
}

export interface ReadingGoal {
  id: string;
  userId: string;
  type: 'books' | 'pages' | 'time';
  target: number;
  year: number;
  progress: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReadingStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: Date;
  streakHistory: {
    date: Date;
    pagesRead: number;
    duration: number;
  }[];
}