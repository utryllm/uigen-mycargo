'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Image, Code } from 'lucide-react';
import { useScreensStore } from '@/lib/store';
import { cn } from '@/lib/utils/cn';

const MOBILE_BREAKPOINT = 768;

export function ScreenTabs() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { screens, activeScreenId, setActiveScreen, deleteScreen } = useScreensStore();

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render on server or before hydration
  if (!mounted || screens.length === 0) return null;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 bg-[#F5F5F5] border-b border-[#E0E0E0] overflow-x-auto flex-shrink-0 [-webkit-overflow-scrolling:touch]">
      {screens.map((screen) => {
        const isActive = activeScreenId === screen.id;
        return (
          <div
            key={screen.id}
            onClick={() => setActiveScreen(screen.id)}
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-lg text-xs sm:text-sm cursor-pointer transition-all duration-200 flex-shrink-0',
              isActive
                ? 'bg-white text-[#333333] shadow-sm font-medium'
                : 'text-[#666666] hover:text-[#333333] hover:bg-white/50'
            )}
          >
            {screen.type === 'image' ? (
              <Image className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <Code className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px] sm:max-w-[120px]">
              {screen.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteScreen(screen.id);
              }}
              className="w-5 h-5 flex items-center justify-center rounded text-[#999999] hover:text-[#666666] hover:bg-[#F0F0F0] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}

      <button
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#666666] hover:text-[#333333] hover:bg-white/50 rounded-lg transition-colors flex-shrink-0"
        title="New screen"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
