<template>
  <ion-page>
    <AppPageHeader title="Settings" />
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="settings-wrap">
        <div class="cpd-card">
          <h3>Profile</h3>
          <p v-if="auth.user" class="muted">{{ auth.user.displayName }} — {{ auth.user.email }}</p>
          <span class="cpd-pill">local mode</span>
        </div>

        <div class="cpd-card">
          <h3>Appearance</h3>
          <ion-segment v-model="theme" @ion-change="onThemeChange">
            <ion-segment-button value="system"><ion-label>System</ion-label></ion-segment-button>
            <ion-segment-button value="light"><ion-label>Light</ion-label></ion-segment-button>
            <ion-segment-button value="dark"><ion-label>Dark</ion-label></ion-segment-button>
          </ion-segment>
        </div>

        <div class="cpd-card">
          <h3>Editor</h3>
          <ion-item lines="none">
            <ion-label>Show grid by default</ion-label>
            <ion-toggle v-model="showGrid" @ion-change="onEditorChange" slot="end" />
          </ion-item>
          <ion-item lines="none">
            <ion-label>Snap to grid</ion-label>
            <ion-toggle v-model="snapToGrid" @ion-change="onEditorChange" slot="end" />
          </ion-item>
          <ion-item lines="none">
            <ion-label position="stacked">Default grid size</ion-label>
            <ion-input type="number" v-model.number="gridSize" min="8" max="80" @ionChange="onEditorChange" />
          </ion-item>
        </div>

        <div class="cpd-card">
          <h3>Cloud sync</h3>
          <p class="muted">Not enabled yet. When the cloud backend ships, you'll be able to sign in
          here to back up your projects and use them on multiple devices.</p>
          <span class="cpd-pill">coming soon</span>
        </div>

        <div class="cpd-card">
          <h3>About</h3>
          <p class="muted">Crochet Pattern Designer · v0.1.0</p>
          <p class="muted small">Built with Vue 3, Ionic, Capacitor, and Pinia. Local-first by design.</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonPage,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonToggle,
  IonInput
} from '@ionic/vue';
import AppPageHeader from '@/components/common/AppPageHeader.vue';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';

const auth = useAuthStore();
const settings = useSettingsStore();

const theme = ref<'system' | 'light' | 'dark'>(settings.settings?.theme ?? 'system');
const showGrid = ref(settings.settings?.editor.showGrid ?? true);
const snapToGrid = ref(settings.settings?.editor.snapToGrid ?? true);
const gridSize = ref(settings.settings?.editor.defaultGridSize ?? 32);

watch(
  () => settings.settings,
  (s) => {
    if (!s) return;
    theme.value = s.theme;
    showGrid.value = s.editor.showGrid;
    snapToGrid.value = s.editor.snapToGrid;
    gridSize.value = s.editor.defaultGridSize;
  }
);

async function onThemeChange() {
  await settings.save({ theme: theme.value });
}

async function onEditorChange() {
  if (!settings.settings) return;
  await settings.save({
    editor: {
      defaultGridSize: Number(gridSize.value) || 32,
      showGrid: showGrid.value,
      snapToGrid: snapToGrid.value
    }
  });
}
</script>

<style scoped>
.settings-wrap {
  max-width: 720px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}
.cpd-card h3 {
  margin: 0 0 8px;
}
.muted {
  color: var(--cpd-color-text-soft);
}
.small {
  font-size: 0.85rem;
}
</style>
