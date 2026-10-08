'use client';

import React, { useState } from 'react';
import { ExperimentBlock } from '@/lib/types';
import { Play, CheckCircle2, XCircle, Sparkles, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExperimentPanelProps {
  experiment: ExperimentBlock;
  onChange: (updated: ExperimentBlock) => void;
}

export default function ExperimentPanel({ experiment, onChange }: ExperimentPanelProps) {
  const [selected, setSelected] = useState<string | undefined>(experiment.selectedAnswer);
  const [status, setStatus] = useState<ExperimentBlock['status']>(experiment.status);

  const handleSelect = (value: string) => {
    if (status !== 'predicting' && status !== 'idle') return;
    setSelected(value);
    onChange({ ...experiment, selectedAnswer: value, status: 'predicting' });
    setStatus('predicting');
  };

  const handleRun = () => {
    if (!selected) return;
    setStatus('revealed');
    onChange({ ...experiment, status: 'revealed', selectedAnswer: selected });
  };

  const isCorrect = selected === experiment.correctAnswer;

  return (
    <div className="rounded-2xl border border-[#44236E] bg-gradient-to-br from-[#1E1136] via-[#150B28] to-[#100720] p-4 space-y-4 my-2.5 shadow-glow-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">
              Interactive Experiment Mode
            </span>
            <p className="text-[10px] text-slate-400">Predict the output → Run code → Level up</p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#29174A] text-pink-300 border border-[#482879]">
          {experiment.language || 'Python'}
        </span>
      </div>

      {/* Code window */}
      <div className="rounded-xl overflow-hidden border border-[#39205F] shadow-lg">
        <div className="bg-[#120822] px-3 py-1.5 flex items-center justify-between border-b border-[#291747]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[10px] text-slate-400 font-mono">sandbox.py</span>
          </div>
          <span className="text-[10px] text-pink-400 font-mono">CEREBRO RUNNER</span>
        </div>
        <pre className="bg-[#0A0414] text-pink-200 text-xs md:text-sm p-4 overflow-x-auto font-mono leading-relaxed border-l-2 border-pink-500">
          <code>{experiment.code}</code>
        </pre>
      </div>

      {/* Question */}
      <div className="bg-[#1D1033]/70 p-3 rounded-xl border border-[#351E57]">
        <p className="text-xs md:text-sm font-semibold text-slate-100 flex items-center gap-1.5">
          <span className="text-pink-400 font-bold">🎯 Question:</span> {experiment.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {experiment.options.map((opt) => {
          const isSelected = selected === opt.value;
          const showResult = status === 'revealed';
          const isRight = opt.value === experiment.correctAnswer;

          return (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.value)}
              disabled={showResult}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border text-xs md:text-sm font-medium transition-all flex items-center gap-3',
                showResult
                  ? isRight
                    ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : isSelected
                    ? 'border-rose-500 bg-rose-950/60 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    : 'border-[#2C1948] bg-[#140B24]/40 text-slate-500 opacity-40'
                  : isSelected
                  ? 'border-pink-500 bg-pink-500/20 text-pink-200 shadow-glow-pink'
                  : 'border-[#301A51] bg-[#170C2B] text-slate-300 hover:border-pink-500/60 hover:bg-[#20103A]'
              )}
            >
              <span
                className={cn(
                  'w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-black shrink-0 transition-all',
                  isSelected
                    ? 'bg-pink-500 text-white border-pink-400'
                    : 'border-[#4A267E] text-slate-400 bg-[#120822]'
                )}
              >
                {opt.label}
              </span>
              <span className="font-mono text-xs md:text-sm flex-1">{opt.value}</span>
              {showResult && isRight && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {showResult && isSelected && !isRight && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Run button */}
      {status !== 'revealed' && (
        <button
          onClick={handleRun}
          disabled={!selected}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:opacity-95 disabled:opacity-40 text-white text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all shadow-glow-pink cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          Execute Code & Verify Prediction
        </button>
      )}

      {/* Result feedback */}
      {status === 'revealed' && (
        <div className="space-y-3 pt-1">
          <div
            className={cn(
              'rounded-xl p-3 text-xs md:text-sm font-bold flex items-center gap-2 border',
              isCorrect
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/70 border-rose-500 text-rose-200'
            )}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Spot on! Your mental model matches the runtime output.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Expected <code>{experiment.correctAnswer}</code> (You predicted <code>{selected}</code>)
                </span>
              </>
            )}
          </div>

          <div className="bg-[#150A29] border border-[#301B52] rounded-xl p-3 text-xs md:text-sm text-slate-300">
            <p className="font-bold text-pink-400 mb-1 flex items-center gap-1">
              <span>💡</span> Runtime Insight:
            </p>
            <p className="leading-relaxed text-slate-300">{experiment.explanation}</p>
          </div>

          {experiment.followUp && (
            <div className="bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-purple-500/40 rounded-xl p-3 text-xs md:text-sm text-purple-200">
              <div className="flex items-center gap-1.5 mb-1 font-bold text-pink-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next Curiosity Trigger:</span>
              </div>
              <p className="leading-relaxed">{experiment.followUp}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
