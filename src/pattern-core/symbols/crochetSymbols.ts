// Inline SVG path strings for built-in crochet symbols.
// These are simplified glyphs; they can be replaced with official
// Craft Yarn Council assets later without touching consumer code.

export interface SymbolGlyph {
  viewBox: string;
  paths: { d: string; stroke?: string; fill?: string; strokeWidth?: number }[];
}

const VB = '0 0 32 32';
const STROKE = '#3d2030';

export const SYMBOL_GLYPHS: Record<string, SymbolGlyph> = {
  chain: {
    viewBox: VB,
    paths: [
      { d: 'M6 16 Q11 8 16 16 Q21 24 26 16', stroke: STROKE, fill: 'none', strokeWidth: 2 }
    ]
  },
  slip_stitch: {
    viewBox: VB,
    paths: [{ d: 'M10 16 L22 16', stroke: STROKE, fill: 'none', strokeWidth: 3 }]
  },
  single_crochet: {
    viewBox: VB,
    paths: [
      { d: 'M16 6 L16 26', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M10 16 L22 16', stroke: STROKE, fill: 'none', strokeWidth: 2.5 }
    ]
  },
  half_double_crochet: {
    viewBox: VB,
    paths: [
      { d: 'M16 5 L16 27', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M10 11 L22 11', stroke: STROKE, fill: 'none', strokeWidth: 2.5 }
    ]
  },
  double_crochet: {
    viewBox: VB,
    paths: [
      { d: 'M16 5 L16 27', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M10 10 L22 10', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M12 16 L20 16', stroke: STROKE, fill: 'none', strokeWidth: 2.5 }
    ]
  },
  treble_crochet: {
    viewBox: VB,
    paths: [
      { d: 'M16 4 L16 28', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M10 9 L22 9', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M11 14 L21 14', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M12 19 L20 19', stroke: STROKE, fill: 'none', strokeWidth: 2.5 }
    ]
  },
  increase: {
    viewBox: VB,
    paths: [
      { d: 'M10 26 L16 6 L22 26', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M11 20 L21 20', stroke: STROKE, fill: 'none', strokeWidth: 2 }
    ]
  },
  decrease: {
    viewBox: VB,
    paths: [
      { d: 'M10 6 L16 26 L22 6', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M12 12 L20 12', stroke: STROKE, fill: 'none', strokeWidth: 2 }
    ]
  },
  shell: {
    viewBox: VB,
    paths: [
      { d: 'M6 26 L16 6 L26 26', stroke: STROKE, fill: 'none', strokeWidth: 2 },
      { d: 'M10 26 L16 10 L22 26', stroke: STROKE, fill: 'none', strokeWidth: 2 }
    ]
  },
  cluster: {
    viewBox: VB,
    paths: [
      { d: 'M8 8 L16 26 L24 8', stroke: STROKE, fill: 'none', strokeWidth: 2.5 },
      { d: 'M16 26 L16 8', stroke: STROKE, fill: 'none', strokeWidth: 2.5 }
    ]
  },
  picot: {
    viewBox: VB,
    paths: [
      { d: 'M16 26 L16 14', stroke: STROKE, fill: 'none', strokeWidth: 2 },
      { d: 'M16 14 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0', stroke: STROKE, fill: 'none', strokeWidth: 2 }
    ]
  },
  repeat: {
    viewBox: VB,
    paths: [
      { d: 'M6 8 L6 24 L9 24', stroke: '#b85c00', fill: 'none', strokeWidth: 2.5 },
      { d: 'M26 8 L26 24 L23 24', stroke: '#b85c00', fill: 'none', strokeWidth: 2.5 },
      { d: 'M12 16 L20 16', stroke: '#b85c00', fill: 'none', strokeWidth: 2 }
    ]
  },
  marker_start: {
    viewBox: VB,
    paths: [{ d: 'M10 8 L22 16 L10 24 Z', fill: '#21915a', stroke: '#21915a', strokeWidth: 1 }]
  },
  marker_end: {
    viewBox: VB,
    paths: [{ d: 'M22 8 L10 16 L22 24 Z', fill: '#b13838', stroke: '#b13838', strokeWidth: 1 }]
  },
  marker_turn: {
    viewBox: VB,
    paths: [
      { d: 'M8 20 Q16 6 24 20', stroke: '#3658b1', fill: 'none', strokeWidth: 2.5 },
      { d: 'M24 20 L20 16 M24 20 L20 24', stroke: '#3658b1', fill: 'none', strokeWidth: 2.5 }
    ]
  },
  marker_join: {
    viewBox: VB,
    paths: [
      { d: 'M16 6 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', stroke: '#da62b0', fill: 'none', strokeWidth: 2 },
      { d: 'M10 16 L22 16', stroke: '#da62b0', fill: 'none', strokeWidth: 2 }
    ]
  }
};

export function getGlyph(key: string): SymbolGlyph | undefined {
  return SYMBOL_GLYPHS[key];
}
