<template>
  <ion-page>
    <AppPageHeader title="Dashboard" />
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="hero">
        <h1 class="cpd-title">Hi {{ displayName }} 👋</h1>
        <p class="cpd-subtitle">
          Welcome to your crochet studio. Start a new pattern, or open something you've been working on.
        </p>
        <div class="hero-actions">
          <ion-button router-link="/projects/new" router-direction="forward">
            <ion-icon slot="start" :icon="addCircleOutline" />
            New project
          </ion-button>
          <ion-button fill="outline" router-link="/projects" router-direction="forward">
            <ion-icon slot="start" :icon="folderOpenOutline" />
            All projects
          </ion-button>
        </div>
      </div>

      <section class="ion-margin-top">
        <h2 class="cpd-title" style="font-size: 1.2rem">Recent projects</h2>
        <LoadingState v-if="projects.loading" />
        <EmptyState
          v-else-if="projects.projects.length === 0"
          title="No projects yet"
          description="Create your first crochet pattern or color grid to get started."
        >
          <ion-button router-link="/projects/new" class="ion-margin-top">Create project</ion-button>
        </EmptyState>
        <div v-else class="cpd-grid-3">
          <ProjectCard
            v-for="p in recent"
            :key="p.id"
            :project="p"
            @duplicate="onDuplicate"
            @rename="onRename"
            @archive="onArchive"
          />
        </div>
      </section>

      <section class="ion-margin-top features">
        <div class="feature-card">
          <h3>Symbol pattern editor</h3>
          <p>Place crochet symbols on a grid. Generate written instructions automatically.</p>
        </div>
        <div class="feature-card">
          <h3>Color grid editor</h3>
          <p>Design pixel-style color charts for scarves, blankets, and panels.</p>
        </div>
        <div class="feature-card">
          <h3>2D preview &amp; validation</h3>
          <p>See your pattern as a clean diagram and catch issues before crocheting.</p>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  alertController
} from '@ionic/vue';
import { addCircleOutline, folderOpenOutline } from 'ionicons/icons';
import AppPageHeader from '@/components/common/AppPageHeader.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import ProjectCard from '@/components/project/ProjectCard.vue';
import { useAuthStore } from '@/stores/authStore';
import { useProjectStore } from '@/stores/projectStore';

const auth = useAuthStore();
const projects = useProjectStore();

const displayName = computed(() => auth.user?.displayName ?? 'crocheter');
const recent = computed(() => projects.projects.slice(0, 6));

onMounted(() => projects.refresh());

async function onDuplicate(id: string) {
  await projects.duplicate(id);
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
    message: 'It will be archived and removed from your list.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      { text: 'Delete', role: 'destructive', handler: async () => projects.archive(id) }
    ]
  });
  await alert.present();
}
</script>

<style scoped>
.hero {
  padding: 16px 0 8px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 24px;
}
.feature-card {
  background: var(--cpd-color-surface-soft);
  padding: 16px;
  border-radius: var(--cpd-radius-md);
}
.feature-card h3 {
  margin: 0 0 6px;
  color: var(--cpd-color-primary);
}
.feature-card p {
  margin: 0;
  color: var(--cpd-color-text-soft);
  font-size: 0.9rem;
}
</style>
