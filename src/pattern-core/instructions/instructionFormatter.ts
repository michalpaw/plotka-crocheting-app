import type { GeneratedInstructions } from './instructionGenerator';

export function formatAsPlainText(instructions: GeneratedInstructions): string {
  const lines: string[] = [];
  lines.push(instructions.patternName);
  lines.push('='.repeat(instructions.patternName.length));
  lines.push('');
  for (const row of instructions.rows) {
    lines.push(`${row.label}: (${row.stitchCount} sts)`);
    for (const line of row.lines) {
      lines.push(`  ${line.index}. ${line.text}`);
    }
    lines.push('');
  }
  lines.push(`Total: ${instructions.summary.totalRows} ${instructions.summary.totalRows === 1 ? 'row' : 'rows'}, ${instructions.summary.totalStitches} stitches.`);
  return lines.join('\n');
}

export function formatAsHtml(instructions: GeneratedInstructions): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rows = instructions.rows
    .map(
      (row) => `
        <section class="row">
          <h3>${esc(row.label)} <small>(${row.stitchCount} sts)</small></h3>
          <ol>
            ${row.lines.map((l) => `<li>${esc(l.text)}</li>`).join('')}
          </ol>
        </section>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${esc(instructions.patternName)}</title>
<style>
  body { font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 780px; margin: 40px auto; padding: 24px; color: #3d2030; }
  h1 { font-family: 'Lora', Georgia, serif; margin-bottom: 8px; color: #823e50; }
  h3 { margin-top: 24px; color: #823e50; font-family: 'Lora', Georgia, serif; }
  ol { padding-left: 20px; }
  li { margin: 4px 0; }
  small { color: #8a5566; font-weight: normal; }
  .summary { margin-top: 32px; padding: 12px 16px; background: #fadcdc; border-radius: 10px; color: #3d2030; }
</style></head>
<body>
  <h1>${esc(instructions.patternName)}</h1>
  ${rows}
  <div class="summary"><strong>Total:</strong> ${instructions.summary.totalRows} rows, ${instructions.summary.totalStitches} stitches.</div>
</body></html>`;
}
