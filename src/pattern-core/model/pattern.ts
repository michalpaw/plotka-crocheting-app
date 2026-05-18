import type { SymbolDefinition } from '../symbols/symbolTypes';
import type { PatternCanvas } from './canvas';
import type { RepeatGroup } from './repeat';
import type { RowInfo, RoundInfo } from './row';

export type PatternMode = 'rows' | 'rounds' | 'freeform';

export interface PatternStructure {
  rows: RowInfo[];
  rounds: RoundInfo[];
  repeatGroups: RepeatGroup[];
}

export interface PatternMetadata {
  hookSize?: string;
  yarnWeight?: string;
  gauge?: string;
  notes?: string;
}

export interface CrochetPattern {
  id: string;
  name: string;
  mode: PatternMode;
  symbolLegend: SymbolDefinition[];
  canvas: PatternCanvas;
  structure: PatternStructure;
  metadata: PatternMetadata;
}

export function createEmptyPattern(name = 'Untitled Pattern'): CrochetPattern {
  return {
    id: cryptoRandom(),
    name,
    mode: 'rows',
    symbolLegend: [],
    canvas: { width: 800, height: 600, gridSize: 32, units: 'px', items: [] },
    structure: { rows: [], rounds: [], repeatGroups: [] },
    metadata: {}
  };
}

function cryptoRandom(): string {
  // Deterministic-free id without depending on browser-only crypto types.
  return 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
