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
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 40), 120);
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
    <div className="border-t border-[#E0E0E0] bg-white p-3 sm:p-4">
      {/* Command Suggestions */}
      {showCommands && (
        <div className="mb-2 bg-white border border-[#E0E0E0] rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          <div className="px-3 py-2 bg-[#F8F8F8] border-b border-[#E0E0E0]">
            <span className="text-[11px] font-semibold text-[#666666] uppercase tracking-wide">Commands</span>
          </div>
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.name}
              className="w-full px-3 py-2 text-left hover:bg-[#F5F5F5] transition-colors border-b border-[#F0F0F0] last:border-b-0"
              onClick={() => handleCommandSelect(cmd.name)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#333333]">{cmd.name}</span>
                <span className="text-[11px] text-[#999999] font-mono">{cmd.usage}</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-0.5">{cmd.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="flex items-end gap-2">
        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 flex-shrink-0 pb-0.5">
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
              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              'text-[#888888] hover:text-[#C41230] hover:bg-[#FEF2F4]',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#888888]'
            )}
            title="Upload image"
          >
            <ImagePlus className="w-[18px] h-[18px]" />
          </button>

          <button
            onClick={() => {
              setInput('/');
              textareaRef.current?.focus();
            }}
            disabled={isDisabled}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              'text-[#888888] hover:text-[#C41230] hover:bg-[#FEF2F4]',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
            title="Commands"
          >
            <Slash className="w-[18px] h-[18px]" />
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
              'w-full min-h-[40px] max-h-[120px] px-3 py-2.5',
              'bg-[#F5F5F5] rounded-xl',
              'text-[13px] sm:text-[14px] leading-5 text-[#333333] placeholder:text-[#999999]',
              'border border-transparent',
              'focus:outline-none focus:bg-white focus:border-[#C41230]',
              'transition-all duration-150 resize-none',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />

          {/* API Key prompt */}
          {!hasValidKey() && (
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#C41230] text-white text-[11px] font-medium rounded-md hover:bg-[#A30F28] transition-colors whitespace-nowrap"
            >
              Add API Key
            </button>
          )}
        </div>

        {/* Send Button */}
        <div className="flex-shrink-0 pb-0.5">
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isDisabled}
            className={cn(
              'w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-150',
              input.trim() && !isDisabled
                ? 'bg-[#C41230] text-white hover:bg-[#A30F28] shadow-sm active:scale-95'
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
      </div>

      {/* Footer hint - compact */}
      <p className="mt-2 text-[11px] text-[#AAAAAA] text-center">
        <span className="hidden sm:inline">Enter to send · </span>
        Type <kbd className="px-1 py-0.5 bg-[#F0F0F0] rounded text-[10px] font-mono">/</kbd> for commands
      </p>
    </div>
  );
}
