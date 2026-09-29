import { UserAccount, AuthSession } from './auth-types';

const STORAGE_KEY_USERS = 'worksgpt_users_v1';
const STORAGE_KEY_SESSION = 'worksgpt_auth_session_v1';
const ADMIN_PASSWORD_HASH = '32145'; // Configured master admin secret

// Initialize default seed user if empty
const initializeSeedUsers = (): UserAccount[] => {
  const now = Date.now();
  const seed: UserAccount[] = [
    {
      id: 'usr_default_demo',
      username: 'user',
      password: 'user123',
      durationDays: 1,
      createdAt: now,
      expiresAt: now + 1 * 24 * 60 * 60 * 1000, // 1 day
    },
  ];
  return seed;
};

/**
 * Automatically purges and returns only non-expired accounts.
 * If any account has exceeded its expiry date, it is automatically deleted.
 */
export const getAccounts = (): UserAccount[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    let accounts: UserAccount[] = raw ? JSON.parse(raw) : initializeSeedUsers();

    const now = Date.now();
    // Auto delete accounts whose expiry date has passed
    const activeAccounts = accounts.filter((acc) => acc.expiresAt > now);

    // If any expired accounts were removed or it was initialized, update storage
    if (activeAccounts.length !== accounts.length || !raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(activeAccounts));
    }

    return activeAccounts;
  } catch (e) {
    console.error('Failed to get accounts', e);
    return [];
  }
};

/**
 * Create a new account with custom duration in days
 */
export const createAccount = (
  username: string,
  password: string,
  durationDays: number
): { success: boolean; message: string; account?: UserAccount } => {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    return { success: false, message: 'Username dan Password tidak boleh kosong.' };
  }

  if (durationDays <= 0) {
    return { success: false, message: 'Masa berlaku hari minimal 1 hari.' };
  }

  const accounts = getAccounts();

  // Check if username already exists
  if (accounts.some((acc) => acc.username.toLowerCase() === cleanUsername)) {
    return { success: false, message: `Username "${cleanUsername}" sudah digunakan.` };
  }

  const now = Date.now();
  const expiresAt = now + durationDays * 24 * 60 * 60 * 1000;

  const newAccount: UserAccount = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    username: cleanUsername,
    password: cleanPassword,
    durationDays,
    createdAt: now,
    expiresAt,
  };

  const updated = [newAccount, ...accounts];
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));
    return { success: true, message: 'Akun berhasil dibuat!', account: newAccount };
  } catch (e) {
    return { success: false, message: 'Gagal menyimpan akun.' };
  }
};

/**
 * Delete an account manually by ID
 */
export const deleteAccount = (id: string): boolean => {
  try {
    const accounts = getAccounts();
    const updated = accounts.filter((acc) => acc.id !== id);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Authenticate username and password with auto expiration verification
 */
export const authenticateUser = (
  username: string,
  password: string
): { success: boolean; message: string; session?: AuthSession } => {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Purge expired accounts first
  const accounts = getAccounts();

  const user = accounts.find((acc) => acc.username.toLowerCase() === cleanUsername);

  if (!user) {
    return {
      success: false,
      message: 'Username tidak ditemukan atau masa berlaku akun telah berakhir.',
    };
  }

  if (user.password !== cleanPassword) {
    return {
      success: false,
      message: 'Password yang dimasukkan salah.',
    };
  }

  const now = Date.now();
  if (now > user.expiresAt) {
    // Auto delete expired account
    deleteAccount(user.id);
    return {
      success: false,
      message: 'Masa berlaku akun telah habis (Expired) dan telah dihapus secara otomatis.',
    };
  }

  const session: AuthSession = {
    username: user.username,
    expiresAt: user.expiresAt,
    loginTime: now,
  };

  setSession(session);
  return { success: true, message: 'Login berhasil.', session };
};

/**
 * Session management
 */
export const getCurrentSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);

    // If session expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
};

export const setSession = (session: AuthSession): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to set session', e);
  }
};

export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
};

/**
 * Verify Admin Password: "32145"
 * The password is strictly checked and never displayed in the UI.
 */
export const verifyAdminPassword = (input: string): boolean => {
  return input.trim() === ADMIN_PASSWORD_HASH;
};

/**
 * Helper to format remaining time nicely (e.g., "23 jam 40 mnt tersisa" or "2 hari tersisa")
 */
export const formatRemainingTime = (expiresAt: number): string => {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return 'Kedaluwarsa (Expired)';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} hari ${hours} jam lagi`;
  }
  if (hours > 0) {
    return `${hours} jam ${minutes} menit lagi`;
  }
  return `${minutes} menit lagi`;
};
