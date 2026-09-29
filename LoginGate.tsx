import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, AlertCircle, KeyRound } from 'lucide-react';
import { WorksGptLogo } from './WorksGptLogo';
import { authenticateUser } from '../lib/auth-storage';
import { AuthSession } from '../lib/auth-types';

interface LoginGateProps {
  onLoginSuccess: (session: AuthSession) => void;
  onOpenAdminPortal: () => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({
  onLoginSuccess,
  onOpenAdminPortal,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Harap masukkan Username (USN) dan Password (PW).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = authenticateUser(username, password);
      setIsLoading(false);

      if (res.success && res.session) {
        onLoginSuccess(res.session);
      } else {
        setErrorMessage(res.message);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen w-screen bg-[#090a0f] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-[120px] rounded-full animate-soft-glow" />
        <div className="absolute bottom-10 -left-20 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md rounded-2xl bg-[#0d0e16]/95 border border-white/[0.08] shadow-2xl shadow-black/80 backdrop-blur-2xl p-6 sm:p-8 flex flex-col relative z-10">
        
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 relative">
            <WorksGptLogo size={48} showText={false} />
            <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full -z-10" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Works<span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">GPT</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Masuk dengan USN & Password untuk mengakses workspace
          </p>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username (USN) Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username (USN)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] focus:border-indigo-500/60 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password (PW) Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password (PW)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] focus:border-indigo-500/60 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Memverifikasi...</span>
              </span>
            ) : (
              <>
                <span>Masuk ke WorksGPT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Account Indicator */}
        <div className="mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
          <p className="text-[11px] text-slate-400">
            Akun bawaan aktif (1 Day): <br />
            <span className="text-indigo-300 font-mono font-medium">USN: user</span> · <span className="text-indigo-300 font-mono font-medium">PW: user123</span>
          </p>
        </div>

        {/* Admin Portal Shortcut Button */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-slate-500">Khusus Administrator:</span>
          <button
            type="button"
            onClick={onOpenAdminPortal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal Admin</span>
          </button>
        </div>

      </div>

    </div>
  );
};
