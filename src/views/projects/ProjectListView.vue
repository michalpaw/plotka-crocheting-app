<template>
  <ion-page>
    <AppPageHeader title="Projects">
      <template #end>
        <ion-button router-link="/projects/new">
          <ion-icon slot="start" :icon="addCircleOutline" />
          New
        </ion-button>
      </template>
    </AppPageHeader>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="toolbar-row">
        <ion-searchbar v-model="query" placeholder="Search projects" />
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          hidden
          @change="onFileChange"
        />
        <ion-button fill="outline" @click="fileInput?.click()">
          <ion-icon slot="start" :icon="cloudUploadOutline" />
          Import
        </ion-button>
      </div>

      <LoadingState v-if="projects.loading" />
      <EmptyState
        v-else-if="filtered.length === 0"
        title="No projects found"
        description="Create a new project or adjust your search."
      >
        <ion-button router-link="/projects/new" class="ion-margin-top">Create project</ion-button>
      </EmptyState>
      <div v-else class="cpd-grid-3">
        <ProjectCard
          v-for="p in filtered"
          :key="p.id"
          :project="p"
          @duplicate="onDuplicate"
          @rename="onRename"
          @archive="onArchive"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonSearchbar,
  alertController,
  toastController
} from '@ionic/vue';
import { addCircleOutline, cloudUploadOutline } from 'ionicons/icons';
import AppPageHeader from '@/components/common/AppPageHeader.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ProjectCard from '@/components/project/ProjectCard.vue';
import { useProjectStore } from '@/stores/projectStore';
import { importProjectFromJson } from '@core/serialization/importExport';

const projects = useProjectStore();
const query = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

onMounted(() => projects.refresh());

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return projects.projects;
  return projects.projects.filter(
    (p) => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q)
  );
});

async function onDuplicate(id: string) {
  await projects.duplicate(id);
  showToast('Project duplicated');
}

async function onRename(id: string) {
  const project = projects.projects.find((p) => p.id === id);
  if (!project) return;
  const alert = await alertController.create({
    header: 'Rename project',
    inputs: [{ name: 'name', value: project.name, placeholder: 'New name' }],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Save',
        handler: async (data) => {
          if (data?.name?.trim()) await projects.rename(id, data.name.trim());
        }
      }
    ]
  });
  await alert.present();
}

async function onArchive(id: string) {
  const alert = await alertController.create({
    header: 'Delete project?',
    message: 'It will be archived locally.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Delete', role: 'destructive', handler: async () => projects.archive(id) }
    ]
  });
  await alert.present();
}

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  target.value = '';
  if (!file) return;
  try {
    const text = await file.text();
    const obj = importProjectFromJson(text);
    await projects.importProjectFromObject(obj);
    showToast('Project imported');
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Failed to import', 'danger');
  }
}

async function showToast(msg: string, color: 'success' | 'danger' = 'success') {
  const t = await toastController.create({ message: msg, duration: 1800, color });
  await t.present();
}
</script>

<style scoped>
.toolbar-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
ion-searchbar {
  flex: 1;
}
</style>
