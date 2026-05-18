<template>
  <ion-page>
    <AppPageHeader :title="project?.name ?? 'Project'" back-href="/projects">
      <template #end>
        <ion-button v-if="project" fill="clear" @click="exportJson">
          <ion-icon slot="icon-only" :icon="downloadOutline" />
        </ion-button>
      </template>
    </AppPageHeader>
    <ion-content :fullscreen="true" class="ion-padding">
      <LoadingState v-if="loading" />
      <EmptyState
        v-else-if="!project"
        title="Project not found"
        description="It may have been deleted or hasn't synced yet."
      >
        <ion-button router-link="/projects">Back to projects</ion-button>
      </EmptyState>
      <div v-else class="details-wrap">
        <div class="cpd-card">
          <h2>{{ project.name }}</h2>
          <p class="muted">{{ project.description || 'No description.' }}</p>
          <div class="meta-row">
            <span class="cpd-pill">{{ typeLabel }}</span>
            <span class="cpd-pill">v{{ project.version }}</span>
            <span class="cpd-pill">{{ project.syncStatus.replace('_', ' ') }}</span>
            <span class="muted">Updated {{ formatRelative(project.updatedAt) }}</span>
          </div>

          <div class="actions">
            <ion-button @click="openEditor">
              <ion-icon slot="start" :icon="brushOutline" />
              Open editor
            </ion-button>
            <ion-button fill="outline" @click="exportJson">
              <ion-icon slot="start" :icon="downloadOutline" />
              Export JSON
            </ion-button>
          </div>
        </div>

        <div class="cpd-card">
          <h3>Summary</h3>
          <ul class="summary-list" v-if="project.projectType === 'symbol_pattern'">
            <li><strong>Mode:</strong> {{ project.payload.pattern.mode }}</li>
            <li><strong>Grid size:</strong> {{ project.payload.pattern.canvas.gridSize }} px</li>
            <li><strong>Symbols placed:</strong> {{ project.payload.pattern.canvas.items.length }}</li>
          </ul>
          <ul class="summary-list" v-else>
            <li><strong>Size:</strong> {{ project.payload.grid.rows }} × {{ project.payload.grid.columns }} cells</li>
            <li><strong>Filled cells:</strong> {{ Object.keys(project.payload.grid.cells).length }}</li>
            <li><strong>Palette colors:</strong> {{ project.payload.grid.palette.length }}</li>
          </ul>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { downloadOutline, brushOutline } from 'ionicons/icons';
import AppPageHeader from '@/components/common/AppPageHeader.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import { useProjectStore } from '@/stores/projectStore';
import { jsonExportService } from '@/services/export/jsonExportService';
import { formatRelative } from '@/utils/dates';
import type { AnyProject } from '@core/model/project';

const route = useRoute();
const router = useRouter();
const projects = useProjectStore();
const project = ref<AnyProject | null>(null);
const loading = ref(true);

const typeLabel = computed(() =>
  project.value?.projectType === 'symbol_pattern' ? 'Symbol pattern' : 'Color grid'
);

onMounted(async () => {
  loading.value = true;
  const id = route.params.id as string;
  project.value = await projects.loadProject(id);
  loading.value = false;
});

function openEditor() {
  if (!project.value) return;
  const dest = project.value.projectType === 'symbol_pattern' ? 'editor' : 'grid';
  router.push(`/projects/${project.value.id}/${dest}`);
}

function exportJson() {
  if (project.value) jsonExportService.exportProject(project.value);
}
</script>

<style scoped>
.details-wrap {
  display: grid;
  gap: 16px;
  max-width: 720px;
}
.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 12px 0;
}
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.muted {
  color: var(--cpd-color-text-soft);
}
.summary-list {
  margin: 0;
  padding-left: 18px;
}
</style>
