'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Image, Code } from 'lucide-react';
import { useScreensStore } from '@/lib/store';

export function ScreenTabs() {
  const [mounted, setMounted] = useState(false);
  const { screens, activeScreenId, setActiveScreen, deleteScreen } = useScreensStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or before hydration
  if (!mounted || screens.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        backgroundColor: '#F5F5F5',
        borderBottom: '1px solid #E0E0E0',
        overflowX: 'auto',
        flexShrink: 0,
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
              gap: '8px',
              padding: '6px 12px',
              borderRadius: isActive ? '4px 4px 0 0' : '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              backgroundColor: isActive ? 'white' : 'transparent',
              color: isActive ? '#333333' : '#666666',
              borderTop: isActive ? '1px solid #E0E0E0' : 'none',
              borderLeft: isActive ? '1px solid #E0E0E0' : 'none',
              borderRight: isActive ? '1px solid #E0E0E0' : 'none',
              marginBottom: isActive ? '-1px' : '0',
            }}
            onClick={() => setActiveScreen(screen.id)}
          >
            {screen.type === 'image' ? (
              <Image style={{ width: '14px', height: '14px', flexShrink: 0 }} />
            ) : (
              <Code style={{ width: '14px', height: '14px', flexShrink: 0 }} />
            )}
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '120px',
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
              <X style={{ width: '12px', height: '12px' }} />
            </button>
          </div>
        );
      })}

      <button
        style={{
          padding: '6px',
          color: '#666666',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="New screen"
      >
        <Plus style={{ width: '16px', height: '16px' }} />
      </button>
    </div>
  );
}
