'use client';

import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { Send, ImagePlus, Slash } from 'lucide-react';
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
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 52), 160);
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
    <div className="border-t border-[#E0E0E0] bg-white p-4">
      {/* Command Suggestions */}
      {showCommands && (
        <div className="mb-3 bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
          <div className="px-4 py-2.5 bg-[#F8F8F8] border-b border-[#E0E0E0]">
            <span className="text-xs font-semibold text-[#666666] uppercase tracking-wide">Commands</span>
          </div>
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.name}
              className="w-full px-4 py-3 text-left hover:bg-[#F5F5F5] transition-colors border-b border-[#F0F0F0] last:border-b-0"
              onClick={() => handleCommandSelect(cmd.name)}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold text-[#333333]">{cmd.name}</span>
                <span className="text-xs text-[#999999] font-mono">{cmd.usage}</span>
              </div>
              <p className="text-xs text-[#666666]">{cmd.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-3">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0 pb-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center transition-all',
              'text-[#666666] hover:text-[#C41230] hover:bg-[#FEF2F4]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#666666]'
            )}
            title="Upload image"
          >
            <ImagePlus className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setInput('/');
              textareaRef.current?.focus();
            }}
            disabled={isDisabled}
            className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center transition-all',
              'text-[#666666] hover:text-[#C41230] hover:bg-[#FEF2F4]',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Commands"
          >
            <Slash className="w-5 h-5" />
          </button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              hasValidKey()
                ? 'Describe the UI you want to create...'
                : 'Add your API key to start...'
            }
            disabled={isDisabled}
            rows={1}
            className={cn(
              'w-full min-h-[52px] max-h-[160px] px-4 py-3.5',
              'bg-[#F5F5F5] rounded-2xl',
              'text-[15px] leading-6 text-[#333333] placeholder:text-[#999999]',
              'border-2 border-transparent',
              'focus:outline-none focus:bg-white focus:border-[#C41230]',
              'transition-all duration-200 resize-none',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
          />

          {/* API Key prompt */}
          {!hasValidKey() && (
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#C41230] text-white text-xs font-medium rounded-lg hover:bg-[#A30F28] transition-colors whitespace-nowrap"
            >
              Add API Key
            </button>
          )}
        </div>

        {/* Send Button */}
        <div className="flex-shrink-0 pb-1.5">
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isDisabled}
            className={cn(
              'h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-200',
              input.trim() && !isDisabled
                ? 'bg-[#C41230] text-white hover:bg-[#A30F28] shadow-md hover:shadow-lg active:scale-95'
                : 'bg-[#E8E8E8] text-[#AAAAAA] cursor-not-allowed'
            )}
          >
            {isDisabled ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Footer hint */}
      <p className="mt-3 text-xs text-[#999999] text-center">
        <span className="hidden sm:inline">Enter to send, Shift+Enter for new line. </span>
        Type <kbd className="px-1.5 py-0.5 bg-[#F0F0F0] rounded text-[10px] font-mono">/</kbd> for commands
      </p>
    </div>
  );
}
