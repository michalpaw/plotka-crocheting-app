import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SymbolPatternProject } from '@core/model/project';
import type { CrochetPattern } from '@core/model/pattern';
import type { PatternCanvasItem } from '@core/model/canvas';
import { newId } from '@/utils/ids';
import { nowIso } from '@/utils/dates';
import { findSymbolById } from '@core/symbols/defaultSymbolLibrary';
import { useProjectStore } from './projectStore';
import { generateInstructions, type GeneratedInstructions } from '@core/instructions/instructionGenerator';
import { validatePattern, type ValidationMessage } from '@core/validation/patternValidator';
import { validateStitchCounts } from '@core/validation/stitchCountValidator';
import { totalStitchCount, stitchCountsPerRow } from '@core/calculations/stitchCounter';

export type EditorTool = 'select' | 'place' | 'erase';

export const useEditorStore = defineStore('editor', () => {
  const project = ref<SymbolPatternProject | null>(null);
  const activeSymbolId = ref<string | null>('sym_sc');
  const tool = ref<EditorTool>('place');
  const selectedItemId = ref<string | null>(null);
  const showGrid = ref(true);
  const snapToGrid = ref(true);
  const zoom = ref(1);
  const dirty = ref(false);

  const pattern = computed<CrochetPattern | null>(() => project.value?.payload.pattern ?? null);

  const instructions = computed<GeneratedInstructions | null>(() =>
    pattern.value ? generateInstructions(pattern.value) : null
  );

  const validationMessages = computed<ValidationMessage[]>(() => {
    if (!pattern.value) return [];
    return [...validatePattern(pattern.value), ...validateStitchCounts(pattern.value)];
  });

  const totalStitches = computed(() => (pattern.value ? totalStitchCount(pattern.value.canvas.items) : 0));

  const rowStitchCounts = computed(() =>
    pattern.value ? stitchCountsPerRow(pattern.value.canvas.items, pattern.value.canvas.gridSize) : []
  );

  function loadProject(p: SymbolPatternProject) {
    project.value = p;
    selectedItemId.value = null;
    dirty.value = false;
  }

  function snap(value: number): number {
    if (!project.value) return value;
    if (!snapToGrid.value) return value;
    const size = project.value.payload.pattern.canvas.gridSize;
    return Math.round(value / size) * size + size / 2;
  }

  function placeSymbolAt(x: number, y: number) {
    if (!project.value || !activeSymbolId.value) return;
    const symbol = findSymbolById(activeSymbolId.value);
    if (!symbol) return;
    const item: PatternCanvasItem = {
      id: newId('item'),
      symbolId: symbol.id,
      x: snap(x),
      y: snap(y),
      rotation: 0,
      scale: 1,
      operation: JSON.parse(JSON.stringify(symbol.operationTemplate)),
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    project.value.payload.pattern.canvas.items.push(item);
    selectedItemId.value = item.id;
    dirty.value = true;
  }

  function selectItem(id: string | null) {
    selectedItemId.value = id;
  }

  function moveItem(id: string, x: number, y: number) {
    if (!project.value) return;
    const item = project.value.payload.pattern.canvas.items.find((i) => i.id === id);
    if (!item) return;
    item.x = snap(x);
    item.y = snap(y);
    item.updatedAt = nowIso();
    dirty.value = true;
  }

  function removeItem(id: string) {
    if (!project.value) return;
    const items = project.value.payload.pattern.canvas.items;
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) items.splice(idx, 1);
    if (selectedItemId.value === id) selectedItemId.value = null;
    dirty.value = true;
  }

  function setActiveSymbol(id: string) {
    activeSymbolId.value = id;
    tool.value = 'place';
  }

  function setTool(t: EditorTool) {
    tool.value = t;
    if (t !== 'select') selectedItemId.value = null;
  }

  function setPatternName(name: string) {
    if (!project.value) return;
    project.value.name = name;
    project.value.payload.pattern.name = name;
    dirty.value = true;
  }

  function setPatternMode(mode: CrochetPattern['mode']) {
    if (!project.value) return;
    project.value.payload.pattern.mode = mode;
    dirty.value = true;
  }

  function setCanvasSize(width: number, height: number) {
    if (!project.value) return;
    project.value.payload.pattern.canvas.width = width;
    project.value.payload.pattern.canvas.height = height;
    dirty.value = true;
  }

  function setGridSize(size: number) {
    if (!project.value) return;
    project.value.payload.pattern.canvas.gridSize = size;
    dirty.value = true;
  }

  async function save() {
    if (!project.value) return;
    const projects = useProjectStore();
    await projects.saveProject(project.value);
    dirty.value = false;
  }

  function reset() {
    project.value = null;
    selectedItemId.value = null;
    dirty.value = false;
  }

  return {
    project,
    pattern,
    activeSymbolId,
    tool,
    selectedItemId,
    showGrid,
    snapToGrid,
    zoom,
    dirty,
    instructions,
    validationMessages,
    totalStitches,
    rowStitchCounts,
    loadProject,
    placeSymbolAt,
    selectItem,
    moveItem,
    removeItem,
    setActiveSymbol,
    setTool,
    setPatternName,
    setPatternMode,
    setCanvasSize,
    setGridSize,
    save,
    reset
  };
});
