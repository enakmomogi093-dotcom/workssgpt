import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export const WorksGptLogo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  showText = true,
  textClassName = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#12131e] via-[#0d0e15] to-[#08080c] border border-white/10 shadow-lg shadow-indigo-950/40 p-1.5 transition-transform hover:scale-105 duration-300"
        style={{ width: size, height: size }}
      >
        {/* Ambient subtle back glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-violet-500/20 blur-[6px] -z-10" />

        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="worksGradient" x1="2" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#818cf8" />
              <stop offset="85%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <radialGradient id="neuralCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Abstract faceted 'W' formed of interconnected neural vectors */}
          <path
            d="M 5 8 L 10 24 L 16 13 L 22 24 L 27 8"
            stroke="url(#worksGradient)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Neural Synapse Nodes */}
          <circle cx="5" cy="8" r="2" fill="#38bdf8" />
          <circle cx="10" cy="24" r="2.2" fill="#818cf8" />
          <circle cx="16" cy="13" r="2.5" fill="#a855f7" />
          <circle cx="22" cy="24" r="2.2" fill="#c084fc" />
          <circle cx="27" cy="8" r="2" fill="#f43f5e" />

          {/* Central Neural Pulse Core */}
          <circle cx="16" cy="13" r="4.5" fill="url(#neuralCoreGlow)" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-white ${textClassName || 'text-lg'}`}>
              Works<span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">GPT</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
