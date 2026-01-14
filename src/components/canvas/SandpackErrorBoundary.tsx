'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import { ErrorOverlay } from './ErrorOverlay';

interface SandpackErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

export function SandpackErrorBoundary({ children, onRetry }: SandpackErrorBoundaryProps) {
  const { sandpack } = useSandpack();
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Listen for Sandpack errors
  useEffect(() => {
    const sandpackError = sandpack.error;
    if (sandpackError && !dismissed) {
      // Get the error message
      setError(sandpackError.message || String(sandpackError));
    } else if (!sandpackError) {
      setError(null);
      setDismissed(false);
    }
  }, [sandpack.error, dismissed]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setError(null);
  }, []);

  const handleRetry = useCallback(() => {
    setDismissed(false);
    setError(null);
    onRetry?.();
  }, [onRetry]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {children}
      {error && !dismissed && (
        <ErrorOverlay
          error={error}
          onDismiss={handleDismiss}
          onRetry={onRetry ? handleRetry : undefined}
        />
      )}
    </div>
  );
}
