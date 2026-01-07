'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Image, Code } from 'lucide-react';
import { useScreensStore } from '@/lib/store';

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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '2px' : '4px',
        padding: isMobile ? '4px 4px' : '4px 8px',
        backgroundColor: '#F5F5F5',
        borderBottom: '1px solid #E0E0E0',
        overflowX: 'auto',
        flexShrink: 0,
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {screens.map((screen) => {
        const isActive = activeScreenId === screen.id;
        return (
          <div
            key={screen.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '4px' : '8px',
              padding: isMobile ? '4px 8px' : '6px 12px',
              borderRadius: isActive ? '4px 4px 0 0' : '4px',
              fontSize: isMobile ? '12px' : '14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              backgroundColor: isActive ? 'white' : 'transparent',
              color: isActive ? '#333333' : '#666666',
              borderTop: isActive ? '1px solid #E0E0E0' : 'none',
              borderLeft: isActive ? '1px solid #E0E0E0' : 'none',
              borderRight: isActive ? '1px solid #E0E0E0' : 'none',
              marginBottom: isActive ? '-1px' : '0',
              flexShrink: 0,
            }}
            onClick={() => setActiveScreen(screen.id)}
          >
            {screen.type === 'image' ? (
              <Image style={{ width: isMobile ? '12px' : '14px', height: isMobile ? '12px' : '14px', flexShrink: 0 }} />
            ) : (
              <Code style={{ width: isMobile ? '12px' : '14px', height: isMobile ? '12px' : '14px', flexShrink: 0 }} />
            )}
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: isMobile ? '80px' : '120px',
              }}
            >
              {screen.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteScreen(screen.id);
              }}
              style={{
                padding: '2px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666666',
              }}
            >
              <X style={{ width: isMobile ? '10px' : '12px', height: isMobile ? '10px' : '12px' }} />
            </button>
          </div>
        );
      })}

      <button
        style={{
          padding: isMobile ? '4px' : '6px',
          color: '#666666',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        title="New screen"
      >
        <Plus style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px' }} />
      </button>
    </div>
  );
}
