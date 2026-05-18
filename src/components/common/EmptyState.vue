<template>
  <div class="cpd-empty">
    <div class="empty-icon">
      <ion-icon :icon="icon ?? sparklesOutline" />
    </div>
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { sparklesOutline } from 'ionicons/icons';

defineProps<{ title: string; description?: string; icon?: string }>();
</script>

<style scoped>
.empty-icon {
  font-size: 48px;
  color: var(--cpd-color-primary);
  margin-bottom: 8px;
}
h3 {
  margin: 8px 0;
}
</style>
