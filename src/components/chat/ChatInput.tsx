'use client';

import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { Send, Sparkles, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui';
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addMessage({
        role: 'assistant',
        content: 'Please upload a valid image file (PNG, JPG, GIF, etc.)',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addMessage({
        role: 'assistant',
        content: 'Image file is too large. Please upload an image under 10MB.',
      });
      return;
    }

    // Create object URL for the image
    const imageUrl = URL.createObjectURL(file);

    // Generate a name from the filename
    const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    // Add as image screen
    addImageScreen(formattedName, imageUrl, `Uploaded image: ${file.name}`);

    // Add message to chat
    addMessage({
      role: 'user',
      content: `📷 Uploaded image: ${file.name}`,
    });
    addMessage({
      role: 'assistant',
      content: `Added "${formattedName}" as a screen. You can see it in the canvas on the right.`,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filter commands based on input
  const filteredCommands = input.startsWith('/')
    ? COMMANDS.filter((cmd) =>
        cmd.name.toLowerCase().includes(input.toLowerCase())
      )
    : [];

  useEffect(() => {
    setShowCommands(input.startsWith('/') && filteredCommands.length > 0);
  }, [input, filteredCommands.length]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
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
    <div className="p-4 border-t border-[#E0E0E0] bg-white">
      {/* Command Suggestions */}
      {showCommands && (
        <div className="mb-2 bg-white border border-[#E0E0E0] rounded-lg shadow-lg overflow-hidden">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.name}
              className="w-full px-4 py-2 text-left hover:bg-[#F5F5F5] transition-colors"
              onClick={() => handleCommandSelect(cmd.name)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#333333]">{cmd.name}</span>
                <span className="text-xs text-[#999999]">{cmd.usage}</span>
              </div>
              <p className="text-xs text-[#666666] mt-0.5">{cmd.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2">
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
            'h-[46px] px-3 border border-[#E0E0E0] rounded-lg',
            'text-[#666666] hover:text-[#C41230] hover:border-[#C41230] hover:bg-[#F8E7EA]',
            'transition-colors flex items-center justify-center',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-[#666666] disabled:hover:border-[#E0E0E0] disabled:hover:bg-transparent'
          )}
          title="Upload image as screen"
        >
          <ImagePlus className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              hasValidKey()
                ? 'Describe the UI you want to create... (/ for commands)'
                : 'Add your API key to start generating...'
            }
            disabled={isDisabled}
            rows={1}
            className={cn(
              'w-full px-4 py-3 pr-12 border border-[#E0E0E0] rounded-lg text-sm resize-none',
              'focus:outline-none focus:ring-2 focus:ring-[#C41230] focus:border-transparent',
              'placeholder:text-[#999999]',
              'disabled:bg-[#F5F5F5] disabled:cursor-not-allowed'
            )}
          />
          {!hasValidKey() && (
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#C41230] hover:bg-[#F8E7EA] rounded"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isDisabled}
          isLoading={isDisabled}
          className="h-[46px] px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Hint */}
      <p className="mt-2 text-xs text-[#999999]">
        Press Enter to send, Shift+Enter for new line. Type / for commands.
      </p>
    </div>
  );
}
