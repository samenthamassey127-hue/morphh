'use client';

import React from 'react';
import {
  StudentProfile,
  GradeLevel,
  TrackGroup,
  Course,
  Mood,
  LearningStyle,
  LearningFingerprint,
} from '@/lib/types';
import FingerprintCard from './FingerprintCard';
import {
  Home,
  Gamepad2,
  ListMusic,
  Heart,
  BarChart2,
  Settings,
  HelpCircle,
  BookOpen,
  Sparkles,
  X,
  Layers,
  Smile,
  Brain,
} from 'lucide-react';

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
  'Math',
  'Science',
  'English',
  'Social Studies',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
];
const MOODS: Mood[] = ['Bored', 'Confused', 'Curious', 'Tired', 'Okay'];
const LEARNING_STYLES: LearningStyle[] = ['Examples', 'Stories', 'Steps', 'Quizzes', 'Visuals'];

export default function Sidebar({ profile, onChange, fingerprint, onClose }: SidebarProps) {
  const handleCourseToggle = (course: Course) => {
    const updatedCourses = profile.courses.includes(course)
      ? profile.courses.filter((c) => c !== course)
      : [...profile.courses, course];
    onChange({ ...profile, courses: updatedCourses });
  };

  return (
    <aside className="w-full md:w-80 bg-[#120B1F] border-r border-[#26163D] flex flex-col h-full overflow-y-auto p-4 md:p-5 transition-all text-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#26173E]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-glow-pink">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-300">
              CEREBRO
            </h1>
            <p className="text-[10px] text-pink-400/80 font-mono tracking-tight">Adaptive Study Studio</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-[#25153E]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav pill list matching screenshot */}
      <div className="space-y-1 mb-5">
        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-glow-pink">
          <Home className="w-4 h-4" />
          <span>Home Quest Hub</span>
        </button>

        <div className="pt-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-2">
          Library
        </div>
        <div className="space-y-0.5 text-xs text-slate-400">
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg hover:text-pink-300 hover:bg-[#1B112D] transition-colors">
            <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Games & Quests</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg hover:text-pink-300 hover:bg-[#1B112D] transition-colors">
            <ListMusic className="w-3.5 h-3.5 text-purple-400" />
            <span>Learning Playlists</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg hover:text-pink-300 hover:bg-[#1B112D] transition-colors">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Favorites</span>
          </button>
        </div>

        <div className="pt-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-2">
          Studio
        </div>
        <div className="space-y-0.5 text-xs text-slate-400">
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg hover:text-pink-300 hover:bg-[#1B112D] transition-colors">
            <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Cognitive Analytics</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg hover:text-pink-300 hover:bg-[#1B112D] transition-colors">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Ollama Settings</span>
          </button>
        </div>
      </div>

      {/* Profile controls container */}
      <div className="space-y-4 pt-3 border-t border-[#25153E]">
        {/* Learning Fingerprint card */}
        {fingerprint && <FingerprintCard fingerprint={fingerprint} />}

        {/* Student name */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
            Student Identity
          </label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            placeholder="Ayo"
            className="w-full px-3 py-2 rounded-xl border border-[#352156] bg-[#190F2C] text-slate-100 text-xs focus:outline-none focus:border-pink-500 font-medium placeholder-slate-500"
          />
        </div>

        {/* Grade Level */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-pink-400" /> Grade Level
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {GRADES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ ...profile, grade: g })}
                className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                  profile.grade === g
                    ? 'bg-pink-600 border-pink-500 text-white shadow-glow-pink'
                    : 'bg-[#180E2B] border-[#311E52] text-slate-300 hover:border-pink-500/50'
                }`}
              >
                G-{g}
              </button>
            ))}
          </div>
        </div>

        {/* Track */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-purple-400" /> Track Focus
          </label>
          <select
            value={profile.group}
            onChange={(e) => onChange({ ...profile, group: e.target.value as TrackGroup })}
            className="w-full px-3 py-2 rounded-xl border border-[#352156] bg-[#190F2C] text-slate-200 text-xs focus:outline-none focus:border-pink-500 font-medium"
          >
            {TRACKS.map((t) => (
              <option key={t} value={t} className="bg-[#120B1F]">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Mood */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Smile className="w-3 h-3 text-amber-400" /> Current Mood
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChange({ ...profile, mood: m })}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full border transition-all ${
                  profile.mood === m
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-400 text-white shadow-glow-pink'
                    : 'bg-[#190E2C] border-[#341F54] text-slate-300 hover:border-pink-500/50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Style */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-pink-400" /> Teaching Persona
          </label>
          <select
            value={profile.learningStyle}
            onChange={(e) => onChange({ ...profile, learningStyle: e.target.value as LearningStyle })}
            className="w-full px-3 py-2 rounded-xl border border-[#352156] bg-[#190F2C] text-slate-200 text-xs focus:outline-none focus:border-pink-500 font-medium"
          >
            {LEARNING_STYLES.map((style) => (
              <option key={style} value={style} className="bg-[#120B1F]">
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Courses */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
            Enrolled Quests / Courses
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_COURSES.map((c) => {
              const selected = profile.courses.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCourseToggle(c)}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-lg border transition-all ${
                    selected
                      ? 'bg-pink-500/20 border-pink-500 text-pink-200'
                      : 'bg-[#180E2B] border-[#311E52] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {selected ? '✓ ' : ''}{c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mascot card at bottom matching screenshot */}
      <div className="mt-5 p-3 rounded-2xl bg-gradient-to-br from-[#24133A] to-[#160A26] border border-[#44266C] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-200 leading-tight">Master New Skills</p>
          <p className="text-[10px] text-pink-400 font-mono">One Quest at a Time</p>
        </div>
      </div>
    </aside>
  );
}
