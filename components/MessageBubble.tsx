'use client';

import React, { useState } from 'react';
import { Message, QuickReplyType, ExperimentBlock } from '@/lib/types';
import QuickReplies from './QuickReplies';
import ExperimentPanel from './ExperimentPanel';
import { Bot, User } from 'lucide-react';

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
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl text-sm leading-relaxed ${
          isAssistant
            ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm'
            : 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
        }`}
      >
        {/* Text portion */}
        {message.text && (
          <div className="p-4 whitespace-pre-wrap break-words">{message.text}</div>
        )}

        {/* Experiment block (rendered inside assistant bubble) */}
        {isAssistant && experiment && (
          <div className="px-4 pb-4">
            <ExperimentPanel experiment={experiment} onChange={handleExperimentChange} />
          </div>
        )}

        {/* Quick replies */}
        {isAssistant && isLastAssistantMessage && !isLoading && !experiment && (
          <div className="px-4 pb-3">
            <QuickReplies onSelect={onQuickReply} />
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
