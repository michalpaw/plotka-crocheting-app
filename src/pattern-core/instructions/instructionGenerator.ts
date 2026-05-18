import type { CrochetPattern } from '../model/pattern';
import type { CrochetOperation } from '../symbols/symbolTypes';
import type { PatternCanvasItem } from '../model/canvas';
import { STITCH_INFO } from '../model/stitch';
import { groupItemsByRows, countStitchesInOperation } from '../calculations/stitchCounter';

export interface InstructionLine {
  index: number;
  text: string;
}

export interface InstructionRow {
  rowNumber: number;
  label: string;
  lines: InstructionLine[];
  stitchCount: number;
}

export interface GeneratedInstructions {
  patternName: string;
  rows: InstructionRow[];
  summary: { totalStitches: number; totalRows: number };
}

export function describeOperation(op: CrochetOperation): string {
  switch (op.type) {
    case 'stitch': {
      const info = STITCH_INFO[op.stitchType];
      const word = op.count === 1 ? info.displayName : `${op.count} ${info.displayName}${op.count > 1 ? 's' : ''}`;
      return `Work ${op.count > 1 ? '' : '1 '}${word}.`;
    }
    case 'repeat': {
      const inner = op.operations.map(describeOperation).join(' ');
      return `Repeat ${op.times}×: ${inner || '[empty repeat block]'}`;
    }
    case 'marker': {
      const labels: Record<string, string> = {
        start: 'Place start marker.',
        end: 'Place end marker.',
        turn: 'Turn.',
        join: 'Join with slip stitch.'
      };
      return labels[op.markerType] || 'Marker.';
    }
  }
}

export function generateInstructions(pattern: CrochetPattern): GeneratedInstructions {
  const rows = groupItemsByRows(pattern.canvas.items, pattern.canvas.gridSize);
  const rowLabel = pattern.mode === 'rounds' ? 'Round' : 'Row';

  const rowInstructions: InstructionRow[] = rows.map((rowItems, idx) => {
    const lines: InstructionLine[] = rowItems.map((item, i) => ({
      index: i + 1,
      text: describeOperation(item.operation)
    }));
    const stitchCount = rowItems.reduce(
      (acc: number, it: PatternCanvasItem) => acc + countStitchesInOperation(it.operation),
      0
    );
    return {
      rowNumber: idx + 1,
      label: `${rowLabel} ${idx + 1}`,
      lines,
      stitchCount
    };
  });

  return {
    patternName: pattern.name || 'Untitled Pattern',
    rows: rowInstructions,
    summary: {
      totalStitches: rowInstructions.reduce((acc, r) => acc + r.stitchCount, 0),
      totalRows: rowInstructions.length
    }
  };
}
