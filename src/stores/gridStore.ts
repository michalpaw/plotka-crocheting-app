import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GridPatternProject } from '@core/model/project';
import {
  cellKey,
  clearGrid as clearGridFn,
  fillGrid as fillGridFn,
  resizeGrid as resizeGridFn,
  addPaletteColor,
  setCell
} from '@core/model/gridPattern';
import { useProjectStore } from './projectStore';

export type GridTool = 'paint' | 'erase' | 'eyedropper';

export const useGridStore = defineStore('grid', () => {
  const project = ref<GridPatternProject | null>(null);
  const activeColor = ref<string>('#ad508c');
  const tool = ref<GridTool>('paint');
  const dirty = ref(false);
  const zoom = ref(1);

  const grid = computed(() => project.value?.payload.grid ?? null);

  function loadProject(p: GridPatternProject) {
    project.value = p;
    dirty.value = false;
    if (p.payload.grid.palette[0]) activeColor.value = p.payload.grid.palette.find((c) => c !== '#ffffff') ?? p.payload.grid.palette[0];
  }

  function setCellAt(row: number, col: number) {
    if (!project.value) return;
    const g = project.value.payload.grid;
    if (row < 0 || col < 0 || row >= g.rows || col >= g.columns) return;

    if (tool.value === 'erase') {
      project.value.payload.grid = setCell(g, row, col, null);
    } else if (tool.value === 'eyedropper') {
      const c = g.cells[cellKey(row, col)];
      if (c) activeColor.value = c;
      return;
    } else {
      project.value.payload.grid = setCell(g, row, col, activeColor.value);
    }
    dirty.value = true;
  }

  function setActiveColor(color: string) {
    activeColor.value = color;
    if (project.value) {
      project.value.payload.grid = addPaletteColor(project.value.payload.grid, color);
    }
  }

  function setTool(t: GridTool) {
    tool.value = t;
  }

  function clearAll() {
    if (!project.value) return;
    project.value.payload.grid = clearGridFn(project.value.payload.grid);
    dirty.value = true;
  }

  function fillAll() {
    if (!project.value) return;
    project.value.payload.grid = fillGridFn(project.value.payload.grid, activeColor.value);
    dirty.value = true;
  }

  function resize(rows: number, columns: number) {
    if (!project.value) return;
    project.value.payload.grid = resizeGridFn(project.value.payload.grid, rows, columns);
    dirty.value = true;
  }

  function addColor(color: string) {
    if (!project.value) return;
    project.value.payload.grid = addPaletteColor(project.value.payload.grid, color);
  }

  async function save() {
    if (!project.value) return;
    const projects = useProjectStore();
    await projects.saveProject(project.value);
    dirty.value = false;
  }

  function reset() {
    project.value = null;
    dirty.value = false;
  }

  return {
    project,
    grid,
    activeColor,
    tool,
    dirty,
    zoom,
    loadProject,
    setCellAt,
    setActiveColor,
    setTool,
    clearAll,
    fillAll,
    resize,
    addColor,
    save,
    reset
  };
});
