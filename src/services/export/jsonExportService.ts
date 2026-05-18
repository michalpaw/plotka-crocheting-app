import type { AnyProject } from '@core/model/project';
import { exportProjectToJson } from '@core/serialization/importExport';
import { downloadFile } from './downloadFile';

export const jsonExportService = {
  exportProject(project: AnyProject): void {
    const json = exportProjectToJson(project);
    const blob = new Blob([json], { type: 'application/json' });
    downloadFile(blob, sanitize(project.name) + '.cpd.json');
  }
};

function sanitize(name: string): string {
  return name.replace(/[^a-z0-9_-]+/gi, '_').slice(0, 64) || 'project';
}
