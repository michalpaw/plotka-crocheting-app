export interface GridRenderOptions {
  width: number;
  height: number;
  gridSize: number;
  color?: string;
}

/** Returns SVG markup (without <svg> wrapper) for a background grid. */
export function renderGridLines({ width, height, gridSize, color = '#e7e3f0' }: GridRenderOptions): string {
  const lines: string[] = [];
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${color}" stroke-width="1" />`);
  }
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${color}" stroke-width="1" />`);
  }
  return lines.join('');
}
