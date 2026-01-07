'use client';

import { Code, Eye, Download, Share2, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useScreensStore } from '@/lib/store';

interface CanvasToolbarProps {
  onExport: () => void;
}

export function CanvasToolbar({ onExport }: CanvasToolbarProps) {
  const [mounted, setMounted] = useState(false);
  const { screens, activeScreenId, viewMode, setViewMode } = useScreensStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        flexShrink: 0,
      }}
    >
      {/* View Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          backgroundColor: '#F5F5F5',
          borderRadius: '8px',
        }}
      >
        <button
          onClick={() => setViewMode('preview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            backgroundColor: currentViewMode === 'preview' ? 'white' : 'transparent',
            color: currentViewMode === 'preview' ? '#333333' : '#666666',
            boxShadow: currentViewMode === 'preview' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          <Eye style={{ width: '16px', height: '16px' }} />
          Preview
        </button>
        <button
          onClick={() => setViewMode('code')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            backgroundColor: currentViewMode === 'code' ? 'white' : 'transparent',
            color: currentViewMode === 'code' ? '#333333' : '#666666',
            boxShadow: currentViewMode === 'code' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          <Code style={{ width: '16px', height: '16px' }} />
          Code
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {currentViewMode === 'code' && activeScreen?.code && (
          <>
            <Button variant="ghost" size="sm" onClick={handleCopyCode}>
              {copied ? (
                <>
                  <Check style={{ width: '16px', height: '16px', marginRight: '4px', color: '#28A745' }} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                  Copy
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownloadCode}>
              <Download style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              Download
            </Button>
          </>
        )}

        {hasScreens && (
          <Button variant="secondary" size="sm" onClick={onExport}>
            <Share2 style={{ width: '16px', height: '16px', marginRight: '4px' }} />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}
