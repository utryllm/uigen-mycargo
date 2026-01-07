'use client';

import { useState, useEffect } from 'react';
import { Settings, Github, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSettingsStore } from '@/lib/store';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { setIsApiKeyModalOpen, hasValidKey } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isKeyValid = mounted ? hasValidKey() : false;

  return (
    <header
      style={{
        height: '56px',
        minHeight: '56px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#C41230',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 600, color: '#333333' }}>
            UI Sim
          </span>
        </div>
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
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        <Button
          variant={isKeyValid ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setIsApiKeyModalOpen(true)}
        >
          <Settings style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          {isKeyValid ? 'API Settings' : 'Add API Key'}
        </Button>
      </div>
    </header>
  );
}
