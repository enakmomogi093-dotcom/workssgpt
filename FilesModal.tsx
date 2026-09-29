import React from 'react';
import { X, FolderArchive, FileText, Upload, AlertCircle } from 'lucide-react';
import { Conversation } from '../lib/chat-types';

interface FilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
}

export const FilesModal: React.FC<FilesModalProps> = ({
  isOpen,
  onClose,
  conversations,
}) => {
  if (!isOpen) return null;

  // Collect all attachments across conversations
  const allAttachments = conversations.flatMap((c) =>
    (c.messages || []).flatMap((m) =>
      (m.attachments || []).map((att) => ({
        ...att,
        conversationTitle: c.title,
        timestamp: m.timestamp,
      }))
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-[#0d0e16] border border-white/[0.08] shadow-2xl shadow-black/80 overflow-hidden flex flex-col text-slate-200"
      >
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-violet-400" />
            <h3 className="font-bold text-base text-white">Workspace Files & Assets</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <Upload className="w-4 h-4 shrink-0" />
            <span>
              Supports images (multimodal vision processing) and text documents (markdown, code, JSON, plain text).
            </span>
          </div>

          {allAttachments.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center">
              <FileText className="w-8 h-8 mb-2 opacity-30" />
              <p>No attached files in your workspace yet.</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Upload files or images in any conversation using the paperclip icon.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {allAttachments.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-slate-200 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">
                        Used in “{item.conversationTitle}” · {(item.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0 px-2 py-0.5 rounded bg-white/[0.04]">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
