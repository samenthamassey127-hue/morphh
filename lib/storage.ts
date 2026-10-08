import { StudentProfile } from './types';

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Alex',
  grade: 8,
  group: 'Science',
  courses: ['Math', 'Science', 'Computer Science'],
  mood: 'Curious',
  learningStyle: 'Examples'
};

const STORAGE_KEY = 'curio_student_profile';

export function getStoredProfile(): StudentProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : DEFAULT_PROFILE;
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}
