const fs = require('fs');
const opentype = require('opentype.js');

// 1. Load traced vector paths from orium-logo-traced.svg
const tracedSvg = fs.readFileSync('public/brand/orium-logo-traced.svg', 'utf8');
const match = tracedSvg.match(/d="([^"]+)"/);
const fullD = match[1];
const subpaths = fullD.split(/(?=M\s)/).filter(Boolean);

function parsePathData(d) {
  const commands = [];
  const regex = /([MCLHVZ])([^MCLHVZ]*)/gi;
  let m;
  while ((m = regex.exec(d)) !== null) {
    const type = m[1];
    const args = m[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    commands.push({ type, args });
  }
  return commands;
}

function transformCommands(commands, sx, sy, tx, ty) {
  return commands.map(cmd => {
    const { type, args } = cmd;
    const t = type.toUpperCase();
    const newArgs = [];
    if (t === 'M' || t === 'L') {
      for (let i = 0; i < args.length; i += 2) {
        newArgs.push(((args[i] * sx) + tx).toFixed(2));
        newArgs.push(((args[i + 1] * sy) + ty).toFixed(2));
      }
    } else if (t === 'C') {
      for (let i = 0; i < args.length; i += 6) {
        newArgs.push(((args[i] * sx) + tx).toFixed(2));
        newArgs.push(((args[i + 1] * sy) + ty).toFixed(2));
        newArgs.push(((args[i + 2] * sx) + tx).toFixed(2));
        newArgs.push(((args[i + 3] * sy) + ty).toFixed(2));
        newArgs.push(((args[i + 4] * sx) + tx).toFixed(2));
        newArgs.push(((args[i + 5] * sy) + ty).toFixed(2));
      }
    } else {
      return type;
    }
    return `${type} ${newArgs.join(' ')}`;
  }).join(' ');
}

// Original Symbol bounds: x=[298.2, 713.4], y=[8.5, 424.0]
// Width: 415.2, Height: 415.5
const symOrigX = 298.2;
const symOrigY = 8.5;
const symOrigW = 415.2;
const symOrigH = 415.5;

const symLoopCommands = parsePathData(subpaths[0]);
const symNeedleCommands = parsePathData(subpaths[1]);

// Original ORIUM Logotype bounds:
// Subpaths: 2, 3 (O), 4 (R), 7 (I), 5 (U), 6 (M)
const oriumOrigX = 87.4;
const oriumOrigY = 451.4;
const oriumOrigW = 840.6;
const oriumOrigH = 146.6;

const oriumSubpaths = [subpaths[2], subpaths[3], subpaths[4], subpaths[7], subpaths[5], subpaths[6]];
const oriumCommands = oriumSubpaths.flatMap(sp => parsePathData(sp));

// Original DIGITAL Subpaths: 8, 9, 10, 11, 12, 13, 14, 15, 16
const digitalSubpaths = subpaths.slice(8);
const digitalCommands = digitalSubpaths.flatMap(sp => parsePathData(sp));
// Digital bounds: x=[244.0, 780.0] (w=536), y=[634.0, 668.4] (h=34.4)
const digOrigX = 244.0;
const digOrigY = 634.0;
const digOrigW = 536.0;
const digOrigH = 34.4;

// Load Sora Font
const fontBuf = fs.readFileSync('scripts/Sora.ttf');
const font = opentype.parse(fontBuf.buffer.slice(fontBuf.byteOffset, fontBuf.byteOffset + fontBuf.byteLength));

function generateInvestimentosPath(startX, baselineY, fontSize, targetWidth) {
  const text = "INVESTIMENTOS";
  let naturalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i]);
    naturalWidth += (glyph.advanceWidth / font.unitsPerEm) * fontSize;
  }
  const letterSpacing = (targetWidth - naturalWidth) / (text.length - 1);
  let curX = startX;
  const paths = [];
  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i]);
    const gp = glyph.getPath(curX, baselineY, fontSize);
    paths.push(gp.toPathData(2));
    curX += (glyph.advanceWidth / font.unitsPerEm) * fontSize + letterSpacing;
  }
  return paths.join(' ');
}

