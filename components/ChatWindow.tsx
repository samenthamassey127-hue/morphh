'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StudentProfile, Message, QuickReplyType, ExperimentBlock, LearningFingerprint } from '@/lib/types';
import MessageBubble from './MessageBubble';
import { Send, Menu, Sparkles, RefreshCw, FlaskConical } from 'lucide-react';
import { getFingerprint, updateFingerprint } from '@/lib/storage';
import { enqueueOffline } from '@/lib/storage';

interface ChatWindowProps {
  profile: StudentProfile;
  onOpenMobileSidebar: () => void;
  isOnline: boolean;
  onFingerprintUpdate?: (fp: LearningFingerprint) => void;
}

/**
 * Parse an ```experiment ... ``` fenced block out of the assistant response text.
 * Returns { textBefore, experiment | null }
 */
function parseExperiment(text: string): { cleanText: string; experiment: ExperimentBlock | null } {
  const match = text.match(/```experiment\s*([\s\S]*?)```/);
  if (!match) return { cleanText: text, experiment: null };
  try {
    const json = JSON.parse(match[1].trim());
    const experiment: ExperimentBlock = {
      id: Date.now().toString(),
      code: json.code ?? '',
      language: json.language ?? 'code',
      question: json.question ?? 'What will this output?',
      options: json.options ?? [],
      correctAnswer: json.correctAnswer ?? '',
      explanation: json.explanation ?? '',
      followUp: json.followUp ?? '',
      status: 'predicting',
    };
    const cleanText = text.replace(/```experiment[\s\S]*?```/, '').trim();
    return { cleanText, experiment };
  } catch {
    return { cleanText: text, experiment: null };
  }
}

export default function ChatWindow({
  profile,
  onOpenMobileSidebar,
  isOnline,
  onFingerprintUpdate,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getSeedQuestions = (): string[] => {
    if (profile.grade <= 8) {
      return [
        'Why is the sky blue?',
        'How do plants turn sunlight into energy?',
        'What is friction and why does it slow things down?',
      ];
    } else if (profile.grade <= 10) {
      return [
        "Explain Newton's second law of motion with steps.",
        'How does quadratic equation factorization work?',
        'Show me a Python experiment on loops!',
      ];
    } else {
      return [
        'Derive the formula for time dilation in special relativity.',
        'How do redox balancing equations work?',
        'Give me a Python experiment on recursion.',
      ];
    }
  };

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = textToSend || input.trim();
      if (!query || isLoading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: query,
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      if (!textToSend) setInput('');
      setIsLoading(true);

      // If offline: enqueue and show cached response
      if (!isOnline) {
        enqueueOffline({ query, profile: profile.name });
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'assistant',
              text: `📶 You're in offline mode. Your question has been saved and will be answered when you reconnect.\n\nMeanwhile, try reviewing your saved lessons or completing a cached quiz.`,
              timestamp: Date.now(),
            },
          ]);
          setIsLoading(false);
        }, 600);
        return;
      }

      try {
        const fingerprint = getFingerprint();
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
            profile,
            fingerprint,
          }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const assistantMsgId = (Date.now() + 1).toString();
        setMessages((prev) => [
          ...prev,
          { id: assistantMsgId, sender: 'assistant', text: '', timestamp: Date.now() },
        ]);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let accumulated = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            accumulated += decoder.decode(value, { stream: true });
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantMsgId ? { ...m, text: accumulated } : m))
            );
          }

          // Post-process: extract experiment block if present
          const { cleanText, experiment } = parseExperiment(accumulated);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, text: cleanText, experiment: experiment ?? undefined } : m
            )
          );

          // Update fingerprint: text answer = +5 engagement (baseline)
          const updatedFp = updateFingerprint(fingerprint, experiment ? 'Experiment' : 'Text', experiment ? 12 : 5);
          onFingerprintUpdate?.(updatedFp);
        }
      } catch (err: any) {
        console.error('Chat error:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'assistant',
            text: `⚠️ Couldn't reach Ollama. Make sure it's running with:\n\n\`ollama serve\`\n\nAnd you have a model pulled:\n\`ollama pull llama3\``,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, profile, isOnline, onFingerprintUpdate]
  );

  const handleQuickReply = (type: QuickReplyType) => {
    const fingerprint = getFingerprint();
    if (type === 'Yes') {
      updateFingerprint(fingerprint, 'Challenge', 20);
      handleSend('Yes! Give me a 2-minute micro-challenge to test my understanding.');
    } else if (type === 'Kind of') {
      updateFingerprint(fingerprint, 'Visual', 8);
      handleSend('Kind of. Can you explain that again using a simpler analogy?');
    } else if (type === 'No') {
      updateFingerprint(fingerprint, 'Text', -10);
      handleSend("No, I didn't get it. Please re-explain from scratch in the absolute simplest way.");
    }
  };

  const handleExperimentComplete = (_id: string, correct: boolean) => {
    const fingerprint = getFingerprint();
    const delta = correct ? 31 : 8; // big positive for correct, smaller for engagement even if wrong
    const updated = updateFingerprint(fingerprint, 'Experiment', delta);
    onFingerprintUpdate?.(updated);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden">
      {/* Top Bar */}
      <header className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Grade {profile.grade}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {profile.group}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {profile.mood}
            </span>
            {!isOnline && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                📶 Offline
              </span>
            )}
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Clear Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto p-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Hey {profile.name || 'there'}, I'm Curio!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Powered by Ollama · running locally on your machine
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
              I learn <em>how you learn</em> and adapt every session to your fingerprint.
            </p>

            <div className="w-full space-y-2 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Try these:
              </p>
              {getSeedQuestions().map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 text-sm transition-all hover:shadow-sm flex items-center gap-2"
                >
                  {q.toLowerCase().includes('experiment') ? (
                    <FlaskConical className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isLastAssistantMessage={index === messages.length - 1 && msg.sender === 'assistant'}
              onQuickReply={handleQuickReply}
              onExperimentComplete={handleExperimentComplete}
              isLoading={isLoading && index === messages.length - 1}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic ml-11 my-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Curio is thinking…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isOnline
                ? `Ask anything about ${profile.courses.join(', ') || 'your subjects'}…`
                : '📶 Offline — questions saved for later'
            }
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
