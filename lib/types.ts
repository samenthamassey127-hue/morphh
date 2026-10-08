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
}

export type QuickReplyType = 'Yes' | 'Kind of' | 'No';
