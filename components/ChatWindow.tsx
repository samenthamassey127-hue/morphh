'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StudentProfile,
  Message,
  QuickReplyType,
  ExperimentBlock,
  LearningFingerprint,
} from '@/lib/types';
import MessageBubble from './MessageBubble';
import {
  Send,
  Menu,
  Sparkles,
  RefreshCw,
  FlaskConical,
  Search,
  Bell,
  Gamepad2,
  Rocket,
  Timer,
  BookOpen,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { getFingerprint, updateFingerprint, enqueueOffline } from '@/lib/storage';

interface ChatWindowProps {
  profile: StudentProfile;
  onOpenMobileSidebar: () => void;
  isOnline: boolean;
  onFingerprintUpdate?: (fp: LearningFingerprint) => void;
}

function parseExperiment(text: string): { cleanText: string; experiment: ExperimentBlock | null } {
  const match = text.match(/```experiment\s*([\s\S]*?)```/);
  if (!match) return { cleanText: text, experiment: null };
  try {
    const json = JSON.parse(match[1].trim());
    const experiment: ExperimentBlock = {
      id: Date.now().toString(),
      code: json.code ?? '',
      language: json.language ?? 'python',
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
  const [activeTab, setActiveTab] = useState<'quest-hub' | 'chat'>('quest-hub');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = textToSend || input.trim();
      if (!query || isLoading) return;

      setActiveTab('chat');

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

      if (!isOnline) {
        enqueueOffline({ query, profile: profile.name });
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'assistant',
              text: `📶 Low-Connectivity Continuity Mode Active.\n\nYour query has been queued for sync. Meanwhile, explore our pre-cached experiments!`,
              timestamp: Date.now(),
            },
          ]);
          setIsLoading(false);
        }, 500);
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

          const { cleanText, experiment } = parseExperiment(accumulated);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, text: cleanText, experiment: experiment ?? undefined }
                : m
            )
          );

          const updatedFp = updateFingerprint(
            fingerprint,
            experiment ? 'Experiment' : 'Text',
            experiment ? 15 : 5
          );
          onFingerprintUpdate?.(updatedFp);
        }
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'assistant',
            text: `⚠️ Ollama connection interrupted. Verify that Ollama is active with:\n\`ollama serve\``,
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
      handleSend('Yes! Give me a high-intensity micro-challenge to test my mastery.');
    } else if (type === 'Kind of') {
      updateFingerprint(fingerprint, 'Visual', 8);
      handleSend('Kind of. Can you explain that again using a simpler visual analogy?');
    } else if (type === 'No') {
      updateFingerprint(fingerprint, 'Text', -10);
      handleSend('No, I did not catch that. Please re-explain from scratch with a practical example.');
    }
  };

  const handleExperimentComplete = (_id: string, correct: boolean) => {
    const fingerprint = getFingerprint();
    const delta = correct ? 31 : 10;
    const updated = updateFingerprint(fingerprint, 'Experiment', delta);
    onFingerprintUpdate?.(updated);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0D0814] overflow-hidden text-slate-100">
      {/* Top Header matching screenshot */}
      <header className="px-4 md:px-6 py-3 border-b border-[#25153E] bg-[#11091C]/80 backdrop-blur-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-[#201036]"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar from screenshot */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for game, subject, or experiment..."
              className="w-full pl-9 pr-10 py-2 rounded-full border border-[#341F54] bg-[#1B0F2E] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 shadow-glow-pink">
              <Search className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {/* User profile capsule from screenshot */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-[#1A0E2D] border border-[#311E52] text-slate-300 hover:text-pink-400 relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-pink-500 absolute top-1 right-1" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C0F30] border border-[#3B225E]">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">
              {profile.name ? profile.name[0].toUpperCase() : 'A'}
            </div>
            <span className="text-xs font-bold text-slate-200 hidden sm:inline">
              {profile.name || 'ade_ayo'}
            </span>
          </div>
        </div>
      </header>

      {/* View Switcher Bar */}
      <div className="px-6 pt-3 flex items-center gap-3 border-b border-[#211237]">
        <button
          onClick={() => setActiveTab('quest-hub')}
          className={`pb-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'quest-hub'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" /> Quests Dashboard
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'chat'
              ? 'border-pink-500 text-pink-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Ollama Copilot ({messages.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {activeTab === 'quest-hub' ? (
          <>
            {/* Banner matching screenshot */}
            <div className="rounded-3xl p-5 md:p-6 cerebro-gradient-banner relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 shadow-glow-card">
              <div className="space-y-1.5 z-10 text-center md:text-left">
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  Welcome {profile.name || 'Ayo'}!
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-wide">
                  Master New Skills While Playing, One Quest at a Time!
                </h2>
                <p className="text-xs text-pink-200/80 max-w-xl">
                  Curio adapts every prompt to your Grade {profile.grade} curriculum and live
                  interaction fingerprint.
                </p>
              </div>

              <div className="flex items-center gap-3 z-10 shrink-0">
                <button
                  onClick={() =>
                    handleSend(
                      'Give me an interactive code experiment with loops and logic to predict the output!'
                    )
                  }
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-all shadow-glow-pink flex items-center gap-2 cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4" /> Start Experiment
                </button>
              </div>
            </div>

            {/* Metrics cards matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="cerebro-card rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 mb-0.5">
                    Total Quests Created
                  </p>
                  <p className="text-2xl font-black text-white">12</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#28143F] border border-[#482575] flex items-center justify-center text-pink-400 shadow-glow-pink">
                  <Gamepad2 className="w-6 h-6" />
                </div>
              </div>

              <div className="cerebro-card rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 mb-0.5">Success Rate</p>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    94%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#28143F] border border-[#482575] flex items-center justify-center text-purple-400 shadow-glow-purple">
                  <Rocket className="w-6 h-6" />
                </div>
              </div>

              <div className="cerebro-card rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 mb-0.5">
                    Average Study Time
                  </p>
                  <p className="text-2xl font-black text-amber-300">42m 15s</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#28143F] border border-[#482575] flex items-center justify-center text-amber-400">
                  <Timer className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Explore Subjects & Recommended Games rows matching screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Explore Subjects */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                    Explore Subjects
                  </h3>
                  <span className="text-[11px] text-pink-400 font-bold flex items-center gap-1 cursor-pointer hover:underline">
                    See all <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      title: 'Science Quests',
                      games: '10 Quests',
                      icon: '🧪',
                      query: 'Give me a Science Quest about photosynthesis and chemical energy!',
                    },
                    {
                      title: 'Atomic Clash',
                      games: '8 Quests',
                      icon: '⚛️',
                      query: 'Start an Atomic Clash quiz on electron shells and atomic numbers!',
                    },
                    {
                      title: 'Python Sandbox',
                      games: '14 Quests',
                      icon: '🐍',
                      query: 'Launch a Python experiment on for-loops and list slicing!',
                    },
                    {
                      title: 'Math Odyssey',
                      games: '9 Quests',
                      icon: '📐',
                      query: 'Give me a quick 2-minute micro-challenge on quadratic equations!',
                    },
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s.query)}
                      className="cerebro-card rounded-2xl p-3.5 text-left flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#231238] border border-[#3D2061] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                        {s.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate group-hover:text-pink-300 transition-colors">
                          {s.title}
                        </p>
                        <p className="text-[10px] text-slate-400">{s.games}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Games / Quests */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">
                    Recommended Quests
                  </h3>
                  <span className="text-[11px] text-pink-400 font-bold flex items-center gap-1 cursor-pointer hover:underline">
                    See all <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      title: 'Grammar Galaxy',
                      subject: 'English Vocabulary',
                      questions: '20 Quests',
                      gradient: 'from-purple-900 to-indigo-950',
                      query: 'Start Grammar Galaxy game on context clues and idioms!',
                    },
                    {
                      title: 'Astrology Pursuit',
                      subject: 'Physics & Astronomy',
                      questions: '16 Quests',
                      gradient: 'from-pink-900 to-rose-950',
                      query: 'Start Astrology Pursuit quiz on planetary gravity and orbits!',
                    },
                  ].map((g, idx) => (
                    <div
                      key={idx}
                      className="cerebro-card rounded-2xl p-3.5 flex flex-col justify-between space-y-3 border border-[#331C54]"
                    >
                      <div
                        className={`h-20 rounded-xl bg-gradient-to-tr ${g.gradient} flex items-center justify-center p-2 border border-white/10`}
                      >
                        <Flame className="w-7 h-7 text-pink-400 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-200">{g.title}</p>
                        <p className="text-[10px] text-slate-400">{g.subject}</p>
                      </div>
                      <button
                        onClick={() => handleSend(g.query)}
                        className="w-full py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-glow-pink hover:opacity-95 transition-all"
                      >
                        Play Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Full Interactive Chat & Experiment Stream */
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#25153E]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  Grade {profile.grade}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#261542] text-purple-300 border border-[#442372]">
                  {profile.group}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Mood: {profile.mood}
                </span>
              </div>

              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 transition-colors"
                  title="Clear Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 mx-auto flex items-center justify-center text-white shadow-glow-pink">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Ask Curio Anything</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Powered by your local Ollama engine. Request code experiments, conceptual quizzes,
                  or step-by-step problem breakdowns.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLastAssistantMessage={
                    index === messages.length - 1 && msg.sender === 'assistant'
                  }
                  onQuickReply={handleQuickReply}
                  onExperimentComplete={handleExperimentComplete}
                  isLoading={isLoading && index === messages.length - 1}
                />
              ))
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-pink-400 text-xs italic ml-11 my-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                Ollama is synthesizing your adaptive response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar at bottom */}
      <div className="p-3 md:p-4 border-t border-[#25153E] bg-[#10081C]">
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
                ? `Ask Curio about ${profile.courses.join(', ') || 'your subjects'} or ask for an experiment...`
                : '📶 Offline Continuity Mode — question saved for sync'
            }
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-2xl border border-[#321C52] bg-[#180E2B] text-slate-100 placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-pink-500 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl hover:opacity-95 disabled:opacity-40 transition-all shadow-glow-pink cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
