<template>
  <div class="toolbar">
    <ion-input
      v-model="name"
      class="name-input"
      placeholder="Project name"
      @ionInput="emit('rename', name)"
    />

    <span class="cpd-spacer" />

    <ion-button size="small" :fill="grid.tool === 'paint' ? 'solid' : 'outline'" @click="grid.setTool('paint')">
      <ion-icon slot="icon-only" :icon="brushOutline" />
    </ion-button>
    <ion-button size="small" :fill="grid.tool === 'erase' ? 'solid' : 'outline'" @click="grid.setTool('erase')">
      <ion-icon slot="icon-only" :icon="trashOutline" />
    </ion-button>
    <ion-button size="small" :fill="grid.tool === 'eyedropper' ? 'solid' : 'outline'" @click="grid.setTool('eyedropper')">
      <ion-icon slot="icon-only" :icon="eyedropOutline" />
    </ion-button>

    <ion-button size="small" fill="clear" color="medium" @click="emit('fill-all')">
      <ion-icon slot="start" :icon="colorFillOutline" />
      Fill
    </ion-button>
    <ion-button size="small" fill="clear" color="medium" @click="emit('clear-all')">
      <ion-icon slot="start" :icon="closeCircleOutline" />
      Clear
    </ion-button>

    <ion-button size="small" fill="outline" @click="emit('export-png')">
      <ion-icon slot="start" :icon="imageOutline" />
      PNG
    </ion-button>
    <ion-button size="small" fill="outline" @click="emit('export-pdf')">
      <ion-icon slot="start" :icon="printOutline" />
      Print
    </ion-button>
    <ion-button size="small" :disabled="!grid.dirty" @click="emit('save')">
      <ion-icon slot="start" :icon="saveOutline" />
      Save
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonInput, IonButton, IonIcon } from '@ionic/vue';
import {
  brushOutline,
  trashOutline,
  eyedropOutline,
  colorFillOutline,
  closeCircleOutline,
  imageOutline,
  printOutline,
  saveOutline
} from 'ionicons/icons';
import { useGridStore } from '@/stores/gridStore';

const emit = defineEmits<{
  (e: 'rename', name: string): void;
  (e: 'save'): void;
  (e: 'export-png'): void;
  (e: 'export-pdf'): void;
  (e: 'fill-all'): void;
  (e: 'clear-all'): void;
}>();

const grid = useGridStore();
const name = ref(grid.project?.name ?? '');

watch(
  () => grid.project,
  (p) => {
    if (p) name.value = p.name;
  },
  { immediate: true }
);
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 8px 12px;
  background: var(--cpd-color-surface);
  border: 1px solid var(--cpd-color-border);
  border-radius: var(--cpd-radius-md);
}
.name-input {
  min-width: 220px;
  flex: 0 1 260px;
  --background: var(--cpd-color-surface-soft);
  --padding-start: 12px;
  --padding-end: 12px;
}
</style>
