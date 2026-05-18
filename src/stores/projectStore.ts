import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { projectRepository } from '@/services/storage/projectRepository';
import { useAuthStore } from './authStore';
import type { AnyProject } from '@core/model/project';

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<AnyProject[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const activeProjectId = ref<string | null>(null);

  const activeProject = computed(() => projects.value.find((p) => p.id === activeProjectId.value) ?? null);

  function requireUserId(): string {
    const auth = useAuthStore();
    if (!auth.user) throw new Error('You must be signed in.');
    return auth.user.id;
  }

  async function refresh() {
    try {
      loading.value = true;
      error.value = null;
      const userId = requireUserId();
      projects.value = await projectRepository.listByUser(userId);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  async function createSymbolProject(name: string, description?: string): Promise<AnyProject> {
    const userId = requireUserId();
    const project = await projectRepository.createSymbolProject(userId, name, description);
    await refresh();
    return project;
  }

  async function createGridProject(name: string, rows: number, columns: number, description?: string): Promise<AnyProject> {
    const userId = requireUserId();
    const project = await projectRepository.createGridProject(userId, name, rows, columns, description);
    await refresh();
    return project;
  }

  async function loadProject(id: string): Promise<AnyProject | null> {
    const project = await projectRepository.get(id);
    if (project) activeProjectId.value = project.id;
    return project;
  }

  async function saveProject(project: AnyProject) {
    const saved = await projectRepository.save(project);
    const idx = projects.value.findIndex((p) => p.id === saved.id);
    if (idx >= 0) projects.value[idx] = saved;
    return saved;
  }

  async function rename(id: string, name: string) {
    await projectRepository.rename(id, name);
    await refresh();
  }

  async function duplicate(id: string) {
    const copy = await projectRepository.duplicate(id);
    await refresh();
    return copy;
  }

  async function archive(id: string) {
    await projectRepository.archive(id);
    await refresh();
  }

  async function importProjectFromObject(obj: AnyProject) {
    const userId = requireUserId();
    const imported = await projectRepository.importProject(obj, userId);
    await refresh();
    return imported;
  }

  return {
    projects,
    loading,
    error,
    activeProjectId,
    activeProject,
    refresh,
    createSymbolProject,
    createGridProject,
    loadProject,
    saveProject,
    rename,
    duplicate,
    archive,
    importProjectFromObject
  };
});
