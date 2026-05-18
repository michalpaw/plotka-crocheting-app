import type { CrochetOperation } from '../symbols/symbolTypes';
import type { PatternCanvasItem } from '../model/canvas';
import { STITCH_INFO } from '../model/stitch';

export function countStitchesInOperation(op: CrochetOperation): number {
  switch (op.type) {
    case 'stitch':
      return (op.stitchCountProduced ?? STITCH_INFO[op.stitchType].stitchCountProduced) * (op.count || 1);
    case 'repeat':
      return op.operations.reduce((acc, inner) => acc + countStitchesInOperation(inner), 0) * (op.times || 1);
    case 'marker':
      return 0;
  }
}

export function totalStitchCount(items: PatternCanvasItem[]): number {
  return items.reduce((acc, item) => acc + countStitchesInOperation(item.operation), 0);
}

/**
 * Group items into rows by clustering close y-coordinates.
 * Returns rows ordered top-to-bottom, each row's items sorted left-to-right.
 */
export function groupItemsByRows(items: PatternCanvasItem[], gridSize = 32): PatternCanvasItem[][] {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => a.y - b.y);
  const rows: PatternCanvasItem[][] = [];
  const tolerance = gridSize * 0.6;
  for (const item of sorted) {
    const last = rows[rows.length - 1];
    if (last && Math.abs(last[0].y - item.y) <= tolerance) {
      last.push(item);
    } else {
      rows.push([item]);
    }
  }
  return rows.map((row) => row.sort((a, b) => a.x - b.x));
}

export interface RowStitchCount {
  rowNumber: number;
  count: number;
}

export function stitchCountsPerRow(items: PatternCanvasItem[], gridSize = 32): RowStitchCount[] {
  return groupItemsByRows(items, gridSize).map((row, idx) => ({
    rowNumber: idx + 1,
    count: row.reduce((acc, it) => acc + countStitchesInOperation(it.operation), 0)
  }));
}
