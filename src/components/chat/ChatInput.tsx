'use client';

import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { Send, ImagePlus, Command, Sparkles } from 'lucide-react';
import { useSettingsStore, useChatStore, useScreensStore } from '@/lib/store';
import { COMMANDS } from '@/types/chat';
import { cn } from '@/lib/utils/cn';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onImageUpload?: (file: File) => void;
}

export function ChatInput({ onSubmit }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { hasValidKey, setIsApiKeyModalOpen } = useSettingsStore();
  const { isLoading, addMessage } = useChatStore();
  const { isGenerating, addImageScreen } = useScreensStore();

  const isDisabled = isLoading || isGenerating;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addMessage({
        role: 'assistant',
        content: 'Please upload a valid image file (PNG, JPG, GIF, etc.)',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addMessage({
        role: 'assistant',
        content: 'Image file is too large. Please upload an image under 10MB.',
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    addImageScreen(formattedName, imageUrl, `Uploaded image: ${file.name}`);
    addMessage({ role: 'user', content: `Uploaded image: ${file.name}` });
    addMessage({
      role: 'assistant',
      content: `Added "${formattedName}" as a screen. You can see it in the canvas.`,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredCommands = input.startsWith('/')
    ? COMMANDS.filter((cmd) => cmd.name.toLowerCase().includes(input.toLowerCase()))
    : [];

  useEffect(() => {
    setShowCommands(input.startsWith('/') && filteredCommands.length > 0);
  }, [input, filteredCommands.length]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 44), 140);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isDisabled) return;

    if (!hasValidKey()) {
      setIsApiKeyModalOpen(true);
      return;
    }

    onSubmit(input.trim());
    setInput('');
    setShowCommands(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCommandSelect = (command: string) => {
    setInput(command + ' ');
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-[#E8E8E8] bg-white p-3 sm:p-4">
      {/* Command Suggestions */}
      {showCommands && (
        <div className="mb-3 bg-white border border-[#E8E8E8] rounded-xl shadow-lg overflow-hidden">
          <div className="px-3 py-2 bg-gradient-to-r from-[#FAFAFA] to-[#F5F5F5] border-b border-[#E8E8E8]">
            <div className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-[#666666]" />
              <span className="text-[11px] font-semibold text-[#666666] uppercase tracking-wide">Commands</span>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.name}
                className="w-full px-3 py-2.5 text-left hover:bg-[#FEF2F4] transition-colors border-b border-[#F0F0F0] last:border-b-0 group"
                onClick={() => handleCommandSelect(cmd.name)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#333333] group-hover:text-[#C41230]">{cmd.name}</span>
                  <span className="text-[10px] text-[#999999] font-mono bg-[#F5F5F5] px-1.5 py-0.5 rounded">{cmd.usage}</span>
                </div>
                <p className="text-[11px] text-[#666666] mt-0.5">{cmd.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Container - Card style */}
      <div
        className={cn(
          'relative rounded-2xl border-2 transition-all duration-200',
          isFocused
            ? 'border-[#C41230]/50 bg-white shadow-sm shadow-[#C41230]/10'
            : 'border-[#E8E8E8] bg-[#FAFAFA] hover:border-[#D0D0D0]'
        )}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={
            hasValidKey()
              ? 'Describe what you want to build...'
              : 'Add your API key to start generating...'
          }
          disabled={isDisabled}
          rows={1}
          className={cn(
            'w-full min-h-[44px] max-h-[140px] px-4 py-3 pr-28',
            'bg-transparent',
            'text-[14px] leading-6 text-[#1A1A1A] placeholder:text-[#999999]',
            'focus:outline-none',
            'resize-none',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />

        {/* Action buttons - positioned inside input */}
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Image upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              'text-[#888888] hover:text-[#C41230] hover:bg-[#FEF2F4]',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#888888]'
            )}
            title="Upload image"
          >
            <ImagePlus className="w-[18px] h-[18px]" />
          </button>

          {/* Commands button */}
          <button
            onClick={() => {
              setInput('/');
              textareaRef.current?.focus();
            }}
            disabled={isDisabled}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              'text-[#888888] hover:text-[#C41230] hover:bg-[#FEF2F4]',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
            title="Commands"
          >
            <Command className="w-[18px] h-[18px]" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isDisabled}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
              input.trim() && !isDisabled
                ? 'bg-gradient-to-br from-[#C41230] to-[#E91E63] text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
                : 'bg-[#E5E5E5] text-[#AAAAAA] cursor-not-allowed'
            )}
          >
            {isDisabled ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* API Key prompt - overlay style */}
        {!hasValidKey() && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-2xl backdrop-blur-sm">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#C41230] to-[#E91E63] text-white text-[13px] font-medium rounded-xl hover:shadow-lg hover:shadow-[#C41230]/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Add API Key to Start
            </button>
          </div>
        )}
      </div>

      {/* Footer hint - subtle */}
      <div className="flex items-center justify-center gap-3 mt-2.5">
        <span className="text-[11px] text-[#AAAAAA]">
          <kbd className="px-1.5 py-0.5 bg-[#F0F0F0] rounded text-[10px] font-mono">Enter</kbd>
          <span className="mx-1">to send</span>
        </span>
        <span className="text-[#D0D0D0]">·</span>
        <span className="text-[11px] text-[#AAAAAA]">
          <kbd className="px-1.5 py-0.5 bg-[#F0F0F0] rounded text-[10px] font-mono">/</kbd>
          <span className="mx-1">for commands</span>
        </span>
      </div>
    </div>
  );
}
