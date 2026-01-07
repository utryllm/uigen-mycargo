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

  const displayMessages = mounted ? messages : [];

  if (displayMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#C41230] to-[#E91E63] rounded-2xl flex items-center justify-center mb-5 shadow-lg">
          <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-[#333333] mb-2">
          Start Building Your UI
        </h3>
        <p className="text-sm text-[#666666] max-w-[300px] mb-6">
          Describe the interface you want to create, and I will generate it for you in real-time.
        </p>
        <div className="w-full max-w-[320px]">
          <p className="text-xs font-semibold text-[#999999] uppercase tracking-wider mb-3">
            Try saying:
          </p>
          <div className="flex flex-col gap-2">
            {[
              'Create a dashboard with user metrics',
              'Build an orders table with filters',
              'Design a login form with validation',
            ].map((suggestion) => (
              <div
                key={suggestion}
                className="px-4 py-3 bg-[#F5F5F5] hover:bg-[#EEEEEE] rounded-xl text-sm text-[#555555] transition-colors cursor-default text-left"
              >
                &ldquo;{suggestion}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
      {displayMessages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {/* Avatar */}
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
              message.role === 'user'
                ? 'bg-[#C41230] text-white'
                : 'bg-[#F0F0F0] text-[#666666]'
            }`}
          >
            {message.role === 'user' ? (
              <User className="w-5 h-5" />
            ) : (
              <Bot className="w-5 h-5" />
            )}
          </div>

          {/* Message Content */}
          <div
            className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-[#C41230] text-white rounded-br-md'
                : 'bg-white border border-[#E0E0E0] text-[#333333] rounded-bl-md shadow-sm'
            }`}
          >
            <p className="text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            {message.isStreaming && (
              <span className="inline-flex items-center gap-1.5 mt-2 text-xs opacity-75">
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating...
              </span>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-[#666666]" />
          </div>
          <div className="bg-white border border-[#E0E0E0] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#666666] animate-spin" />
              <span className="text-sm text-[#666666]">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