// ==========================================
// 1. orium-logo-horizontal.svg (viewBox="0 0 380 84")
// ==========================================
// Target Symbol: x=14, y=10, size=64x64
const symScaleH = 64 / symOrigH;
const symLoopD_H = transformCommands(symLoopCommands, symScaleH, symScaleH, 14 - symOrigX * symScaleH, 10 - symOrigY * symScaleH);
const symNeedleD_H = transformCommands(symNeedleCommands, symScaleH, symScaleH, 14 - symOrigX * symScaleH, 10 - symOrigY * symScaleH);

// Separator: x=94, y1=14, y2=70
const sepX = 94;

// ORIUM Logotype:
// Target: startX=112, topY=16, height=33
const oriumScaleH = 33 / oriumOrigH;
const oriumTargetW = oriumOrigW * oriumScaleH; // 840.6 * (33/146.6) = 189.2px
const oriumD_H = transformCommands(oriumCommands, oriumScaleH, oriumScaleH, 112 - oriumOrigX * oriumScaleH, 16 - oriumOrigY * oriumScaleH);

// INVESTIMENTOS:
// startX=112, baselineY=68, fontSize=11.2, targetWidth=oriumTargetW
const investD_H = generateInvestimentosPath(112, 68, 11.2, oriumTargetW);

const horizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 84" width="380" height="84" fill="none">
  <defs>
    <linearGradient id="oriumPurpleGradient" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#581c87" />
      <stop offset="45%" stop-color="#7026e6" />
      <stop offset="100%" stop-color="#9333ea" />
    </linearGradient>
  </defs>

  <!-- Símbolo Oficial Orium -->
  <g id="orium-symbol">
    <!-- Anel Exterior 'O' -->
    <path d="${symLoopD_H}" fill="#111827" fill-rule="evenodd" />
    <!-- Ponteiro Diagonal Violeta Ascendente -->
    <path d="${symNeedleD_H}" fill="url(#oriumPurpleGradient)" fill-rule="evenodd" />
  </g>

  <!-- Divisor Vertical Minimalista -->
  <line x1="${sepX}" y1="14" x2="${sepX}" y2="70" stroke="#cbd5e1" stroke-width="1.25" stroke-linecap="round" />

  <!-- Logotipia Exclusiva ORIUM -->
  <path d="${oriumD_H}" fill="#111827" fill-rule="evenodd" />

  <!-- Subtítulo INVESTIMENTOS em Vetor Puro -->
  <path d="${investD_H}" fill="url(#oriumPurpleGradient)" fill-rule="evenodd" />
</svg>`;

fs.writeFileSync('public/brand/orium-logo-horizontal.svg', horizontalSvg);
console.log('Generated public/brand/orium-logo-horizontal.svg');

// ==========================================
// 2. orium-logo-horizontal-white.svg (viewBox="0 0 380 84")
// ==========================================
const horizontalWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 84" width="380" height="84" fill="none">
  <defs>
    <linearGradient id="oriumPurpleGradientWhite" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7026e6" />
      <stop offset="50%" stop-color="#9333ea" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
  </defs>

  <!-- Símbolo Oficial Orium -->
  <g id="orium-symbol-white">
    <!-- Anel Exterior 'O' -->
    <path d="${symLoopD_H}" fill="#FFFFFF" fill-rule="evenodd" />
    <!-- Ponteiro Diagonal Violeta Ascendente -->
    <path d="${symNeedleD_H}" fill="url(#oriumPurpleGradientWhite)" fill-rule="evenodd" />
  </g>

  <!-- Divisor Vertical Minimalista -->
  <line x1="${sepX}" y1="14" x2="${sepX}" y2="70" stroke="rgba(255,255,255,0.22)" stroke-width="1.25" stroke-linecap="round" />

  <!-- Logotipia Exclusiva ORIUM -->
  <path d="${oriumD_H}" fill="#FFFFFF" fill-rule="evenodd" />

  <!-- Subtítulo INVESTIMENTOS em Vetor Puro -->
  <path d="${investD_H}" fill="url(#oriumPurpleGradientWhite)" fill-rule="evenodd" />
</svg>`;

fs.writeFileSync('public/brand/orium-logo-horizontal-white.svg', horizontalWhiteSvg);
console.log('Generated public/brand/orium-logo-horizontal-white.svg');

