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
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-6 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C41230] to-[#E91E63] rounded-xl flex items-center justify-center mb-4 shadow-md">
          <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-[#333333] mb-1.5">
          Start Building Your UI
        </h3>
        <p className="text-[13px] text-[#666666] max-w-[280px] mb-5">
          Describe the interface you want to create, and I'll generate it for you.
        </p>
        <div className="w-full max-w-[280px]">
          <p className="text-[10px] font-semibold text-[#999999] uppercase tracking-wider mb-2">
            Try saying:
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              'Create a dashboard with user metrics',
              'Build an orders table with filters',
              'Design a login form with validation',
            ].map((suggestion) => (
              <div
                key={suggestion}
                className="px-3 py-2 bg-[#F5F5F5] hover:bg-[#EEEEEE] rounded-lg text-[12px] sm:text-[13px] text-[#555555] transition-colors cursor-default text-left"
              >
                "{suggestion}"
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
      {displayMessages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 sm:gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {/* Avatar */}
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
              message.role === 'user'
                ? 'bg-[#C41230] text-white'
                : 'bg-[#F0F0F0] text-[#666666]'
            }`}
          >
            {message.role === 'user' ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>

          {/* Message Content */}
          <div
            className={`max-w-[80%] sm:max-w-[75%] rounded-xl px-3 py-2 ${
              message.role === 'user'
                ? 'bg-[#C41230] text-white rounded-br-sm'
                : 'bg-white border border-[#E5E5E5] text-[#333333] rounded-bl-sm shadow-sm'
            }`}
          >
            <p className="text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
            {message.isStreaming && (
              <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] opacity-70">
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating...
              </span>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-[#666666]" />
          </div>
          <div className="bg-white border border-[#E5E5E5] rounded-xl rounded-bl-sm px-3 py-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 text-[#666666] animate-spin" />
              <span className="text-[13px] text-[#666666]">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
