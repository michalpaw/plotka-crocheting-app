import type { AnyProject } from '../model/project';
import { PATTERN_SCHEMA_VERSION } from './schemaVersioning';

export interface ExportedProject {
  format: 'crochet-pattern-designer';
  schemaVersion: number;
  exportedAt: string;
  project: AnyProject;
}

export function exportProjectToJson(project: AnyProject): string {
  const wrapper: ExportedProject = {
    format: 'crochet-pattern-designer',
    schemaVersion: PATTERN_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    project
  };
  return JSON.stringify(wrapper, null, 2);
}

export function importProjectFromJson(json: string): AnyProject {
  const parsed = JSON.parse(json);
  if (parsed?.format !== 'crochet-pattern-designer') {
    throw new Error('Not a Crochet Pattern Designer export file.');
  }
  if (!parsed.project) {
    throw new Error('Export file does not contain a project.');
  }
  return parsed.project as AnyProject;
}
