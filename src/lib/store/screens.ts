import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { ScreensState, ScreensActions, Screen } from '@/types/screen';
import type { Prototype } from '@/types/prototype';

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

      loadPrototype: (prototype: Prototype) => {
        const screenIds: string[] = [];
        const now = new Date();

        // Clear any existing screens from this prototype
        set((state) => ({
          screens: state.screens.filter((s) => s.prototypeId !== prototype.id),
        }));

        // Create all screens from the prototype
        const newScreens: Screen[] = prototype.screens.map((protoScreen) => {
          const id = nanoid();
          screenIds.push(id);
          return {
            id,
            name: protoScreen.name,
            code: protoScreen.code,
            description: protoScreen.description,
            type: 'code' as const,
            prototypeId: prototype.id,
            prototypeScreenId: protoScreen.id,
            createdAt: now,
            updatedAt: now,
          };
        });

        set((state) => ({
          screens: [...state.screens, ...newScreens],
          activeScreenId: screenIds[0],
        }));

        return screenIds;
      },

      navigateToPrototypeScreen: (prototypeId: string, screenId: string) => {
        const screens = get().screens;
        const targetScreen = screens.find(
          (s) => s.prototypeId === prototypeId && s.prototypeScreenId === screenId
        );
        if (targetScreen) {
          set({ activeScreenId: targetScreen.id });
        }
      },

      clearPrototype: (prototypeId: string) => {
        set((state) => {
          const remainingScreens = state.screens.filter(
            (s) => s.prototypeId !== prototypeId
          );
          const newActiveId =
            state.activeScreenId &&
            state.screens.find((s) => s.id === state.activeScreenId)?.prototypeId === prototypeId
              ? remainingScreens.length > 0
                ? remainingScreens[0].id
                : null
              : state.activeScreenId;
          return {
            screens: remainingScreens,
            activeScreenId: newActiveId,
          };
        });
      },
    }),
    {
      name: 'lumina-screens',
      partialize: (state) => ({
        screens: state.screens,
        activeScreenId: state.activeScreenId,
      }),
    }
  )
);
