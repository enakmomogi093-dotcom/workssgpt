import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  Trash2, 
  Settings as SettingsIcon, 
  ChevronDown, 
  Sparkles, 
  Check, 
  Cpu, 
  Home,
  Download,
  KeyRound
} from 'lucide-react';
import { WorksGptLogo } from './WorksGptLogo';
import { SUPPORTED_MODELS } from '../lib/gemini-config';
import { ModelOption } from '../lib/chat-types';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onClearChat: () => void;
  onOpenSettings: () => void;
  onOpenLanding: () => void;
  onOpenAdminPortal?: () => void;
  onExportChat?: () => void;
  currentModel: string;
  onSelectModel: (modelId: string) => void;
  hasMessages: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onToggleSidebar,
  onNewChat,
  onClearChat,
  onOpenSettings,
  onOpenLanding,
  onOpenAdminPortal,
  onExportChat,
  currentModel,
  onSelectModel,
  hasMessages,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeModelObj = SUPPORTED_MODELS.find((m) => m.id === currentModel) || SUPPORTED_MODELS[0];

  return (
    <header className="h-14 sm:h-16 border-b border-white/[0.06] bg-[#090a0f]/80 backdrop-blur-xl px-3 sm:px-5 flex items-center justify-between z-20 shrink-0 select-none">
      
      {/* Left: Mobile Sidebar Trigger + Brand & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenLanding}
            className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer"
            title="WorksGPT Home"
          >
            <WorksGptLogo size={28} textClassName="text-base font-bold hidden sm:inline" />
          </button>

          {/* AI Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Online</span>
          </div>
        </div>
      </div>

      {/* Center: Model Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.15] text-xs font-medium text-slate-200 transition-all cursor-pointer shadow-sm"
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[120px] sm:max-w-[160px]">
            {activeModelObj.name}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {modelDropdownOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0e1018] border border-white/[0.1] shadow-2xl shadow-black/80 p-2 z-50 backdrop-blur-2xl">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
              Select AI Engine
            </div>

            <div className="space-y-1">
              {SUPPORTED_MODELS.map((model) => {
                const isSelected = model.id === currentModel;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-600/15 border border-indigo-500/30 text-white' 
                        : 'hover:bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{model.name}</span>
                        {model.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                        {model.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: New Chat, Clear, Export, Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all cursor-pointer active:scale-95"
          title="New Chat"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {hasMessages && (
          <>
            {onExportChat && (
              <button
                onClick={onExportChat}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                title="Export Conversation as Markdown"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClearChat}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}

        {onOpenAdminPortal && (
          <button
            onClick={onOpenAdminPortal}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors cursor-pointer"
            title="Portal Admin"
            aria-label="Portal Admin"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
          title="Settings"
          aria-label="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
