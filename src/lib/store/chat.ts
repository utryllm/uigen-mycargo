import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { ChatState, ChatActions, ChatMessage } from '@/types/chat';

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,

      addMessage: (message) => {
        const id = nanoid();
        const newMessage: ChatMessage = {
          ...message,
          id,
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
        return id;
      },

      updateMessage: (id, content) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, content } : msg
          ),
        }));
      },

      setMessageStreaming: (id, isStreaming) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isStreaming } : msg
          ),
        }));
      },

      setIsLoading: (isLoading) => {
        set({ isLoading });
      },

      clearHistory: () => {
        set({ messages: [], isLoading: false });
      },
    }),
    {
      name: 'uigen-chat',
      partialize: (state) => ({
        messages: state.messages.slice(-50), // Keep last 50 messages
      }),
    }
  )
);
