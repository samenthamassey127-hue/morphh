'use client';

import React from 'react';
import { QuickReplyType } from '@/lib/types';
import { Check, HelpCircle, RotateCcw } from 'lucide-react';

interface QuickRepliesProps {
  onSelect: (type: QuickReplyType) => void;
}

export default function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <button
        onClick={() => onSelect('Yes')}
        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#132A24] border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all flex items-center gap-1.5 shadow-sm"
      >
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span>Got it! Challenge me 🧩</span>
      </button>

      <button
        onClick={() => onSelect('Kind of')}
        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2C2114] border border-amber-500/50 text-amber-300 hover:bg-amber-900/60 hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-sm"
      >
        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
        <span>Kind of · Simpler analogy 🎨</span>
      </button>

      <button
        onClick={() => onSelect('No')}
        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2A111F] border border-rose-500/50 text-rose-300 hover:bg-rose-900/60 hover:border-rose-400 transition-all flex items-center gap-1.5 shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
        <span>No · Re-explain simply 🔄</span>
      </button>
    </div>
  );
}
