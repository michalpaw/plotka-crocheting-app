import type { SymbolDefinition } from './symbolTypes';

const now = '2026-05-18T00:00:00Z';

export const DEFAULT_SYMBOL_LIBRARY: SymbolDefinition[] = [
  {
    id: 'sym_ch',
    code: 'ch',
    name: 'Chain',
    category: 'basic_stitch',
    defaultShortcut: 'C',
    svgIcon: 'chain',
    stitchCountProduced: 1,
    operationTemplate: { type: 'stitch', stitchType: 'chain', count: 1, stitchCountProduced: 1 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_sl',
    code: 'sl',
    name: 'Slip Stitch',
    category: 'basic_stitch',
    defaultShortcut: 'L',
    svgIcon: 'slip_stitch',
    stitchCountProduced: 1,
    operationTemplate: { type: 'stitch', stitchType: 'slip_stitch', count: 1, stitchCountProduced: 1 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_sc',
    code: 'sc',
    name: 'Single Crochet',
    category: 'basic_stitch',
    defaultShortcut: 'S',
    svgIcon: 'single_crochet',
    stitchCountProduced: 1,
    operationTemplate: { type: 'stitch', stitchType: 'single_crochet', count: 1, stitchCountProduced: 1 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_hdc',
    code: 'hdc',
    name: 'Half Double Crochet',
    category: 'basic_stitch',
    defaultShortcut: 'H',
    svgIcon: 'half_double_crochet',
    stitchCountProduced: 1,
    operationTemplate: { type: 'stitch', stitchType: 'half_double_crochet', count: 1, stitchCountProduced: 1 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_dc',
    code: 'dc',
    name: 'Double Crochet',
    category: 'basic_stitch',
    defaultShortcut: 'D',
    svgIcon: 'double_crochet',
    stitchCountProduced: 1,
    operationTemplate: { type: 'stitch', stitchType: 'double_crochet', count: 1, stitchCountProduced: 1 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_tr',
    code: 'tr',
    name: 'Treble Crochet',
    category: 'basic_stitch',
    defaultShortcut: 'T',
    svgIcon: 'treble_crochet',
    stitchCountProduced: 1,
    operationTemplate: { type: 'stitch', stitchType: 'treble_crochet', count: 1, stitchCountProduced: 1 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_inc',
    code: 'inc',
    name: 'Increase',
    category: 'increase_decrease',
    defaultShortcut: 'I',
    svgIcon: 'increase',
    stitchCountProduced: 2,
    operationTemplate: { type: 'stitch', stitchType: 'increase', count: 1, stitchCountProduced: 2 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_dec',
    code: 'dec',
    name: 'Decrease',
    category: 'increase_decrease',
    defaultShortcut: 'X',
    svgIcon: 'decrease',
    stitchCountProduced: 1,
    operationTemplate: { type: 'stitch', stitchType: 'decrease', count: 1, stitchCountProduced: 1 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_shell',
    code: 'shell',
    name: 'Shell',
    category: 'texture',
    defaultShortcut: 'E',
    svgIcon: 'shell',
    stitchCountProduced: 5,
    operationTemplate: { type: 'stitch', stitchType: 'shell', count: 1, stitchCountProduced: 5 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_cluster',
    code: 'cl',
    name: 'Cluster',
    category: 'texture',
    defaultShortcut: 'U',
    svgIcon: 'cluster',
    stitchCountProduced: 1,
    operationTemplate: { type: 'stitch', stitchType: 'cluster', count: 1, stitchCountProduced: 1 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_picot',
    code: 'p',
    name: 'Picot',
    category: 'texture',
    defaultShortcut: 'P',
    svgIcon: 'picot',
    stitchCountProduced: 0,
    operationTemplate: { type: 'stitch', stitchType: 'picot', count: 1, stitchCountProduced: 0 },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_repeat',
    code: 'rep',
    name: 'Repeat Block',
    category: 'repeat',
    defaultShortcut: 'R',
    svgIcon: 'repeat',
    operationTemplate: { type: 'repeat', times: 1, operations: [] },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_m_start',
    code: 'm_start',
    name: 'Start Marker',
    category: 'marker',
    defaultShortcut: '1',
    svgIcon: 'marker_start',
    operationTemplate: { type: 'marker', markerType: 'start' },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_m_end',
    code: 'm_end',
    name: 'End Marker',
    category: 'marker',
    defaultShortcut: '2',
    svgIcon: 'marker_end',
    operationTemplate: { type: 'marker', markerType: 'end' },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_m_turn',
    code: 'm_turn',
    name: 'Turn Marker',
    category: 'marker',
    defaultShortcut: '3',
    svgIcon: 'marker_turn',
    operationTemplate: { type: 'marker', markerType: 'turn' },
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sym_m_join',
    code: 'm_join',
    name: 'Join Marker',
    category: 'marker',
    defaultShortcut: '4',
    svgIcon: 'marker_join',
    operationTemplate: { type: 'marker', markerType: 'join' },
    createdAt: now,
    updatedAt: now
  }
];

export function findSymbolById(id: string): SymbolDefinition | undefined {
  return DEFAULT_SYMBOL_LIBRARY.find((s) => s.id === id);
}

export function findSymbolByCode(code: string): SymbolDefinition | undefined {
  return DEFAULT_SYMBOL_LIBRARY.find((s) => s.code === code);
}

export function findSymbolByShortcut(shortcut: string): SymbolDefinition | undefined {
  const upper = shortcut.toUpperCase();
  return DEFAULT_SYMBOL_LIBRARY.find((s) => s.defaultShortcut?.toUpperCase() === upper);
}
