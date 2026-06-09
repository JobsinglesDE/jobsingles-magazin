#!/usr/bin/env node
/**
 * medic-render-heroes.mjs
 *
 * Render Hero-Bilder für Gastrosingles Sprint 1 (W2 Stammtische + W3 Unikliniken).
 * - FLUX.2-pro via Together.ai
 * - Filter 1+3 (Warm Classic + Film Grain)
 * - Thematischer Prompt aus mdoc-Frontmatter (stadt, klinikName/traegerName)
 * - 1200x640 (Hero Aspect)
 *
 * Usage:
 *   medic-render-heroes.mjs <kind>           # alle missing
 *   medic-render-heroes.mjs unikliniken
 *   medic-render-heroes.mjs aerztestammtische
 *   medic-render-heroes.mjs --slug <slug> --collection <kind>
 *   medic-render-heroes.mjs --dry-run
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import sharp from 'sharp';

const REPO = '/docker/projects/gastrosingles-magazin';
const W = 1200, H = 640;
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '3', 10);

if (!TOGETHER_API_KEY) {
  console.error('TOGETHER_API_KEY fehlt');
  process.exit(1);
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
let singleSlug = null;
let singleColl = null;
let kindArg = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--slug') singleSlug = args[++i];
  else if (args[i] === '--collection') singleColl = args[++i];
  else if (!args[i].startsWith('--')) kindArg = args[i];
}

function parseFM(mdocPath) {
  const raw = fs.readFileSync(mdocPath, 'utf-8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`No frontmatter: ${mdocPath}`);
  return yaml.load(m[1]);
}

// Thematic prompt per collection
function buildPrompt(fm, collection) {
  const stadt = (fm.stadt || '').replace(/-/g, ' ');
  const alt = fm.featuredImageAlt || '';
  const base = 'photorealistic, Canon R5 85mm f/1.4, natural skin texture with visible pores and subtle wrinkles, golden hour, shallow depth of field, no plastic look, documentary photography style';

  if (collection === 'unikliniken') {
    const klinik = fm.klinikName || 'Universitätsklinikum';
    return `Exterior architectural shot of ${klinik} hospital campus in ${stadt}, Germany. Modern German university hospital architecture, glass and concrete facade, medical staff in white coats walking past entrance, warm late-afternoon light, German urban or hillside setting. ${base}. Wide angle establishing shot, no signage text visible, no logos.`;
  }
  if (collection === 'junge-fachgesellschaften') {
    const fach = fm.fachrichtung || 'innere';
    const fgName = fm.jungeFGName || 'junge Fachgesellschaft';
    const fachScene = {
      innere: 'modern medical congress lecture hall, young internal medicine doctors networking in business-casual',
      chirurgie: 'surgical congress hands-on workshop room, young surgeons in scrubs at a wet-lab table',
      bildgebung: 'modern radiology reading room with monitors, young radiologists discussing scans',
      anaesthesie: 'anesthesiology congress hall, young anesthesia doctors networking in casual blazers',
      'neuro-psy': 'modern neurology/psychiatry congress mingling area, young doctors in smart-casual attire',
      'paediatrie-gyn': 'pediatrics/obstetrics summer school workshop with young doctors in lab coats over casual wear',
      allgemein: 'cozy German pub or café — young family doctors networking at a JADE-style stammtisch',
      spezial: 'small specialist medical congress workshop area, young doctors networking in casual attire',
    }[fach] || 'modern medical conference networking lounge with young German doctors';
    return `${fachScene}, Germany. ${fgName} young doctors meetup atmosphere, 6-8 mixed-gender young Mediziner (mid-20s to mid-30s), engaged conversation, name badges visible but no readable text, warm professional lighting. ${base}. No clinic logos, no patient material, no instrument close-ups.`;
  }
  // aerztestammtische
  const traeger = fm.traegerName || 'Mediziner-Netzwerk';
  return `Group of 6-8 young German doctors (mid-20s to mid-30s, mixed genders, casual off-duty clothes) at a cozy German pub or café table in ${stadt}, Germany, warm conversation, beer and water glasses, laughing genuinely. ${traeger} networking meetup atmosphere, evening warm interior light, no white coats, no medical equipment visible. ${base}.`;
}

async function flux2pro(prompt, attempt = 0) {
  const res = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.2-pro',
      prompt,
      width: W,
      height: H,
      n: 1,
    }),
  });
  if (res.status === 429 && attempt < 8) {
    const wait = Math.min(60000, 4000 * Math.pow(1.6, attempt)) + Math.random() * 2000;
    await new Promise(r => setTimeout(r, wait));
    return flux2pro(prompt, attempt + 1);
  }
  if (!res.ok) throw new Error(`Together ${res.status}: ${(await res.text()).slice(0,200)}`);
  const data = await res.json();
  const url = data.data?.[0]?.url;
  if (!url) throw new Error('No image URL');
  const imgRes = await fetch(url);
  return Buffer.from(await imgRes.arrayBuffer());
}

// Filter 1+3: Warm Classic + Film Grain
async function applyStyle(imgBuf) {
  const { width: w, height: h } = await sharp(imgBuf).metadata();
  const grain = Buffer.alloc(w * h * 3);
  for (let i = 0; i < grain.length; i++) {
    grain[i] = 128 + Math.floor((Math.random() - 0.5) * 35);
  }
  const grainBuf = await sharp(grain, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
  return await sharp(imgBuf)
    .modulate({ brightness: 1.03, saturation: 0.80 })
    .tint({ r: 255, g: 228, b: 192 })
    .gamma(1.05)
    .composite([{ input: grainBuf, blend: 'overlay', opacity: 0.13 }])
    .webp({ quality: 85 })
    .toBuffer();
}

function listJobs() {
  const jobs = [];
  const collections = singleColl ? [singleColl] : (kindArg ? [kindArg] : ['aerztestammtische', 'unikliniken', 'junge-fachgesellschaften']);
  for (const coll of collections) {
    const contentDir = path.join(REPO, 'content', coll);
    const imgRoot = path.join(REPO, 'public/images', coll);
    if (!fs.existsSync(contentDir)) continue;
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdoc'));
    for (const file of files) {
      const slug = file.replace(/\.mdoc$/, '');
      if (singleSlug && slug !== singleSlug) continue;
      const outDir = path.join(imgRoot, slug);
      const outPath = path.join(outDir, `${slug}.webp`);
      if (fs.existsSync(outPath)) continue;
      const fm = parseFM(path.join(contentDir, file));
      jobs.push({ slug, coll, fm, outPath, outDir });
    }
  }
  return jobs;
}

async function runJob(job) {
  const prompt = buildPrompt(job.fm, job.coll);
  if (dryRun) {
    console.log(`[DRY] ${job.coll}/${job.slug}`);
    console.log(`  → ${job.outPath}`);
    console.log(`  Prompt: ${prompt.slice(0, 180)}...`);
    return { ok: true, slug: job.slug };
  }
  try {
    const raw = await flux2pro(prompt);
    const styled = await applyStyle(raw);
    fs.mkdirSync(job.outDir, { recursive: true });
    fs.writeFileSync(job.outPath, styled);
    const stats = fs.statSync(job.outPath);
    console.log(`✓ ${job.coll}/${job.slug} (${(stats.size/1024).toFixed(0)} KB)`);
    return { ok: true, slug: job.slug };
  } catch (e) {
    console.error(`✗ ${job.coll}/${job.slug}: ${e.message}`);
    return { ok: false, slug: job.slug, error: e.message };
  }
}

async function main() {
  const jobs = listJobs();
  console.log(`${jobs.length} Bilder zu rendern (Concurrency: ${CONCURRENCY})`);
  if (jobs.length === 0) return;

  const results = [];
  // Simple worker pool
  const queue = [...jobs];
  async function worker() {
    while (queue.length) {
      const job = queue.shift();
      results.push(await runJob(job));
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));

  const ok = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok);
  console.log(`\nFertig: ${ok}/${jobs.length}`);
  if (fail.length) {
    console.log('Fehler:');
    fail.forEach(f => console.log(`  - ${f.slug}: ${f.error}`));
    process.exit(1);
  }
}

main();
