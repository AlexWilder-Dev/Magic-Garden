// One-off: builds public/og.jpg (1200x630) for link previews.
import sharp from 'sharp';
import { stat } from 'node:fs/promises';

const W = 1200, H = 630;
const photo = await sharp('media/garden-main.jpg')
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 1.02 })
  .toBuffer();

const logo = await sharp('media/logo.png').png().toBuffer();
const { width: lw, height: lh } = await sharp(logo).metadata();
const padX = 30, padY = 14;
const pw = lw + padX * 2, ph = lh + padY * 2;
const plate = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${pw + 24}" height="${ph + 24}">
  <defs><filter id="s" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".45"/></filter></defs>
  <rect x="12" y="8" width="${pw}" height="${ph}" rx="18" fill="#f4ecdd" filter="url(#s)"/>
  <rect x="20" y="16" width="${pw - 16}" height="${ph - 16}" rx="12" fill="none" stroke="#302315" stroke-opacity=".35" stroke-width="2"/>
</svg>`);

const left = 40, top = H - ph - 24 - 34;
await sharp(photo)
  .composite([
    { input: plate, left, top },
    { input: logo, left: left + 12 + padX, top: top + 8 + padY },
  ])
  .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: '4:2:0' })
  .toFile('public/og.jpg');

const meta = await sharp('public/og.jpg').metadata();
const { size } = await stat('public/og.jpg');
console.log(`og.jpg ${meta.width}x${meta.height} ${meta.format} ${(size / 1024).toFixed(0)}KB`);
