import sharp from 'sharp';
import fs from 'node:fs';
const inBuf = fs.readFileSync('/tmp/medic-hero-raw.png');
// Upscale to 2880x1536 lanczos3
const upscaled = await sharp(inBuf).resize(2880, 1536, { kernel: 'lanczos3' }).toBuffer();
const { width: w, height: h } = await sharp(upscaled).metadata();
// Light grain only (split warm/cool composition shouldn't get full warm-tint)
const grain = Buffer.alloc(w * h * 3);
for (let i = 0; i < grain.length; i++) grain[i] = 128 + Math.floor((Math.random() - 0.5) * 18);
const grainBuf = await sharp(grain, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
const out = await sharp(upscaled)
  .modulate({ brightness: 1.02, saturation: 0.95 })
  .composite([{ input: grainBuf, blend: 'soft-light', tile: false }])
  .webp({ quality: 88, effort: 5 })
  .toBuffer();
const target = '/docker/projects/gastrosingles-magazin/public/images/hero-tv-news.webp';
fs.writeFileSync(target, out);
console.log('saved', target, out.length, 'bytes');
