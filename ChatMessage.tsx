import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  RotateCw, 
  FileText, 
  AlertCircle, 
  Bot, 
  User,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../lib/chat-types';
import { MarkdownContent } from './MarkdownContent';
import { WorksGptLogo } from './WorksGptLogo';

interface ChatMessageProps {
  message: ChatMessageType;
  onRetry?: () => void;
  showTimestamp?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRetry,
  showTimestamp = true,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <div className="flex flex-col items-end mb-6 group">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-indigo-600/90 to-indigo-700/90 text-white px-4 py-3 shadow-md shadow-indigo-950/30 border border-indigo-400/20">
          
          {/* Attachments preview if user uploaded any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {message.attachments.map((att) => (
                <div 
                  key={att.id}
                  className="rounded-lg bg-black/30 border border-white/10 p-1.5 flex items-center gap-2 max-w-xs overflow-hidden"
                >
                  {att.type === 'image' && att.base64Data ? (
                    <img 
                      src={`data:${att.mimeType};base64,${att.base64Data}`} 
                      alt={att.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-xs text-slate-200 truncate pr-1">
                    <p className="font-medium truncate max-w-[120px]">{att.name}</p>
                    <p className="text-[10px] text-slate-400">{(att.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* User message text */}
          <div className="text-[14.5px] leading-relaxed whitespace-pre-wrap break-words font-normal">
            {message.content}
          </div>
        </div>

        {/* Timestamp */}
        {showTimestamp && (
          <div className="text-[11px] text-slate-500 mt-1 mr-1">
            {formattedTime}
          </div>
        )}
      </div>
    );
  }

  // Assistant / AI Message Layout
  return (
    <div className="flex gap-3 sm:gap-4 mb-8 group max-w-full">
      {/* WorksGPT AI Avatar */}
      <div className="shrink-0 mt-0.5">
        <WorksGptLogo size={32} showText={false} />
      </div>

      <div className="flex-1 min-w-0">
        {/* AI Header Line */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="font-semibold text-sm text-white tracking-tight">WorksGPT</span>
          
          {message.model && (
            <span className="text-[11px] text-indigo-400/80 font-mono">
              {message.model.replace('gemini-', '')}
            </span>
          )}

          {showTimestamp && (
            <span className="text-[11px] text-slate-500">
              · {formattedTime}
            </span>
          )}
        </div>

        {/* Message Content or Error */}
        {message.error ? (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="space-y-1">
              <p className="font-medium text-rose-200">Something went wrong. Please try again.</p>
              <p className="text-xs text-rose-400/90">{message.content}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-medium text-rose-200 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Retry Request</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-slate-200">
            {message.isStreaming && message.content === '' ? (
              <div className="flex items-center gap-2 py-2 text-slate-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="italic">WorksGPT is thinking...</span>
              </div>
            ) : (
              <MarkdownContent content={message.content} />
            )}
          </div>
        )}

        {/* Action Toolbar on hover */}
        {!message.isStreaming && !message.error && message.content && (
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopyMessage}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
                title="Regenerate answer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
