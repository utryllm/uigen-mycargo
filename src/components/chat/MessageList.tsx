'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Bot, Loader2, Wand2, ArrowRight, Layers, Table, FormInput } from 'lucide-react';
import { useChatStore } from '@/lib/store';

interface QuickPromptProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

function QuickPrompt({ icon, text, onClick }: QuickPromptProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 w-full p-3.5 bg-white hover:bg-[#FAFAFA] border border-[#E5E5E5] hover:border-[#6366F1]/40 rounded-xl transition-all duration-200 text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F8F8F8] to-[#F0F0F0] group-hover:from-[#EEF2FF] group-hover:to-[#E0E7FF] flex items-center justify-center flex-shrink-0 transition-colors">
        {icon}
      </div>
      <span className="text-sm text-[#4B5563] group-hover:text-[#1F2937] flex-1 leading-snug" style={{ wordBreak: 'break-word' }}>
        {text}
      </span>
      <ArrowRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#6366F1] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0 flex-shrink-0" />
    </button>
  );
}

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

  // Empty state with interactive prompts
  if (displayMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="relative inline-flex mb-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#A78BFA] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6366F1]/25">
                <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#A78BFA] rounded-full" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#6366F1] rounded-full" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#111827] mb-2">
              Build Your UI
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs mx-auto">
              Describe what you want to create, and I&apos;ll generate beautiful, interactive React components for you.
            </p>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
              Quick starts
            </p>
            <QuickPrompt
              icon={<Layers className="w-4 h-4 text-[#6B7280] group-hover:text-[#6366F1] transition-colors" />}
              text="Create a dashboard with user metrics and charts"
              onClick={() => {}}
            />
            <QuickPrompt
              icon={<Table className="w-4 h-4 text-[#6B7280] group-hover:text-[#6366F1] transition-colors" />}
              text="Build a data table with sorting and filters"
              onClick={() => {}}
            />
            <QuickPrompt
              icon={<FormInput className="w-4 h-4 text-[#6B7280] group-hover:text-[#6366F1] transition-colors" />}
              text="Design a login form with validation"
              onClick={() => {}}
            />
          </div>

          {/* Tip */}
          <div className="mt-6 p-3.5 bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF] border border-[#C7D2FE] rounded-xl">
            <p className="text-xs text-[#4338CA] leading-relaxed">
              <span className="font-semibold">Tip:</span> Type <kbd className="px-1.5 py-0.5 bg-white/80 rounded text-[11px] font-mono border border-[#A5B4FC]">/sample</kbd> to load interactive prototype demos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
      {displayMessages.map((message, index) => {
        const isUser = message.role === 'user';
        const isFirstInGroup = index === 0 || displayMessages[index - 1].role !== message.role;
        const isLastInGroup = index === displayMessages.length - 1 || displayMessages[index + 1]?.role !== message.role;

        return (
          <div
            key={message.id}
            className={`flex gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar - only show for first message in group */}
            <div className={`w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 ${!isFirstInGroup ? 'invisible' : ''}`}>
              {isUser ? (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#333333] flex items-center justify-center shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className={`max-w-[85%] sm:max-w-[80%] min-w-0 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              {/* Name label for first message */}
              {isFirstInGroup && (
                <span className={`text-[11px] font-medium mb-1.5 ${isUser ? 'text-[#666666]' : 'text-[#6366F1]'}`}>
                  {isUser ? 'You' : 'Assistant'}
                </span>
              )}

              <div
                className={`relative px-4 py-3 max-w-full ${
                  isUser
                    ? 'bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white'
                    : 'bg-white border border-[#E5E5E5] text-[#333333] shadow-sm'
                } ${
                  // Rounded corners based on position
                  isUser
                    ? isFirstInGroup && isLastInGroup
                      ? 'rounded-2xl rounded-br-md'
                      : isFirstInGroup
                      ? 'rounded-2xl rounded-br-md'
                      : isLastInGroup
                      ? 'rounded-2xl rounded-tr-md'
                      : 'rounded-2xl rounded-r-md'
                    : isFirstInGroup && isLastInGroup
                    ? 'rounded-2xl rounded-bl-md'
                    : isFirstInGroup
                    ? 'rounded-2xl rounded-bl-md'
                    : isLastInGroup
                    ? 'rounded-2xl rounded-tl-md'
                    : 'rounded-2xl rounded-l-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {message.content}
                </p>

                {message.isStreaming && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[11px] opacity-70">Generating...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {isLoading && !displayMessages.some(m => m.isStreaming) && (
        <div className="flex gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-medium mb-1.5 text-[#6366F1]">Assistant</span>
            <div className="bg-white border border-[#E5E5E5] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#6366F1] animate-spin" />
                <span className="text-sm text-[#6B7280]">Thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
