<template>
  <div class="canvas-host" ref="hostRef" @keydown="onKeyDown" tabindex="0">
    <svg
      v-if="pattern"
      ref="svgRef"
      :width="pattern.canvas.width"
      :height="pattern.canvas.height"
      :viewBox="`0 0 ${pattern.canvas.width} ${pattern.canvas.height}`"
      xmlns="http://www.w3.org/2000/svg"
      @click="onCanvasClick"
    >
      <rect :width="pattern.canvas.width" :height="pattern.canvas.height" fill="#fdfbff" />
      <g v-if="editor.showGrid" v-html="gridLines" />
      <g v-for="item in pattern.canvas.items" :key="item.id" @click.stop="onItemClick(item.id, $event)">
        <rect
          v-if="editor.selectedItemId === item.id"
          :x="item.x - cellHalf"
          :y="item.y - cellHalf"
          :width="cellSize"
          :height="cellSize"
          rx="4"
          fill="#fef3c7"
          stroke="#f59e0b"
          stroke-width="2"
        />
        <g :transform="transformFor(item)" v-html="symbolInnerFor(item.symbolId)" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useEditorStore } from '@/stores/editorStore';
import { useSymbolStore } from '@/stores/symbolStore';
import { renderSymbolInner } from '@/renderers/svg/SvgSymbolRenderer';
import { renderGridLines } from '@/renderers/svg/SvgGridRenderer';

const editor = useEditorStore();
const symbolStore = useSymbolStore();

const hostRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);

const pattern = computed(() => editor.pattern);
const cellSize = computed(() => pattern.value?.canvas.gridSize ?? 32);
const cellHalf = computed(() => cellSize.value / 2);

const gridLines = computed(() => {
  if (!pattern.value) return '';
  return renderGridLines({
    width: pattern.value.canvas.width,
    height: pattern.value.canvas.height,
    gridSize: pattern.value.canvas.gridSize
  });
});

const symbolInnerCache = new Map<string, { inner: string; viewBox: string }>();
function getSymbolRender(symbolId: string) {
  const cached = symbolInnerCache.get(symbolId);
  if (cached) return cached;
  const symbol = symbolStore.getById(symbolId);
  if (!symbol) return { inner: '', viewBox: '0 0 32 32' };
  const rendered = renderSymbolInner(symbol);
  symbolInnerCache.set(symbolId, rendered);
  return rendered;
}

function symbolInnerFor(symbolId: string): string {
  return getSymbolRender(symbolId).inner;
}

function transformFor(item: { symbolId: string; x: number; y: number; rotation?: number; scale?: number }) {
  const size = cellSize.value;
  const { viewBox } = getSymbolRender(item.symbolId);
  const [vbX, vbY, vbW, vbH] = viewBox.split(' ').map(Number);
  const innerScaleX = size / vbW;
  const innerScaleY = size / vbH;
  const half = size / 2;
  const tx = item.x - half;
  const ty = item.y - half;
  const rotation = item.rotation ?? 0;
  const scale = item.scale ?? 1;
  return `translate(${tx} ${ty}) translate(${half} ${half}) rotate(${rotation}) scale(${scale}) translate(${-half} ${-half}) scale(${innerScaleX} ${innerScaleY}) translate(${-vbX} ${-vbY})`;
}

function getSvgCoords(evt: MouseEvent): { x: number; y: number } | null {
  const svg = svgRef.value;
  if (!svg) return null;
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const transformed = pt.matrixTransform(ctm.inverse());
  return { x: transformed.x, y: transformed.y };
}

function onCanvasClick(evt: MouseEvent) {
  const coords = getSvgCoords(evt);
  if (!coords) return;
  if (editor.tool === 'place') {
    editor.placeSymbolAt(coords.x, coords.y);
  } else if (editor.tool === 'select') {
    editor.selectItem(null);
  }
}

function onItemClick(id: string, evt: MouseEvent) {
  evt.stopPropagation();
  if (editor.tool === 'erase') {
    editor.removeItem(id);
    return;
  }
  editor.selectItem(id);
}

function onKeyDown(evt: KeyboardEvent) {
  if (evt.key === 'Delete' || evt.key === 'Backspace') {
    if (editor.selectedItemId) {
      editor.removeItem(editor.selectedItemId);
      evt.preventDefault();
      return;
    }
  }
  if (evt.key.length === 1) {
    const symbol = symbolStore.getByShortcut(evt.key);
    if (symbol) {
      editor.setActiveSymbol(symbol.id);
      evt.preventDefault();
    }
  }
}

onMounted(() => {
  hostRef.value?.focus();
});

onBeforeUnmount(() => {
  symbolInnerCache.clear();
});
</script>

<style scoped>
.canvas-host {
  width: 100%;
  height: 100%;
  min-height: 360px;
  outline: none;
  overflow: auto;
  background:
    linear-gradient(45deg, #fafafa 25%, transparent 25%) -8px 0,
    linear-gradient(-45deg, #fafafa 25%, transparent 25%) -8px 0,
    linear-gradient(45deg, transparent 75%, #fafafa 75%),
    linear-gradient(-45deg, transparent 75%, #fafafa 75%);
  background-size: 16px 16px;
  background-color: #ffffff;
  border-radius: var(--cpd-radius-md);
}
svg {
  display: block;
  cursor: crosshair;
  background: #fdfbff;
}
</style>
