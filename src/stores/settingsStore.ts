import { defineStore } from 'pinia';
import { ref } from 'vue';
import { settingsRepository, type AppSettings } from '@/services/storage/settingsRepository';
import { useAuthStore } from './authStore';

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings | null>(null);

  async function load() {
    const auth = useAuthStore();
    if (!auth.user) return;
    settings.value = await settingsRepository.get(auth.user.id);
    applyTheme(settings.value.theme);
  }

  async function save(partial: Partial<AppSettings>) {
    if (!settings.value) return;
    settings.value = { ...settings.value, ...partial } as AppSettings;
    await settingsRepository.save(settings.value);
    applyTheme(settings.value.theme);
  }

  function applyTheme(theme: AppSettings['theme']) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const prefersDark =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = theme === 'dark' || (theme === 'system' && prefersDark);
    root.classList.toggle('dark', useDark);
  }

  return { settings, load, save };
});
