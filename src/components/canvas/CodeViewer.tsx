'use client';

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useScreensStore } from '@/lib/store';
import { Loader2, Image } from 'lucide-react';

export function CodeViewer() {
  const { screens, activeScreenId, isGenerating, streamingCode } = useScreensStore();
  const activeScreen = screens.find((s) => s.id === activeScreenId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const code = isGenerating && streamingCode ? streamingCode : activeScreen?.code || '';

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      </div>
    );
  }

  // Handle image screens - no code to show
  if (activeScreen?.type === 'image') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-center p-8">
        <div className="w-16 h-16 rounded-xl bg-[#2d2d2d] flex items-center justify-center mb-4">
          <Image className="w-8 h-8 text-[#666666]" />
        </div>
        <p className="text-sm text-[#999999] mb-2">This is an uploaded image</p>
        <p className="text-xs text-[#666666]">No code available for image screens</p>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
        <p className="text-sm text-[#666666]">No code to display</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language="typescript"
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: '"Fira Code", "Fira Mono", Consolas, monospace',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
