#!/usr/bin/env node
/**
 * composite-hero.mjs — Doppelwelt Split-Screen + Magazine-Style Text Overlay
 *
 * Composites two images (Zurich left, Alps right) with orange gradient blend,
 * adds "BLAULICHTSINGLES TV NEWS" magazine-style text overlay,
 * applies Warm Classic + Film Grain filters, white border + logo.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const LEFT = '/tmp/hero-left-zurich.png';
const RIGHT = '/tmp/hero-right-alps.png';
const LOGO = '/root/.claude/skills/image-gen/assets/jobsingles-logo.png';
const OUTPUT = '/tmp/hero-tv-news.webp';

// Target: 2940x1626 (same as other heroes, before border)
const TARGET_W = 2940;
const TARGET_H = 1626;

async function main() {
  console.log('1/7 Loading and resizing images...');

  // Resize both to full target size first
  const leftFull = await sharp(LEFT)
    .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'center' })
    .toBuffer();

  const rightFull = await sharp(RIGHT)
    .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'center' })
    .toBuffer();

  console.log('2/7 Creating gradient blend mask...');

  // Create gradient mask for blending (left=white, right=black, orange transition in middle)
  // The mask determines how much of the LEFT image shows (white=left, black=right)
  const blendWidth = TARGET_W;
  const blendHeight = TARGET_H;
  const transitionCenter = Math.floor(blendWidth * 0.5);
  const transitionWidth = Math.floor(blendWidth * 0.15); // 15% soft blend zone

  // Create raw RGBA gradient mask
  const maskData = Buffer.alloc(blendWidth * blendHeight * 4);
  for (let y = 0; y < blendHeight; y++) {
    for (let x = 0; x < blendWidth; x++) {
      const idx = (y * blendWidth + x) * 4;
      let alpha;
      if (x < transitionCenter - transitionWidth) {
        alpha = 255; // fully left image
      } else if (x > transitionCenter + transitionWidth) {
        alpha = 0; // fully right image
      } else {
        // Smooth transition
        const t = (x - (transitionCenter - transitionWidth)) / (transitionWidth * 2);
        alpha = Math.round(255 * (1 - t));
      }
      maskData[idx] = alpha;     // R
      maskData[idx + 1] = alpha; // G
      maskData[idx + 2] = alpha; // B
      maskData[idx + 3] = 255;   // A
    }
  }

  console.log('3/7 Blending split-screen...');

  // Strategy: Start with right image, composite left on top with gradient alpha mask
  // First, create a version of the left image with gradient alpha
  const leftRaw = await sharp(leftFull).raw().toBuffer();
  const rightRaw = await sharp(rightFull).raw().toBuffer();

  // Manual pixel blend
  const blendedData = Buffer.alloc(TARGET_W * TARGET_H * 3);
  for (let i = 0; i < TARGET_W * TARGET_H; i++) {
    const maskAlpha = maskData[i * 4] / 255; // use R channel as alpha
    const srcIdx = i * 3;
    blendedData[srcIdx]     = Math.round(leftRaw[srcIdx]     * maskAlpha + rightRaw[srcIdx]     * (1 - maskAlpha));
    blendedData[srcIdx + 1] = Math.round(leftRaw[srcIdx + 1] * maskAlpha + rightRaw[srcIdx + 1] * (1 - maskAlpha));
    blendedData[srcIdx + 2] = Math.round(leftRaw[srcIdx + 2] * maskAlpha + rightRaw[srcIdx + 2] * (1 - maskAlpha));
  }

  let blended = await sharp(blendedData, {
    raw: { width: TARGET_W, height: TARGET_H, channels: 3 }
  }).png().toBuffer();

  console.log('4/7 Adding orange glow at center seam...');

  // Add subtle orange glow at the transition point
  const glowSvg = `<svg width="${TARGET_W}" height="${TARGET_H}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="15%" fx="50%" fy="50%">
        <stop offset="0%" stop-color="#FF7A00" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#FF7A00" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#glow)"/>
  </svg>`;

  const glowBuf = Buffer.from(glowSvg);

  blended = await sharp(blended)
    .composite([{ input: glowBuf, blend: 'screen' }])
    .toBuffer();

  console.log('5/7 Applying Warm Classic + Film Grain filters...');

  // Film grain
  const grainData = Buffer.alloc(TARGET_W * TARGET_H * 3);
  for (let i = 0; i < grainData.length; i++) {
    grainData[i] = 128 + Math.floor((Math.random() - 0.5) * 35);
  }
  const grainBuf = await sharp(grainData, {
    raw: { width: TARGET_W, height: TARGET_H, channels: 3 }
  }).png().toBuffer();

  let styled = await sharp(blended)
    .modulate({ brightness: 1.03, saturation: 0.80 })
    .tint({ r: 255, g: 228, b: 192 })
    .gamma(1.05)
    .composite([{ input: grainBuf, blend: 'overlay', opacity: 0.13 }])
    .toBuffer();

  console.log('6/7 Adding magazine-style text overlay...');

  // Dark gradient overlay at top for text readability
  // + "BLAULICHTSINGLES" large + "TV NEWS" below
  const textOverlaySvg = `<svg width="${TARGET_W}" height="${TARGET_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.6"/>
        <stop offset="40%" stop-color="#000000" stop-opacity="0.3"/>
        <stop offset="70%" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="60%" stop-color="#000000" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.5"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.7"/>
      </filter>
    </defs>

    <!-- Dark gradient overlays -->
    <rect width="100%" height="100%" fill="url(#topGrad)"/>
    <rect width="100%" height="100%" fill="url(#bottomGrad)"/>

    <!-- Decorative line above title -->
    <line x1="${TARGET_W * 0.35}" y1="280" x2="${TARGET_W * 0.65}" y2="280"
          stroke="#FF7A00" stroke-width="3" opacity="0.8"/>

    <!-- BLAULICHTSINGLES — Main title -->
    <text x="${TARGET_W / 2}" y="420"
          text-anchor="middle"
          font-family="Liberation Sans, Helvetica, Arial, sans-serif"
          font-weight="900"
          font-size="140"
          letter-spacing="18"
          fill="white"
          filter="url(#shadow)">BLAULICHTSINGLES</text>

    <!-- Decorative line between -->
    <line x1="${TARGET_W * 0.38}" y1="470" x2="${TARGET_W * 0.62}" y2="470"
          stroke="white" stroke-width="2" opacity="0.5"/>

    <!-- TV NEWS — Subtitle -->
    <text x="${TARGET_W / 2}" y="570"
          text-anchor="middle"
          font-family="Liberation Sans, Helvetica, Arial, sans-serif"
          font-weight="700"
          font-size="110"
          letter-spacing="30"
          fill="#FF7A00"
          filter="url(#shadow)">TV NEWS</text>

    <!-- Tagline -->
    <text x="${TARGET_W / 2}" y="660"
          text-anchor="middle"
          font-family="Liberation Sans, Helvetica, Arial, sans-serif"
          font-weight="400"
          font-size="42"
          letter-spacing="8"
          fill="white"
          opacity="0.75">TATORT ZÜRICH  ·  DER BERGDOKTOR</text>
  </svg>`;

  styled = await sharp(styled)
    .composite([{ input: Buffer.from(textOverlaySvg), blend: 'over' }])
    .png()
    .toBuffer();

  console.log('7/7 Adding white border + logo...');

  // White border: 20px sides/top, 50px bottom
  const borderSide = 20;
  const borderBottom = 50;
  const finalW = TARGET_W + borderSide * 2;
  const finalH = TARGET_H + borderSide + borderBottom;

  // Create white canvas
  let final = await sharp({
    create: { width: finalW, height: finalH, channels: 3, background: { r: 255, g: 255, b: 255 } }
  })
    .composite([{ input: styled, left: borderSide, top: borderSide }])
    .png()
    .toBuffer();

  // Add logo centered in bottom border
  const logoMeta = await sharp(LOGO).metadata();
  const logoH = 36;
  const logoW = Math.round(logoMeta.width * (logoH / logoMeta.height));
  const logoBuf = await sharp(LOGO).resize(logoW, logoH).toBuffer();

  final = await sharp(final)
    .composite([{
      input: logoBuf,
      left: Math.round((finalW - logoW) / 2),
      top: TARGET_H + borderSide + Math.round((borderBottom - logoH) / 2)
    }])
    .webp({ quality: 85 })
    .toBuffer();

  fs.writeFileSync(OUTPUT, final);
  const meta = await sharp(OUTPUT).metadata();
  console.log(`\nDONE: ${OUTPUT}`);
  console.log(`Size: ${meta.width}x${meta.height}, ${(final.length / 1024).toFixed(0)} KB`);
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
