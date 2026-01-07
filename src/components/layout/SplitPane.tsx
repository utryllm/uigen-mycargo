'use client';

import { useState, useCallback, useRef, useEffect, type ReactNode, type MouseEvent } from 'react';
import { MessageSquare, Monitor } from 'lucide-react';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

const MOBILE_BREAKPOINT = 768;

export function SplitPane({
  left,
  right,
  defaultLeftWidth = 400,
  minLeftWidth = 300,
  maxLeftWidth = 600,
}: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'canvas'>('chat');
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;

      if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
        setLeftWidth(newLeftWidth);
      }
    },
    [isDragging, minLeftWidth, maxLeftWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mobile layout with tabs
  if (isMobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Mobile Tab Bar */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E0E0E0',
            backgroundColor: 'white',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              flex: 1,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'chat' ? '#FAFAFA' : 'white',
              borderBottom: activeTab === 'chat' ? '2px solid #C41230' : '2px solid transparent',
              color: activeTab === 'chat' ? '#C41230' : '#666666',
              fontWeight: activeTab === 'chat' ? 600 : 400,
              fontSize: '14px',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
            }}
          >
            <MessageSquare style={{ width: '18px', height: '18px' }} />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            style={{
              flex: 1,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'canvas' ? '#FAFAFA' : 'white',
              borderBottom: activeTab === 'canvas' ? '2px solid #C41230' : '2px solid transparent',
              color: activeTab === 'canvas' ? '#C41230' : '#666666',
              fontWeight: activeTab === 'canvas' ? 600 : 400,
              fontSize: '14px',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
            }}
          >
            <Monitor style={{ width: '18px', height: '18px' }} />
            Canvas
          </button>
        </div>

        {/* Mobile Content */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: activeTab === 'chat' ? 'block' : 'none',
          }}
        >
          {left}
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: activeTab === 'canvas' ? 'block' : 'none',
          }}
        >
          {right}
        </div>
      </div>
    );
  }

  // Desktop layout with resizable split pane
  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Panel */}
      <div
        style={{
          width: `${leftWidth}px`,
          minWidth: `${leftWidth}px`,
          maxWidth: `${leftWidth}px`,
          height: '100%',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {left}
      </div>

      {/* Resize Handle */}
      <div
        style={{
          width: '4px',
          minWidth: '4px',
          height: '100%',
          backgroundColor: isDragging ? '#C41230' : '#E0E0E0',
          cursor: 'col-resize',
          flexShrink: 0,
          transition: 'background-color 0.15s ease',
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          if (!isDragging) {
            (e.target as HTMLDivElement).style.backgroundColor = '#C41230';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            (e.target as HTMLDivElement).style.backgroundColor = '#E0E0E0';
          }
        }}
      />

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {right}
      </div>
    </div>
  );
}
