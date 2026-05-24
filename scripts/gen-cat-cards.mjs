import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT = decodeURIComponent(new URL('..', import.meta.url).pathname);

const IMAGES = [
  'public/images/catalogue/nw-roll-macro.webp',
  'public/images/catalogue/ribbed-carpet.webp',
  'public/images/catalogue/velour-hero.webp',
  'public/images/catalogue/lp-macro.webp',
  'public/images/catalogue/caution-carpet-1.webp',
  'public/images/catalogue/grass-carpet-hero.webp',
];

for (const rel of IMAGES) {
  const src = join(ROOT, rel);
  const dst = src.replace('.webp', '-640w.webp');
  if (existsSync(dst)) { console.log('skip', rel.split('/').pop()); continue; }
  await sharp(src).resize(640, null).webp({ quality: 82 }).toFile(dst);
  console.log('✓', rel.split('/').pop());
}
