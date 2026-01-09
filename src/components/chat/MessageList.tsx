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
      className="group flex items-center gap-3 w-full p-3 bg-white hover:bg-[#FAFAFA] border border-[#E8E8E8] hover:border-[#C41230]/30 rounded-xl transition-all duration-200 text-left"
    >
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F8F8F8] to-[#F0F0F0] group-hover:from-[#FEF2F4] group-hover:to-[#FCE8EB] flex items-center justify-center flex-shrink-0 transition-colors">
        {icon}
      </div>
      <span className="text-[13px] text-[#444444] group-hover:text-[#333333] flex-1 line-clamp-2">
        {text}
      </span>
      <ArrowRight className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#C41230] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
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
          <div className="text-center mb-6">
            <div className="relative inline-flex mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#C41230] via-[#E91E63] to-[#FF6B6B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#C41230]/20">
                <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD200] rounded-full" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#28A745] rounded-full" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-2">
              Build Your UI
            </h3>
            <p className="text-[13px] sm:text-sm text-[#666666] leading-relaxed">
              Describe what you want to create, and I'll generate beautiful, interactive React components for you.
            </p>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider px-1 mb-3">
              Quick starts
            </p>
            <QuickPrompt
              icon={<Layers className="w-4 h-4 text-[#666666] group-hover:text-[#C41230] transition-colors" />}
              text="Create a dashboard with user metrics and charts"
              onClick={() => {}}
            />
            <QuickPrompt
              icon={<Table className="w-4 h-4 text-[#666666] group-hover:text-[#C41230] transition-colors" />}
              text="Build a data table with sorting and filters"
              onClick={() => {}}
            />
            <QuickPrompt
              icon={<FormInput className="w-4 h-4 text-[#666666] group-hover:text-[#C41230] transition-colors" />}
              text="Design a login form with validation"
              onClick={() => {}}
            />
          </div>

          {/* Tip */}
          <div className="mt-6 p-3 bg-gradient-to-r from-[#FFF8E1] to-[#FFFBF0] border border-[#FFE082] rounded-xl">
            <p className="text-[12px] text-[#8D6E00]">
              <span className="font-semibold">Tip:</span> Type <kbd className="px-1.5 py-0.5 bg-white/80 rounded text-[11px] font-mono border border-[#FFD54F]">/sample</kbd> to load interactive prototype demos
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
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#C41230] to-[#E91E63] flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className={`max-w-[82%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              {/* Name label for first message */}
              {isFirstInGroup && (
                <span className={`text-[11px] font-medium mb-1 px-1 ${isUser ? 'text-[#666666]' : 'text-[#C41230]'}`}>
                  {isUser ? 'You' : 'Assistant'}
                </span>
              )}

              <div
                className={`relative px-3.5 py-2.5 ${
                  isUser
                    ? 'bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-white'
                    : 'bg-white border border-[#E8E8E8] text-[#333333] shadow-sm'
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
                <p className="text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap break-words">
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
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#C41230] to-[#E91E63] flex items-center justify-center shadow-sm flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-medium mb-1 px-1 text-[#C41230]">Assistant</span>
            <div className="bg-white border border-[#E8E8E8] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#C41230] animate-spin" />
                <span className="text-[13px] text-[#666666]">Thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
