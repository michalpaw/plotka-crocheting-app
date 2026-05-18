import type { CrochetPattern } from '@core/model/pattern';
import { renderPatternSvg } from '../svg/SvgPatternRenderer';

export const preview2DService = {
  renderToSvgString(pattern: CrochetPattern): string {
    return renderPatternSvg(pattern, { showGrid: true });
  }
};
