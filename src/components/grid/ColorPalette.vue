<template>
  <div class="palette-row">
    <div
      v-for="color in palette"
      :key="color"
      class="cpd-swatch"
      :class="{ active: color === active }"
      :style="{ background: color }"
      :title="color"
      @click="$emit('select', color)"
    />
    <label class="cpd-swatch add" title="Add color">
      <input type="color" v-model="picker" @change="onAdd" hidden />
      +
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ palette: string[]; active: string }>();
const emit = defineEmits<{
  (e: 'select', color: string): void;
  (e: 'add', color: string): void;
}>();

const picker = ref('#ad508c');

function onAdd() {
  emit('add', picker.value);
  emit('select', picker.value);
}
</script>

<style scoped>
.palette-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cpd-swatch.add {
  background: var(--cpd-color-surface-soft);
  color: var(--cpd-color-text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 1px dashed var(--cpd-color-border);
}
</style>
