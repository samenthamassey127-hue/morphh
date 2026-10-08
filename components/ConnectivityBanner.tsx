'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Wifi, WifiOff, RefreshCw, CloudOff } from 'lucide-react';
import { getOfflineQueue, markQueueSynced } from '@/lib/storage';

interface ConnectivityBannerProps {
  onOllamaStatusChange?: (ok: boolean) => void;
}

type Status = 'checking' | 'online' | 'offline' | 'no-ollama';

export default function ConnectivityBanner({ onOllamaStatusChange }: ConnectivityBannerProps) {
  const [status, setStatus] = useState<Status>('checking');
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
    // Simulate sync (in production, POST each item to the server)
    await new Promise((r) => setTimeout(r, 1200));
    markQueueSynced();
    setPendingSync(0);
    setSyncedCount(count);
    setSyncing(false);
    setTimeout(() => setSyncedCount(null), 3000);
  };

  if (status === 'checking') return null;

  if (status === 'online') {
    return syncedCount != null ? (
      <div className="px-4 py-2 bg-emerald-500 text-white text-xs font-medium flex items-center gap-2 animate-pulse">
        <Wifi className="w-3.5 h-3.5" />
        Synced {syncedCount} completed {syncedCount === 1 ? 'activity' : 'activities'} ✓
      </div>
    ) : null;
  }

  if (status === 'no-ollama') {
    return (
      <div className="px-4 py-2 bg-amber-500 text-white text-xs font-medium flex items-center gap-2">
        <CloudOff className="w-3.5 h-3.5 shrink-0" />
        <span>
          Ollama not detected. Run <code className="bg-amber-600/50 px-1 rounded">ollama serve</code> and make sure{' '}
          <code className="bg-amber-600/50 px-1 rounded">llama3</code> is pulled.
        </span>
      </div>
    );
  }

  // offline
  return (
    <div className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-2">
      <WifiOff className="w-3.5 h-3.5 shrink-0 text-rose-400" />
      <span className="flex-1">
        📶 <strong>Low-Connectivity Mode</strong> — Using cached lessons. Progress saved locally.
        {pendingSync > 0 && (
          <span className="ml-1 text-amber-300">
            ({pendingSync} {pendingSync === 1 ? 'activity' : 'activities'} pending sync)
          </span>
        )}
      </span>
      {pendingSync > 0 && navigator.onLine && (
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing…' : 'Sync now'}
        </button>
      )}
    </div>
  );
}
