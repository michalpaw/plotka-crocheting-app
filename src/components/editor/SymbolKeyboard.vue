<template>
  <div class="keyboard">
    <button
      v-for="symbol in quickSymbols"
      :key="symbol.id"
      type="button"
      class="cpd-symbol-btn"
      :class="{ active: editor.activeSymbolId === symbol.id }"
      @click="editor.setActiveSymbol(symbol.id)"
    >
      <span class="cpd-shortcut-key" v-if="symbol.defaultShortcut">{{ symbol.defaultShortcut }}</span>
      <span v-html="iconFor(symbol)" class="icon-wrap" />
    </button>
    <span class="cpd-spacer" />
    <ion-button size="small" fill="outline" @click="editor.setTool('select')" :color="editor.tool === 'select' ? 'primary' : undefined">
      <ion-icon slot="icon-only" :icon="handLeftOutline" />
    </ion-button>
    <ion-button size="small" fill="outline" @click="editor.setTool('place')" :color="editor.tool === 'place' ? 'primary' : undefined">
      <ion-icon slot="icon-only" :icon="brushOutline" />
    </ion-button>
    <ion-button size="small" fill="outline" @click="editor.setTool('erase')" :color="editor.tool === 'erase' ? 'primary' : undefined">
      <ion-icon slot="icon-only" :icon="trashOutline" />
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { handLeftOutline, brushOutline, trashOutline } from 'ionicons/icons';
import { useEditorStore } from '@/stores/editorStore';
import { useSymbolStore } from '@/stores/symbolStore';
import { renderSymbolSvg } from '@/renderers/svg/SvgSymbolRenderer';
import type { SymbolDefinition } from '@core/symbols/symbolTypes';

const editor = useEditorStore();
const symbolStore = useSymbolStore();

const quickSymbols = computed(() =>
  symbolStore.symbols.filter((s) => s.category === 'basic_stitch' || s.category === 'increase_decrease')
);

function iconFor(s: SymbolDefinition) {
  return renderSymbolSvg(s, 28);
}
</script>

<style scoped>
.keyboard {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 8px;
  background: var(--cpd-color-surface);
  border: 1px solid var(--cpd-color-border);
  border-radius: var(--cpd-radius-md);
}
.icon-wrap {
  display: inline-block;
  line-height: 0;
}
</style>
