export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  mimeType: string;
  size: number;
  base64Data?: string;
  textSnippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  attachments?: Attachment[];
  isStreaming?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
  isPro?: boolean;
}

export interface AppSettings {
  appearance: 'dark' | 'light' | 'system';
  enterToSend: boolean;
  showTimestamps: boolean;
  compactMode: boolean;
  defaultModel: string;
  temperature: number;
}
