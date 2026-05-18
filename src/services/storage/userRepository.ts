import { getLocalDatabase } from './localDatabase';
import { newId } from '@/utils/ids';
import { nowIso } from '@/utils/dates';

export interface LocalUser {
  id: string;
  email: string;
  displayName: string;
  mode: 'local' | 'cloud';
  createdAt: string;
  updatedAt: string;
}

export const userRepository = {
  async list(): Promise<LocalUser[]> {
    const docs = await getLocalDatabase().users.list();
    return docs as unknown as LocalUser[];
  },

  async findByEmail(email: string): Promise<LocalUser | null> {
    const docs = await this.list();
    const normalized = email.trim().toLowerCase();
    return docs.find((u) => u.email.toLowerCase() === normalized) ?? null;
  },

  async create(email: string, displayName?: string): Promise<LocalUser> {
    const user: LocalUser = {
      id: newId('user'),
      email: email.trim(),
      displayName: displayName?.trim() || email.split('@')[0] || 'Crocheter',
      mode: 'local',
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    await getLocalDatabase().users.upsert(user as unknown as { id: string });
    return user;
  },

  async upsert(user: LocalUser): Promise<LocalUser> {
    user.updatedAt = nowIso();
    await getLocalDatabase().users.upsert(user as unknown as { id: string });
    return user;
  },

  async get(id: string): Promise<LocalUser | null> {
    const doc = await getLocalDatabase().users.get(id);
    return (doc as unknown as LocalUser) ?? null;
  }
};
