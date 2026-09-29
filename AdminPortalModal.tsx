import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  KeyRound, 
  UserPlus, 
  Users, 
  Trash2, 
  Clock, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Calendar,
  Lock,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { UserAccount } from '../lib/auth-types';
import { 
  getAccounts, 
  createAccount, 
  deleteAccount, 
  verifyAdminPassword,
  formatRemainingTime 
} from '../lib/auth-storage';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  // State: whether admin password has been verified
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Form state to create new user
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [durationDays, setDurationDays] = useState<number>(1);
  const [createMsg, setCreateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Accounts list
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});

  // Refresh accounts list
  const loadAccounts = () => {
    // getAccounts() automatically purges expired accounts
    const accs = getAccounts();
    setAccounts(accs);
  };

  useEffect(() => {
    if (isOpen && isAdminUnlocked) {
      loadAccounts();
    }
  }, [isOpen, isAdminUnlocked]);

  // Clean form state on close
  const handleClose = () => {
    setAdminPasswordInput('');
    setAdminAuthError(null);
    setCreateMsg(null);
    onClose();
  };

  // Admin authentication check (Admin PW "32145" verified securely without displaying)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);

    const isMatch = verifyAdminPassword(adminPasswordInput);
    if (isMatch) {
      setIsAdminUnlocked(true);
      setAdminPasswordInput('');
      loadAccounts();
    } else {
      setAdminAuthError('Password Admin salah. Akses ditolak.');
    }
  };

  // Handle user creation
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);

    const res = createAccount(newUsername, newPassword, durationDays);
    if (res.success) {
      setCreateMsg({ type: 'success', text: `Akun "${newUsername}" berhasil dibuat dengan masa aktif ${durationDays} hari.` });
      setNewUsername('');
      setNewPassword('');
      setDurationDays(1);
      loadAccounts();
    } else {
      setCreateMsg({ type: 'error', text: res.message });
    }
  };

  // Handle user deletion
  const handleDeleteUser = (id: string, username: string) => {
    if (window.confirm(`Yakin ingin menghapus akun "${username}"?`)) {
      deleteAccount(id);
      loadAccounts();
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-[#0c0d15] border border-white/[0.09] shadow-2xl shadow-black/90 overflow-hidden flex flex-col text-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">Portal Administrator</h3>
              <p className="text-[11px] text-slate-400">Manajemen Pengguna & Masa Berlaku Akun</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {!isAdminUnlocked ? (
            /* Admin Password Gatekeeper (Password strictly masked and never shown) */
            <div className="max-w-sm mx-auto py-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>

              <h4 className="text-lg font-bold text-white mb-1">Akses Khusus Admin</h4>
              <p className="text-xs text-slate-400 mb-6">
                Masukkan Password Admin untuk mengelola akun pengguna dan durasi masa berlaku.
              </p>

              {adminAuthError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{adminAuthError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Masukkan Password Admin"
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-sm text-center text-white placeholder:text-slate-500 focus:outline-none transition-colors tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all cursor-pointer active:scale-95"
                >
                  Buka Portal Admin
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked Admin Dashboard */
            <div className="space-y-6">
              
              {/* Notification Banner */}
              {createMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    createMsg.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {createMsg.type === 'success' ? (
                    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{createMsg.text}</span>
                </div>
              )}

              {/* Form Create Username & Password + Day */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Buat Akun Baru (Create USN & PW)
                  </h4>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Username (USN) */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Username (USN)
                      </label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Contoh: member1"
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-indigo-500/60 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>

                    {/* Password (PW) */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Password (PW)
                      </label>
                      <input
                        type="text"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Contoh: pass123"
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-indigo-500/60 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Duration in Days */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-medium text-slate-300">
                        Masa Berlaku Akun (Hari / Days)
                      </label>
                      <span className="text-[11px] font-mono text-indigo-400">
                        {durationDays} Hari ({durationDays * 24} Jam)
                      </span>
                    </div>

                    {/* Quick day buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {[1, 3, 7, 30].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setDurationDays(days)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            durationDays === days
                              ? 'bg-indigo-600 text-white font-semibold'
                              : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                          }`}
                        >
                          {days} Hari
                        </button>
                      ))}

                      {/* Custom number input */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-[11px] text-slate-400">Kustom:</span>
                        <input
                          type="number"
                          min={1}
                          max={365}
                          value={durationDays}
                          onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 bg-black/40 border border-white/[0.08] focus:border-indigo-500/60 rounded-lg px-2 py-1 text-xs text-center text-white focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-400">hari</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Buat Akun Sekarang</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Registered Accounts List & Auto Delete Info */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                      Daftar Akun Aktif ({accounts.length})
                    </h4>
                  </div>

                  <button
                    onClick={loadAccounts}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    title="Perbarui daftar dan bersihkan akun kedaluwarsa"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Periksa & Bersihkan</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 mb-3 bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-lg flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>
                    <strong>Sistem Auto-Delete:</strong> Akun yang telah melewati masa berlaku hari akan otomatis dihapus dan tidak dapat login kembali.
                  </span>
                </div>

                {accounts.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs text-slate-500">
                    Belum ada akun aktif terdaftar.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {accounts.map((acc) => {
                      const isVisible = visiblePasswords[acc.id];
                      const remainingText = formatRemainingTime(acc.expiresAt);
                      const isExpired = Date.now() > acc.expiresAt;

                      return (
                        <div
                          key={acc.id}
                          className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">
                                {acc.username}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                                {acc.durationDays} Day{acc.durationDays > 1 ? 's' : ''}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                              <span>PW:</span>
                              <span className="font-mono text-slate-300">
                                {isVisible ? acc.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(acc.id)}
                                className="text-slate-500 hover:text-slate-300"
                              >
                                {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Dibuat: {new Date(acc.createdAt).toLocaleDateString()}
                              </span>
                              <span>·</span>
                              <span>
                                Kedaluwarsa: {new Date(acc.expiresAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Remaining status */}
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                              isExpired 
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {remainingText}
                            </span>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteUser(acc.id, acc.username)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Hapus akun"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        {isAdminUnlocked && (
          <div className="px-6 py-3 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
            <button
              onClick={() => {
                setIsAdminUnlocked(false);
                setAdminPasswordInput('');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Mode Admin</span>
            </button>

            <button
              onClick={handleClose}
              className="px-4 py-1.5 rounded-xl text-xs font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
