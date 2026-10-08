'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import ConnectivityBanner from '@/components/ConnectivityBanner';
import { StudentProfile, LearningFingerprint } from '@/lib/types';
import { getStoredProfile, saveStoredProfile, getFingerprint } from '@/lib/storage';

export default function Home() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [fingerprint, setFingerprint] = useState<LearningFingerprint | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setProfile(getStoredProfile());
    setFingerprint(getFingerprint());
  }, []);

  const handleProfileChange = (updated: StudentProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleFingerprintUpdate = useCallback((fp: LearningFingerprint) => {
    setFingerprint(fp);
  }, []);

  if (!profile || !fingerprint) return null;

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Connectivity / Ollama status banner */}
      <ConnectivityBanner onOllamaStatusChange={setIsOnline} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full">
          <Sidebar
            profile={profile}
            onChange={handleProfileChange}
            fingerprint={fingerprint}
          />
        </div>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/50 backdrop-blur-sm">
            <div className="w-80 h-full bg-white dark:bg-slate-900 shadow-xl">
              <Sidebar
                profile={profile}
                onChange={handleProfileChange}
                fingerprint={fingerprint}
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main Chat */}
        <ChatWindow
          profile={profile}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          isOnline={isOnline}
          onFingerprintUpdate={handleFingerprintUpdate}
        />
      </div>
    </main>
  );
}
