<template>
  <ion-app>
    <ion-router-outlet />
    <ConsoleErrorModal />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import ConsoleErrorModal from '@/components/common/ConsoleErrorModal.vue';
import { installConsoleInterceptor } from '@/utils/useConsoleErrors';

onMounted(() => {
  installConsoleInterceptor();
});
</script>
