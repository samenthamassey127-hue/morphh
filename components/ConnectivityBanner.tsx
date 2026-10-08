'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Wifi, WifiOff, RefreshCw, CloudOff, Cpu } from 'lucide-react';
import { getOfflineQueue, markQueueSynced } from '@/lib/storage';

interface ConnectivityBannerProps {
  onOllamaStatusChange?: (ok: boolean) => void;
}

type Status = 'checking' | 'online' | 'offline' | 'no-ollama';

export default function ConnectivityBanner({ onOllamaStatusChange }: ConnectivityBannerProps) {
  const [status, setStatus] = useState<Status>('checking');
  const [modelName, setModelName] = useState<string>('llama3.2:1b');
  const [pendingSync, setPendingSync] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);

  const checkStatus = useCallback(async () => {
    if (!navigator.onLine) {
      setStatus('offline');
      onOllamaStatusChange?.(false);
      return;
    }
    try {
      const res = await fetch('/api/ollama-status', { cache: 'no-store' });
      const json = await res.json();
      if (json.ok) {
        setStatus('online');
        setModelName(json.model || 'llama3.2:1b');
        onOllamaStatusChange?.(true);
      } else {
        setStatus('no-ollama');
        onOllamaStatusChange?.(false);
      }
    } catch {
      setStatus('offline');
      onOllamaStatusChange?.(false);
    }
    setPendingSync(getOfflineQueue().filter((q) => !q.synced).length);
  }, [onOllamaStatusChange]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkStatus);
      window.removeEventListener('offline', checkStatus);
    };
  }, [checkStatus]);

  const handleSync = async () => {
    setSyncing(true);
    const queue = getOfflineQueue();
    const count = queue.filter((q) => !q.synced).length;
    await new Promise((r) => setTimeout(r, 1200));
    markQueueSynced();
    setPendingSync(0);
    setSyncedCount(count);
    setSyncing(false);
    setTimeout(() => setSyncedCount(null), 3000);
  };

  if (status === 'checking') return null;

  if (status === 'online') {
    return (
      <div className="px-4 py-1.5 bg-[#140A22] border-b border-[#2C184A] text-xs font-semibold flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> Ollama Active:
          </span>
          <span className="font-mono text-[11px] text-pink-300 bg-[#24133C] px-2 py-0.5 rounded-full border border-[#442270]">
            {modelName}
          </span>
        </div>

        {syncedCount != null ? (
          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
            <Wifi className="w-3.5 h-3.5" /> Synced {syncedCount} offline quest{syncedCount === 1 ? '' : 's'} ✓
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Continuity Mode Ready · Zero Cloud Latency
          </span>
        )}
      </div>
    );
  }

  if (status === 'no-ollama') {
    return (
      <div className="px-4 py-2 bg-amber-950/80 border-b border-amber-600/40 text-amber-200 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Local Ollama server paused. Run <code className="bg-amber-900/60 px-1.5 py-0.5 rounded font-mono text-amber-200">ollama serve</code> to activate AI inference.
          </span>
        </div>
      </div>
    );
  }

  // offline
  return (
    <div className="px-4 py-2 bg-[#251020] border-b border-rose-500/40 text-rose-200 text-xs font-medium flex items-center justify-between">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
        <span>
          📶 <strong>Low-Connectivity Continuity Mode:</strong> Working offline with cached curriculum.
          {pendingSync > 0 && (
            <span className="ml-1 text-pink-300 font-bold">
              ({pendingSync} activities saved locally)
            </span>
          )}
        </span>
      </div>
      {pendingSync > 0 && navigator.onLine && (
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-glow-pink disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      )}
    </div>
  );
}
