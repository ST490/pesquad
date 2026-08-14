import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const inputPath = path.resolve(process.cwd(), 'Gemini_Generated_Image_odo3w2odo3w2odo3.png');
const data = fs.readFileSync(inputPath);
const src = PNG.sync.read(data);

// Let's sample the top white ledges
for (let y = 350; y < 450; y += 20) {
  for (let x = 1200; x < 1800; x += 50) {
    const idx = (src.width * y + x) << 2;
    const r = src.data[idx], g = src.data[idx+1], b = src.data[idx+2];
    console.log(`Pos (${x}, ${y}): RGB(${r}, ${g}, ${b}) diff=${Math.max(Math.abs(r-g), Math.abs(g-b), Math.abs(r-b))}`);
  }
}
