'use client';

import { useState, useEffect } from 'react';
import { Header, SplitPane } from '@/components/layout';
import { ChatPanel, ApiKeyModal } from '@/components/chat';
import { CanvasPanel } from '@/components/canvas';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAFA] to-[#F0F0F0]">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#6366F1]/25 animate-pulse">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <rect x="8" y="6" width="6" height="6" rx="1.5" fill="white" />
              <rect x="18" y="6" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.9" />
              <rect x="18" y="13" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.7" />
              <rect x="8" y="13" width="6" height="6" rx="1.5" fill="white" />
              <rect x="8" y="20" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.8" />
              <path d="M14 9H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M11 12V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M14 16H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M11 19V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M21 12V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <p className="text-[#666666] text-sm font-medium">Loading Protofy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-row overflow-hidden">
        <SplitPane
          left={<ChatPanel />}
          right={<CanvasPanel />}
          defaultLeftWidth={400}
          minLeftWidth={320}
          maxLeftWidth={600}
        />
      </main>
      <ApiKeyModal />
    </div>
  );
}
