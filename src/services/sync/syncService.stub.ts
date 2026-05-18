// Future cloud sync. Not active in MVP — projects stay local.

import type { AnyProject } from '@core/model/project';

export interface SyncResult {
  pushed: number;
  pulled: number;
  conflicts: number;
}

export const syncService = {
  isEnabled(): boolean {
    return false;
  },

  async push(_projects: AnyProject[]): Promise<SyncResult> {
    return { pushed: 0, pulled: 0, conflicts: 0 };
  },

  async pull(_since?: string): Promise<AnyProject[]> {
    return [];
  },

  async syncAll(): Promise<SyncResult> {
    return { pushed: 0, pulled: 0, conflicts: 0 };
  }
};
