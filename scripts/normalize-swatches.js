#!/usr/bin/env node
/**
 * Normalize swatch images for the shade grid cards.
 *
 * Problem: all source JPEGs are 520×292 landscape pixels but carry EXIF
 * orientation 6 (CW 90°) or 8 (CCW 90°).  Browsers honour the tag and show
 * them portrait, but:
 *   - The rotation direction differs between NW (orient=8) and Ribbed/Velour
 *     (orient=6), so the crop focal point shifts between groups.
 *   - CSS object-position cannot compensate because the offsets differ per
 *     group without any per-image override.
 *
 * Fix: for every swatch image —
 *   1. Apply the EXIF rotation (bake it into pixel data, strip tag).
 *   2. Resize+crop to 480×640 (3:4 portrait — matches the CSS container
 *      exactly) with a centred crop so the carpet texture fills the frame.
 *   3. Write the result back as JPEG (source) and WebP (served file),
 *      both at quality 85.
 *
 * After this, `object-position: center` works identically for every card.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
import { existsSync } from 'fs';
import { join, dirname, basename, extname } from 'path';

const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);
const CATALOGUE = join(ROOT, 'public/images/catalogue');

const TARGET_W = 480;
const TARGET_H = 640;
const QUALITY = 85;

const SWATCHES = [
  // Non Woven Regular
  'nw-light-grey', 'nw-light-camel', 'nw-camel', 'nw-light-brown',
  'nw-dark-brown', 'nw-dark-grey', 'nw-black', 'nw-blue-black',
  'nw-green-black', 'nw-plain-green', 'nw-red', 'nw-red-black',
  'nw-magenta', 'nw-blue',
  // Non Woven Premium
  'nw-p-orange', 'nw-p-safron', 'nw-p-yellow', 'nw-p-yellow-green',
  'nw-p-cactus-green', 'nw-p-aqua-green', 'nw-p-firozi-blue',
  'nw-p-oasis-blue', 'nw-p-turkish-blue', 'nw-p-violet', 'nw-p-purple',
  'nw-p-dark-purple', 'nw-p-pink', 'nw-p-golden', 'nw-p-silver-grey',
  // Ribbed
  'ribbed-black', 'ribbed-dark-brown', 'ribbed-dark-grey',
  'ribbed-green-black', 'ribbed-grey', 'ribbed-medium-grey',
  'ribbed-powder-blue', 'ribbed-red',
  // Velour
  'velour-black', 'velour-camel', 'velour-dark-brown', 'velour-dark-grey',
  'velour-grey', 'velour-medium-grey', 'velour-pastel-green', 'velour-pink',
  'velour-powder-blue', 'velour-red', 'velour-red-black', 'velour-silver-grey',
  // Loop Pile
  'lp-beige', 'lp-blue', 'lp-brown', 'lp-charcoal',
  'loop-pile-grey', 'loop-pile-maroon',
];

async function processOne(name) {
  const src = join(CATALOGUE, name + '.jpg');
  if (!existsSync(src)) {
    console.warn(`  SKIP (not found): ${name}.jpg`);
    return;
  }

  const pipeline = sharp(src)
    .rotate()                          // apply EXIF orientation, strip tag
    .resize(TARGET_W, TARGET_H, {
      fit: 'cover',
      position: 'centre',             // centre-crop so texture fills frame
    });

  // Overwrite JPEG source (so optimize-images.js picks it up correctly)
  await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(src + '.tmp');

  // Write WebP directly (the served file)
  const webp = join(CATALOGUE, name + '.webp');
  await pipeline.clone().webp({ quality: QUALITY }).toFile(webp);

  // Atomic replace of the JPEG
  const { rename } = await import('fs/promises');
  await rename(src + '.tmp', src);

  return true;
}

async function main() {
  console.log('🧹  Normalizing swatch images…');
  console.log(`    Target: ${TARGET_W}×${TARGET_H} portrait (3:4), centred crop`);
  let ok = 0, skip = 0;

  for (const name of SWATCHES) {
    const result = await processOne(name);
    if (result) { ok++; process.stdout.write('.'); }
    else skip++;
  }

  console.log(`\n    ✓ Normalized ${ok} images, ${skip} skipped`);
}

main().catch(err => { console.error(err); process.exit(1); });
