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
          <div className="w-12 h-12 bg-gradient-to-br from-[#C41230] to-[#E91E63] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C41230]/20 animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p className="text-[#666666] text-sm font-medium">Loading Lumina UI...</p>
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
