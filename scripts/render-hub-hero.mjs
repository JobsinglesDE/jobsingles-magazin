#!/usr/bin/env node
import fs from 'fs';
import sharp from 'sharp';
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const W = 1920, H = 1088;
const prompt = `Large modern medical congress networking hall in Germany, late afternoon golden hour light streaming through floor-to-ceiling glass walls. Wide diverse mix of 30-50 young German doctors (mid-20s to late-30s, varied genders and backgrounds) in business-casual and smart-casual attire, engaged in animated small-group conversations, holding name badges (no readable text), coffee cups and water bottles. Multiple specialty cliques visible — chirurgical group in muted blue, internal medicine group, radiology cluster around tablet screens, allgemein/JADE-style table in foreground. Professional yet warm atmosphere, no white coats, no medical equipment, no patient material. photorealistic, Canon R5 35mm f/2.0, natural skin texture with visible pores and subtle wrinkles, shallow depth of field on foreground group, no plastic look, documentary photography style, no signage text visible, no logos.`;

const res = await fetch('https://api.together.xyz/v1/images/generations', {
  method: 'POST', headers: { 'Authorization': `Bearer ${TOGETHER_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'black-forest-labs/FLUX.2-pro', prompt, width: W, height: H, n: 1 }),
});
if (!res.ok) { console.error('Err:', res.status, await res.text()); process.exit(1); }
const data = await res.json();
const imgBuf = Buffer.from(await (await fetch(data.data[0].url)).arrayBuffer());
const { width: w, height: h } = await sharp(imgBuf).metadata();
const grain = Buffer.alloc(w * h * 3);
for (let i = 0; i < grain.length; i++) grain[i] = 128 + Math.floor((Math.random() - 0.5) * 35);
const grainBuf = await sharp(grain, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
const styled = await sharp(imgBuf)
  .modulate({ brightness: 1.03, saturation: 0.80 })
  .tint({ r: 255, g: 228, b: 192 })
  .gamma(1.05)
  .composite([{ input: grainBuf, blend: 'overlay', opacity: 0.13 }])
  .webp({ quality: 85 }).toBuffer();
fs.writeFileSync('/docker/projects/gastrosingles-magazin/public/images/hubs/junge-fachgesellschaften.webp', styled);
console.log(`✓ Hub hero rendered: ${(styled.length/1024).toFixed(0)} KB`);
