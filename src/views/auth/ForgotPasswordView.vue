<template>
  <div>
    <h2 class="cpd-title">Forgot password?</h2>
    <p class="cpd-subtitle">
      You're currently in local mode. Passwords aren't actually stored, so there's nothing to reset
      — just sign in again with your email.
    </p>

    <form @submit.prevent="onSubmit">
      <ion-item lines="full">
        <ion-label position="stacked">Email</ion-label>
        <ion-input v-model="email" type="email" placeholder="you@example.com" />
      </ion-item>

      <ion-button type="submit" expand="block" class="ion-margin-top">Show recovery info</ion-button>
    </form>

    <p v-if="message" class="info-box">{{ message }}</p>

    <p class="auth-links">
      <router-link to="/auth/login">Back to sign in</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore();
const email = ref('');
const message = ref<string | null>(null);

async function onSubmit() {
  const result = await auth.forgotPassword(email.value);
  message.value = result.message;
}
</script>

<style scoped>
.info-box {
  margin-top: 18px;
  background: var(--cpd-color-surface-soft);
  color: var(--cpd-color-text);
  padding: 12px 14px;
  border-radius: var(--cpd-radius-md);
}
.auth-links {
  margin-top: 16px;
  text-align: center;
}
</style>
