import { StudentProfile } from './types';
import type { LearningFingerprint } from './types';

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Alex',
  grade: 8,
  group: 'Science',
  courses: ['Math', 'Science', 'Computer Science'],
  mood: 'Curious',
  learningStyle: 'Examples',
};

const PROFILE_KEY = 'vibelearn_student_profile';
const FINGERPRINT_KEY = 'vibelearn_fingerprint';
const OFFLINE_QUEUE_KEY = 'vibelearn_offline_queue';

// ─── Student Profile ──────────────────────────────────────────────────────────

export function getStoredProfile(): StudentProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const item = localStorage.getItem(PROFILE_KEY);
    return item ? JSON.parse(item) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

// ─── Learning Fingerprint ─────────────────────────────────────────────────────

export const DEFAULT_FINGERPRINT: LearningFingerprint = {
  bestActivities: ['Challenge', 'Visual'],
  preferredSessionMinutes: 10,
  difficultyTrajectory: 'Medium→Hard',
  bestRecoveryStrategy: 'Real-world problems',
  engagementHistory: [],
  lastUpdated: Date.now(),
};

export function getFingerprint(): LearningFingerprint {
  if (typeof window === 'undefined') return DEFAULT_FINGERPRINT;
  try {
    const item = localStorage.getItem(FINGERPRINT_KEY);
    return item ? JSON.parse(item) : DEFAULT_FINGERPRINT;
  } catch {
    return DEFAULT_FINGERPRINT;
  }
}

export function saveFingerprint(fp: LearningFingerprint): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FINGERPRINT_KEY, JSON.stringify(fp));
  } catch (e) {
    console.error('Failed to save fingerprint', e);
  }
}

import type { ActivityType, ActivityEngagement } from './types';

/**
 * Record an engagement delta for an activity type and recompute the fingerprint.
 */
export function updateFingerprint(
  fp: LearningFingerprint,
  activityType: ActivityType,
  engagementDelta: number
): LearningFingerprint {
  const entry: ActivityEngagement = {
    type: activityType,
    engagementDelta,
    timestamp: Date.now(),
  };

  const history = [...fp.engagementHistory, entry].slice(-50); // keep last 50

  // Average delta per activity type
  const averages: Record<string, number> = {};
  for (const e of history) {
    if (!averages[e.type]) averages[e.type] = 0;
    averages[e.type] += e.engagementDelta;
  }
  const counts: Record<string, number> = {};
  for (const e of history) counts[e.type] = (counts[e.type] || 0) + 1;
  const activityTypes = Object.keys(averages) as ActivityType[];
  activityTypes.sort((a, b) => averages[b] / counts[b] - averages[a] / counts[a]);

  // Difficulty trajectory from recent deltas
  const recent = history.slice(-10);
  const avgDelta = recent.reduce((s, e) => s + e.engagementDelta, 0) / (recent.length || 1);
  let difficultyTrajectory = fp.difficultyTrajectory;
  if (avgDelta > 15) difficultyTrajectory = 'Medium→Hard';
  else if (avgDelta > 5) difficultyTrajectory = 'Easy→Medium';
  else if (avgDelta < -5) difficultyTrajectory = 'Easy';

  // Best recovery: activity with highest delta among last 5 negative ones
  const negatives = history.filter(e => e.engagementDelta < 0).slice(-5);
  const recoveryType = negatives.length > 0
    ? negatives.sort((a, b) => b.engagementDelta - a.engagementDelta)[0].type
    : fp.bestRecoveryStrategy;

  const updated: LearningFingerprint = {
    bestActivities: activityTypes.slice(0, 3),
    preferredSessionMinutes: fp.preferredSessionMinutes,
    difficultyTrajectory,
    bestRecoveryStrategy: recoveryType || 'Real-world problems',
    engagementHistory: history,
    lastUpdated: Date.now(),
  };

  saveFingerprint(updated);
  return updated;
}

// ─── Offline Queue ─────────────────────────────────────────────────────────────

export interface OfflineQueueItem {
  id: string;
  payload: Record<string, unknown>;
  createdAt: number;
  synced: boolean;
}

export function getOfflineQueue(): OfflineQueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

export function enqueueOffline(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const queue = getOfflineQueue();
  queue.push({ id: Date.now().toString(), payload, createdAt: Date.now(), synced: false });
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to enqueue offline item', e);
  }
}

export function markQueueSynced(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
  } catch {}
}
