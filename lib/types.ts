export type GradeLevel = 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type TrackGroup =
  | 'General'
  | 'Science'
  | 'Commerce'
  | 'Arts'
  | 'STEM'
  | 'Exam Prep';

export type Course =
  | 'Math'
  | 'Science'
  | 'English'
  | 'Social Studies'
  | 'Computer Science'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'History'
  | 'Geography';

export type Mood = 'Bored' | 'Confused' | 'Curious' | 'Tired' | 'Okay';

export type LearningStyle = 'Examples' | 'Stories' | 'Steps' | 'Quizzes' | 'Visuals';

export type ActivityType = 'Game' | 'Visual' | 'Challenge' | 'Text' | 'Experiment' | 'Quiz';

// --- Learning Fingerprint ---
export interface ActivityEngagement {
  type: ActivityType;
  engagementDelta: number; // positive = helpful, negative = not
  timestamp: number;
}

export interface LearningFingerprint {
  bestActivities: ActivityType[];         // ranked by avg engagement
  preferredSessionMinutes: number;        // 5 | 10 | 15 | 20
  difficultyTrajectory: 'Easy→Medium' | 'Medium→Hard' | 'Hard' | 'Easy';
  bestRecoveryStrategy: string;           // e.g. "Real-world problems"
  engagementHistory: ActivityEngagement[];
  lastUpdated: number;
}

// --- Experiment Mode ---
export type ExperimentStatus = 'idle' | 'predicting' | 'running' | 'revealed';

export interface ExperimentOption {
  label: string;
  value: string;
}

export interface ExperimentBlock {
  id: string;
  code: string;
  language: string;
  question: string;
  options: ExperimentOption[];
  correctAnswer: string;
  explanation: string;
  followUp: string;
  status: ExperimentStatus;
  selectedAnswer?: string;
}

// --- Offline / Sync ---
export interface OfflineActivity {
  id: string;
  type: 'quiz' | 'experiment' | 'lesson';
  title: string;
  content: string;
  completed: boolean;
  completedAt?: number;
  synced: boolean;
}

export interface SyncState {
  isOnline: boolean;
  pendingSync: number;
  lastSyncedAt?: number;
}

// --- Student Profile ---
export interface StudentProfile {
  name?: string;
  grade: GradeLevel;
  group: TrackGroup;
  courses: Course[];
  mood: Mood;
  learningStyle: LearningStyle;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  experiment?: ExperimentBlock;
}

export type QuickReplyType = 'Yes' | 'Kind of' | 'No';
