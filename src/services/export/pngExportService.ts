import type { GridPattern } from '@core/model/gridPattern';
import { cellKey } from '@core/model/gridPattern';
import { downloadFile } from './downloadFile';

export const pngExportService = {
  /** Export a grid pattern to PNG at `pixelSize` pixels per cell. */
  async exportGridPattern(grid: GridPattern, name: string, pixelSize = 16): Promise<void> {
    if (typeof document === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.width = grid.columns * pixelSize;
    canvas.height = grid.rows * pixelSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.columns; c++) {
        const color = grid.cells[cellKey(r, c)];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
      }
    }

    // Optional thin grid overlay
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    for (let r = 0; r <= grid.rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * pixelSize + 0.5);
      ctx.lineTo(canvas.width, r * pixelSize + 0.5);
      ctx.stroke();
    }
    for (let c = 0; c <= grid.columns; c++) {
      ctx.beginPath();
      ctx.moveTo(c * pixelSize + 0.5, 0);
      ctx.lineTo(c * pixelSize + 0.5, canvas.height);
      ctx.stroke();
    }

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encoding failed'))), 'image/png');
    });
    downloadFile(blob, sanitize(name) + '.png');
  },

  async exportSvgElement(svg: SVGSVGElement, name: string): Promise<void> {
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: 'image/svg+xml' });
    downloadFile(blob, sanitize(name) + '.svg');
  }
};

function sanitize(name: string): string {
  return name.replace(/[^a-z0-9_-]+/gi, '_').slice(0, 64) || 'pattern';
}
