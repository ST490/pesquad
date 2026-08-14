import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const inputPath = path.resolve(process.cwd(), 'Gemini_Generated_Image_odo3w2odo3w2odo3.png');
const data = fs.readFileSync(inputPath);

const src = PNG.sync.read(data);
console.log(`Input Image Dimensions: ${src.width}x${src.height}`);

// Check alpha values and color distributions
let nonOpaqueCount = 0;
let opaqueCount = 0;

for (let y = 0; y < src.height; y++) {
  for (let x = 0; x < src.width; x++) {
    const idx = (src.width * y + x) << 2;
    const a = src.data[idx + 3];
    if (a < 255) nonOpaqueCount++;
    else opaqueCount++;
  }
}

console.log(`Opaque pixels: ${opaqueCount}, Transparent/Semi-transparent: ${nonOpaqueCount}`);

// Inspect corner pixels
const corners = [
  [10, 10],
  [src.width - 10, 10],
  [10, src.height - 10],
  [src.width - 10, src.height - 10],
  [500, 100],
  [1500, 100],
  [1450, 720], // Center where the cube is
];

corners.forEach(([x, y]) => {
  const idx = (src.width * y + x) << 2;
  console.log(`Pixel (${x}, ${y}): R=${src.data[idx]} G=${src.data[idx+1]} B=${src.data[idx+2]} A=${src.data[idx+3]}`);
});
