export interface UserAccount {
  id: string;
  username: string;
  password: string; // stored for credential matching
  durationDays: number;
  createdAt: number;
  expiresAt: number;
}

export interface AuthSession {
  username: string;
  expiresAt: number;
  loginTime: number;
}

export interface AdminStats {
  total: number;
  active: number;
  expired: number;
}
