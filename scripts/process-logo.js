import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const inputPath = path.resolve(process.cwd(), 'Gemini_Generated_Image_odo3w2odo3w2odo3.png');
const data = fs.readFileSync(inputPath);
const src = PNG.sync.read(data);

const width = src.width;
const height = src.height;

function isBackground(r, g, b) {
  const avg = (r + g + b) / 3;

  // 1. Warm orange neon lines & glow: R is prominently higher than B
  if (r - b > 22 && r > 90) {
    return false;
  }

  // 2. Dark cybernetic black/slate plates
  if (avg < 85) {
    return false;
  }

  // 3. Warm ivory/white top plates and ledge highlights
  if (r - b >= 15 && r > 150) {
    return false;
  }

  // 4. Everything else in the mid/high brightness is the grey/white checkerboard!
  return true;
}

// Bounding box of the cube
const minX = 1040;
const maxX = 1920;
const minY = 120;
const maxY = 1060;

const bboxWidth = maxX - minX + 1;
const bboxHeight = maxY - minY + 1;

const padding = 20;
const cropSize = Math.max(bboxWidth, bboxHeight) + padding * 2;
const out = new PNG({ width: cropSize, height: cropSize });

const offsetX = Math.floor((cropSize - bboxWidth) / 2) - minX;
const offsetY = Math.floor((cropSize - bboxHeight) / 2) - minY;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const srcIdx = (y * width + x) << 2;
    const targetX = x + offsetX;
    const targetY = y + offsetY;

    if (targetX >= 0 && targetX < cropSize && targetY >= 0 && targetY < cropSize) {
      const targetIdx = (targetY * cropSize + targetX) << 2;

      const r = src.data[srcIdx];
      const g = src.data[srcIdx + 1];
      const b = src.data[srcIdx + 2];

      if (x < minX || x > maxX || y < minY || y > maxY || isBackground(r, g, b)) {
        out.data[targetIdx] = 0;
        out.data[targetIdx + 1] = 0;
        out.data[targetIdx + 2] = 0;
        out.data[targetIdx + 3] = 0;
      } else {
        out.data[targetIdx] = r;
        out.data[targetIdx + 1] = g;
        out.data[targetIdx + 2] = b;
        out.data[targetIdx + 3] = 255;
      }
    }
  }
}

// Edge smoothing
for (let y = 1; y < cropSize - 1; y++) {
  for (let x = 1; x < cropSize - 1; x++) {
    const idx = (y * cropSize + x) << 2;
    if (out.data[idx + 3] === 255) {
      let transparentNeighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nIdx = ((y + dy) * cropSize + (x + dx)) << 2;
          if (out.data[nIdx + 3] === 0) transparentNeighbors++;
        }
      }
      if (transparentNeighbors >= 5) {
        out.data[idx + 3] = 160;
      } else if (transparentNeighbors >= 3) {
        out.data[idx + 3] = 215;
      }
    }
  }
}

const logoPath = path.resolve(process.cwd(), 'public', 'pesquad-logo.png');
const faviconPath = path.resolve(process.cwd(), 'public', 'favicon.png');

fs.writeFileSync(logoPath, PNG.sync.write(out));
fs.writeFileSync(faviconPath, PNG.sync.write(out));

console.log(`Generated perfectly transparent logo (${cropSize}x${cropSize})`);
