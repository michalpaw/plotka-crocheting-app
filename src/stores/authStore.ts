import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { localAuthService } from '@/services/auth/localAuthService';
import type { LocalUser } from '@/services/storage/userRepository';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<LocalUser | null>(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => user.value !== null);

  async function bootstrap() {
    user.value = await localAuthService.getCurrentUser();
    initialized.value = true;
  }

  async function login(email: string, password: string) {
    const result = await localAuthService.login(email, password);
    user.value = result.user;
  }

  async function register(email: string, password: string, displayName?: string) {
    const result = await localAuthService.register(email, password, displayName);
    user.value = result.user;
  }

  async function forgotPassword(email: string) {
    return localAuthService.forgotPassword(email);
  }

  async function logout() {
    await localAuthService.logout();
    user.value = null;
  }

  return { user, initialized, isAuthenticated, bootstrap, login, register, forgotPassword, logout };
});
