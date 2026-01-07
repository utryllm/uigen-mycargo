'use client';

import { useState, useCallback, useRef, type ReactNode, type MouseEvent } from 'react';

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

export function SplitPane({
  left,
  right,
  defaultLeftWidth = 400,
  minLeftWidth = 300,
  maxLeftWidth = 600,
}: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
