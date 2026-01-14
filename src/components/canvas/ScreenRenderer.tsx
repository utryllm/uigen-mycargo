'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import {
  SandpackProvider,
  SandpackPreview,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react';
import { useScreensStore } from '@/lib/store';
import { Loader2, MonitorSmartphone } from 'lucide-react';
import { SandpackErrorBoundary } from './SandpackErrorBoundary';

const SANDPACK_THEME = {
  colors: {
    surface1: '#ffffff',
    surface2: '#F5F5F5',
    surface3: '#E0E0E0',
    clickable: '#666666',
    base: '#333333',
    disabled: '#999999',
    hover: '#C41230',
    accent: '#C41230',
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "Fira Mono", monospace',
    size: '14px',
    lineHeight: '1.5',
  },
};

// Base files for Sandpack
const BASE_FILES = {
  '/styles.css': `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #F5F5F5;
  color: #333333;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #999;
}
`,
};

export function ScreenRenderer() {
  const [mounted, setMounted] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [sandpackKey, setSandpackKey] = useState(0);
  const lastCodeRef = useRef<string>('');

  const { screens, activeScreenId, isGenerating, streamingCode, navigateToPrototypeScreen } = useScreensStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeScreen = mounted ? screens.find((s) => s.id === activeScreenId) : null;

  // Force re-render when activeScreenId changes (e.g., prototype loads)
  useEffect(() => {
    if (mounted && activeScreenId) {
      // Small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        setSandpackKey(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mounted, activeScreenId]);

  // Listen for postMessage navigation events from Sandpack iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle navigation messages from prototype screens
      if (event.data?.type === 'NAVIGATE' && event.data.screenId) {
        const currentScreen = screens.find((s) => s.id === activeScreenId);
        if (currentScreen?.prototypeId) {
          navigateToPrototypeScreen(currentScreen.prototypeId, event.data.screenId);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeScreenId, screens, navigateToPrototypeScreen]);

  const currentIsGenerating = mounted ? isGenerating : false;
  const currentStreamingCode = mounted ? streamingCode : '';

  // Get the current code to render
  const currentCode = currentIsGenerating && currentStreamingCode
    ? currentStreamingCode
    : activeScreen?.code || '';

  // Track previous generating state to detect when generation completes
  const wasGeneratingRef = useRef(false);

  // Force Sandpack to re-render when generation completes or screen changes
  useEffect(() => {
    // Generation just completed
    if (wasGeneratingRef.current && !currentIsGenerating && currentCode) {
      setSandpackKey(prev => prev + 1);
      setRenderError(null);
      lastCodeRef.current = currentCode;
    }
    wasGeneratingRef.current = currentIsGenerating;
  }, [currentIsGenerating, currentCode]);

  // Also update when switching screens
  useEffect(() => {
    if (activeScreen?.code && activeScreen.code !== lastCodeRef.current) {
      setSandpackKey(prev => prev + 1);
      setRenderError(null);
      lastCodeRef.current = activeScreen.code;
    }
  }, [activeScreen?.code, activeScreenId]);

  // Reset error when screen changes
  useEffect(() => {
    setRenderError(null);
  }, [activeScreenId]);

  // Check if code looks complete enough to render
  const isCodeComplete = (code: string): boolean => {
    if (!code || code.length < 100) return false;

    // Must have export default
    if (!code.includes('export default')) return false;

    // Must have a return statement with JSX
    if (!code.includes('return') || !code.includes('<')) return false;

    // Check for balanced braces (rough check)
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) return false;

    // Check for balanced parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) return false;

    // Check that it doesn't end mid-statement
    const trimmed = code.trim();
    const lastChar = trimmed[trimmed.length - 1];
    if (lastChar !== '}' && lastChar !== ';' && lastChar !== ')') return false;

    return true;
  };

  const files = useMemo(() => {
    if (!currentCode || currentCode.length < 50) return null;

    // Clean up the code - remove any markdown artifacts
    let cleanCode = currentCode;
    if (cleanCode.startsWith('```')) {
      const firstNewline = cleanCode.indexOf('\n');
      cleanCode = cleanCode.substring(firstNewline + 1);
    }
    if (cleanCode.endsWith('```')) {
      cleanCode = cleanCode.substring(0, cleanCode.lastIndexOf('```'));
    }
    cleanCode = cleanCode.trim();

    // Don't render incomplete code during streaming
    if (currentIsGenerating && !isCodeComplete(cleanCode)) {
      return null;
    }

    // Wrap the component code in an App.tsx file
    const appCode = `
import './styles.css';
${cleanCode.includes("'use client'") ? '' : "'use client';"}
${cleanCode}
`;

    return {
      ...BASE_FILES,
      '/App.tsx': appCode,
    };
  }, [currentCode, currentIsGenerating]);

  // Empty state
  if (!activeScreen && !currentIsGenerating) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F5F5',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <MonitorSmartphone style={{ width: '40px', height: '40px', color: '#C41230' }} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#333333', marginBottom: '8px' }}>
          No Screen Selected
        </h3>
        <p style={{ fontSize: '14px', color: '#666666', maxWidth: '320px' }}>
          Start by describing the UI you want in the chat panel, or select an existing screen from the tabs above.
        </p>
      </div>
    );
  }

  // Image screen - display the uploaded image
  if (activeScreen?.type === 'image' && activeScreen.imageUrl) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F5F5F5',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflow: 'auto',
          }}
        >
          <img
            src={activeScreen.imageUrl}
            alt={activeScreen.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
        </div>
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'white',
            borderTop: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#333333' }}>
              {activeScreen.name}
            </p>
            <p style={{ fontSize: '12px', color: '#666666' }}>
              {activeScreen.description}
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              padding: '4px 8px',
              backgroundColor: '#F8E7EA',
              color: '#C41230',
              borderRadius: '4px',
              fontWeight: 500,
            }}
          >
            Image
          </span>
        </div>
      </div>
    );
  }

  // Loading state during generation (no code yet, or code not complete)
  if (currentIsGenerating && (!files || !currentStreamingCode)) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F5F5',
        }}
      >
        <Loader2
          style={{
            width: '32px',
            height: '32px',
            color: '#C41230',
            marginBottom: '16px',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ fontSize: '14px', color: '#666666' }}>
          {currentStreamingCode ? 'Building component...' : 'Generating your UI...'}
        </p>
        {currentStreamingCode && (
          <p style={{ fontSize: '12px', color: '#999999', marginTop: '8px' }}>
            {currentStreamingCode.length} characters received
          </p>
        )}
      </div>
    );
  }

  // Render with Sandpack
  if (!files) return null;

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {currentIsGenerating && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10,
            backgroundColor: '#C41230',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Loader2
            style={{
              width: '14px',
              height: '14px',
              animation: 'spin 1s linear infinite',
            }}
          />
          Generating...
        </div>
      )}
      <SandpackProvider
        key={`sandpack-${sandpackKey}-${activeScreenId || 'new'}`}
        template="react-ts"
        files={files}
        theme={SANDPACK_THEME}
        options={{
          externalResources: [
            'https://cdn.tailwindcss.com',
          ],
          recompileMode: 'immediate',
          recompileDelay: 100,
          autorun: true,
          autoReload: true,
        }}
        customSetup={{
          dependencies: {
            // Icons - essential and well-tested
            'lucide-react': '0.460.0',
            // Charts - commonly requested feature
            'recharts': '2.13.3',
            // Progress indicators
            'react-circular-progressbar': '2.1.0',
            // Utilities
            'clsx': '2.1.1',
          },
        }}
      >
        <SandpackThemeProvider theme={SANDPACK_THEME}>
          <SandpackErrorBoundary onRetry={() => setSandpackKey(prev => prev + 1)}>
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <SandpackPreview
                showOpenInCodeSandbox={false}
                showRefreshButton={true}
                showSandpackErrorOverlay={false}
                style={{
                  height: '100%',
                  width: '100%',
                  flex: 1,
                  minHeight: 0,
                }}
              />
            </div>
          </SandpackErrorBoundary>
        </SandpackThemeProvider>
      </SandpackProvider>
    </div>
  );
}
