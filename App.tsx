import React, { useState, useEffect, useRef } from 'react';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickPrompts } from './components/QuickPrompts';
import { SettingsModal } from './components/SettingsModal';
import { ExploreModal } from './components/ExploreModal';
import { FilesModal } from './components/FilesModal';
import { LoginGate } from './components/LoginGate';
import { AdminPortalModal } from './components/AdminPortalModal';
import {
  Conversation,
  ChatMessage as ChatMessageType,
  AppSettings,
  Attachment,
} from './lib/chat-types';
import {
  getStoredConversations,
  saveStoredConversations,
  getActiveConversationId,
  setActiveConversationId,
  getStoredSettings,
  saveStoredSettings,
  createNewConversation,
  exportConversationAsMarkdown,
} from './lib/chat-storage';
import { getCurrentSession, clearSession } from './lib/auth-storage';
import { AuthSession } from './lib/auth-types';
import { DEFAULT_MODEL } from './lib/gemini-config';

export default function App() {
  // Authentication session state
  const [session, setSession] = useState<AuthSession | null>(() => getCurrentSession());
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // App view: 'landing' or 'chat'
  const [view, setView] = useState<'landing' | 'chat'>('landing');

  // Conversations & active state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Settings
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());

  // UI Drawer / Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);

  // Streaming & Abort controller
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll ref
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Staged prompt from Explore or Landing
  const [stagedPrompt, setStagedPrompt] = useState<string>('');

  // Initial load
  useEffect(() => {
    const saved = getStoredConversations();
    setConversations(saved);

    const savedActiveId = getActiveConversationId();
    if (savedActiveId && saved.some((c) => c.id === savedActiveId)) {
      setActiveId(savedActiveId);
    } else if (saved.length > 0) {
      setActiveId(saved[0].id);
    }

    // Apply dark class
    if (settings.appearance === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save conversations on update
  useEffect(() => {
    if (conversations.length > 0) {
      saveStoredConversations(conversations);
    }
  }, [conversations]);

  // Save activeId
  useEffect(() => {
    setActiveConversationId(activeId);
  }, [activeId]);

  // Expiration watcher: check every 10 seconds if account validity has passed
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const current = getCurrentSession();
      if (!current) {
        setSession(null);
        alert('Masa berlaku akun Anda telah berakhir (Expired) dan otomatis dihapus. Silakan hubungi admin untuk perpanjangan.');
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [session]);

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  // Current active conversation
  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  // Auto-scroll to bottom when messages change or streaming updates
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [activeConversation?.messages?.length, isStreaming]);

  // Handle Switch Conversation
  const handleSelectConversation = (id: string) => {
    setActiveId(id);
    setView('chat');
  };

  // Handle New Chat
  const handleNewChat = () => {
    const newConv = createNewConversation(settings.defaultModel);
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setView('chat');
  };

  // Handle Delete Conversation
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveStoredConversations(updated);
      if (activeId === id) {
        const nextId = updated.length > 0 ? updated[0].id : null;
        setActiveId(nextId);
      }
      return updated;
    });
  };

  // Handle Rename Conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c))
    );
  };

  // Handle Clear Current Chat
  const handleClearCurrentChat = () => {
    if (!activeId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [], updatedAt: Date.now() } : c))
    );
  };

  // Handle Export Chat
  const handleExportChat = () => {
    if (!activeConversation) return;
    const md = exportConversationAsMarkdown(activeConversation);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'chat'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Change Model for active conversation
  const handleSelectModel = (modelId: string) => {
    if (activeId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, model: modelId } : c))
      );
    }
  };

  // Stop generation
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    // Turn off streaming state on the last message
    if (activeId) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const updatedMessages = [...c.messages];
          const lastIdx = updatedMessages.length - 1;
          if (lastIdx >= 0 && updatedMessages[lastIdx].role === 'assistant') {
            updatedMessages[lastIdx] = {
              ...updatedMessages[lastIdx],
              isStreaming: false,
            };
          }
          return { ...c, messages: updatedMessages };
        })
      );
    }
  };

  // Send Message & Stream Response
  const handleSendMessage = async (text: string, attachments?: Attachment[]) => {
    if ((!text.trim() && (!attachments || attachments.length === 0)) || isStreaming) {
      return;
    }

    // Ensure we have an active conversation
    let currentConvId = activeId;
    let targetConv = conversations.find((c) => c.id === currentConvId);

    if (!targetConv) {
      const newConv = createNewConversation(settings.defaultModel);
      newConv.title = text.slice(0, 35) || 'New Conversation';
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(newConv.id);
      currentConvId = newConv.id;
      targetConv = newConv;
    } else if (targetConv.messages.length === 0) {
      // Auto-title on first message
      const generatedTitle = text.slice(0, 35) || 'Conversation';
      handleRenameConversation(targetConv.id, generatedTitle);
    }

    const userMessageId = 'msg_' + Date.now() + '_user';
    const assistantMessageId = 'msg_' + (Date.now() + 1) + '_assistant';

    const userMessage: ChatMessageType = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      attachments,
    };

    const assistantMessage: ChatMessageType = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
      model: targetConv.model || settings.defaultModel,
      isStreaming: true,
    };

    // Append both to state
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== currentConvId) return c;
        return {
          ...c,
          messages: [...c.messages, userMessage, assistantMessage],
          updatedAt: Date.now(),
        };
      })
    );

    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Prepare history for API
    const historyPayload = targetConv.messages
      .filter((m) => !m.error)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    // Prepare images payload
    const imagesPayload = (attachments || [])
      .filter((a) => a.type === 'image' && a.base64Data)
      .map((a) => ({
        inlineData: {
          mimeType: a.mimeType,
          data: a.base64Data,
        },
      }));

    // If text files are attached, prepend their content to user message
    let finalPrompt = text;
    const textAttachments = (attachments || []).filter(
      (a) => a.type === 'file' && a.textSnippet
    );
    if (textAttachments.length > 0) {
      const fileDocs = textAttachments
        .map((a) => `--- File: ${a.name} ---\n${a.textSnippet}\n--- End of ${a.name} ---`)
        .join('\n\n');
      finalPrompt = `${fileDocs}\n\n${text}`;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: finalPrompt,
          history: historyPayload,
          model: targetConv.model || settings.defaultModel || DEFAULT_MODEL,
          temperature: settings.temperature,
          images: imagesPayload,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported on this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.chunk) {
              accumulatedText += parsed.chunk;
              // Update message in state
              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id !== currentConvId) return c;
                  const msgs = [...c.messages];
                  const lastIdx = msgs.length - 1;
                  if (lastIdx >= 0 && msgs[lastIdx].id === assistantMessageId) {
                    msgs[lastIdx] = {
                      ...msgs[lastIdx],
                      content: accumulatedText,
                      isStreaming: true,
                    };
                  }
                  return { ...c, messages: msgs };
                })
              );
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e: any) {
            if (e.message !== 'Unexpected end of JSON input') {
              console.error('SSE parse error', e);
            }
          }
        }
      }

      // Mark streaming done
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentConvId) return c;
          const msgs = [...c.messages];
          const lastIdx = msgs.length - 1;
          if (lastIdx >= 0 && msgs[lastIdx].id === assistantMessageId) {
            msgs[lastIdx] = {
              ...msgs[lastIdx],
              content: accumulatedText || 'No response generated.',
              isStreaming: false,
            };
          }
          return { ...c, messages: msgs };
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream generation aborted by user.');
      } else {
        console.error('Chat generation error', err);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c;
            const msgs = [...c.messages];
            const lastIdx = msgs.length - 1;
            if (lastIdx >= 0 && msgs[lastIdx].id === assistantMessageId) {
              msgs[lastIdx] = {
                ...msgs[lastIdx],
                content:
                  err.message ||
                  'Something went wrong while connecting to the AI model. Please verify your GEMINI_API_KEY.',
                isStreaming: false,
                error: true,
              };
            }
            return { ...c, messages: msgs };
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Retry an assistant response
  const handleRetry = () => {
    if (!activeConversation || activeConversation.messages.length === 0) return;
    const msgs = [...activeConversation.messages];
    const lastMsg = msgs[msgs.length - 1];
    if (lastMsg.role === 'assistant') {
      // Find the user message before it
      const prevUserMsg = msgs[msgs.length - 2];
      if (prevUserMsg && prevUserMsg.role === 'user') {
        // Remove the failed assistant message and resend
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            return { ...c, messages: msgs.slice(0, -1) };
          })
        );
        handleSendMessage(prevUserMsg.content, prevUserMsg.attachments);
      }
    }
  };

  // Launch workspace from landing or quick prompt
  const handleLaunchWorkspace = (prompt?: string) => {
    setView('chat');
    if (!activeId) {
      handleNewChat();
    }
    if (prompt) {
      setStagedPrompt(prompt);
    }
  };

  const currentMessages = activeConversation?.messages || [];

  // If not logged in, enforce login gate
  if (!session) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#090a0f] text-[#ededef]">
        <LoginGate
          onLoginSuccess={(newSession) => setSession(newSession)}
          onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        />
        <AdminPortalModal
          isOpen={isAdminPortalOpen}
          onClose={() => setIsAdminPortalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090a0f] text-[#ededef]">
      {/* View: Landing Page */}
      {view === 'landing' ? (
        <div className="w-full h-full overflow-y-auto">
          <LandingPage
            onStartChatting={() => handleLaunchWorkspace()}
            onExploreTemplate={(prompt) => handleLaunchWorkspace(prompt)}
          />
        </div>
      ) : (
        /* View: AI Dashboard Workspace */
        <div className="flex w-full h-full overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
            onOpenExplore={() => setIsExploreOpen(true)}
            onOpenFiles={() => setIsFilesOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
            onLogout={handleLogout}
            currentUser={session.username}
            expiresAt={session.expiresAt}
            settings={settings}
            onUpdateSettings={(newSettings) => {
              setSettings(newSettings);
              saveStoredSettings(newSettings);
            }}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Chat Workspace */}
          <main className="flex-1 flex flex-col h-full min-w-0 bg-[#090a0f] relative overflow-hidden">
            {/* Header */}
            <ChatHeader
              onToggleSidebar={() => setIsMobileSidebarOpen(true)}
              onNewChat={handleNewChat}
              onClearChat={handleClearCurrentChat}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenLanding={() => setView('landing')}
              onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
              onExportChat={currentMessages.length > 0 ? handleExportChat : undefined}
              currentModel={activeConversation?.model || settings.defaultModel}
              onSelectModel={handleSelectModel}
              hasMessages={currentMessages.length > 0}
            />

            {/* Chat Messages Body */}
            <div
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-2 ${
                settings.compactMode ? 'space-y-1' : ''
              }`}
            >
              {currentMessages.length === 0 ? (
                /* Empty State / Quick Prompts */
                <QuickPrompts
                  onSelectPrompt={(prompt) => {
                    setStagedPrompt(prompt);
                  }}
                />
              ) : (
                /* Chat Messages List */
                <div className="max-w-4xl mx-auto w-full pt-2 pb-6">
                  {currentMessages.map((msg, idx) => (
                    <ChatMessage
                      key={msg.id || idx}
                      message={msg}
                      showTimestamp={settings.showTimestamps}
                      onRetry={
                        msg.role === 'assistant' && idx === currentMessages.length - 1
                          ? handleRetry
                          : undefined
                      }
                    />
                  ))}
                  <div ref={chatBottomRef} className="h-4" />
                </div>
              )}
            </div>

            {/* Bottom Floating Input */}
            <div className="w-full shrink-0 pt-1">
              <ChatInput
                onSendMessage={handleSendMessage}
                isStreaming={isStreaming}
                onStopStreaming={handleStopStreaming}
                enterToSend={settings.enterToSend}
                initialValue={stagedPrompt}
              />
            </div>
          </main>
        </div>
      )}

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          saveStoredSettings(newSettings);
        }}
      />

      <ExploreModal
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        onSelectPrompt={(prompt) => {
          setStagedPrompt(prompt);
          if (view !== 'chat') setView('chat');
        }}
      />

      <FilesModal
        isOpen={isFilesOpen}
        onClose={() => setIsFilesOpen(false)}
        conversations={conversations}
      />

      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
}
