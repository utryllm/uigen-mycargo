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
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading UI Sim...</p>
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
