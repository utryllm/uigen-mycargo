'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SandpackProvider,
  SandpackPreview,
} from '@codesandbox/sandpack-react';

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

function PreviewContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string | null>(null);
  const [name, setName] = useState<string>('Preview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get code from URL hash first (encoded in base64)
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = JSON.parse(atob(hash));
        if (decoded.code) {
          setCode(decoded.code);
          setName(decoded.name || 'Preview');
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.log('Failed to decode hash:', e);
      }
    }

    // Fallback: try localStorage with retries
    let attempts = 0;
    const maxAttempts = 10;

    const checkLocalStorage = () => {
      const storedCode = localStorage.getItem('protofy-preview-code');
      const storedName = localStorage.getItem('protofy-preview-name');

      if (storedCode) {
        setCode(storedCode);
        setName(storedName || 'Preview');
        // Clean up
        localStorage.removeItem('protofy-preview-code');
        localStorage.removeItem('protofy-preview-name');
        setIsLoading(false);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkLocalStorage, 100);
      } else {
        setIsLoading(false);
      }
    };

    checkLocalStorage();
  }, []);

  const files = useMemo(() => {
    if (!code) return null;

    let cleanCode = code;
    if (cleanCode.startsWith('```')) {
      const firstNewline = cleanCode.indexOf('\n');
      cleanCode = cleanCode.substring(firstNewline + 1);
    }
    if (cleanCode.endsWith('```')) {
      cleanCode = cleanCode.substring(0, cleanCode.lastIndexOf('```'));
    }
    cleanCode = cleanCode.trim();

    const appCode = `
import './styles.css';
${cleanCode.includes("'use client'") ? '' : "'use client';"}
${cleanCode}
`;

    return {
      ...BASE_FILES,
      '/App.tsx': appCode,
    };
  }, [code]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Preview Available</h2>
          <p className="text-gray-600 mb-4">The preview data could not be loaded. Please try again from the main app.</p>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium text-sm hover:bg-indigo-600 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toolbar - hidden when printing */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-3 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{name}</span>
          <span className="text-white/70 text-sm">• Protofy Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors"
          >
            Print / Save PDF
          </button>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Instructions - hidden when printing */}
      <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-2 text-sm text-indigo-700 print:hidden">
        <strong>To save as image:</strong> Use your browser&apos;s screenshot tool (Windows: Win+Shift+S, Mac: Cmd+Shift+4)
      </div>

      {/* Preview */}
      <div className="flex-1" id="preview-content">
        {files && (
          <SandpackProvider
            template="react-ts"
            files={files}
            options={{
              externalResources: ['https://cdn.tailwindcss.com'],
              recompileMode: 'immediate',
              autorun: true,
            }}
            customSetup={{
              dependencies: {
                'lucide-react': '0.460.0',
                'recharts': '2.13.3',
                'clsx': '2.1.1',
              },
            }}
          >
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              style={{
                height: 'calc(100vh - 100px)',
                width: '100%',
              }}
            />
          </SandpackProvider>
        )}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
