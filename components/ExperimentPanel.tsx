'use client';

import React, { useState } from 'react';
import { ExperimentBlock } from '@/lib/types';
import { Play, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
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
    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 space-y-4 my-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg">🧪</span>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          Experiment Mode
        </span>
      </div>

      {/* Code block */}
      <div className="rounded-xl overflow-hidden border border-emerald-200 dark:border-emerald-800">
        <div className="bg-slate-900 px-3 py-1.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-auto text-[10px] text-slate-400 font-mono">{experiment.language}</span>
        </div>
        <pre className="bg-slate-950 text-emerald-300 text-sm p-4 overflow-x-auto font-mono leading-relaxed">
          <code>{experiment.code}</code>
        </pre>
      </div>

      {/* Question */}
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{experiment.question}</p>

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
                'w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-2',
                showResult
                  ? isRight
                    ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200'
                    : isSelected
                    ? 'border-rose-400 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-500 opacity-50'
                  : isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              )}
            >
              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 border-current">
                {opt.label}
              </span>
              <span className="font-mono">{opt.value}</span>
              {showResult && isRight && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
              )}
              {showResult && isSelected && !isRight && (
                <XCircle className="w-4 h-4 text-rose-500 ml-auto shrink-0" />
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
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-semibold transition-all"
        >
          <Play className="w-4 h-4" />
          Run & Reveal
        </button>
      )}

      {/* Result */}
      {status === 'revealed' && (
        <div className="space-y-3">
          <div
            className={cn(
              'rounded-xl p-3 text-sm font-medium',
              isCorrect
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
            )}
          >
            {isCorrect ? '✅ Correct prediction!' : `❌ You predicted: "${selected}" — Actual: "${experiment.correctAnswer}"`}
          </div>

          <div className="bg-white/70 dark:bg-slate-900/50 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300">
            <p className="font-semibold mb-1">💡 Why?</p>
            <p>{experiment.explanation}</p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 text-sm text-indigo-800 dark:text-indigo-200">
            <div className="flex items-center gap-1 mb-1">
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs uppercase tracking-wide">Go Deeper</span>
            </div>
            <p>{experiment.followUp}</p>
          </div>
        </div>
      )}
    </div>
  );
}
