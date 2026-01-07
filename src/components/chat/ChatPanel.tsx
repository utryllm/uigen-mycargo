'use client';

import { useCallback } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useChatStore, useScreensStore, useSettingsStore } from '@/lib/store';
import { parseCodeFromResponse, extractCodeFromStream } from '@/lib/ai/parser';
import { getComponentNameFromPrompt } from '@/lib/ai/prompts/system';
import { SAMPLE_ONBOARDING_DASHBOARD, SAMPLE_SCREEN_NAME, SAMPLE_SCREEN_DESCRIPTION } from '@/lib/samples/onboarding-dashboard';

export function ChatPanel() {
  const { addMessage, updateMessage, setMessageStreaming, setIsLoading, clearHistory } = useChatStore();
  const { addScreen, setIsGenerating, setStreamingCode, finalizeScreen, screens, clearScreens, activeScreenId, updateScreen } = useScreensStore();
  const { provider, model, getActiveKey } = useSettingsStore();

  // Get the currently active screen
  const activeScreen = screens.find(s => s.id === activeScreenId);

  const handleSubmit = useCallback(
    async (message: string) => {
      // Check for special commands
      if (message.toLowerCase() === '/clear' || message.toLowerCase() === '/reset') {
        // Clear both chat and screens
        clearHistory();
        clearScreens();
        // Clear localStorage as well
        if (typeof window !== 'undefined') {
          localStorage.removeItem('uigen-chat');
          localStorage.removeItem('uigen-screens');
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

      // Handle /sample command - load sample dashboard
      if (message.toLowerCase() === '/sample') {
        addMessage({ role: 'user', content: message });

        // Create the sample screen
        const screenId = addScreen({
          name: SAMPLE_SCREEN_NAME,
          code: SAMPLE_ONBOARDING_DASHBOARD,
          description: SAMPLE_SCREEN_DESCRIPTION,
        });

        addMessage({
          role: 'assistant',
          content: `Loaded sample "${SAMPLE_SCREEN_NAME}" screen. This is an interactive enterprise onboarding dashboard with:\n\n• Tab navigation (Request, Case, Task views)\n• Filter chips (My requests, All requests, Team requests)\n• Sortable data table with pagination\n• Expandable rows\n• Action buttons\n\nYou can interact with all the elements. Try clicking the tabs, filters, or sorting the columns!`,
          screenId,
        });
        return;
      }

      // Add user message
      addMessage({ role: 'user', content: message });

      // Start generation
      setIsLoading(true);
      setIsGenerating(true);
      setStreamingCode('');

      // Check if we have an active screen with code - this means we're editing
      const isEditMode = activeScreen && activeScreen.code && activeScreen.type !== 'image';
      const screenId = isEditMode ? activeScreen.id : addScreen({
        name: getComponentNameFromPrompt(message),
        code: '',
        description: message,
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
            prompt: message,
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
    [activeScreen, addMessage, addScreen, clearHistory, clearScreens, finalizeScreen, getActiveKey, model, provider, screens, setIsGenerating, setIsLoading, setMessageStreaming, setStreamingCode, updateMessage]
  );

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #E0E0E0',
          backgroundColor: 'white',
          flexShrink: 0,
        }}
      >
        <h2 style={{ fontWeight: 600, color: '#333333', fontSize: '16px', margin: 0 }}>
          Chat
        </h2>
        <p style={{ fontSize: '12px', color: '#666666', margin: '4px 0 0 0' }}>
          Describe interfaces to generate
        </p>
      </div>
      <MessageList />
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
}
