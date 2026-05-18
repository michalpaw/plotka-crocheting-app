<template>
  <div class="preview" v-html="svg" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CrochetPattern } from '@core/model/pattern';
import { preview2DService } from '@/renderers/preview2d/Preview2DService';

const props = defineProps<{ pattern: CrochetPattern }>();

const svg = computed(() => preview2DService.renderToSvgString(props.pattern));
</script>

<style scoped>
.preview {
  background: var(--cpd-color-surface);
  border: 1px solid var(--cpd-color-border);
  border-radius: var(--cpd-radius-md);
  padding: 12px;
  overflow: auto;
}
.preview :deep(svg) {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
