import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState, SettingsActions, Provider } from '@/types/settings';

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      provider: 'openai',
      openaiKey: null,
      anthropicKey: null,
      model: 'gpt-4o',
      isApiKeyModalOpen: false,

      setProvider: (provider) => {
        const defaultModel = provider === 'openai' ? 'gpt-4o' : 'claude-3-5-sonnet-latest';
        set({ provider, model: defaultModel });
      },

      setApiKey: (provider, key) => {
        if (provider === 'openai') {
          set({ openaiKey: key });
        } else {
          set({ anthropicKey: key });
        }
      },

      setModel: (model) => {
        set({ model });
      },

      setIsApiKeyModalOpen: (isOpen) => {
        set({ isApiKeyModalOpen: isOpen });
      },

      getActiveKey: () => {
        const state = get();
        return state.provider === 'openai' ? state.openaiKey : state.anthropicKey;
      },

      hasValidKey: () => {
        const key = get().getActiveKey();
        return key !== null && key.length > 0;
      },
    }),
    {
      name: 'uigen-settings',
      partialize: (state) => ({
        provider: state.provider,
        openaiKey: state.openaiKey,
        anthropicKey: state.anthropicKey,
        model: state.model,
      }),
    }
  )
);
