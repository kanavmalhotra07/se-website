#!/usr/bin/env node
/**
 * Image optimization: converts all JPG/PNG in public/images/ to WebP.
 * Large images (width > 1600px) also get 640w and 1280w responsive variants.
 * Skips files already up to date (checks mtime).
 */

import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const INPUT_DIR = decodeURIComponent(new URL('../public/images', import.meta.url).pathname);
const WEBP_QUALITY = 82;
const RESPONSIVE_THRESHOLD_W = 1600; // generate srcset variants if wider than this
const RESPONSIVE_WIDTHS = [640, 1280];

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findImages(full));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function webpPath(src) {
  const dir = dirname(src);
  const base = basename(src, extname(src));
  return join(dir, base + '.webp');
}

function responsivePath(src, w) {
  const dir = dirname(src);
  const base = basename(src, extname(src));
  return join(dir, `${base}-${w}w.webp`);
}

async function isStale(src, dest) {
  if (!existsSync(dest)) return true;
  const [srcStat, destStat] = await Promise.all([stat(src), stat(dest)]);
  return srcStat.mtimeMs > destStat.mtimeMs;
}

async function processImage(src) {
  const webp = webpPath(src);
  const results = [];

  // Full-size WebP
  if (await isStale(src, webp)) {
    await sharp(src).webp({ quality: WEBP_QUALITY }).toFile(webp);
    results.push(basename(webp));
  }

  // Responsive variants for wide images
  const meta = await sharp(src).metadata();
  if (meta.width > RESPONSIVE_THRESHOLD_W) {
    for (const w of RESPONSIVE_WIDTHS) {
      const dest = responsivePath(src, w);
      if (await isStale(src, dest)) {
        await sharp(src).resize(w).webp({ quality: WEBP_QUALITY }).toFile(dest);
        results.push(basename(dest));
      }
    }
  }

  return results;
}

async function main() {
  console.log('🖼  Optimizing images…');
  const images = await findImages(INPUT_DIR);
  console.log(`   Found ${images.length} source images`);

  let converted = 0;
  let skipped = 0;

  // Process in parallel batches of 8
  const BATCH = 8;
  for (let i = 0; i < images.length; i += BATCH) {
    const batch = images.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(processImage));
    for (const files of results) {
      if (files.length > 0) {
        converted += files.length;
      } else {
        skipped++;
      }
    }
  }

  console.log(`   ✓ Generated ${converted} WebP file(s), ${skipped} already up to date`);
}

main().catch(err => { console.error(err); process.exit(1); });
