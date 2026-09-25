const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');

// 1. Adaptive SVG Favicon (light / dark mode)
const symDarkSvg = fs.readFileSync('public/brand/orium-symbol-dark.svg', 'utf8');
const symWhiteSvg = fs.readFileSync('public/brand/orium-symbol.svg', 'utf8');

// Extract paths from symbol
const darkLoop = symDarkSvg.match(/<path d="([^"]+)" fill="#111827"/)[1];
const purpleNeedle = symDarkSvg.match(/<path d="([^"]+)" fill="url\(#oriumPurpleSymDark\)"/)[1];

const adaptiveFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" fill="none">
  <defs>
    <linearGradient id="favPurple" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7026e6" />
      <stop offset="50%" stop-color="#9333ea" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
    <style>
      .orium-fav-loop { fill: #111827; }
      @media (prefers-color-scheme: dark) {
        .orium-fav-loop { fill: #ffffff; }
      }
    </style>
  </defs>
  <path class="orium-fav-loop" d="${darkLoop}" fill-rule="evenodd" />
  <path d="${purpleNeedle}" fill="url(#favPurple)" fill-rule="evenodd" />
</svg>`;

fs.writeFileSync('public/favicon.svg', adaptiveFavicon);
console.log('Saved adaptive public/favicon.svg');

// 2. Square icon SVG for app icons (with refined luxury dark graphite background)
function getSquareAppIconSvg(size, bg = '#111827') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" fill="none">
    <defs>
      <linearGradient id="appPurple" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#7026e6" />
        <stop offset="50%" stop-color="#9333ea" />
        <stop offset="100%" stop-color="#c084fc" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="16" fill="${bg}" />
    <g transform="translate(4, 4) scale(0.9)">
      <path d="${darkLoop}" fill="#ffffff" fill-rule="evenodd" />
      <path d="${purpleNeedle}" fill="url(#appPurple)" fill-rule="evenodd" />
    </g>
  </svg>`;
}

// 3. Transparent icon SVG for 32x32 favicon
function getTransparentFaviconSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="${size}" height="${size}" fill="none">
    <defs>
      <linearGradient id="favPurpleT" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#7026e6" />
        <stop offset="50%" stop-color="#9333ea" />
        <stop offset="100%" stop-color="#c084fc" />
      </linearGradient>
    </defs>
    <path d="${darkLoop}" fill="#111827" fill-rule="evenodd" />
    <path d="${purpleNeedle}" fill="url(#favPurpleT)" fill-rule="evenodd" />
  </svg>`;
}

function renderSvg(svgStr, width, height) {
  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: width } });
  return resvg.render().asPng();
}

// Generate PNGs
const icon512 = renderSvg(getSquareAppIconSvg(512), 512, 512);
const icon192 = renderSvg(getSquareAppIconSvg(192), 192, 192);
const icon180 = renderSvg(getSquareAppIconSvg(180), 180, 180);
const fav32 = renderSvg(getTransparentFaviconSvg(32), 32, 32);
const fav192 = renderSvg(getTransparentFaviconSvg(192), 192, 192);

// Save to public and src/app
fs.writeFileSync('public/icon.png', icon512);
fs.writeFileSync('src/app/icon.png', icon512);

fs.writeFileSync('public/icon-192.png', icon192);
fs.writeFileSync('public/apple-icon.png', icon180);
fs.writeFileSync('src/app/apple-icon.png', icon180);
fs.writeFileSync('public/apple-touch-icon.png', icon192);

fs.writeFileSync('public/favicon.png', fav192);
fs.writeFileSync('public/brand/orium-digital-favicon.png', fav192);
fs.writeFileSync('public/favicon-32x32.png', fav32);

// For ICO: an ICO file can embed a 32x32 PNG directly (standard modern ICO format)
function createIcoFromPng(pngBuf) {
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(1, 4); // 1 image

  // Directory entry: 16 bytes
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width
  entry.writeUInt8(32, 1); // height
  entry.writeUInt8(0, 2);  // color palette
  entry.writeUInt8(0, 3);  // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuf.length, 8); // size
  entry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  return Buffer.concat([header, entry, pngBuf]);
}

const icoBuf = createIcoFromPng(fav32);
fs.writeFileSync('public/favicon.ico', icoBuf);
fs.writeFileSync('src/app/favicon.ico', icoBuf);
console.log('Saved all icons and favicons.');

// Also render horizontal digital logo to PNG & WEBP
const digSvg = fs.readFileSync('public/brand/orium-digital-logo-horizontal.svg', 'utf8');
const digPng = renderSvg(digSvg, 760, 168);
fs.writeFileSync('public/brand/orium-digital-logo-horizontal.png', digPng);
console.log('Saved public/brand/orium-digital-logo-horizontal.png');
