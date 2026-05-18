import type { CrochetPattern } from './pattern';
import type { GridPattern } from './gridPattern';

export type ProjectType = 'symbol_pattern' | 'grid_pattern';
export type SyncStatus = 'local_only' | 'pending_sync' | 'synced' | 'conflict';

export interface BaseProject {
  id: string;
  localUserId: string;
  cloudId?: string;
  name: string;
  description?: string;
  projectType: ProjectType;
  patternSchemaVersion: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  syncStatus: SyncStatus;
  version: number;
}

export interface SymbolPatternProject extends BaseProject {
  projectType: 'symbol_pattern';
  payload: { pattern: CrochetPattern };
}

export interface GridPatternProject extends BaseProject {
  projectType: 'grid_pattern';
  payload: { grid: GridPattern };
}

export type AnyProject = SymbolPatternProject | GridPatternProject;

export const CURRENT_SCHEMA_VERSION = 1;
