const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');

const whiteSvg = fs.readFileSync('public/brand/orium-logo-horizontal-white.svg', 'utf8');
const innerSvg = whiteSvg.replace(/<svg[^>]*>|<\/svg>/gi, '');

// Create 1200x630 OG banner SVG
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="ogGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#1e2230" />
      <stop offset="60%" stop-color="#0e131b" />
      <stop offset="100%" stop-color="#080b10" />
    </radialGradient>
    <linearGradient id="purpleAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(112, 38, 230, 0)" />
      <stop offset="50%" stop-color="rgba(147, 51, 234, 0.4)" />
      <stop offset="100%" stop-color="rgba(112, 38, 230, 0)" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogGlow)" />

  <!-- Subtle grid/accent line -->
  <rect x="200" y="520" width="800" height="1" fill="url(#purpleAccent)" />

  <!-- Center Logo (scaled to width ~560, height ~123.8) -->
  <g transform="translate(320, 220) scale(1.47)">
    ${innerSvg}
  </g>

  <!-- Tagline -->
  <text x="600" y="475" text-anchor="middle" font-family="'Cinzel', 'Trajan', serif" font-size="16" font-weight="400" letter-spacing="6" fill="#a1a1aa">
    CURADORIA IMOBILIÁRIA DE ALTO PADRÃO · SANTA CATARINA &amp; MATO GROSSO DO SUL
  </text>
</svg>`;

const resvg = new Resvg(ogSvg, { fitTo: { mode: 'width', value: 1200 } });
const ogPng = resvg.render().asPng();

fs.writeFileSync('public/brand/og-image.png', ogPng);
console.log('Saved public/brand/og-image.png, size:', ogPng.length);
