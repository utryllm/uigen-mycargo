'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  SandpackProvider,
  SandpackPreview,
  SandpackThemeProvider,
} from '@codesandbox/sandpack-react';
import { Loader2, AlertCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import Link from 'next/link';

interface Screen {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface ExportData {
  screens: Screen[];
  metadata: {
    createdAt: string;
    screenCount: number;
  };
}

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

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  useEffect(() => {
    const fetchExport = async () => {
      try {
        const response = await fetch(`/api/export?id=${id}`);
        if (!response.ok) {
          throw new Error('Export not found');
        }
        const exportData = await response.json();
        setData(exportData);
      } catch {
        setError('This prototype could not be found or has expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchExport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C41230] mx-auto mb-4" />
          <p className="text-sm text-[#666666]">Loading prototype...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#DC3545]" />
          </div>
          <h1 className="text-xl font-semibold text-[#333333] mb-2">
            Prototype Not Found
          </h1>
          <p className="text-sm text-[#666666] mb-6">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Create New Prototype
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeScreen = data.screens[activeScreenIndex];
  const files = {
    '/styles.css': `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F5F5; }
`,
    '/App.tsx': `
import './styles.css';
${activeScreen.code}
`,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#666666] hover:text-[#333333]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-[#333333]">
                {activeScreen.name}
              </h1>
              <p className="text-xs text-[#666666]">
                Screen {activeScreenIndex + 1} of {data.screens.length}
              </p>
            </div>
          </div>

          {/* Screen Navigation */}
          {data.screens.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveScreenIndex((i) => Math.max(0, i - 1))}
                disabled={activeScreenIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-1">
                {data.screens.map((screen, index) => (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreenIndex(index)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      index === activeScreenIndex
                        ? 'bg-[#C41230] text-white'
                        : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E0E0E0]'
                    }`}
                  >
                    {screen.name}
                  </button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setActiveScreenIndex((i) =>
                    Math.min(data.screens.length - 1, i + 1)
                  )
                }
                disabled={activeScreenIndex === data.screens.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Preview */}
      <main className="flex-1">
        <SandpackProvider
          template="react-ts"
          files={files}
          theme={SANDPACK_THEME}
          options={{
            externalResources: ['https://cdn.tailwindcss.com'],
          }}
          customSetup={{
            dependencies: {
              'lucide-react': 'latest',
            },
          }}
        >
          <SandpackThemeProvider theme={SANDPACK_THEME}>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
              style={{ height: 'calc(100vh - 65px)' }}
            />
          </SandpackThemeProvider>
        </SandpackProvider>
      </main>
    </div>
  );
}
