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
    const errors = sandpack.errors;
    if (errors && errors.length > 0 && !dismissed) {
      // Get the first error message
      const errorMessage = errors.map(e => e.message).join('\n');
      setError(errorMessage);
    } else if (!errors || errors.length === 0) {
      setError(null);
      setDismissed(false);
    }
  }, [sandpack.errors, dismissed]);

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
