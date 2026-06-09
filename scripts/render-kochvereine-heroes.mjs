#!/usr/bin/env node
/**
 * render-kochvereine-heroes.mjs — FLUX.2-pro Hero-Bilder für Kochvereine
 * Filter 1+3, 1200x640, Prompt per Stadt aus Frontmatter
 *
 * Usage: render-kochvereine-heroes.mjs [slug1 slug2 ...]
 */
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import sharp from 'sharp';

const REPO = '/docker/projects/gastrosingles-magazin';
const W = 1200, H = 640;
const KEY = process.env.TOGETHER_API_KEY;
if (!KEY) { console.error('TOGETHER_API_KEY fehlt'); process.exit(1); }

const BASE = 'photorealistic, Canon R5 85mm f/1.4, natural skin texture with visible pores and subtle wrinkles, golden hour warm light, shallow depth of field, no plastic look, documentary photography style, character faces with personality, no AI smoothness';

// Per-city scene hooks for VKD chef clubs
const CITY_SCENES = {
  'konstanz': 'professional German chefs in white kitchen jackets gathered at a chef-association presentation table near Bodensee lake shore in Konstanz, evening warm light, traditional German hospitality scene',
  'stuttgart': 'German chefs in white jackets at a Stuttgart hotel banquet hall presenting plated dishes, warm pendant lighting, professional culinary association evening event',
  'karlsruhe': 'German chefs in white kitchen jackets at a Karlsruhe restaurant event, baroque palace silhouette visible through window, evening warm light, professional chef club gathering',
  'aalen': 'German chefs in white jackets at a chef club competition table in a traditional Swabian restaurant kitchen, Swabian Alb hills setting, warm professional lighting',
  'baden-baden': 'German chefs in white kitchen jackets at an elegant chef-association presentation inside a Belle Époque grand hotel of Baden-Baden, chandelier light, professional star-chef atmosphere',
  'freiburg': 'German chefs in white jackets at a chef club gathering in a Freiburg Altstadt restaurant with exposed wood beams, evening warm light, Black Forest cuisine setting',
  'friedrichshafen': 'German chefs in white kitchen jackets at a Friedrichshafen lakeside restaurant chef-club event, Bodensee waterfront visible, evening warm light',
  'goeppingen': 'German chefs in white jackets at a Swabian chef club event in Göppingen Stauferland region, warm rustic interior, professional culinary association meeting',
  'heidelberg': 'German chefs in white kitchen jackets at a chef-association outdoor event with Heidelberg castle silhouette in background, evening golden light, Neckar valley setting',
  'heilbronn': 'German chefs in white jackets at a Württemberg wine region chef-club event in Heilbronn, vineyards visible through window at sunset, warm interior light',
  'villingen-schwenningen': 'German chefs in white jackets at a chef club gathering in Villingen-Schwenningen Black Forest region, traditional half-timbered interior, evening warm light',
  'loerrach': 'German chefs in white kitchen jackets at a chef-association event in Lörrach near Swiss border, three-country corner setting, warm restaurant lighting',
  'tauberbischofsheim': 'German chefs in white jackets at a Main-Tauber chef club event in a historic Franconian restaurant, evening warm light, wine region atmosphere',
  'pforzheim': 'German chefs in white kitchen jackets at a Nordschwarzwald chef club event in Pforzheim, dark forest exterior visible through window, warm interior',
  'offenburg': 'German chefs in white jackets at an Ortenau chef-club event in Offenburg, wine region atmosphere with Riesling glasses on table, evening warm light',
  'ravensburg': 'German chefs and hotel professionals in uniform at a Ravensburg chef club gathering in a medieval town hall hotel, warm pendant lighting',
  'schwaebisch-gmuend': 'German chefs in white jackets at a chef club event in Schwäbisch Gmünd Stauferland region, traditional Swabian interior, warm evening light',
  'titisee-neustadt': 'German chefs in white kitchen jackets at a Hochschwarzwald chef club gathering near Titisee lake, Black Forest dark wood interior, warm lighting',
  'ulm': 'German chefs in white jackets at an Ulm chef-club event in a Danube-side restaurant, Ulm Minster silhouette visible, evening warm light',
  'mannheim': 'German chefs in white kitchen jackets at a Mannheim/Ludwigshafen chef club event in an urban Rhine-Neckar restaurant, professional culinary gathering, warm pendant lighting',
};

function buildPrompt(slug, fm) {
  const stadt = (fm.stadt || '').toLowerCase().replace(/ /g, '-');
  const scene = CITY_SCENES[stadt] || `professional German chefs in white kitchen jackets at a VKD chef-association gathering in ${fm.stadt || 'a German town'}, evening warm light, traditional German hospitality scene`;
  return `${scene}. ${BASE}. No text, no readable signage, no logos, authentic German setting.`;
}

async function flux(prompt, a = 0) {
  const res = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'black-forest-labs/FLUX.2-pro', prompt, width: W, height: H, n: 1 }),
  });
  if (res.status === 429 && a < 6) { await new Promise(r => setTimeout(r, 4000 * Math.pow(1.6, a) + Math.random()*2000)); return flux(prompt, a+1); }
  if (!res.ok) throw new Error(`Together ${res.status}: ${(await res.text()).slice(0,200)}`);
  const d = await res.json();
  const url = d.data?.[0]?.url;
  if (!url) throw new Error('No URL');
  return Buffer.from(await (await fetch(url)).arrayBuffer());
}

async function filter(buf) {
  const { width: w, height: h } = await sharp(buf).metadata();
  const g = Buffer.alloc(w * h * 3);
  for (let i = 0; i < g.length; i++) g[i] = 128 + Math.floor((Math.random()-0.5)*35);
  const grain = await sharp(g, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
  return sharp(buf)
    .modulate({ brightness: 1.03, saturation: 0.80 })
    .tint({ r: 255, g: 228, b: 192 })
    .gamma(1.05)
    .composite([{ input: grain, blend: 'overlay', opacity: 0.13 }])
    .webp({ quality: 85 }).toBuffer();
}

function parseFM(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  return yaml.load(m[1]);
}

const args = process.argv.slice(2);
const contentDir = path.join(REPO, 'content/kochvereine');
const slugs = args.length
  ? args
  : fs.readdirSync(contentDir).filter(f => f.endsWith('.mdoc')).map(f => f.replace(/\.mdoc$/, ''));

(async () => {
  for (const slug of slugs) {
    const mdocPath = path.join(contentDir, `${slug}.mdoc`);
    if (!fs.existsSync(mdocPath)) { console.error(`✗ ${slug}: mdoc missing`); continue; }
    const fm = parseFM(mdocPath);
    if (!fm) { console.error(`✗ ${slug}: frontmatter missing`); continue; }
    const outDir = path.join(REPO, 'public/images/kochvereine', slug);
    const outPath = path.join(outDir, `${slug}.webp`);
    if (fs.existsSync(outPath)) { console.log(`= ${slug} (exists)`); continue; }
    const prompt = buildPrompt(slug, fm);
    try {
      console.log(`→ ${slug} (${fm.stadt || '?'}) rendering ...`);
      const raw = await flux(prompt);
      const styled = await filter(raw);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outPath, styled);
      console.log(`✓ ${slug} (${(fs.statSync(outPath).size/1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`✗ ${slug}: ${e.message}`);
    }
  }
})();
