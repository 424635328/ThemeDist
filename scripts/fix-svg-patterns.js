import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '..', 'public/assets/patterns');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let svg = fs.readFileSync(filePath, 'utf-8');

  // 1. Replace currentColor → #ffffff
  svg = svg.replace(/currentColor/gi, '#ffffff');

  // 2. Replace rgba(..., alpha) → hex, dropping alpha
  svg = svg.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)/gi, (_, r, g, b) => {
    return `#${parseInt(r).toString(16).padStart(2,'0')}${parseInt(g).toString(16).padStart(2,'0')}${parseInt(b).toString(16).padStart(2,'0')}`;
  });

  // 3. Strip opacity attributes
  svg = svg.replace(/\s+opacity\s*=\s*["'][\d.]+["']/gi, '');

  // 4. Ensure viewBox — if missing, derive from width/height
  const svgTagMatch = svg.match(/<svg([^>]*)>/i);
  if (svgTagMatch) {
    let svgAttrs = svgTagMatch[1];
    const hasViewBox = /viewBox\s*=/i.test(svgAttrs);
    if (!hasViewBox) {
      const wMatch = svgAttrs.match(/width\s*=\s*["'](\d+)["']/i);
      const hMatch = svgAttrs.match(/height\s*=\s*["'](\d+)["']/i);
      if (wMatch && hMatch) {
        const vb = ` viewBox="0 0 ${wMatch[1]} ${hMatch[1]}"`;
        svg = svg.replace(/<svg([^>]*)>/i, `<svg$1${vb}>`);
      }
    }
  }

  fs.writeFileSync(filePath, svg);
  console.log(`✓ ${file}`);
});

console.log(`\nDone — ${files.length} files processed.`);
