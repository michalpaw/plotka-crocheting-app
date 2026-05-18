import { getLocalDatabase } from './localDatabase';
import { newId } from '@/utils/ids';
import { nowIso } from '@/utils/dates';
import type {
  AnyProject,
  GridPatternProject,
  SymbolPatternProject
} from '@core/model/project';
import { CURRENT_SCHEMA_VERSION } from '@core/model/project';
import { createEmptyPattern } from '@core/model/pattern';
import { createEmptyGridPattern } from '@core/model/gridPattern';

export const projectRepository = {
  async listByUser(localUserId: string): Promise<AnyProject[]> {
    const docs = await getLocalDatabase().projects.list();
    return (docs as unknown as AnyProject[])
      .filter((p) => p.localUserId === localUserId && !p.deletedAt)
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  },

  async get(id: string): Promise<AnyProject | null> {
    const doc = await getLocalDatabase().projects.get(id);
    return (doc as unknown as AnyProject) ?? null;
  },

  async createSymbolProject(localUserId: string, name: string, description?: string): Promise<SymbolPatternProject> {
    const project: SymbolPatternProject = {
      id: newId('prj'),
      localUserId,
      name,
      description,
      projectType: 'symbol_pattern',
      patternSchemaVersion: CURRENT_SCHEMA_VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      syncStatus: 'local_only',
      version: 1,
      payload: { pattern: { ...createEmptyPattern(name) } }
    };
    await getLocalDatabase().projects.upsert(project as unknown as { id: string });
    return project;
  },

  async createGridProject(
    localUserId: string,
    name: string,
    rows = 50,
    columns = 50,
    description?: string
  ): Promise<GridPatternProject> {
    const project: GridPatternProject = {
      id: newId('prj'),
      localUserId,
      name,
      description,
      projectType: 'grid_pattern',
      patternSchemaVersion: CURRENT_SCHEMA_VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      syncStatus: 'local_only',
      version: 1,
      payload: { grid: createEmptyGridPattern(rows, columns) }
    };
    await getLocalDatabase().projects.upsert(project as unknown as { id: string });
    return project;
  },

  async save(project: AnyProject): Promise<AnyProject> {
    project.updatedAt = nowIso();
    project.version = (project.version || 1) + 1;
    if (project.syncStatus === 'synced') project.syncStatus = 'pending_sync';
    await getLocalDatabase().projects.upsert(project as unknown as { id: string });
    return project;
  },

  async rename(id: string, name: string): Promise<AnyProject | null> {
    const p = await this.get(id);
    if (!p) return null;
    p.name = name;
    return this.save(p);
  },

  async duplicate(id: string): Promise<AnyProject | null> {
    const original = await this.get(id);
    if (!original) return null;
    const copy: AnyProject = JSON.parse(JSON.stringify(original));
    copy.id = newId('prj');
    copy.name = `${original.name} (Copy)`;
    copy.createdAt = nowIso();
    copy.updatedAt = nowIso();
    copy.version = 1;
    copy.syncStatus = 'local_only';
    delete copy.cloudId;
    await getLocalDatabase().projects.upsert(copy as unknown as { id: string });
    return copy;
  },

  async archive(id: string): Promise<void> {
    const p = await this.get(id);
    if (!p) return;
    p.deletedAt = nowIso();
    p.updatedAt = nowIso();
    await getLocalDatabase().projects.upsert(p as unknown as { id: string });
  },

  async hardDelete(id: string): Promise<void> {
    await getLocalDatabase().projects.remove(id);
  },

  async importProject(project: AnyProject, localUserId: string): Promise<AnyProject> {
    const fresh: AnyProject = {
      ...project,
      id: newId('prj'),
      localUserId,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      version: 1,
      syncStatus: 'local_only'
    };
    delete fresh.cloudId;
    await getLocalDatabase().projects.upsert(fresh as unknown as { id: string });
    return fresh;
  }
};
