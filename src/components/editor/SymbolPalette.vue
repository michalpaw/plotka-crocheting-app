<template>
  <div class="palette">
    <div v-for="(group, category) in groups" :key="category" class="group">
      <h4>{{ labels[category] || category }}</h4>
      <div class="group-grid">
        <button
          v-for="symbol in group"
          :key="symbol.id"
          type="button"
          class="cpd-symbol-btn"
          :class="{ active: editor.activeSymbolId === symbol.id }"
          :title="`${symbol.name}${symbol.defaultShortcut ? ' (' + symbol.defaultShortcut + ')' : ''}`"
          @click="editor.setActiveSymbol(symbol.id)"
        >
          <span v-html="iconFor(symbol)"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSymbolStore } from '@/stores/symbolStore';
import { useEditorStore } from '@/stores/editorStore';
import { renderSymbolSvg } from '@/renderers/svg/SvgSymbolRenderer';
import type { SymbolDefinition } from '@core/symbols/symbolTypes';

const symbols = useSymbolStore();
const editor = useEditorStore();

const labels: Record<string, string> = {
  basic_stitch: 'Basic stitches',
  increase_decrease: 'Increase / decrease',
  texture: 'Texture',
  repeat: 'Repeats',
  marker: 'Markers',
  custom: 'Custom'
};

const groups = computed(() => symbols.byCategory);

function iconFor(s: SymbolDefinition) {
  return renderSymbolSvg(s, 36);
}
</script>

<style scoped>
.palette {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.group h4 {
  margin: 0 0 6px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cpd-color-text-soft);
}
.group-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 6px;
}
</style>
