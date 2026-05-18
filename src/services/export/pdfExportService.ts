// Lightweight PDF/print export.
//
// The MVP avoids pulling in a heavy PDF library; instead it opens a
// pre-formatted printable HTML window and lets the user "Save as PDF"
// from the browser/OS print dialog. A future version can drop in
// pdfmake/jsPDF behind the same interface.

import type { GeneratedInstructions } from '@core/instructions/instructionGenerator';
import { formatAsHtml } from '@core/instructions/instructionFormatter';
import type { GridPattern } from '@core/model/gridPattern';
import { cellKey } from '@core/model/gridPattern';

export const pdfExportService = {
  printInstructions(instructions: GeneratedInstructions): void {
    if (typeof window === 'undefined') return;
    const html = formatAsHtml(instructions);
    openPrintWindow(html);
  },

  printGrid(grid: GridPattern, name: string): void {
    if (typeof window === 'undefined') return;
    const html = renderGridHtml(grid, name);
    openPrintWindow(html);
  }
};

function openPrintWindow(html: string): void {
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  // Give the new window a moment to lay out before triggering print.
  setTimeout(() => {
    try {
      w.focus();
      w.print();
    } catch {
      /* user can print manually */
    }
  }, 250);
}

function renderGridHtml(grid: GridPattern, name: string): string {
  const cells: string[] = [];
  for (let r = 0; r < grid.rows; r++) {
    const row: string[] = [];
    for (let c = 0; c < grid.columns; c++) {
      const color = grid.cells[cellKey(r, c)] ?? '#ffffff';
      row.push(`<td style="background:${color}"></td>`);
    }
    cells.push(`<tr>${row.join('')}</tr>`);
  }

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${esc(name)}</title>
<style>
  body { font-family: sans-serif; margin: 24px; color: #3d2030; }
  h1 { margin: 0 0 16px; }
  table { border-collapse: collapse; }
  td { width: 14px; height: 14px; border: 1px solid #ddd; }
  @media print { @page { size: auto; margin: 12mm; } }
</style></head>
<body>
  <h1>${esc(name)}</h1>
  <p>${grid.rows} × ${grid.columns} cells</p>
  <table>${cells.join('')}</table>
</body></html>`;
}
