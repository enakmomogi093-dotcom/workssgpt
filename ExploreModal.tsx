import React from 'react';
import { X, Sparkles, Code2, PenTool, Search, Cpu, ArrowUpRight } from 'lucide-react';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

const TEMPLATES = [
  {
    category: 'Development',
    title: 'Full-Stack Architecture Spec',
    prompt: 'Design a scalable fullstack SaaS architecture using Next.js App Router, Tailwind CSS, TypeScript, and serverless background workers.',
    icon: Code2,
    gradient: 'from-blue-500/20 to-indigo-500/20 text-blue-400',
  },
  {
    category: 'Engineering',
    title: 'Code Performance & Refactor',
    prompt: 'Analyze this code snippet for memory leaks, O(n) algorithmic complexity bottlenecks, and modern TypeScript idioms: \n\n[paste code here]',
    icon: Cpu,
    gradient: 'from-indigo-500/20 to-purple-500/20 text-indigo-400',
  },
  {
    category: 'Product & Writing',
    title: 'Investor Pitch & Executive Summary',
    prompt: 'Draft a compelling 1-page executive summary for a seed-stage venture round emphasizing product-market fit, unit economics, and competitive defensibility.',
    icon: PenTool,
    gradient: 'from-violet-500/20 to-pink-500/20 text-violet-400',
  },
  {
    category: 'Strategy & Research',
    title: 'Competitive Breakdown',
    prompt: 'Conduct a thorough deep-dive matrix comparing current state-of-the-art AI developer tooling, strengths, weaknesses, and pricing tiers.',
    icon: Search,
    gradient: 'from-emerald-500/20 to-cyan-500/20 text-emerald-400',
  },
];

export const ExploreModal: React.FC<ExploreModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-[#0d0e16] border border-white/[0.08] shadow-2xl shadow-black/80 overflow-hidden flex flex-col text-slate-200"
      >
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Explore WorksGPT Templates</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-4">
          <p className="text-xs text-slate-400">
            Select a curated workspace template to instantly prime WorksGPT with domain-specific context.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {TEMPLATES.map((tmpl, idx) => {
              const Icon = tmpl.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectPrompt(tmpl.prompt);
                    onClose();
                  }}
                  className="group p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${tmpl.gradient}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 block mb-1">
                      {tmpl.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-indigo-200 transition-colors">
                      {tmpl.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {tmpl.prompt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
