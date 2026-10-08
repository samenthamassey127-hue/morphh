'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import { StudentProfile } from '@/lib/types';
import { getStoredProfile, saveStoredProfile } from '@/lib/storage';

export default function Home() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const loaded = getStoredProfile();
    setProfile(loaded);
  }, []);

  const handleProfileChange = (updated: StudentProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
  };

  if (!profile) return null;

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar profile={profile} onChange={handleProfileChange} />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/50 backdrop-blur-sm">
          <div className="w-80 h-full bg-white dark:bg-slate-900 shadow-xl">
            <Sidebar
              profile={profile}
              onChange={handleProfileChange}
              isOpen={mobileSidebarOpen}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Chat Area */}
      <ChatWindow
        profile={profile}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      />
    </main>
  );
}
