import type { StitchType } from '../symbols/symbolTypes';

export interface StitchInfo {
  type: StitchType;
  displayName: string;
  abbreviation: string;
  stitchCountProduced: number;
}

export const STITCH_INFO: Record<StitchType, StitchInfo> = {
  chain: { type: 'chain', displayName: 'chain', abbreviation: 'ch', stitchCountProduced: 1 },
  slip_stitch: { type: 'slip_stitch', displayName: 'slip stitch', abbreviation: 'sl st', stitchCountProduced: 1 },
  single_crochet: { type: 'single_crochet', displayName: 'single crochet', abbreviation: 'sc', stitchCountProduced: 1 },
  half_double_crochet: { type: 'half_double_crochet', displayName: 'half double crochet', abbreviation: 'hdc', stitchCountProduced: 1 },
  double_crochet: { type: 'double_crochet', displayName: 'double crochet', abbreviation: 'dc', stitchCountProduced: 1 },
  treble_crochet: { type: 'treble_crochet', displayName: 'treble crochet', abbreviation: 'tr', stitchCountProduced: 1 },
  increase: { type: 'increase', displayName: 'increase', abbreviation: 'inc', stitchCountProduced: 2 },
  decrease: { type: 'decrease', displayName: 'decrease', abbreviation: 'dec', stitchCountProduced: 1 },
  cluster: { type: 'cluster', displayName: 'cluster', abbreviation: 'cl', stitchCountProduced: 1 },
  shell: { type: 'shell', displayName: 'shell', abbreviation: 'shell', stitchCountProduced: 5 },
  picot: { type: 'picot', displayName: 'picot', abbreviation: 'p', stitchCountProduced: 0 }
};
