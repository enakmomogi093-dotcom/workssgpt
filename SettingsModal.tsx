import React, { useState } from 'react';
import { 
  X, 
  Moon, 
  Sun, 
  Laptop, 
  Sliders, 
  MessageSquare, 
  Info, 
  Check, 
  Cpu, 
  ShieldCheck,
  Server
} from 'lucide-react';
import { AppSettings } from '../lib/chat-types';
import { SUPPORTED_MODELS } from '../lib/gemini-config';
import { WorksGptLogo } from './WorksGptLogo';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'about'>('general');
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    onSave(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-[#0d0e16] border border-white/[0.08] shadow-2xl shadow-black/80 overflow-hidden flex flex-col text-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-white/[0.06] px-6 bg-white/[0.01]">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            General & Chat
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ai'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Engine
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            About
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6 text-sm">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Appearance */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Appearance
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'system', label: 'System', icon: Laptop },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = formData.appearance === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, appearance: item.id as any })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Behaviors */}
              <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Chat Behaviors
                </label>

                {/* Enter to Send */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <p className="font-medium text-white text-xs">Enter to Send</p>
                    <p className="text-[11px] text-slate-400">Pressing Enter sends the message; Shift+Enter inserts a new line</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.enterToSend}
                    onChange={(e) => setFormData({ ...formData, enterToSend: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* Show Timestamps */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <p className="font-medium text-white text-xs">Show Timestamps</p>
                    <p className="text-[11px] text-slate-400">Display the time of each sent and received message</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showTimestamps}
                    onChange={(e) => setFormData({ ...formData, showTimestamps: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* Compact Mode */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <p className="font-medium text-white text-xs">Compact View</p>
                    <p className="text-[11px] text-slate-400">Reduce spacing between messages for high density</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.compactMode}
                    onChange={(e) => setFormData({ ...formData, compactMode: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              {/* Default Model */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Default AI Model
                </label>
                <div className="space-y-2">
                  {SUPPORTED_MODELS.map((model) => {
                    const isSelected = formData.defaultModel === model.id;
                    return (
                      <div
                        key={model.id}
                        onClick={() => setFormData({ ...formData, defaultModel: model.id })}
                        className={`p-3 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
                            : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{model.name}</span>
                            {model.badge && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                {model.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{model.description}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Creativity (Temperature)
                  </label>
                  <span className="text-xs font-mono font-medium text-indigo-400">
                    {formData.temperature.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0.0 (Precise / Code)</span>
                  <span>0.7 (Balanced)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-5 text-center py-4">
              <div className="flex justify-center">
                <WorksGptLogo size={48} showText={false} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">WorksGPT</h4>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">“Your AI Workspace, Reimagined.”</p>
                <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                  A high-performance modern workspace designed for coding, ideating, and professional problem solving with Google's Gemini models.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-400">App Version</span>
                  <span className="text-white font-mono">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Engine Protocol</span>
                  <span className="text-emerald-400 font-mono">Gemini GenAI SDK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deployment Target</span>
                  <span className="text-cyan-400 font-mono">Vercel & AI Studio</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            {savedToast ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
};
