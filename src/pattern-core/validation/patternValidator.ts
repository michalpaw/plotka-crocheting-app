import type { CrochetPattern } from '../model/pattern';
import { DEFAULT_SYMBOL_LIBRARY } from '../symbols/defaultSymbolLibrary';

export type ValidationSeverity = 'info' | 'warning' | 'error';

export interface ValidationMessage {
  severity: ValidationSeverity;
  code: string;
  message: string;
}

export function validatePattern(pattern: CrochetPattern): ValidationMessage[] {
  const messages: ValidationMessage[] = [];

  if (!pattern.name?.trim()) {
    messages.push({ severity: 'warning', code: 'missing_name', message: 'Pattern has no name.' });
  }
  if (pattern.canvas.items.length === 0) {
    messages.push({
      severity: 'info',
      code: 'empty_pattern',
      message: 'Pattern has no symbols yet. Place a symbol from the palette to begin.'
    });
  }

  const knownIds = new Set([
    ...DEFAULT_SYMBOL_LIBRARY.map((s) => s.id),
    ...(pattern.symbolLegend ?? []).map((s) => s.id)
  ]);

  for (const item of pattern.canvas.items) {
    if (!knownIds.has(item.symbolId)) {
      messages.push({
        severity: 'error',
        code: 'unknown_symbol',
        message: `Unknown symbol "${item.symbolId}" at (${item.x}, ${item.y}).`
      });
    }
    if (!item.operation) {
      messages.push({
        severity: 'error',
        code: 'invalid_operation',
        message: `Item ${item.id} has no operation.`
      });
    }
  }

  return messages;
}
