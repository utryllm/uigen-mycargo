'use client';

import { useState, useEffect } from 'react';
import { Settings, Github, Zap } from 'lucide-react';
import { useSettingsStore } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

const MOBILE_BREAKPOINT = 768;

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setIsApiKeyModalOpen, hasValidKey } = useSettingsStore();

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isKeyValid = mounted ? hasValidKey() : false;

  return (
    <header className="h-14 sm:h-16 min-h-14 sm:min-h-16 bg-white border-b border-[#E0E0E0] px-3 sm:px-5 flex items-center justify-between flex-shrink-0">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#C41230] rounded-xl flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-semibold text-[#333333]">
            UI Sim
          </span>
        </div>
        {!isMobile && (
          <span className="text-xs px-2.5 py-1 bg-[#F5F5F5] text-[#666666] rounded-full font-medium">
            UI Generator
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!isMobile && (
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 flex items-center justify-center text-[#666666] hover:text-[#333333] hover:bg-[#F5F5F5] rounded-xl transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        )}

        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className={cn(
            'h-10 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200',
            isKeyValid
              ? 'bg-[#F5F5F5] text-[#333333] hover:bg-[#EBEBEB]'
              : 'bg-[#C41230] text-white hover:bg-[#A30F28] shadow-sm'
          )}
        >
          <Settings className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          {!isMobile && (
            <span>{isKeyValid ? 'API Settings' : 'Add API Key'}</span>
          )}
        </button>
      </div>
    </header>
  );
}
