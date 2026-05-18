<template>
  <div>
    <h2 class="cpd-title">Welcome back</h2>
    <p class="cpd-subtitle">Sign in to access your local projects. No real cloud account is needed yet.</p>

    <form @submit.prevent="onSubmit">
      <ion-item lines="full">
        <ion-label position="stacked">Email</ion-label>
        <ion-input v-model="email" type="email" autocomplete="email" required placeholder="you@example.com" />
      </ion-item>
      <ion-item lines="full">
        <ion-label position="stacked">Password</ion-label>
        <ion-input v-model="password" type="password" autocomplete="current-password" placeholder="Anything goes in local mode" />
      </ion-item>

      <p v-if="error" class="cpd-error">{{ error }}</p>

      <ion-button type="submit" expand="block" :disabled="loading" class="ion-margin-top">
        <span v-if="!loading">Sign in</span>
        <ion-spinner v-else name="dots" />
      </ion-button>
    </form>

    <div class="auth-links">
      <router-link to="/auth/register">Create an account</router-link>
      <router-link to="/auth/forgot">Forgot password?</router-link>
    </div>

    <p class="auth-disclaimer">
      Local-only login. Passwords aren't stored on this device — a profile is created for the email
      you enter so your projects can be associated with you.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { toMessage } from '@/utils/errors';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  loading.value = true;
  error.value = null;
  try {
    await auth.login(email.value, password.value);
    const redirect = (route.query.redirect as string) || '/dashboard';
    router.replace(redirect);
  } catch (e) {
    error.value = toMessage(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-links {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
  font-size: 0.95rem;
}
.auth-disclaimer {
  margin-top: 24px;
  font-size: 0.8rem;
  color: var(--cpd-color-text-soft);
}
</style>
