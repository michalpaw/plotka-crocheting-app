import { SYMBOL_GLYPHS, type SymbolGlyph } from '@core/symbols/crochetSymbols';
import type { SymbolDefinition } from '@core/symbols/symbolTypes';

export interface SymbolSvgString {
  viewBox: string;
  inner: string;
}

/** Returns the inner SVG markup for a symbol (paths only, no <svg> wrapper). */
export function renderSymbolInner(symbol: SymbolDefinition): SymbolSvgString {
  const key = symbol.svgIcon || symbol.code;
  const glyph: SymbolGlyph = SYMBOL_GLYPHS[key] ?? SYMBOL_GLYPHS['single_crochet'];
  const inner = glyph.paths
    .map(
      (p) =>
        `<path d="${p.d}" stroke="${p.stroke ?? 'currentColor'}" fill="${p.fill ?? 'none'}" stroke-width="${
          p.strokeWidth ?? 2
        }" stroke-linecap="round" stroke-linejoin="round" />`
    )
    .join('');
  return { viewBox: glyph.viewBox, inner };
}

/** Returns a standalone <svg>...</svg> string for use in <img src=> or palettes. */
export function renderSymbolSvg(symbol: SymbolDefinition, size = 32): string {
  const { viewBox, inner } = renderSymbolInner(symbol);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${viewBox}">${inner}</svg>`;
}
