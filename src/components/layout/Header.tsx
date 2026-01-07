'use client';

import { useState, useEffect } from 'react';
import { Settings, Github, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSettingsStore } from '@/lib/store';

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
    <header
      style={{
        height: isMobile ? '48px' : '56px',
        minHeight: isMobile ? '48px' : '56px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        padding: isMobile ? '0 12px' : '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              backgroundColor: '#C41230',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap style={{ width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px', color: 'white' }} />
          </div>
          <span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600, color: '#333333' }}>
            UI Sim
          </span>
        </div>
        {!isMobile && (
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              backgroundColor: '#F5F5F5',
              color: '#666666',
              borderRadius: '9999px',
            }}
          >
            UI Generator
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px' }}>
        {!isMobile && (
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px',
              color: '#666666',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Github style={{ width: '20px', height: '20px' }} />
          </a>
        )}

        <Button
          variant={isKeyValid ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setIsApiKeyModalOpen(true)}
        >
          <Settings style={{ width: '16px', height: '16px', marginRight: isMobile ? '0' : '8px' }} />
          {!isMobile && (isKeyValid ? 'API Settings' : 'Add API Key')}
        </Button>
      </div>
    </header>
  );
}
