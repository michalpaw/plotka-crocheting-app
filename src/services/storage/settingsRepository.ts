import { getLocalDatabase } from './localDatabase';
import { nowIso } from '@/utils/dates';

export interface AppSettings {
  id: string;
  localUserId: string;
  theme: 'light' | 'dark' | 'system';
  editor: {
    defaultGridSize: number;
    showGrid: boolean;
    snapToGrid: boolean;
  };
  shortcuts: Record<string, string>;
  updatedAt: string;
}

const SETTINGS_ID_PREFIX = 'settings:';

export const settingsRepository = {
  async get(localUserId: string): Promise<AppSettings> {
    const doc = await getLocalDatabase().settings.get(SETTINGS_ID_PREFIX + localUserId);
    if (doc) return doc as unknown as AppSettings;
    const fresh: AppSettings = {
      id: SETTINGS_ID_PREFIX + localUserId,
      localUserId,
      theme: 'system',
      editor: {
        defaultGridSize: 32,
        showGrid: true,
        snapToGrid: true
      },
      shortcuts: {},
      updatedAt: nowIso()
    };
    await getLocalDatabase().settings.upsert(fresh as unknown as { id: string });
    return fresh;
  },

  async save(settings: AppSettings): Promise<AppSettings> {
    settings.updatedAt = nowIso();
    await getLocalDatabase().settings.upsert(settings as unknown as { id: string });
    return settings;
  }
};
