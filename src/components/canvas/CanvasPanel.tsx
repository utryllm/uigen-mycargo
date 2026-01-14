'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScreenTabs } from './ScreenTabs';
import { CanvasToolbar } from './CanvasToolbar';
import { ScreenRenderer } from './ScreenRenderer';
import { CodeViewer } from './CodeViewer';
import { useScreensStore } from '@/lib/store';
import { Modal, Button } from '@/components/ui';
import { Copy, Check, ExternalLink } from 'lucide-react';

export function CanvasPanel() {
  const [mounted, setMounted] = useState(false);
  const { screens, viewMode, activeScreenId } = useScreensStore();
  const [exportModal, setExportModal] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeScreen = screens.find((s) => s.id === activeScreenId);

  // Open preview in new window for screenshot capture
  const handleDownloadImage = useCallback(async () => {
    if (!activeScreen?.code) return;

    setIsCapturing(true);

    try {
      // Call API to generate standalone HTML
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeScreen.code,
          name: activeScreen.name || 'Screen',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      // Get the HTML content
      const html = await response.text();

      // Create a blob URL for the HTML
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Open in new window
      const popup = window.open(
        url,
        '_blank',
        'width=1280,height=900,menubar=no,toolbar=no,location=no,status=no'
      );

      if (popup) {
        popup.focus();
        // Clean up blob URL after window loads
        popup.onload = () => {
          URL.revokeObjectURL(url);
        };
      } else {
        URL.revokeObjectURL(url);
        alert('Please allow popups for this site to open the preview.');
      }
    } catch (error) {
      console.error('Preview failed:', error);
      // Fallback to manual instructions
      alert(
        'Screenshot Preview\n\n' +
        'Failed to open preview. Please use your system screenshot tool:\n\n' +
        '• Windows: Press Win + Shift + S\n' +
        '• Mac: Press Cmd + Shift + 4\n\n' +
        'Then select the preview area to capture.'
      );
    } finally {
      setIsCapturing(false);
    }
  }, [activeScreen?.code, activeScreen?.name]);

  const handleExport = async () => {
    if (screens.length === 0) return;

    setIsExporting(true);
    setExportModal(true);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screens: screens.map((s) => ({
            id: s.id,
            name: s.name,
            code: s.code,
            description: s.description,
          })),
          metadata: {
            createdAt: new Date().toISOString(),
            screenCount: screens.length,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExportUrl(data.url);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!exportUrl) return;
    await navigator.clipboard.writeText(exportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentViewMode = mounted ? viewMode : 'preview';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      <ScreenTabs />
      <CanvasToolbar
        onExport={handleExport}
        onDownloadImage={handleDownloadImage}
        isCapturing={isCapturing}
      />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {currentViewMode === 'preview' ? <ScreenRenderer /> : <CodeViewer />}
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={exportModal}
        onClose={() => {
          setExportModal(false);
          setExportUrl(null);
          setCopied(false);
        }}
        title="Export Prototype"
        size="md"
      >
        {isExporting ? (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid #6366F1',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ fontSize: '14px', color: '#666666' }}>Creating shareable link...</p>
          </div>
        ) : exportUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#666666', marginBottom: '8px' }}>Shareable Link</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={exportUrl}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: '1px solid #E0E0E0',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
                <Button variant="secondary" size="sm" onClick={handleCopyUrl}>
                  {copied ? <Check style={{ width: '16px', height: '16px' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
                </Button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setExportModal(false);
                  setExportUrl(null);
                }}
              >
                Close
              </Button>
              <Button onClick={() => window.open(exportUrl, '_blank')}>
                <ExternalLink style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Open Preview
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#DC3545' }}>Failed to create export. Please try again.</p>
            <Button
              variant="secondary"
              style={{ marginTop: '16px' }}
              onClick={() => setExportModal(false)}
            >
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
