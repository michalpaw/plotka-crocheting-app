// Pure-domain grid (pixel-style color) pattern.

export interface GridPattern {
  rows: number;
  columns: number;
  /** Map of "row:col" -> hex color string. Empty/undefined means no fill. */
  cells: Record<string, string>;
  palette: string[];
}

export function createEmptyGridPattern(rows = 50, columns = 50): GridPattern {
  return {
    rows,
    columns,
    cells: {},
    palette: DEFAULT_PALETTE.slice()
  };
}

export const DEFAULT_PALETTE = [
  '#ffffff',
  '#f3f3f3',
  '#1a1a1a',
  '#e84d4d',
  '#f59e0b',
  '#fbbf24',
  '#22c55e',
  '#0ea5e9',
  '#3b82f6',
  '#7a4ec9',
  '#d946ef',
  '#ec4899',
  '#a16207',
  '#16a34a',
  '#475569'
];

export function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

export function setCell(grid: GridPattern, row: number, col: number, color: string | null): GridPattern {
  const key = cellKey(row, col);
  const next: GridPattern = { ...grid, cells: { ...grid.cells } };
  if (color === null) delete next.cells[key];
  else next.cells[key] = color;
  return next;
}

export function clearGrid(grid: GridPattern): GridPattern {
  return { ...grid, cells: {} };
}

export function fillGrid(grid: GridPattern, color: string): GridPattern {
  const cells: Record<string, string> = {};
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.columns; c++) {
      cells[cellKey(r, c)] = color;
    }
  }
  return { ...grid, cells };
}

export function resizeGrid(grid: GridPattern, rows: number, columns: number): GridPattern {
  const cells: Record<string, string> = {};
  for (const [k, v] of Object.entries(grid.cells)) {
    const [r, c] = k.split(':').map(Number);
    if (r < rows && c < columns) cells[k] = v;
  }
  return { ...grid, rows, columns, cells };
}

export function addPaletteColor(grid: GridPattern, color: string): GridPattern {
  if (grid.palette.includes(color)) return grid;
  return { ...grid, palette: [...grid.palette, color] };
}
