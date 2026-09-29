import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  FileText, 
  Terminal, 
  Check, 
  ChevronRight,
  Layers,
  Bot
} from 'lucide-react';
import { WorksGptLogo } from './WorksGptLogo';

interface LandingPageProps {
  onStartChatting: () => void;
  onExploreTemplate?: (prompt: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartChatting,
  onExploreTemplate,
}) => {
  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090a0f] text-slate-100 overflow-hidden flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Background ambient glowing mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-[120px] rounded-full animate-soft-glow" />
        <div className="absolute top-[35%] -left-32 w-[450px] h-[450px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[45%] -right-32 w-[450px] h-[450px] bg-purple-600/10 blur-[130px] rounded-full" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="w-full border-b border-white/[0.06] bg-[#090a0f]/80 backdrop-blur-xl sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <WorksGptLogo size={34} textClassName="text-xl font-bold" />
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button 
              onClick={scrollToFeatures} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <a 
              href="#architecture" 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Architecture
            </a>
            <span className="text-xs text-indigo-400/80 font-mono tracking-wider">
              Gemini 3 Powered
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartChatting}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 pt-12 md:pt-20 pb-20 flex flex-col items-center text-center">
        
        {/* Subtle kicker badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 mb-8 backdrop-blur-md shadow-inner shadow-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-200">WorksGPT v1.0</span>
          <span className="text-white/30">·</span>
          <span className="text-indigo-300">Your AI Workspace, Reimagined</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] sm:leading-[1.12]">
          Work Smarter <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            With AI.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
          A powerful AI workspace designed to help you think, create, code, and get things done.
        </p>

        {/* Dual CTA buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onStartChatting}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98]"
          >
            <span>Start Chatting</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={scrollToFeatures}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Explore WorksGPT</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* AI Orb / Interactive Workspace Simulation Graphic */}
        <div className="relative mt-16 sm:mt-20 w-full max-w-4xl rounded-2xl p-1 bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent shadow-2xl shadow-indigo-950/50">
          <div className="relative w-full rounded-2xl bg-[#0c0d14]/90 backdrop-blur-2xl border border-white/[0.08] overflow-hidden p-6 sm:p-8">
            
            {/* Ambient Orb Element floating behind mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-cyan-500/25 via-indigo-600/35 to-violet-600/25 blur-3xl -z-10 animate-soft-glow pointer-events-none" />

            {/* Neural Graphic in the orb center */}
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">worksgpt-workspace // live</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Gemini Online</span>
              </div>
            </div>

            {/* Preview conversation items inside card */}
            <div className="space-y-4 text-left">
              {/* User Prompt */}
              <div className="flex justify-end">
                <div className="max-w-md bg-indigo-600/20 border border-indigo-500/30 text-slate-200 text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm">
                  Design an end-to-end fullstack architecture for WorksGPT with streaming AI and Vercel edge deployment.
                </div>
              </div>

              {/* AI Response Preview */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>WorksGPT Architecture Engine</span>
                  </div>
                  <p className="text-slate-300">
                    Here is the optimized blueprint using standard route handlers and real-time streaming chunks:
                  </p>
                  <div className="p-3 bg-black/50 border border-white/[0.08] rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto">
                    <code>
                      {`POST /api/chat -> GoogleGenAI(stream: true) -> text/event-stream`}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Quick Action Cards on Mockup */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { title: 'Code System', prompt: 'Help me build a Next.js website' },
                { title: 'Learn Simply', prompt: 'Explain quantum computing simply' },
                { title: 'Executive Write', prompt: 'Write a professional email' },
                { title: 'Debug Logic', prompt: 'Find the problem in my code' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (onExploreTemplate) {
                      onExploreTemplate(item.prompt);
                    } else {
                      onStartChatting();
                    }
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-indigo-500/40 text-left transition-all cursor-pointer group"
                >
                  <p className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.prompt}
                  </p>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Feature Grid Section */}
        <section id="features-section" className="w-full mt-28 text-left scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineered for Modern Productivity
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Everything you need to ideate, write, analyze, and deploy without cognitive friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Technical Excellence</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate production-ready code with complete explanations, formatted syntax highlighting, and 1-click copy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Real-Time Streaming</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Experience instant, low-latency streaming answers driven by Google's latest Gemini 3 models.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Enterprise Security</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Server-side token protection. Your API keys are shielded from client bundles, keeping your keys private.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture details */}
        <section id="architecture" className="w-full mt-24 text-left p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                <Cpu className="w-4 h-4" />
                <span>Ready for Local & Vercel Deployment</span>
              </div>
              <h3 className="text-xl font-bold text-white">Deploy to Vercel in Minutes</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                WorksGPT is designed with zero lock-in: run it locally with Vite + Express or deploy serverlessly directly to Vercel with environment variable support.
              </p>
            </div>
            <button
              onClick={onStartChatting}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-200 transition-colors cursor-pointer shrink-0 active:scale-95 shadow-md shadow-white/10"
            >
              Get Started Now
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <WorksGptLogo size={22} textClassName="text-sm font-semibold" />
            <span className="text-slate-600">|</span>
            <span>Your AI Workspace, Reimagined.</span>
          </div>
          <div>
            <span>WorksGPT v1.0.0 · Powered by Gemini API</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
