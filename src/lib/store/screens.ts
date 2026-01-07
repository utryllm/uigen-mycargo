import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { ScreensState, ScreensActions, Screen } from '@/types/screen';

type ScreensStore = ScreensState & ScreensActions;

export const useScreensStore = create<ScreensStore>()(
  persist(
    (set, get) => ({
      screens: [],
      activeScreenId: null,
      isGenerating: false,
      streamingCode: '',
      viewMode: 'preview',

      addScreen: (screen) => {
        const id = nanoid();
        const newScreen: Screen = {
          ...screen,
          id,
          type: screen.type || 'code',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          screens: [...state.screens, newScreen],
          activeScreenId: id,
        }));
        return id;
      },

      addImageScreen: (name, imageUrl, description = '') => {
        const id = nanoid();
        const newScreen: Screen = {
          id,
          name,
          code: '',
          description,
          type: 'image',
          imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          screens: [...state.screens, newScreen],
          activeScreenId: id,
        }));
        return id;
      },

      updateScreen: (id, updates) => {
        set((state) => ({
          screens: state.screens.map((screen) =>
            screen.id === id
              ? { ...screen, ...updates, updatedAt: new Date() }
              : screen
          ),
        }));
      },

      deleteScreen: (id) => {
        set((state) => {
          const newScreens = state.screens.filter((s) => s.id !== id);
          const newActiveId =
            state.activeScreenId === id
              ? newScreens.length > 0
                ? newScreens[0].id
                : null
              : state.activeScreenId;
          return {
            screens: newScreens,
            activeScreenId: newActiveId,
          };
        });
      },

      setActiveScreen: (id) => {
        set({ activeScreenId: id });
      },

      setStreamingCode: (code) => {
        set({ streamingCode: code });
      },

      appendStreamingCode: (chunk) => {
        set((state) => ({
          streamingCode: state.streamingCode + chunk,
        }));
      },

      finalizeScreen: (id, code, name) => {
        set((state) => ({
          screens: state.screens.map((screen) =>
            screen.id === id
              ? {
                  ...screen,
                  code,
                  name: name || screen.name,
                  updatedAt: new Date(),
                }
              : screen
          ),
          streamingCode: '',
          isGenerating: false,
        }));
      },

      setIsGenerating: (isGenerating) => {
        set({ isGenerating });
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      clearScreens: () => {
        set({
          screens: [],
          activeScreenId: null,
          streamingCode: '',
          isGenerating: false,
        });
      },
    }),
    {
      name: 'uigen-screens',
      partialize: (state) => ({
        screens: state.screens,
        activeScreenId: state.activeScreenId,
      }),
    }
  )
);
