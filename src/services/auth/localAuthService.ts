// Local MVP authentication.
//
// This is NOT real security. Passwords are accepted as-is and never sent
// anywhere. When the cloud backend is added, replace this implementation
// with a service that talks to FastAPI and use proper auth flows.

import { userRepository, type LocalUser } from '@/services/storage/userRepository';

const SESSION_KEY = 'cpd:session';

interface SessionRecord {
  userId: string;
  loggedInAt: string;
}

export interface AuthResult {
  user: LocalUser;
}

export const localAuthService = {
  async login(email: string, _password: string): Promise<AuthResult> {
    if (!email.trim()) throw new Error('Email is required.');
    let user = await userRepository.findByEmail(email);
    if (!user) {
      // Local MVP behavior: unknown email creates a local profile.
      user = await userRepository.create(email);
    }
    persistSession({ userId: user.id, loggedInAt: new Date().toISOString() });
    return { user };
  },

  async register(email: string, _password: string, displayName?: string): Promise<AuthResult> {
    if (!email.trim()) throw new Error('Email is required.');
    const existing = await userRepository.findByEmail(email);
    const user = existing ?? (await userRepository.create(email, displayName));
    if (existing && displayName) {
      existing.displayName = displayName;
      await userRepository.upsert(existing);
    }
    persistSession({ userId: user.id, loggedInAt: new Date().toISOString() });
    return { user };
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return {
      message: `You are using local mode — no passwords are stored. Just sign in again with ${
        email || 'your email'
      } and you'll regain access to your local projects.`
    };
  },

  async logout(): Promise<void> {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<LocalUser | null> {
    const session = readSession();
    if (!session) return null;
    return userRepository.get(session.userId);
  }
};

function persistSession(s: SessionRecord) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function readSession(): SessionRecord | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionRecord) : null;
  } catch {
    return null;
  }
}
