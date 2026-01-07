'use client';

import { Code, Eye, Download, Share2, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useScreensStore } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

const MOBILE_BREAKPOINT = 768;

interface CanvasToolbarProps {
  onExport: () => void;
}

export function CanvasToolbar({ onExport }: CanvasToolbarProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { screens, activeScreenId, viewMode, setViewMode } = useScreensStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeScreen = mounted ? screens.find((s) => s.id === activeScreenId) : null;
  const currentViewMode = mounted ? viewMode : 'preview';
  const hasScreens = mounted ? screens.length > 0 : false;

  const handleCopyCode = async () => {
    if (!activeScreen?.code) return;

    await navigator.clipboard.writeText(activeScreen.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    if (!activeScreen?.code) return;

    const blob = new Blob([activeScreen.code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeScreen.name}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 bg-white border-b border-[#E0E0E0] flex-shrink-0 gap-2">
      {/* View Toggle - Segmented control style */}
      <div className="flex items-center gap-1 p-1 bg-[#F5F5F5] rounded-xl">
        <button
          onClick={() => setViewMode('preview')}
          className={cn(
            'h-8 sm:h-9 px-3 sm:px-4 flex items-center gap-1.5 sm:gap-2 rounded-lg text-sm font-medium transition-all duration-200',
            currentViewMode === 'preview'
              ? 'bg-white text-[#333333] shadow-sm'
              : 'text-[#666666] hover:text-[#333333]'
          )}
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          onClick={() => setViewMode('code')}
          className={cn(
            'h-8 sm:h-9 px-3 sm:px-4 flex items-center gap-1.5 sm:gap-2 rounded-lg text-sm font-medium transition-all duration-200',
            currentViewMode === 'code'
              ? 'bg-white text-[#333333] shadow-sm'
              : 'text-[#666666] hover:text-[#333333]'
          )}
        >
          <Code className="w-4 h-4" />
          <span className="hidden sm:inline">Code</span>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {currentViewMode === 'code' && activeScreen?.code && (
          <>
            <button
              onClick={handleCopyCode}
              className={cn(
                'h-9 sm:h-10 px-3 sm:px-4 flex items-center gap-1.5 rounded-xl text-sm font-medium transition-all duration-200',
                'text-[#666666] hover:text-[#333333] hover:bg-[#F5F5F5]',
                copied && 'text-[#28A745]'
              )}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadCode}
              className="hidden sm:flex h-10 px-4 items-center gap-1.5 rounded-xl text-sm font-medium text-[#666666] hover:text-[#333333] hover:bg-[#F5F5F5] transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </>
        )}

        {hasScreens && (
          <button
            onClick={onExport}
            className="h-9 sm:h-10 px-3 sm:px-4 flex items-center gap-1.5 rounded-xl text-sm font-medium bg-[#F5F5F5] text-[#333333] hover:bg-[#EBEBEB] transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}
      </div>
    </div>
  );
}
