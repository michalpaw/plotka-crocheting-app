<template>
  <div class="grid-canvas-wrap" v-if="grid">
    <canvas
      ref="canvasRef"
      :width="pixelWidth"
      :height="pixelHeight"
      :style="{ width: pixelWidth + 'px', height: pixelHeight + 'px' }"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="endStroke"
      @mouseleave="endStroke"
      @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend.prevent="endStroke"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useGridStore } from '@/stores/gridStore';
import { cellKey } from '@core/model/gridPattern';

const store = useGridStore();

const grid = computed(() => store.grid);
const cellSize = ref(14);
const pixelWidth = computed(() => (grid.value?.columns ?? 0) * cellSize.value);
const pixelHeight = computed(() => (grid.value?.rows ?? 0) * cellSize.value);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const painting = ref(false);

function getCtx() {
  return canvasRef.value?.getContext('2d') ?? null;
}

function draw() {
  if (!grid.value) return;
  const ctx = getCtx();
  if (!ctx) return;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, pixelWidth.value, pixelHeight.value);

  for (let r = 0; r < grid.value.rows; r++) {
    for (let c = 0; c < grid.value.columns; c++) {
      const color = grid.value.cells[cellKey(r, c)];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(c * cellSize.value, r * cellSize.value, cellSize.value, cellSize.value);
    }
  }

  ctx.strokeStyle = 'rgba(43, 37, 64, 0.1)';
  ctx.lineWidth = 1;
  for (let r = 0; r <= grid.value.rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellSize.value + 0.5);
    ctx.lineTo(pixelWidth.value, r * cellSize.value + 0.5);
    ctx.stroke();
  }
  for (let c = 0; c <= grid.value.columns; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cellSize.value + 0.5, 0);
    ctx.lineTo(c * cellSize.value + 0.5, pixelHeight.value);
    ctx.stroke();
  }
}

watch(() => grid.value && JSON.stringify(grid.value.cells), draw);
watch(() => [grid.value?.rows, grid.value?.columns], draw);

onMounted(() => {
  // Choose a reasonable cell size based on grid dimensions.
  if (grid.value) {
    const maxPx = 720;
    const longest = Math.max(grid.value.rows, grid.value.columns);
    cellSize.value = Math.max(6, Math.min(24, Math.floor(maxPx / longest)));
  }
  draw();
});

onBeforeUnmount(() => {
  painting.value = false;
});

function hit(evt: { clientX: number; clientY: number }) {
  const canvas = canvasRef.value;
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const x = evt.clientX - rect.left;
  const y = evt.clientY - rect.top;
  const col = Math.floor(x / cellSize.value);
  const row = Math.floor(y / cellSize.value);
  return { row, col };
}

function onMouseDown(evt: MouseEvent) {
  painting.value = true;
  const cell = hit(evt);
  if (cell) store.setCellAt(cell.row, cell.col);
}

function onMouseMove(evt: MouseEvent) {
  if (!painting.value) return;
  const cell = hit(evt);
  if (cell) store.setCellAt(cell.row, cell.col);
}

function endStroke() {
  painting.value = false;
}

function onTouchStart(evt: TouchEvent) {
  painting.value = true;
  const t = evt.touches[0];
  const cell = hit(t);
  if (cell) store.setCellAt(cell.row, cell.col);
}

function onTouchMove(evt: TouchEvent) {
  if (!painting.value) return;
  const t = evt.touches[0];
  const cell = hit(t);
  if (cell) store.setCellAt(cell.row, cell.col);
}
</script>

<style scoped>
.grid-canvas-wrap {
  background: var(--cpd-color-surface);
  border: 1px solid var(--cpd-color-border);
  border-radius: var(--cpd-radius-md);
  padding: 12px;
  overflow: auto;
  max-width: 100%;
  max-height: 72vh;
}
canvas {
  display: block;
  cursor: crosshair;
  touch-action: none;
  user-select: none;
}
</style>
