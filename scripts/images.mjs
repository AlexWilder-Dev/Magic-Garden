// Builds responsive WebP derivatives of the venue photos, logo variants and icons.
// Source photos live in /media (straight from the venue's current site).
import sharp from 'sharp';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'media';
const OUT = 'public/img';
const WIDTHS = [480, 800, 1200, 1500];

const photos = [
  'garden-canopy.jpg', 'garden-main.jpg', 'garden-outside-bar.jpg', 'garden-covered.jpg',
  'garden-cafe.jpg', 'garden-private-seating.jpg', 'garden-taxi-2.jpg', 'garden-taxi-1.jpg',
  'garden-outside-view.jpg', 'home-1.jpg', 'home-3.jpg', 'about-4.jpg',
  'inside-seating.jpg', 'contact-1.jpg', 'inside-restaurant-2.jpg', 'inside-restaurant-3.jpg',
  'inside-bar-night.jpg', 'inside-stage-fireplace.jpg', 'misc-2.jpg', 'inside-conservatory.jpg',
  'inside-darts.jpg', 'inside-the-bar.jpg', 'ev-casa-del-ritmo.jpg', 'ev-divyarup.jpg',
  'ev-joao-menezes.jpg', 'ev-koikoi.jpg', 'ev-living-sounds.png', 'ev-quiz-1.jpg',
  'ev-quiz-2.jpg', 'ev-sauna-social.png', 'ev-souleymane.jpg', 'ev-they-say-jump.png',
];

await mkdir(OUT, { recursive: true });
const manifest = {};

for (const file of photos) {
  const name = file.replace(/\.(jpe?g|png)$/i, '');
  const src = path.join(SRC, file);
  const { width, height } = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w < width);
  widths.push(width);
  const unique = [...new Set(widths)].sort((a, b) => a - b);
  for (const w of unique) {
    await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: name.startsWith('ev-') ? 82 : 74, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  manifest[name] = { w: width, h: height, widths: unique };
}

await writeFile('src/data/images.json', JSON.stringify(manifest, null, 2) + '\n');

// Logo: original for light grounds, a cream-script version for dark grounds.
const logo = sharp(path.join(SRC, 'logo.png')).ensureAlpha();
const { data, info } = await logo.raw().toBuffer({ resolveWithObject: true });
const light = Buffer.from(data);
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const [r, g, b, a] = [light[i], light[i + 1], light[i + 2], light[i + 3]];
    if (a === 0) continue;
    const brown = r < 120 && g < 95 && b < 70 && r >= g && g >= b && x > 100 && y < 95;
    const shadow = r > 150 && g > 140 && b > 90 && Math.abs(r - g) < 40 && a < 200;
    if (brown) { light[i] = 246; light[i + 1] = 233; light[i + 2] = 210; }
    else if (shadow) { light[i + 3] = 0; }
  }
}
await sharp(light, { raw: info }).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'logo-light.png'));
await copyFile(path.join(SRC, 'logo.png'), path.join(OUT, 'logo.png'));

// Icons: the top hat and the first curl of vine.
let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a > 200 && r > 150 && g < 80 && b < 80) {
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
}
console.log('hat bbox', { minX, minY, maxX, maxY });
const side = Math.max(maxX - minX, maxY - minY) + 16;
const cx = Math.round((minX + maxX) / 2) + 4;
const cy = Math.round((minY + maxY) / 2);
const box = {
  left: Math.max(0, cx - Math.round(side / 2)),
  top: Math.max(0, cy - Math.round(side / 2)),
  width: side,
  height: side,
};
box.width = Math.min(box.width, info.width - box.left);
box.height = Math.min(box.height, info.height - box.top);
const noText = Buffer.from(data);
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const [r, g, b] = [noText[i], noText[i + 1], noText[i + 2]];
    const brown = r < 120 && g < 95 && b < 70 && r >= g && g >= b && x > 100 && y < 95;
    const shadow = r > 150 && g > 140 && b > 90 && Math.abs(r - g) < 40 && noText[i + 3] < 200;
    const isRed = r > g + 40 && r > b + 40 && noText[i + 3] > 120;
    const isGreen = g > r + 20 && g > b + 20 && noText[i + 3] > 120;
    if (brown || shadow || (x > 104 && y < 95 && !isRed && !isGreen)) noText[i + 3] = 0;
  }
}
const hat = await sharp(noText, { raw: info }).extract(box).png().toBuffer();
await sharp(hat).resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/favicon.png');
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#f4ecdd' } })
  .composite([{ input: await sharp(hat).resize(150, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(), gravity: 'centre' }])
  .png()
  .toFile('public/apple-touch-icon.png');

console.log(`wrote ${Object.keys(manifest).length} photos`);
