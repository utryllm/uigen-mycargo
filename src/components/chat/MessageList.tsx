'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Bot, Loader2 } from 'lucide-react';
import { useChatStore } from '@/lib/store';

export function MessageList() {
  const [mounted, setMounted] = useState(false);
  const { messages, isLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show empty state on server and initial client render
  const displayMessages = mounted ? messages : [];

  if (displayMessages.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#F5F5F5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Bot style={{ width: '32px', height: '32px', color: '#666666' }} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#333333', marginBottom: '8px' }}>
          Start Building Your UI
        </h3>
        <p style={{ fontSize: '14px', color: '#666666', maxWidth: '280px' }}>
          Describe the interface you want to create, and I will generate it for you in real-time.
        </p>
        <div style={{ marginTop: '24px', textAlign: 'left' }}>
          <p style={{ fontSize: '12px', color: '#999999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Try saying:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Create a dashboard with user metrics',
              'Build an orders table with filters',
              'Design a login form with validation',
            ].map((suggestion) => (
              <div
                key={suggestion}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#666666',
                }}
              >
                &quot;{suggestion}&quot;
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {displayMessages.map((message) => (
        <div
          key={message.id}
          style={{
            display: 'flex',
            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            gap: '12px',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: message.role === 'user' ? '#C41230' : '#F5F5F5',
              color: message.role === 'user' ? 'white' : '#666666',
            }}
          >
            {message.role === 'user' ? (
              <User style={{ width: '16px', height: '16px' }} />
            ) : (
              <Bot style={{ width: '16px', height: '16px' }} />
            )}
          </div>

          {/* Message Content */}
          <div
            style={{
              maxWidth: '80%',
              borderRadius: '8px',
              padding: '8px 16px',
              backgroundColor: message.role === 'user' ? '#C41230' : 'white',
              color: message.role === 'user' ? 'white' : '#333333',
              border: message.role === 'user' ? 'none' : '1px solid #E0E0E0',
            }}
          >
            <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', margin: 0 }}>
              {message.content}
            </p>
            {message.isStreaming && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '12px', opacity: 0.7 }}>Generating...</span>
              </span>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot style={{ width: '16px', height: '16px', color: '#666666' }} />
          </div>
          <div
            style={{
              backgroundColor: 'white',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              padding: '8px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 style={{ width: '16px', height: '16px', color: '#666666', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '14px', color: '#666666' }}>Thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
