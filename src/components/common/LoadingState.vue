<template>
  <div class="loading-state">
    <ion-spinner name="crescent" />
    <p v-if="label">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
import { IonSpinner } from '@ionic/vue';
defineProps<{ label?: string }>();
</script>

<style scoped>
.loading-state {
  text-align: center;
  padding: 32px;
  color: var(--cpd-color-text-soft);
}
ion-spinner {
  --color: var(--cpd-color-primary);
}
</style>
