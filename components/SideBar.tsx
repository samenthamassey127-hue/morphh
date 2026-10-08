'use client';

import React from 'react';
import { StudentProfile, GradeLevel, TrackGroup, Course, Mood, LearningStyle, LearningFingerprint } from '@/lib/types';
import ThemeToggle from './ThemeToggle';
import FingerprintCard from './FingerprintCard';
import { Sparkles, BookOpen, Brain, Smile, Layers, X } from 'lucide-react';

interface SidebarProps {
  profile: StudentProfile;
  onChange: (updatedProfile: StudentProfile) => void;
  fingerprint?: LearningFingerprint;
  isOpen?: boolean;
  onClose?: () => void;
}

const GRADES: GradeLevel[] = [6, 7, 8, 9, 10, 11, 12];
const TRACKS: TrackGroup[] = ['General', 'Science', 'Commerce', 'Arts', 'STEM', 'Exam Prep'];
const ALL_COURSES: Course[] = [
  'Math', 'Science', 'English', 'Social Studies',
  'Computer Science', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography',
];
const MOODS: Mood[] = ['Bored', 'Confused', 'Curious', 'Tired', 'Okay'];
const LEARNING_STYLES: LearningStyle[] = ['Examples', 'Stories', 'Steps', 'Quizzes', 'Visuals'];

export default function Sidebar({ profile, onChange, fingerprint, isOpen, onClose }: SidebarProps) {
  const handleCourseToggle = (course: Course) => {
    const updatedCourses = profile.courses.includes(course)
      ? profile.courses.filter((c) => c !== course)
      : [...profile.courses, course];
    onChange({ ...profile, courses: updatedCourses });
  };

  return (
    <aside className="w-full md:w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto p-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">VibeLearn</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Ollama</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-5 flex-1">
        {/* Learning Fingerprint */}
        {fingerprint && fingerprint.engagementHistory.length > 0 && (
          <FingerprintCard fingerprint={fingerprint} />
        )}
        {fingerprint && fingerprint.engagementHistory.length === 0 && (
          <div className="rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 p-4 text-center text-xs text-slate-400 dark:text-slate-500">
            🧠 <strong className="text-indigo-500">Learning Fingerprint</strong> will appear here after your first interaction.
          </div>
        )}

        {/* Name */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 block">
            Student Name
          </label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Grade */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Grade Level
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ ...profile, grade: g })}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  profile.grade === g
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Track */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Track
          </label>
          <select
            value={profile.group}
            onChange={(e) => onChange({ ...profile, group: e.target.value as TrackGroup })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {TRACKS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Mood */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5" /> Current Mood
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChange({ ...profile, mood: m })}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  profile.mood === m
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Style */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" /> Preferred Style
          </label>
          <select
            value={profile.learningStyle}
            onChange={(e) => onChange({ ...profile, learningStyle: e.target.value as LearningStyle })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {LEARNING_STYLES.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Courses */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 block">
            Courses
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_COURSES.map((c) => {
              const selected = profile.courses.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCourseToggle(c)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                    selected
                      ? 'bg-indigo-100 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {selected ? '✓ ' : ''}{c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
