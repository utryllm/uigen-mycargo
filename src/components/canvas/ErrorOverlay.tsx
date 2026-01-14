'use client';

import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, X, RefreshCw, Copy, Check } from 'lucide-react';

interface ErrorOverlayProps {
  error: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorOverlay({ error, onDismiss, onRetry }: ErrorOverlayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Parse the error to get a user-friendly message
  const getFriendlyMessage = (errorText: string): { title: string; suggestion: string } => {
    const lowerError = errorText.toLowerCase();

    if (lowerError.includes('could not find dependency') || lowerError.includes('cannot find module')) {
      const match = errorText.match(/['"]([^'"]+)['"]/);
      const packageName = match ? match[1] : 'a package';
      return {
        title: 'Missing Package',
        suggestion: `The component tried to use "${packageName}" which isn't available. Try asking for an alternative approach that uses the built-in libraries.`,
      };
    }

    if (lowerError.includes('syntaxerror') || lowerError.includes('unexpected token')) {
      return {
        title: 'Syntax Error',
        suggestion: 'There was a problem with the generated code syntax. Try regenerating or simplifying your request.',
      };
    }

    if (lowerError.includes('is not defined') || lowerError.includes('is not a function')) {
      return {
        title: 'Reference Error',
        suggestion: 'Something in the code wasn\'t properly defined. Try regenerating the component.',
      };
    }

    if (lowerError.includes('maximum call stack') || lowerError.includes('too much recursion')) {
      return {
        title: 'Infinite Loop Detected',
        suggestion: 'The component got stuck in an infinite loop. Try regenerating with a simpler design.',
      };
    }

    if (lowerError.includes('network') || lowerError.includes('fetch')) {
      return {
        title: 'Network Error',
        suggestion: 'There was a problem loading resources. Check your internet connection and try again.',
      };
    }

    return {
      title: 'Something Went Wrong',
      suggestion: 'The component couldn\'t be rendered. Try modifying your request or regenerating.',
    };
  };

  const { title, suggestion } = getFriendlyMessage(error);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed, ignore
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
          maxWidth: '420px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle style={{ width: '24px', height: '24px', color: '#DC2626' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333333', marginBottom: '4px' }}>
              {title}
            </h3>
            <p style={{ fontSize: '14px', color: '#666666', lineHeight: 1.5 }}>
              {suggestion}
            </p>
          </div>
          <button
            onClick={onDismiss}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999999',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F5';
              e.currentTarget.style.color = '#666666';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#999999';
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Actions */}
        <div
          style={{
            padding: '16px 24px',
            display: 'flex',
            gap: '12px',
          }}
        >
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#6366F1',
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4F46E5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6366F1';
              }}
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              Try Again
            </button>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              flex: onRetry ? 0 : 1,
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #E0E0E0',
              backgroundColor: 'white',
              color: '#666666',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F5';
              e.currentTarget.style.borderColor = '#CCCCCC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#E0E0E0';
            }}
          >
            {showDetails ? (
              <>
                Hide Details
                <ChevronUp style={{ width: '16px', height: '16px' }} />
              </>
            ) : (
              <>
                View Details
                <ChevronDown style={{ width: '16px', height: '16px' }} />
              </>
            )}
          </button>
        </div>

        {/* Error Details */}
        {showDetails && (
          <div
            style={{
              padding: '0 24px 20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#F8F8F8',
                borderRadius: '8px',
                border: '1px solid #E0E0E0',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#F0F0F0',
                  borderBottom: '1px solid #E0E0E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Error Details
                </span>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: copied ? '#28A745' : '#666666',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!copied) e.currentTarget.style.backgroundColor = '#E0E0E0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {copied ? (
                    <>
                      <Check style={{ width: '12px', height: '12px' }} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy style={{ width: '12px', height: '12px' }} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre
                style={{
                  padding: '12px',
                  margin: 0,
                  fontSize: '12px',
                  fontFamily: '"Fira Code", "Fira Mono", Consolas, monospace',
                  color: '#DC2626',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '200px',
                  overflow: 'auto',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
