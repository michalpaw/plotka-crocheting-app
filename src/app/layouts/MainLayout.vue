<template>
  <ion-page>
    <ion-split-pane content-id="main-content" when="md">
      <ion-menu content-id="main-content" type="overlay">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Crochet Designer</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item :button="true" router-link="/dashboard" router-direction="root">
              <ion-icon slot="start" :icon="homeOutline" />
              <ion-label>Dashboard</ion-label>
            </ion-item>
            <ion-item :button="true" router-link="/projects" router-direction="root">
              <ion-icon slot="start" :icon="folderOpenOutline" />
              <ion-label>Projects</ion-label>
            </ion-item>
            <ion-item :button="true" router-link="/projects/new" router-direction="root">
              <ion-icon slot="start" :icon="addCircleOutline" />
              <ion-label>New project</ion-label>
            </ion-item>
            <ion-item :button="true" router-link="/settings" router-direction="root">
              <ion-icon slot="start" :icon="settingsOutline" />
              <ion-label>Settings</ion-label>
            </ion-item>
            <ion-item :button="true" :detail="false" @click="onLogout">
              <ion-icon slot="start" :icon="logOutOutline" />
              <ion-label>Sign out</ion-label>
            </ion-item>
          </ion-list>
          <div class="cpd-side-meta">
            <div v-if="auth.user">
              <strong>{{ auth.user.displayName }}</strong>
              <div class="muted">{{ auth.user.email }}</div>
              <span class="cpd-pill">local mode</span>
            </div>
          </div>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content" />
    </ion-split-pane>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import {
  homeOutline,
  folderOpenOutline,
  addCircleOutline,
  settingsOutline,
  logOutOutline
} from 'ionicons/icons';

const auth = useAuthStore();
const router = useRouter();

async function onLogout() {
  await auth.logout();
  router.replace('/auth/login');
}
</script>

<style scoped>
.cpd-side-meta {
  padding: 16px;
  border-top: 1px solid var(--cpd-color-border);
  margin-top: 8px;
}
.muted {
  color: var(--cpd-color-text-soft);
  font-size: 0.85rem;
  margin-bottom: 6px;
}
</style>
