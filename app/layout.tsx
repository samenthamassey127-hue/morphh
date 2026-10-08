import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CEREBRO — Adaptive AI Quest & Study Studio',
  description:
    'Cyber-themed adaptive learning platform powered by Ollama with live Learning Fingerprint, Experiment Mode and Low-Connectivity sync.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0D0814] text-slate-100 font-sans antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
