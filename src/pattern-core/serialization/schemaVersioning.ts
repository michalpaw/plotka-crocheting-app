export const PATTERN_SCHEMA_VERSION = 1;
export const GRID_SCHEMA_VERSION = 1;

export interface VersionedDocument<T> {
  schemaVersion: number;
  data: T;
}

export function wrap<T>(data: T, schemaVersion: number): VersionedDocument<T> {
  return { schemaVersion, data };
}

export function unwrap<T>(doc: VersionedDocument<T>): T {
  return doc.data;
}
