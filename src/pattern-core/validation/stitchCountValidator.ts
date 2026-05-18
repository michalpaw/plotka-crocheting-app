import type { CrochetPattern } from '../model/pattern';
import { stitchCountsPerRow } from '../calculations/stitchCounter';
import type { ValidationMessage } from './patternValidator';

export function validateStitchCounts(pattern: CrochetPattern): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  if (pattern.mode !== 'rows' && pattern.mode !== 'rounds') return messages;

  const counts = stitchCountsPerRow(pattern.canvas.items, pattern.canvas.gridSize);
  if (counts.length < 2) return messages;

  for (let i = 1; i < counts.length; i++) {
    const diff = counts[i].count - counts[i - 1].count;
    if (Math.abs(diff) > Math.max(2, Math.ceil(counts[i - 1].count * 0.25))) {
      messages.push({
        severity: 'warning',
        code: 'large_stitch_jump',
        message: `Row ${counts[i].rowNumber} differs from row ${counts[i - 1].rowNumber} by ${diff} stitches.`
      });
    }
  }

  return messages;
}
