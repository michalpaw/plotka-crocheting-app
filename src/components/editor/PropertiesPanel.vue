<template>
  <div class="props">
    <h4>Canvas</h4>
    <div class="row">
      <label>Width</label>
      <ion-input v-model.number="width" type="number" min="100" @ionChange="applySize" />
    </div>
    <div class="row">
      <label>Height</label>
      <ion-input v-model.number="height" type="number" min="100" @ionChange="applySize" />
    </div>
    <div class="row">
      <label>Grid size</label>
      <ion-input v-model.number="gridSize" type="number" min="8" max="80" @ionChange="applyGrid" />
    </div>

    <h4>Selected item</h4>
    <div v-if="selected">
      <p><strong>{{ symbolName }}</strong></p>
      <p class="muted">at ({{ selected.x.toFixed(0) }}, {{ selected.y.toFixed(0) }})</p>
      <ion-button size="small" color="danger" fill="outline" @click="removeSelected">Delete</ion-button>
    </div>
    <p v-else class="muted">Tap an item on the canvas to select it.</p>

    <h4>Stitch summary</h4>
    <ul class="list">
      <li v-for="row in editor.rowStitchCounts" :key="row.rowNumber">
        Row {{ row.rowNumber }}: {{ row.count }} sts
      </li>
    </ul>
    <p v-if="editor.rowStitchCounts.length === 0" class="muted">No rows yet.</p>
    <p><strong>Total:</strong> {{ editor.totalStitches }} stitches</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IonInput, IonButton } from '@ionic/vue';
import { useEditorStore } from '@/stores/editorStore';
import { useSymbolStore } from '@/stores/symbolStore';

const editor = useEditorStore();
const symbols = useSymbolStore();

const width = ref(editor.pattern?.canvas.width ?? 800);
const height = ref(editor.pattern?.canvas.height ?? 600);
const gridSize = ref(editor.pattern?.canvas.gridSize ?? 32);

watch(
  () => editor.pattern?.canvas,
  (c) => {
    if (c) {
      width.value = c.width;
      height.value = c.height;
      gridSize.value = c.gridSize;
    }
  },
  { immediate: true, deep: true }
);

const selected = computed(() =>
  editor.pattern?.canvas.items.find((i) => i.id === editor.selectedItemId) ?? null
);
const symbolName = computed(() => {
  if (!selected.value) return '';
  return symbols.getById(selected.value.symbolId)?.name ?? '?';
});

function applySize() {
  editor.setCanvasSize(Number(width.value) || 800, Number(height.value) || 600);
}
function applyGrid() {
  editor.setGridSize(Number(gridSize.value) || 32);
}
function removeSelected() {
  if (editor.selectedItemId) editor.removeItem(editor.selectedItemId);
}
</script>

<style scoped>
.props {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
}
.props h4 {
  margin: 12px 0 4px;
  color: var(--cpd-color-primary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.row label {
  flex: 0 0 80px;
  color: var(--cpd-color-text-soft);
}
.row ion-input {
  flex: 1;
  --background: var(--cpd-color-surface-soft);
  --padding-start: 8px;
  --padding-end: 8px;
}
.list {
  margin: 0;
  padding-left: 16px;
  max-height: 140px;
  overflow: auto;
}
.muted {
  color: var(--cpd-color-text-soft);
  font-size: 0.85rem;
}
</style>
