<template>
  <div class="toolbar">
    <ion-input
      v-model="name"
      class="name-input"
      placeholder="Pattern name"
      @ionInput="onNameChange"
    />

    <ion-segment v-model="mode" @ion-change="onModeChange" class="mode-segment">
      <ion-segment-button value="rows"><ion-label>Rows</ion-label></ion-segment-button>
      <ion-segment-button value="rounds"><ion-label>Rounds</ion-label></ion-segment-button>
      <ion-segment-button value="freeform"><ion-label>Free</ion-label></ion-segment-button>
    </ion-segment>

    <span class="cpd-spacer" />

    <ion-button size="small" fill="clear" @click="editor.showGrid = !editor.showGrid">
      <ion-icon slot="start" :icon="gridOutline" />
      {{ editor.showGrid ? 'Hide grid' : 'Show grid' }}
    </ion-button>
    <ion-button size="small" fill="clear" @click="editor.snapToGrid = !editor.snapToGrid">
      <ion-icon slot="start" :icon="magnetOutline" />
      Snap {{ editor.snapToGrid ? 'on' : 'off' }}
    </ion-button>

    <ion-button size="small" fill="outline" @click="emit('preview')">
      <ion-icon slot="start" :icon="eyeOutline" />
      Preview
    </ion-button>

    <ion-button size="small" :disabled="!editor.dirty" @click="emit('save')">
      <ion-icon slot="start" :icon="saveOutline" />
      Save
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { gridOutline, magnetOutline, eyeOutline, saveOutline } from 'ionicons/icons';
import { useEditorStore } from '@/stores/editorStore';

const emit = defineEmits<{ (e: 'save'): void; (e: 'preview'): void }>();

const editor = useEditorStore();
const name = ref(editor.project?.name ?? '');
const mode = ref<string>(editor.pattern?.mode ?? 'rows');

watch(
  () => editor.project,
  (p) => {
    if (p) {
      name.value = p.name;
      mode.value = p.payload.pattern.mode;
    }
  },
  { immediate: true }
);

function onNameChange() {
  editor.setPatternName(name.value);
}

function onModeChange() {
  editor.setPatternMode(mode.value as 'rows' | 'rounds' | 'freeform');
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--cpd-color-surface);
  border: 1px solid var(--cpd-color-border);
  border-radius: var(--cpd-radius-md);
  margin-bottom: 8px;
}
.name-input {
  min-width: 220px;
  flex: 0 1 260px;
  --background: var(--cpd-color-surface-soft);
  --padding-start: 12px;
  --padding-end: 12px;
  border-radius: var(--cpd-radius-sm);
}
.mode-segment {
  min-width: 220px;
  max-width: 260px;
}
</style>
