// One-off: generate the Reforge (fitness) home-screen icons from an inline SVG.
// Run with sharp available (npm install --no-save sharp).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const svg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#12A97A"/>
      <stop offset="1" stop-color="#0A6E4B"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#g)"/>
  <g fill="#ffffff">
    <rect x="34" y="45.5" width="32" height="9" rx="2"/>
    <rect x="24" y="36" width="9" height="28" rx="3"/>
    <rect x="67" y="36" width="9" height="28" rx="3"/>
    <rect x="15" y="41" width="7" height="18" rx="3"/>
    <rect x="78" y="41" width="7" height="18" rx="3"/>
  </g>
</svg>`;

await mkdir('public/icons', { recursive: true });
for (const size of [180, 192, 512]) {
  await sharp(Buffer.from(svg(size))).png().toFile(`public/icons/fitness-${size}.png`);
  console.log(`wrote public/icons/fitness-${size}.png`);
}
