<template>
  <ion-page>
    <AppPageHeader title="New project" back-href="/projects" />
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="create-wrap">
        <h2 class="cpd-title">Start a new project</h2>
        <p class="cpd-subtitle">Choose what kind of pattern you want to design.</p>

        <ProjectForm @submit="onCreate" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, toastController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import AppPageHeader from '@/components/common/AppPageHeader.vue';
import ProjectForm from '@/components/project/ProjectForm.vue';
import { useProjectStore } from '@/stores/projectStore';
import type { ProjectType } from '@core/model/project';

const projects = useProjectStore();
const router = useRouter();

async function onCreate(payload: {
  name: string;
  description: string;
  type: ProjectType;
  rows: number;
  columns: number;
}) {
  try {
    const project =
      payload.type === 'symbol_pattern'
        ? await projects.createSymbolProject(payload.name, payload.description)
        : await projects.createGridProject(payload.name, payload.rows, payload.columns, payload.description);
    const dest = project.projectType === 'symbol_pattern' ? 'editor' : 'grid';
    router.replace(`/projects/${project.id}/${dest}`);
  } catch (e) {
    const t = await toastController.create({
      message: e instanceof Error ? e.message : 'Could not create project',
      duration: 2000,
      color: 'danger'
    });
    await t.present();
  }
}
</script>

<style scoped>
.create-wrap {
  max-width: 580px;
  margin: 0 auto;
}
</style>
