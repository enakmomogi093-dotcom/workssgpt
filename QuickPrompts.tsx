import React from 'react';
import { Code2, BookOpen, PenLine, Lightbulb, Bug, Sparkles } from 'lucide-react';
import { WorksGptLogo } from './WorksGptLogo';

interface QuickPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

const PROMPT_ITEMS = [
  {
    category: 'Code',
    prompt: 'Help me build a Next.js website',
    icon: Code2,
    gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400',
  },
  {
    category: 'Learn',
    prompt: 'Explain this topic simply',
    icon: BookOpen,
    gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400',
  },
  {
    category: 'Write',
    prompt: 'Write a professional email',
    icon: PenLine,
    gradient: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400',
  },
  {
    category: 'Brainstorm',
    prompt: 'Give me ideas for my next project',
    icon: Lightbulb,
    gradient: 'from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-400',
  },
  {
    category: 'Debug',
    prompt: 'Find the problem in my code',
    icon: Bug,
    gradient: 'from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-400',
  },
];

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center max-w-3xl mx-auto my-auto animate-fadeIn">
      {/* Brand Icon and Heading */}
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-4 relative">
          <WorksGptLogo size={52} showText={false} />
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full -z-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          What will you create today?
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          Ask a question, start a project, or explore an idea.
        </p>
      </div>

      {/* Cards: What can I help with? */}
      <div className="w-full">
        <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
          What can I help with?
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROMPT_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPrompt(item.prompt)}
                className="group relative flex flex-col text-left p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-indigo-500/30 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-indigo-950/30"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`p-1.5 rounded-lg border bg-gradient-to-br ${item.gradient}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  “{item.prompt}”
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
