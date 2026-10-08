'use client';

import React from 'react';
import { QuickReplyType } from '@/lib/types';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

interface QuickRepliesProps {
  onSelect: (type: QuickReplyType) => void;
  disabled?: boolean;
}

export default function QuickReplies({ onSelect, disabled }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
      <span className="text-xs text-slate-400 font-medium mr-1">Feedback response:</span>
      <button
        onClick={() => onSelect('Yes')}
        disabled={disabled}
        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors disabled:opacity-50"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Yes
      </button>

      <button
        onClick={() => onSelect('Kind of')}
        disabled={disabled}
        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors disabled:opacity-50"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        Kind of
      </button>

      <button
        onClick={() => onSelect('No')}
        disabled={disabled}
        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors disabled:opacity-50"
      >
        <XCircle className="w-3.5 h-3.5" />
        No
      </button>
    </div>
  );
}
