export type Provider = 'openai' | 'anthropic';

export interface SettingsState {
  provider: Provider;
  openaiKey: string | null;
  anthropicKey: string | null;
  model: string;
  isApiKeyModalOpen: boolean;
}

export interface SettingsActions {
  setProvider: (provider: Provider) => void;
  setApiKey: (provider: Provider, key: string) => void;
  setModel: (model: string) => void;
  setIsApiKeyModalOpen: (isOpen: boolean) => void;
  getActiveKey: () => string | null;
  hasValidKey: () => boolean;
}

export const OPENAI_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
];

export const ANTHROPIC_MODELS = [
  { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku' },
  { id: 'claude-3-opus-latest', name: 'Claude 3 Opus' },
];
