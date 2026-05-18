import type { CrochetPattern } from '@core/model/pattern';
import { findSymbolById } from '@core/symbols/defaultSymbolLibrary';
import { renderSymbolInner } from './SvgSymbolRenderer';
import { renderGridLines } from './SvgGridRenderer';

export interface PatternRenderOptions {
  showGrid?: boolean;
  highlightItemIds?: string[];
}

export function renderPatternSvg(pattern: CrochetPattern, opts: PatternRenderOptions = {}): string {
  const { canvas } = pattern;
  const { showGrid = true, highlightItemIds = [] } = opts;

  const grid = showGrid ? renderGridLines({ width: canvas.width, height: canvas.height, gridSize: canvas.gridSize }) : '';

  const items = canvas.items
    .map((item) => {
      const symbol = findSymbolById(item.symbolId) ?? pattern.symbolLegend.find((s) => s.id === item.symbolId);
      if (!symbol) return '';
      const { viewBox, inner } = renderSymbolInner(symbol);
      const [vbX, vbY, vbW, vbH] = viewBox.split(' ').map(Number);
      const size = canvas.gridSize;
      const scale = item.scale ?? 1;
      const halfSize = size / 2;
      const tx = item.x - halfSize;
      const ty = item.y - halfSize;
      const innerScaleX = size / vbW;
      const innerScaleY = size / vbH;
      const rotation = item.rotation ?? 0;
      const highlight = highlightItemIds.includes(item.id);

      return `<g transform="translate(${tx} ${ty})">
        ${highlight ? `<rect x="0" y="0" width="${size}" height="${size}" rx="4" ry="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />` : ''}
        <g transform="translate(${halfSize} ${halfSize}) rotate(${rotation}) scale(${scale}) translate(${-halfSize} ${-halfSize}) scale(${innerScaleX} ${innerScaleY}) translate(${-vbX} ${-vbY})">
          ${inner}
        </g>
      </g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
    <rect x="0" y="0" width="${canvas.width}" height="${canvas.height}" fill="#fdf6f3" />
    ${grid}
    ${items}
  </svg>`;
}
