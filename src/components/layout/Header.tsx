'use client';

import { useState, useEffect } from 'react';
import { Settings, Github } from 'lucide-react';
import { useSettingsStore } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

const MOBILE_BREAKPOINT = 768;

// Custom Protofy Logo - Abstract "P" made of connecting nodes/prototype blocks
function ProtofyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main P shape with nodes */}
      <rect x="8" y="6" width="6" height="6" rx="1.5" fill="white" />
      <rect x="18" y="6" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.9" />
      <rect x="18" y="13" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="8" y="13" width="6" height="6" rx="1.5" fill="white" />
      <rect x="8" y="20" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.8" />

      {/* Connection lines */}
      <path d="M14 9H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M11 12V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M14 16H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M11 19V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M21 12V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

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
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Logo */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/25">
            <ProtofyLogo className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          {/* Brand Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
              Protofy
            </span>

            {/* Separator & Tagline */}
            {!isMobile && (
              <>
                <div className="w-px h-5 bg-[#E0E0E0]" />
                <span className="text-sm text-[#666666] font-medium">
                  Describe it. See it. Ship it.
                </span>
              </>
            )}
          </div>
        </div>
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
              : 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-90 shadow-sm'
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
