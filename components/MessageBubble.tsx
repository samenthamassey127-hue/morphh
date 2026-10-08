'use client';

import React, { useState } from 'react';
import { Message, QuickReplyType, ExperimentBlock } from '@/lib/types';
import QuickReplies from './QuickReplies';
import ExperimentPanel from './ExperimentPanel';
import { Sparkles, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isLastAssistantMessage: boolean;
  onQuickReply: (type: QuickReplyType) => void;
  onExperimentComplete?: (experimentId: string, correct: boolean) => void;
  isLoading?: boolean;
}

export default function MessageBubble({
  message,
  isLastAssistantMessage,
  onQuickReply,
  onExperimentComplete,
  isLoading,
}: MessageBubbleProps) {
  const isAssistant = message.sender === 'assistant';
  const [experiment, setExperiment] = useState<ExperimentBlock | undefined>(message.experiment);

  const handleExperimentChange = (updated: ExperimentBlock) => {
    setExperiment(updated);
    if (updated.status === 'revealed' && updated.selectedAnswer !== undefined) {
      onExperimentComplete?.(
        updated.id,
        updated.selectedAnswer === updated.correctAnswer
      );
    }
  };

  return (
    <div
      className={`flex items-start gap-3 my-4 animate-in fade-in duration-300 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {isAssistant && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-glow-pink mt-0.5 border border-pink-400/40">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[88%] md:max-w-[78%] rounded-2xl text-xs md:text-sm leading-relaxed ${
          isAssistant
            ? 'bg-[#181026] text-slate-100 rounded-tl-sm border border-[#321F4E] shadow-glow-card'
            : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-tr-sm shadow-glow-pink font-medium'
        }`}
      >
        {/* Text portion */}
        {message.text && (
          <div className="p-4 whitespace-pre-wrap break-words leading-relaxed">
            {message.text}
          </div>
        )}

        {/* Experiment block */}
        {isAssistant && experiment && (
          <div className="px-4 pb-4">
            <ExperimentPanel experiment={experiment} onChange={handleExperimentChange} />
          </div>
        )}

        {/* Quick replies */}
        {isAssistant && isLastAssistantMessage && !isLoading && !experiment && (
          <div className="px-4 pb-3 border-t border-[#2A1842]/60 pt-2">
            <QuickReplies onSelect={onQuickReply} />
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="w-9 h-9 rounded-2xl bg-[#26143E] border border-[#482875] text-pink-300 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
