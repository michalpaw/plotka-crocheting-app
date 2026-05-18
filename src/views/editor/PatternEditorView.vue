<template>
  <ion-page>
    <AppPageHeader :title="title" :back-href="`/projects/${route.params.id}`">
      <template #end>
        <ion-button v-if="editor.project" fill="clear" @click="exportJson">
          <ion-icon slot="icon-only" :icon="downloadOutline" />
        </ion-button>
      </template>
    </AppPageHeader>
    <ion-content :fullscreen="true">
      <LoadingState v-if="loading" />
      <EmptyState
        v-else-if="!editor.project"
        title="Project not found"
        description="It may have been deleted."
      >
        <ion-button router-link="/projects">Back to projects</ion-button>
      </EmptyState>
      <div v-else class="editor-shell">
        <EditorToolbar @save="onSave" @preview="showPreview = !showPreview" />
        <div class="editor-main">
          <aside class="cpd-side-panel left-panel">
            <h4 class="panel-title">Symbols</h4>
            <SymbolPalette />
          </aside>

          <main class="canvas-area">
            <div class="cpd-canvas-wrap">
              <PatternCanvas />
            </div>
            <SymbolKeyboard class="keyboard-strip" />
          </main>

          <aside class="cpd-side-panel right-panel">
            <PropertiesPanel />
            <hr />
            <ValidationPanel :messages="editor.validationMessages" />
          </aside>
        </div>

        <transition name="slide-up">
          <div v-if="showPreview" class="preview-drawer">
            <header>
              <h3>2D Preview &amp; Instructions</h3>
              <ion-button fill="clear" @click="showPreview = false">
                <ion-icon slot="icon-only" :icon="closeOutline" />
              </ion-button>
            </header>
            <div class="preview-body">
              <div class="preview-side">
                <Pattern2DPreview v-if="editor.pattern" :pattern="editor.pattern" />
              </div>
              <div class="preview-side">
                <InstructionPreview v-if="editor.instructions" :instructions="editor.instructions" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  toastController
} from '@ionic/vue';
import { downloadOutline, closeOutline } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import AppPageHeader from '@/components/common/AppPageHeader.vue';
import LoadingState from '@/components/common/LoadingState.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import EditorToolbar from '@/components/editor/EditorToolbar.vue';
import SymbolPalette from '@/components/editor/SymbolPalette.vue';
import SymbolKeyboard from '@/components/editor/SymbolKeyboard.vue';
import PatternCanvas from '@/components/editor/PatternCanvas.vue';
import PropertiesPanel from '@/components/editor/PropertiesPanel.vue';
import ValidationPanel from '@/components/preview/ValidationPanel.vue';
import Pattern2DPreview from '@/components/preview/Pattern2DPreview.vue';
import InstructionPreview from '@/components/preview/InstructionPreview.vue';
import { useEditorStore } from '@/stores/editorStore';
import { useProjectStore } from '@/stores/projectStore';
import { jsonExportService } from '@/services/export/jsonExportService';
import type { SymbolPatternProject } from '@core/model/project';

const route = useRoute();
const projects = useProjectStore();
const editor = useEditorStore();

const loading = ref(true);
const showPreview = ref(false);

const title = computed(() => editor.project?.name || 'Editor');

onMounted(async () => {
  const id = route.params.id as string;
  const project = await projects.loadProject(id);
  if (project && project.projectType === 'symbol_pattern') {
    editor.loadProject(project as SymbolPatternProject);
  }
  loading.value = false;
});

onBeforeUnmount(() => {
  editor.reset();
});

async function onSave() {
  await editor.save();
  const t = await toastController.create({
    message: 'Project saved',
    duration: 1200,
    color: 'success'
  });
  t.present();
}

function exportJson() {
  if (editor.project) jsonExportService.exportProject(editor.project);
}
</script>

<style scoped>
.editor-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
}
.editor-main {
  display: grid;
  grid-template-columns: 260px 1fr 300px;
  gap: 8px;
  flex: 1;
  min-height: 0;
}
.left-panel,
.right-panel {
  overflow: auto;
  max-height: calc(100vh - 160px);
}
.canvas-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}
.cpd-canvas-wrap {
  flex: 1;
  min-height: 320px;
}
.keyboard-strip {
  flex: none;
}
.panel-title {
  margin: 0 0 8px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cpd-color-text-soft);
}
hr {
  border: none;
  border-top: 1px solid var(--cpd-color-border);
  margin: 12px 0;
}

@media (max-width: 1100px) {
  .editor-main {
    grid-template-columns: 1fr;
  }
  .left-panel,
  .right-panel {
    max-height: 280px;
  }
}

.preview-drawer {
  position: fixed;
  inset: auto 0 0 0;
  background: var(--cpd-color-surface);
  border-top: 1px solid var(--cpd-color-border);
  box-shadow: 0 -10px 30px rgba(43, 37, 64, 0.15);
  z-index: 20;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}
.preview-drawer header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--cpd-color-border);
}
.preview-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px;
  overflow: auto;
}
@media (max-width: 800px) {
  .preview-body {
    grid-template-columns: 1fr;
  }
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
