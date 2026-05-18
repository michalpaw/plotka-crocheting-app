<template>
  <div>
    <h2 class="cpd-title">Create your local profile</h2>
    <p class="cpd-subtitle">Pick a name and email. This stays on your device.</p>

    <form @submit.prevent="onSubmit">
      <ion-item lines="full">
        <ion-label position="stacked">Display name</ion-label>
        <ion-input v-model="displayName" placeholder="Your name" />
      </ion-item>
      <ion-item lines="full">
        <ion-label position="stacked">Email</ion-label>
        <ion-input v-model="email" type="email" autocomplete="email" required placeholder="you@example.com" />
      </ion-item>
      <ion-item lines="full">
        <ion-label position="stacked">Password</ion-label>
        <ion-input v-model="password" type="password" autocomplete="new-password" placeholder="Not stored in local mode" />
      </ion-item>

      <p v-if="error" class="cpd-error">{{ error }}</p>

      <ion-button type="submit" expand="block" :disabled="loading" class="ion-margin-top">
        <span v-if="!loading">Create profile</span>
        <ion-spinner v-else name="dots" />
      </ion-button>
    </form>

    <p class="auth-links">
      Already have a local profile?
      <router-link to="/auth/login">Sign in</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonItem, IonLabel, IonInput, IonButton, IonSpinner } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { toMessage } from '@/utils/errors';

const auth = useAuthStore();
const router = useRouter();

const displayName = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  loading.value = true;
  error.value = null;
  try {
    await auth.register(email.value, password.value, displayName.value);
    router.replace('/dashboard');
  } catch (e) {
    error.value = toMessage(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-links {
  text-align: center;
  margin-top: 16px;
  font-size: 0.95rem;
}
</style>