// ==========================================
// 3. orium-symbol.svg (viewBox="0 0 80 80") - White loop for dark backgrounds
// ==========================================
const symScaleSolo = 66 / symOrigH;
const symLoopD_Solo = transformCommands(symLoopCommands, symScaleSolo, symScaleSolo, 7 - symOrigX * symScaleSolo, 7 - symOrigY * symScaleSolo);
const symNeedleD_Solo = transformCommands(symNeedleCommands, symScaleSolo, symScaleSolo, 7 - symOrigX * symScaleSolo, 7 - symOrigY * symScaleSolo);

const symbolSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" fill="none">
  <defs>
    <linearGradient id="oriumPurpleSymWhite" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7026e6" />
      <stop offset="50%" stop-color="#9333ea" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
  </defs>
  <path d="${symLoopD_Solo}" fill="#FFFFFF" fill-rule="evenodd" />
  <path d="${symNeedleD_Solo}" fill="url(#oriumPurpleSymWhite)" fill-rule="evenodd" />
</svg>`;

fs.writeFileSync('public/brand/orium-symbol.svg', symbolSvg);
console.log('Generated public/brand/orium-symbol.svg');

// ==========================================
// 4. orium-symbol-dark.svg (viewBox="0 0 80 80") - Dark loop for light backgrounds
// ==========================================
const symbolDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" fill="none">
  <defs>
    <linearGradient id="oriumPurpleSymDark" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#581c87" />
      <stop offset="45%" stop-color="#7026e6" />
      <stop offset="100%" stop-color="#9333ea" />
    </linearGradient>
  </defs>
  <path d="${symLoopD_Solo}" fill="#111827" fill-rule="evenodd" />
  <path d="${symNeedleD_Solo}" fill="url(#oriumPurpleSymDark)" fill-rule="evenodd" />
</svg>`;

fs.writeFileSync('public/brand/orium-symbol-dark.svg', symbolDarkSvg);
console.log('Generated public/brand/orium-symbol-dark.svg');

// ==========================================
// 5. public/favicon.svg (viewBox="0 0 128 128")
// ==========================================
const symScaleFav = 108 / symOrigH;
const symLoopD_Fav = transformCommands(symLoopCommands, symScaleFav, symScaleFav, 10 - symOrigX * symScaleFav, 10 - symOrigY * symScaleFav);
const symNeedleD_Fav = transformCommands(symNeedleCommands, symScaleFav, symScaleFav, 10 - symOrigX * symScaleFav, 10 - symOrigY * symScaleFav);

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" fill="none">
  <defs>
    <linearGradient id="favPurple" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#581c87" />
      <stop offset="50%" stop-color="#7026e6" />
      <stop offset="100%" stop-color="#9333ea" />
    </linearGradient>
  </defs>
  <path d="${symLoopD_Fav}" fill="#111827" fill-rule="evenodd" />
  <path d="${symNeedleD_Fav}" fill="url(#favPurple)" fill-rule="evenodd" />
</svg>`;

fs.writeFileSync('public/favicon.svg', faviconSvg);
console.log('Generated public/favicon.svg');

// ==========================================
// 6. orium-digital-logo-horizontal.svg (For footer credit)
// ==========================================
// Subtitle DIGITAL:
const digScaleH = 10 / digOrigH;
const digTargetW = digOrigW * digScaleH;
const digD_H = transformCommands(digitalCommands, digScaleH, digScaleH, 112 - digOrigX * digScaleH, 58 - digOrigY * digScaleH);

const digitalHorizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 84" width="380" height="84" fill="none">
  <defs>
    <linearGradient id="oriumDigitalPurple" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#581c87" />
      <stop offset="45%" stop-color="#7026e6" />
      <stop offset="100%" stop-color="#9333ea" />
    </linearGradient>
  </defs>

  <g id="orium-digital-symbol">
    <path d="${symLoopD_H}" fill="#111827" fill-rule="evenodd" />
    <path d="${symNeedleD_H}" fill="url(#oriumDigitalPurple)" fill-rule="evenodd" />
  </g>

  <line x1="${sepX}" y1="14" x2="${sepX}" y2="70" stroke="#cbd5e1" stroke-width="1.25" stroke-linecap="round" />

  <path d="${oriumD_H}" fill="#111827" fill-rule="evenodd" />
  <path d="${digD_H}" fill="url(#oriumDigitalPurple)" fill-rule="evenodd" />
</svg>`;

fs.writeFileSync('public/brand/orium-digital-logo-horizontal.svg', digitalHorizontalSvg);
console.log('Generated public/brand/orium-digital-logo-horizontal.svg');
