// Placeholder for the future cloud authentication service.
//
// When the FastAPI backend is ready, implement these methods using fetch()
// against /auth/login, /auth/register, etc. Vue/Pinia code should not need
// to change — it talks to the same `AuthResult` shape returned by
// localAuthService.

import type { LocalUser } from '@/services/storage/userRepository';

export interface CloudAuthResult {
  user: LocalUser;
  accessToken: string;
}

export const cloudAuthService = {
  async login(_email: string, _password: string): Promise<CloudAuthResult> {
    throw new Error('Cloud authentication is not enabled in this build.');
  },
  async register(_email: string, _password: string, _displayName?: string): Promise<CloudAuthResult> {
    throw new Error('Cloud authentication is not enabled in this build.');
  },
  async forgotPassword(_email: string): Promise<{ message: string }> {
    throw new Error('Cloud authentication is not enabled in this build.');
  },
  async refresh(): Promise<CloudAuthResult> {
    throw new Error('Cloud authentication is not enabled in this build.');
  }
};
