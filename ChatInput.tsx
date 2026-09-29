import React, { useRef, useState, useEffect } from 'react';
import { 
  Send, 
  Square, 
  Paperclip, 
  Mic, 
  MicOff, 
  X, 
  Image as ImageIcon, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Attachment } from '../lib/chat-types';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  enterToSend: boolean;
  disabled?: boolean;
  initialValue?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  enterToSend,
  disabled = false,
  initialValue = '',
}) => {
  const [input, setInput] = useState(initialValue);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync initialValue when set externally (e.g. from quick prompt card)
  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialValue]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 48), 200)}px`;
    }
  }, [input]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeech = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech error', err);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError(null);

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Max 10MB limit per file
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds 10MB limit`);
        continue;
      }

      const isImage = file.type.startsWith('image/');
      
      try {
        if (isImage) {
          const base64Data = await readFileAsBase64(file);
          newAttachments.push({
            id: 'att_' + Date.now() + '_' + i,
            name: file.name,
            type: 'image',
            mimeType: file.type || 'image/png',
            size: file.size,
            base64Data,
          });
        } else {
          // Check if readable as text
          const textExtensions = ['.txt', '.md', '.json', '.js', '.ts', '.tsx', '.jsx', '.py', '.html', '.css', '.csv'];
          const isText = textExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
          
          if (isText) {
            const textContent = await readFileAsText(file);
            newAttachments.push({
              id: 'att_' + Date.now() + '_' + i,
              name: file.name,
              type: 'file',
              mimeType: file.type || 'text/plain',
              size: file.size,
              textSnippet: textContent,
            });
          } else {
            // PDF or DOCX file metadata indicator
            newAttachments.push({
              id: 'att_' + Date.now() + '_' + i,
              name: file.name,
              type: 'file',
              mimeType: file.type || 'application/octet-stream',
              size: file.size,
              textSnippet: `[Attached File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`,
            });
          }
        }
      } catch (err) {
        console.error('Error reading file', err);
        setUploadError(`Could not read ${file.name}`);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // extract base64 payload from data:...;base64,....
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if ((!trimmed && attachments.length === 0) || isStreaming || disabled) return;

    onSendMessage(trimmed, attachments.length > 0 ? attachments : undefined);
    setInput('');
    setAttachments([]);
    setUploadError(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (enterToSend) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const hasContent = input.trim().length > 0 || attachments.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Upload error banner if any */}
      {uploadError && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {uploadError}
          </span>
          <button onClick={() => setUploadError(null)}>
            <X className="w-3.5 h-3.5 cursor-pointer" />
          </button>
        </div>
      )}

      {/* Main Glassmorphic Input Container */}
      <div className={`relative rounded-2xl bg-[#0c0d14]/90 backdrop-blur-xl border transition-all duration-200 ${
        hasContent 
          ? 'border-indigo-500/40 shadow-xl shadow-indigo-950/30' 
          : 'border-white/[0.08] shadow-lg shadow-black/40'
      }`}>
        
        {/* Attachment preview tray */}
        {attachments.length > 0 && (
          <div className="p-3 border-b border-white/[0.06] flex flex-wrap gap-2 items-center">
            {attachments.map((att) => (
              <div 
                key={att.id}
                className="group relative flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-200"
              >
                {att.type === 'image' && att.base64Data ? (
                  <img 
                    src={`data:${att.mimeType};base64,${att.base64Data}`} 
                    alt={att.name}
                    className="w-5 h-5 object-cover rounded" 
                  />
                ) : (
                  <FileText className="w-4 h-4 text-indigo-400" />
                )}
                <span className="truncate max-w-[140px] font-medium">{att.name}</span>
                <span className="text-[10px] text-slate-500">
                  ({(att.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <span className="text-[11px] text-slate-500 font-mono">
              {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
            </span>
          </div>
        )}

        {/* Textarea */}
        <div className="px-4 pt-3.5 pb-2 flex items-start">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask WorksGPT anything... (Shift + Enter for new line)"
            className="w-full bg-transparent resize-none text-[15px] text-slate-100 placeholder:text-slate-500 focus:outline-none leading-relaxed max-h-[200px]"
          />
        </div>

        {/* Bottom Toolbar */}
        <div className="px-3 pb-3 flex items-center justify-between gap-2">
          {/* Left Buttons: File Attachment, Mic */}
          <div className="flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,.txt,.md,.json,.js,.ts,.tsx,.py,.html,.css,.csv,.pdf,.docx"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Attach files (Images, TXT, PDF, DOCX)"
              disabled={isStreaming || disabled}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleSpeech}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isListening 
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input (Speech to text)'}
              disabled={isStreaming || disabled}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Right Buttons: Character count & Send/Stop Button */}
          <div className="flex items-center gap-3">
            {input.length > 50 && (
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                {input.length} chars
              </span>
            )}

            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-md shadow-rose-950/40"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!hasContent || disabled}
                className={`relative flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  hasContent && !disabled
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95'
                    : 'bg-white/[0.04] text-slate-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      <div className="mt-2 text-center text-[11px] text-slate-500">
        WorksGPT may produce concise answers. Verify sensitive facts.
      </div>
    </div>
  );
};
