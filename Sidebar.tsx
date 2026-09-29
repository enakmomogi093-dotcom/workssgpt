import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Compass, 
  FolderArchive, 
  Settings as SettingsIcon, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search, 
  ChevronLeft, 
  Moon, 
  Sun,
  Laptop,
  Sparkles,
  Bot,
  LogOut,
  KeyRound,
  Clock
} from 'lucide-react';
import { Conversation, AppSettings } from '../lib/chat-types';
import { WorksGptLogo } from './WorksGptLogo';
import { formatRemainingTime } from '../lib/auth-storage';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onOpenExplore: () => void;
  onOpenFiles: () => void;
  onOpenSettings: () => void;
  onOpenAdminPortal?: () => void;
  onLogout?: () => void;
  currentUser?: string;
  expiresAt?: number;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onOpenExplore,
  onOpenFiles,
  onOpenSettings,
  onOpenAdminPortal,
  onLogout,
  currentUser,
  expiresAt,
  settings,
  onUpdateSettings,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const toggleTheme = () => {
    const nextTheme = settings.appearance === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, appearance: nextTheme });
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-[#08090e] border-r border-white/[0.06] select-none text-slate-300">
      
      {/* Top Header: Brand + Collapse button */}
      <div className="h-14 sm:h-16 px-4 flex items-center justify-between border-b border-white/[0.06] shrink-0">
        {!isCollapsed ? (
          <WorksGptLogo size={30} textClassName="text-lg font-bold" />
        ) : (
          <WorksGptLogo size={30} showText={false} />
        )}

        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Action: New Chat */}
      <div className="p-3 shrink-0">
        <button
          onClick={() => {
            onNewChat();
            if (window.innerWidth < 768) onCloseMobile();
          }}
          className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="New Chat"
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Secondary Navigation Menu */}
      {!isCollapsed && (
        <div className="px-3 pb-2 space-y-1 shrink-0 border-b border-white/[0.06]">
          <button
            onClick={onOpenExplore}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Explore Templates</span>
          </button>

          <button
            onClick={onOpenFiles}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <FolderArchive className="w-4 h-4 text-violet-400" />
            <span>Workspace Files</span>
          </button>
        </div>
      )}

      {/* Search Input */}
      {!isCollapsed && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 min-h-0">
        {!isCollapsed && (
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Chat History
          </div>
        )}

        {filteredConversations.length === 0 ? (
          !isCollapsed && (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              {searchQuery ? 'No matching chats' : 'No chats yet'}
            </div>
          )
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            const isEditing = editingId === conv.id;

            if (isCollapsed) {
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    isActive ? 'bg-indigo-600/20 text-white' : 'hover:bg-white/[0.04] text-slate-400'
                  }`}
                  title={conv.title}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              );
            }

            return (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  if (window.innerWidth < 768) onCloseMobile();
                }}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/15 text-white font-medium border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  
                  {isEditing ? (
                    <form 
                      onSubmit={(e) => handleSaveRename(conv.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center gap-1"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-black/60 border border-indigo-500/50 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                      />
                      <button 
                        type="submit" 
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingId(null)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </form>
                  ) : (
                    <span className="truncate">{conv.title || 'Untitled Chat'}</span>
                  )}
                </div>

                {/* Edit & Delete Action buttons on hover */}
                {!isEditing && (
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => startRename(conv, e)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Profile Bar & Settings */}
      <div className="p-3 border-t border-white/[0.06] shrink-0 bg-white/[0.01]">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {/* User profile item */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20 uppercase">
                  {currentUser ? currentUser.slice(0, 2) : 'WG'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-white truncate max-w-[90px]">
                      {currentUser || 'WorksGPT User'}
                    </p>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      ACTIVE
                    </span>
                  </div>
                  {expiresAt ? (
                    <p className="text-[10px] text-indigo-400 font-mono truncate flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatRemainingTime(expiresAt)}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-500 truncate">Vercel Ready</p>
                  )}
                </div>
              </div>

              {/* Theme & Settings Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Toggle Light/Dark Theme"
                >
                  {settings.appearance === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={onOpenSettings}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Settings"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action bar: Admin Portal & Logout */}
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
              {onOpenAdminPortal && (
                <button
                  onClick={onOpenAdminPortal}
                  className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  title="Buka Portal Admin"
                >
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span>Admin</span>
                </button>
              )}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer ml-auto"
                  title="Keluar dari akun"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:block h-screen transition-all duration-300 shrink-0 z-30 ${
          isCollapsed ? 'w-16' : 'w-64 lg:w-72'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
