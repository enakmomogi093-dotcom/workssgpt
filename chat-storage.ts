import { Conversation, AppSettings } from './chat-types';
import { DEFAULT_MODEL } from './gemini-config';

const STORAGE_KEY_CONVERSATIONS = 'worksgpt_conversations_v1';
const STORAGE_KEY_ACTIVE_ID = 'worksgpt_active_conversation_id';
const STORAGE_KEY_SETTINGS = 'worksgpt_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  appearance: 'dark',
  enterToSend: true,
  showTimestamps: true,
  compactMode: false,
  defaultModel: DEFAULT_MODEL,
  temperature: 0.7,
};

export const getStoredConversations = (): Conversation[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load conversations from localStorage', e);
    return [];
  }
};

export const saveStoredConversations = (conversations: Conversation[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations to localStorage', e);
  }
};

export const getActiveConversationId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
};

export const setActiveConversationId = (id: string | null): void => {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } else {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
  }
};

export const getStoredSettings = (): AppSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: AppSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const createNewConversation = (model = DEFAULT_MODEL): Conversation => {
  const newId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  return {
    id: newId,
    title: 'New Chat',
    messages: [],
    model,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

export const exportConversationAsMarkdown = (conversation: Conversation): string => {
  const dateStr = new Date(conversation.createdAt).toLocaleString();
  let md = `# ${conversation.title}\n*Created: ${dateStr} | Model: ${conversation.model}*\n\n---\n\n`;

  for (const msg of conversation.messages) {
    const sender = msg.role === 'user' ? '**You**' : '**WorksGPT**';
    const time = new Date(msg.timestamp).toLocaleTimeString();
    md += `### ${sender} _(${time})_\n\n${msg.content}\n\n`;
    if (msg.attachments && msg.attachments.length > 0) {
      md += `*Attached Files:* ${msg.attachments.map(a => a.name).join(', ')}\n\n`;
    }
  }

  return md;
};
