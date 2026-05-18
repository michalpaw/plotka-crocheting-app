// Local database abstraction.
//
// The architecture document suggests RxDB; however the MVP only needs simple
// key/value-style persistence with collections. We expose a generic
// `LocalCollection<T>` interface so the underlying implementation can be
// swapped to RxDB (or any other local-first store) later without touching
// repositories or stores.

export interface LocalCollection<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  upsert(doc: T): Promise<T>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

class WebStorageCollection<T extends { id: string }> implements LocalCollection<T> {
  constructor(private readonly key: string) {}

  private read(): T[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  }

  private write(items: T[]): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  async list(): Promise<T[]> {
    return this.read();
  }

  async get(id: string): Promise<T | null> {
    return this.read().find((d) => d.id === id) ?? null;
  }

  async upsert(doc: T): Promise<T> {
    const items = this.read();
    const idx = items.findIndex((d) => d.id === doc.id);
    if (idx >= 0) items[idx] = doc;
    else items.push(doc);
    this.write(items);
    return doc;
  }

  async remove(id: string): Promise<void> {
    this.write(this.read().filter((d) => d.id !== id));
  }

  async clear(): Promise<void> {
    this.write([]);
  }
}

export interface LocalDatabase {
  users: LocalCollection<{ id: string; [k: string]: unknown }>;
  projects: LocalCollection<{ id: string; [k: string]: unknown }>;
  settings: LocalCollection<{ id: string; [k: string]: unknown }>;
  sessions: LocalCollection<{ id: string; [k: string]: unknown }>;
}

let dbInstance: LocalDatabase | null = null;

export function getLocalDatabase(): LocalDatabase {
  if (dbInstance) return dbInstance;
  dbInstance = {
    users: new WebStorageCollection('cpd:users'),
    projects: new WebStorageCollection('cpd:projects'),
    settings: new WebStorageCollection('cpd:settings'),
    sessions: new WebStorageCollection('cpd:sessions')
  };
  return dbInstance;
}
