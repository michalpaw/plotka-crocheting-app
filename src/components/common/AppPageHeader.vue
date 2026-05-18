<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button v-if="!hideMenu" />
        <ion-back-button v-if="backHref" :default-href="backHref" />
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="end">
        <slot name="end" />
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonBackButton } from '@ionic/vue';

defineProps<{ title: string; backHref?: string; hideMenu?: boolean }>();
</script>
