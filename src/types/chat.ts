export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  screenId?: string;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}

export interface ChatActions {
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, content: string) => void;
  setMessageStreaming: (id: string, isStreaming: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearHistory: () => void;
}

export type Command = {
  name: string;
  description: string;
  usage: string;
};

export const COMMANDS: Command[] = [
  { name: '/new', description: 'Create a new screen', usage: '/new [description]' },
  { name: '/edit', description: 'Edit an existing screen', usage: '/edit [screen name] [changes]' },
  { name: '/delete', description: 'Delete a screen', usage: '/delete [screen name]' },
  { name: '/rename', description: 'Rename a screen', usage: '/rename [old name] [new name]' },
  { name: '/export', description: 'Export prototype', usage: '/export' },
  { name: '/clear', description: 'Clear chat history', usage: '/clear' },
  { name: '/sample', description: 'Load sample dashboard screen', usage: '/sample' },
];
