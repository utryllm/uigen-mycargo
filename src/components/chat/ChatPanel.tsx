'use client';

import { useCallback, useState } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SampleSelectorModal } from './SampleSelectorModal';
import { useChatStore, useScreensStore, useSettingsStore } from '@/lib/store';
import { parseCodeFromResponse, extractCodeFromStream } from '@/lib/ai/parser';
import { getComponentNameFromPrompt } from '@/lib/ai/prompts/system';
import { SAMPLE_ONBOARDING_DASHBOARD, SAMPLE_SCREEN_NAME, SAMPLE_SCREEN_DESCRIPTION } from '@/lib/samples/onboarding-dashboard';
import { PROTOTYPES } from '@/lib/samples';
import type { PrototypeKey } from '@/types/prototype';
import { Sparkles, MoreHorizontal } from 'lucide-react';

export function ChatPanel() {
  const { addMessage, updateMessage, setMessageStreaming, setIsLoading, clearHistory } = useChatStore();
  const { addScreen, setIsGenerating, setStreamingCode, finalizeScreen, screens, clearScreens, activeScreenId, updateScreen, loadPrototype } = useScreensStore();
  const { provider, model, getActiveKey } = useSettingsStore();
  const [showSampleModal, setShowSampleModal] = useState(false);

  // Get the currently active screen
  const activeScreen = screens.find(s => s.id === activeScreenId);

  // Handle prototype loading
  const handleLoadPrototype = useCallback((persona: PrototypeKey) => {
    const prototype = PROTOTYPES[persona];
    if (!prototype) return;

    addMessage({ role: 'user', content: `/sample ${persona}` });

    // Load the prototype screens
    const screenIds = loadPrototype(prototype);

    // Build feature list for message
    const featureList = prototype.screens.map(s => `• ${s.name}`).join('\n');

    addMessage({
      role: 'assistant',
      content: `Loaded "${prototype.name}" prototype with ${prototype.screens.length} interactive screens:\n\n${featureList}\n\nClick the tabs in the preview to navigate between screens. You can also use the chat to modify any screen!`,
      screenId: screenIds[0],
    });
  }, [addMessage, loadPrototype]);

  const handleSubmit = useCallback(
    async (message: string) => {
      // Check for special commands
      if (message.toLowerCase() === '/clear' || message.toLowerCase() === '/reset') {
        // Clear both chat and screens
        clearHistory();
        clearScreens();
        // Clear localStorage as well
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lumina-chat');
          localStorage.removeItem('lumina-screens');
        }
        return;
      }

      if (message.startsWith('/delete ')) {
        const screenName = message.replace('/delete ', '').trim();
        const screen = screens.find(
          (s) => s.name.toLowerCase() === screenName.toLowerCase()
        );
        if (screen) {
          useScreensStore.getState().deleteScreen(screen.id);
          addMessage({
            role: 'assistant',
            content: `Deleted screen "${screen.name}"`,
          });
        } else {
          addMessage({
            role: 'assistant',
            content: `Screen "${screenName}" not found`,
          });
        }
        return;
      }

      // Handle /sample commands
      const sampleMatch = message.toLowerCase().match(/^\/sample(?:\s+(business|retail|old))?$/);
      if (sampleMatch) {
        const persona = sampleMatch[1] as PrototypeKey | 'old' | undefined;

        // /sample business or /sample retail - load specific prototype
        if (persona === 'business' || persona === 'retail') {
          handleLoadPrototype(persona);
          return;
        }

        // /sample old - load legacy sample
        if (persona === 'old') {
          addMessage({ role: 'user', content: message });
          const screenId = addScreen({
            name: SAMPLE_SCREEN_NAME,
            code: SAMPLE_ONBOARDING_DASHBOARD,
            description: SAMPLE_SCREEN_DESCRIPTION,
          });
          addMessage({
            role: 'assistant',
            content: `Loaded sample "${SAMPLE_SCREEN_NAME}" screen. This is an interactive enterprise onboarding dashboard.`,
            screenId,
          });
          return;
        }

        // /sample (no argument) - show modal
        setShowSampleModal(true);
        return;
      }

      // Check for /new command to force new screen creation
      const forceNewScreen = message.toLowerCase().startsWith('/new ');
      const actualMessage = forceNewScreen ? message.substring(5).trim() : message;

      // Add user message
      addMessage({ role: 'user', content: message });

      // Start generation
      setIsLoading(true);
      setIsGenerating(true);
      setStreamingCode('');

      // Check if we have an active screen with code - this means we're editing
      // Unless /new command is used, which forces new screen creation
      const isEditMode = !forceNewScreen && activeScreen && activeScreen.code && activeScreen.type !== 'image';
      const screenId = isEditMode ? activeScreen.id : addScreen({
        name: getComponentNameFromPrompt(actualMessage),
        code: '',
        description: actualMessage,
      });

      // Add assistant message placeholder
      const assistantMsgId = addMessage({
        role: 'assistant',
        content: isEditMode ? `Updating "${activeScreen.name}"...` : 'Generating your UI...',
        screenId,
        isStreaming: true,
      });

      try {
        console.log('Sending generation request...', isEditMode ? '(Edit mode)' : '(New screen)');
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: actualMessage,
            provider,
            model,
            apiKey: getActiveKey(),
            // Pass current screen code if editing
            currentScreenCode: isEditMode ? activeScreen.code : undefined,
            currentScreenName: isEditMode ? activeScreen.name : undefined,
            isEditMode,
            existingScreens: screens.map((s) => ({
              name: s.name,
              description: s.description,
            })),
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          throw new Error(`Failed to generate UI: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullResponse = '';

        console.log('Starting to read stream...');
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('Stream complete. Total length:', fullResponse.length);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;

          // Extract and update streaming code
          const partialCode = extractCodeFromStream(fullResponse);
          if (partialCode) {
            setStreamingCode(partialCode);
          }

          // Update assistant message with progress
          const preview = fullResponse.length > 100
            ? fullResponse.substring(0, 100) + '...'
            : fullResponse;
          updateMessage(assistantMsgId, `${isEditMode ? 'Updating' : 'Generating'} your UI... (${fullResponse.length} chars received)\n\n${preview}`);
        }

        console.log('Parsing final response...');
        // Parse final code
        const { code, name } = parseCodeFromResponse(fullResponse);
        console.log('Parsed successfully. Component:', name, 'Code length:', code.length);

        // Update the screen (same ID for edit mode)
        finalizeScreen(screenId, code, isEditMode ? activeScreen.name : name);

        // Update final message
        const actionWord = isEditMode ? 'Updated' : 'Created';
        updateMessage(assistantMsgId, `${actionWord} "${isEditMode ? activeScreen.name : name}" screen. You can see it in the canvas on the right.`);
        setMessageStreaming(assistantMsgId, false);
      } catch (error) {
        console.error('Generation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updateMessage(
          assistantMsgId,
          `Sorry, I encountered an error: ${errorMessage}\n\nPlease check your API key and try again.`
        );
        setMessageStreaming(assistantMsgId, false);
        // Only delete the screen if we created a new one (not edit mode)
        if (!isEditMode) {
          useScreensStore.getState().deleteScreen(screenId);
        }
      } finally {
        setIsLoading(false);
        setIsGenerating(false);
      }
    },
    [activeScreen, addMessage, addScreen, clearHistory, clearScreens, finalizeScreen, getActiveKey, handleLoadPrototype, model, provider, screens, setIsGenerating, setIsLoading, setMessageStreaming, setStreamingCode, updateMessage]
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FAFAFA] to-[#F5F5F5]">
      {/* Header - Modern gradient with icon */}
      <div className="relative overflow-hidden bg-white border-b border-[#E8E8E8] flex-shrink-0">
        {/* Subtle gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/5 via-transparent to-[#8B5CF6]/5" />

        <div className="relative flex items-center justify-between px-4 sm:px-5 h-14 sm:h-16">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-sm shadow-[#6366F1]/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1A1A1A] text-[15px] sm:text-base">
                AI Assistant
              </h2>
              <p className="text-[11px] sm:text-xs text-[#666666]">
                Describe your UI to generate
              </p>
            </div>
          </div>

          {/* Menu button */}
          <button className="w-8 h-8 rounded-lg hover:bg-[#F5F5F5] flex items-center justify-center transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#666666]" />
          </button>
        </div>
      </div>

      <MessageList />
      <ChatInput onSubmit={handleSubmit} />

      {/* Sample Selector Modal */}
      <SampleSelectorModal
        isOpen={showSampleModal}
        onClose={() => setShowSampleModal(false)}
        onSelectPrototype={handleLoadPrototype}
      />
    </div>
  );
}
