import type { CrochetOperation } from '../symbols/symbolTypes';

export interface PatternCanvas {
  width: number;
  height: number;
  gridSize: number;
  units: 'px' | 'mm';
  items: PatternCanvasItem[];
}

export interface PatternCanvasItem {
  id: string;
  symbolId: string;
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
  rowId?: string;
  roundId?: string;
  repeatGroupId?: string;
  operation: CrochetOperation;
  createdAt: string;
  updatedAt: string;
}

export function createEmptyCanvas(gridSize = 32): PatternCanvas {
  return {
    width: 800,
    height: 600,
    gridSize,
    units: 'px',
    items: []
  };
}
