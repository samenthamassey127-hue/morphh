'use client';

import React, { useEffect, useState } from 'react';
import { LearningFingerprint, ActivityType } from '@/lib/types';
import { Brain, TrendingUp, Clock, Zap } from 'lucide-react';

interface FingerprintCardProps {
  fingerprint: LearningFingerprint;
}

const ACTIVITY_EMOJI: Record<ActivityType, string> = {
  Game: '🎮',
  Visual: '🎨',
  Challenge: '🧩',
  Text: '📖',
  Experiment: '🧪',
  Quiz: '📝',
};

const TRAJECTORY_COLOR: Record<string, string> = {
  'Easy→Medium': 'text-amber-500',
  'Medium→Hard': 'text-indigo-500',
  Hard: 'text-rose-500',
  Easy: 'text-emerald-500',
};

export default function FingerprintCard({ fingerprint }: FingerprintCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const { bestActivities, preferredSessionMinutes, difficultyTrajectory, bestRecoveryStrategy } =
    fingerprint;

  return (
    <div
      className={`transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-4 space-y-3`}
    >
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          Your Learning Fingerprint
        </span>
      </div>

      {/* Best activities */}
      <div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">Best for you</p>
        <div className="flex flex-wrap gap-1.5">
          {bestActivities.map((a) => (
            <span
              key={a}
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
            >
              {ACTIVITY_EMOJI[a]} {a}
            </span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-2">
          <Clock className="w-3.5 h-3.5 mx-auto text-slate-500 dark:text-slate-400 mb-1" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{preferredSessionMinutes} min</p>
          <p className="text-[10px] text-slate-400">Session</p>
        </div>
        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-2">
          <TrendingUp className="w-3.5 h-3.5 mx-auto text-slate-500 dark:text-slate-400 mb-1" />
          <p className={`text-[10px] font-bold ${TRAJECTORY_COLOR[difficultyTrajectory]}`}>
            {difficultyTrajectory}
          </p>
          <p className="text-[10px] text-slate-400">Difficulty</p>
        </div>
        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-2">
          <Zap className="w-3.5 h-3.5 mx-auto text-slate-500 dark:text-slate-400 mb-1" />
          <p className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {bestRecoveryStrategy}
          </p>
          <p className="text-[10px] text-slate-400">Recovery</p>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
        Learned from your real interactions · updates as you learn
      </p>
    </div>
  );
}
