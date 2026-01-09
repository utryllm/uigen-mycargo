export interface Screen {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  type?: 'code' | 'image';
  imageUrl?: string;
  // Prototype linking
  prototypeId?: string;         // Links to parent prototype
  prototypeScreenId?: string;   // e.g., "dashboard", "payments"
}

export interface ScreensState {
  screens: Screen[];
  activeScreenId: string | null;
  isGenerating: boolean;
  streamingCode: string;
  viewMode: 'preview' | 'code';
}

import type { Prototype } from './prototype';

export interface ScreensActions {
  addScreen: (screen: Omit<Screen, 'id' | 'createdAt' | 'updatedAt'>) => string;
  addImageScreen: (name: string, imageUrl: string, description?: string) => string;
  updateScreen: (id: string, updates: Partial<Screen>) => void;
  deleteScreen: (id: string) => void;
  setActiveScreen: (id: string | null) => void;
  setStreamingCode: (code: string) => void;
  appendStreamingCode: (chunk: string) => void;
  finalizeScreen: (id: string, code: string, name?: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setViewMode: (mode: 'preview' | 'code') => void;
  clearScreens: () => void;
  // Prototype actions
  loadPrototype: (prototype: Prototype) => string[];
  navigateToPrototypeScreen: (prototypeId: string, screenId: string) => void;
  clearPrototype: (prototypeId: string) => void;
}
