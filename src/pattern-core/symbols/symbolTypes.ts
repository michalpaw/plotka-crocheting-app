// Pure TypeScript domain types for crochet symbols.
// This file must not import Vue, Ionic, Pinia, RxDB or browser APIs.

export type StitchType =
  | 'chain'
  | 'slip_stitch'
  | 'single_crochet'
  | 'half_double_crochet'
  | 'double_crochet'
  | 'treble_crochet'
  | 'increase'
  | 'decrease'
  | 'cluster'
  | 'shell'
  | 'picot';

export type MarkerType = 'start' | 'end' | 'turn' | 'join';

export interface StitchOperation {
  type: 'stitch';
  stitchType: StitchType;
  count: number;
  stitchCountProduced?: number;
  workedInto?: string;
}

export interface RepeatOperation {
  type: 'repeat';
  times: number;
  operations: CrochetOperation[];
}

export interface MarkerOperation {
  type: 'marker';
  markerType: MarkerType;
}

export type CrochetOperation = StitchOperation | RepeatOperation | MarkerOperation;

export type SymbolCategory =
  | 'basic_stitch'
  | 'increase_decrease'
  | 'texture'
  | 'repeat'
  | 'marker'
  | 'custom';

export interface SymbolDefinition {
  id: string;
  code: string;
  name: string;
  category: SymbolCategory;
  defaultShortcut?: string;
  svgIcon?: string;
  stitchCountProduced?: number;
  operationTemplate: CrochetOperation;
  createdAt: string;
  updatedAt: string;
}
