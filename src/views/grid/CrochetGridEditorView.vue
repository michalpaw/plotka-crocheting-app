<template>
  <ion-page>
    <AppPageHeader :title="title" :back-href="`/projects/${route.params.id}`" />
    <ion-content :fullscreen="true" class="ion-padding">
      <LoadingState v-if="loading" />
      <EmptyState
        v-else-if="!grid.project"
        title="Grid not found"
        description="This project may have been deleted, or it isn't a color grid project."
      >
        <ion-button router-link="/projects">Back to projects</ion-button>
      </EmptyState>
      <div v-else class="grid-shell">
        <GridToolbar
          @rename="onRename"
          @save="onSave"
          @export-png="onExportPng"
          @export-pdf="onExportPdf"
          @fill-all="grid.fillAll"
          @clear-all="onClearAll"
        />

        <div class="layout">
          <aside class="cpd-side-panel">
            <h4>Colors</h4>
            <ColorPalette
              :palette="palette"
              :active="grid.activeColor"
              @select="grid.setActiveColor"
              @add="grid.addColor"
            />
            <h4>Size</h4>
            <div class="cpd-row">
              <ion-input v-model.number="rows" type="number" min="2" max="500" />
              <span>×</span>
              <ion-input v-model.number="cols" type="number" min="2" max="500" />
              <ion-button size="small" fill="outline" @click="applyResize">Apply</ion-button>
            </div>
            <p class="muted small">
              Tip: drag to paint multiple cells. Switch tools with the icons in the toolbar.
            </p>
          </aside>
          <main class="canvas-area">
            <CrochetGridCanvas />
          </main>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  toastController,
  alertController
} from '@ionic/vue';
import { useRoute } from 'vue-router';
import AppPageHeader from '@/components/common/AppPageHeader.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import GridToolbar from '@/components/grid/GridToolbar.vue';
import ColorPalette from '@/components/grid/ColorPalette.vue';
import CrochetGridCanvas from '@/components/grid/CrochetGridCanvas.vue';
import { useGridStore } from '@/stores/gridStore';
import { useProjectStore } from '@/stores/projectStore';
import { pngExportService } from '@/services/export/pngExportService';
import { pdfExportService } from '@/services/export/pdfExportService';
import type { GridPatternProject } from '@core/model/project';

const route = useRoute();
const grid = useGridStore();
const projects = useProjectStore();

const loading = ref(true);
const rows = ref(50);
const cols = ref(50);

const title = computed(() => grid.project?.name || 'Grid editor');
const palette = computed(() => grid.project?.payload.grid.palette ?? []);

watch(
  () => grid.project?.payload.grid,
  (g) => {
    if (g) {
      rows.value = g.rows;
      cols.value = g.columns;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  const id = route.params.id as string;
  const project = await projects.loadProject(id);
  if (project && project.projectType === 'grid_pattern') {
    grid.loadProject(project as GridPatternProject);
  }
  loading.value = false;
});

onBeforeUnmount(() => {
  grid.reset();
});

async function onRename(name: string) {
  if (!grid.project) return;
  grid.project.name = name;
}

async function onSave() {
  await grid.save();
  (await toastController.create({ message: 'Grid saved', duration: 1200, color: 'success' })).present();
}

async function onExportPng() {
  if (!grid.project) return;
  await pngExportService.exportGridPattern(grid.project.payload.grid, grid.project.name);
}

function onExportPdf() {
  if (!grid.project) return;
  pdfExportService.printGrid(grid.project.payload.grid, grid.project.name);
}

async function onClearAll() {
  const alert = await alertController.create({
    header: 'Clear grid?',
    message: 'All painted cells will be cleared.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Clear', role: 'destructive', handler: () => grid.clearAll() }
    ]
  });
  await alert.present();
}

function applyResize() {
  const r = Math.max(2, Math.min(500, Number(rows.value) || 50));
  const c = Math.max(2, Math.min(500, Number(cols.value) || 50));
  grid.resize(r, c);
}
</script>

<style scoped>
.grid-shell {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 12px;
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
.canvas-area {
  min-height: 360px;
}
.muted {
  color: var(--cpd-color-text-soft);
}
.small {
  font-size: 0.8rem;
}
h4 {
  margin: 12px 0 6px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cpd-color-primary);
}
.cpd-side-panel ion-input {
  --background: var(--cpd-color-surface-soft);
  --padding-start: 8px;
  --padding-end: 8px;
  max-width: 80px;
}
</style>
