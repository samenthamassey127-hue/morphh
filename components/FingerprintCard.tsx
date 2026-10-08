'use client';

import React, { useEffect, useState } from 'react';
import { LearningFingerprint, ActivityType } from '@/lib/types';
import { Brain, TrendingUp, Clock, Zap, Sparkles } from 'lucide-react';

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
      } rounded-2xl border border-[#39245C] bg-gradient-to-br from-[#1C122F] via-[#160D27] to-[#12081F] p-4 space-y-3.5 shadow-glow-card relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-pink-400">
              Live Fingerprint
            </span>
            <p className="text-[10px] text-slate-400">Adaptive AI Cognitive Profile</p>
          </div>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
        </span>
      </div>

      {/* Best activities */}
      <div>
        <p className="text-[10px] text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
          Top Engagement Boosters
        </p>
        <div className="flex flex-wrap gap-1.5">
          {bestActivities.map((a) => (
            <span
              key={a}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#261642] text-pink-300 border border-[#482875] flex items-center gap-1 shadow-sm"
            >
              <span>{ACTIVITY_EMOJI[a] || '✨'}</span> {a}
            </span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center pt-1">
        <div className="bg-[#110A1E]/80 border border-[#2B1B47] rounded-xl p-2.5">
          <Clock className="w-3.5 h-3.5 mx-auto text-pink-400 mb-1" />
          <p className="text-xs font-black text-slate-100">{preferredSessionMinutes}m</p>
          <p className="text-[9px] uppercase font-semibold text-slate-400">Session</p>
        </div>
        <div className="bg-[#110A1E]/80 border border-[#2B1B47] rounded-xl p-2.5">
          <TrendingUp className="w-3.5 h-3.5 mx-auto text-purple-400 mb-1" />
          <p className="text-[10px] font-black text-purple-300 leading-tight">
            {difficultyTrajectory}
          </p>
          <p className="text-[9px] uppercase font-semibold text-slate-400">Level</p>
        </div>
        <div className="bg-[#110A1E]/80 border border-[#2B1B47] rounded-xl p-2.5">
          <Zap className="w-3.5 h-3.5 mx-auto text-amber-400 mb-1" />
          <p className="text-[9px] font-extrabold text-amber-200 leading-tight truncate">
            {bestRecoveryStrategy}
          </p>
          <p className="text-[9px] uppercase font-semibold text-slate-400">Recovery</p>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-[#26173E]">
        <span className="flex items-center gap-1 text-pink-400/90 font-medium">
          <Sparkles className="w-3 h-3" /> Adapts with Ollama
        </span>
        <span className="font-mono text-[9px] text-slate-500">
          {fingerprint.engagementHistory.length} interactions
        </span>
      </div>
    </div>
  );
}
