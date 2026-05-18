import type { APIRoute } from 'astro';

const SITE = 'https://sanchienterprises.com';
const LASTMOD = '2026-05-18';

const pages = [
  '/',
  '/about/',
  '/contact/',
  '/products/',
  '/products/non-woven-carpet/',
  '/products/ribbed-carpet/',
  '/products/velour-carpet/',
  '/products/caution-carpet/',
  '/products/designer-carpet/',
  '/products/loop-pile-carpet/',
];

export const GET: APIRoute = () => {
  const entries = pages
    .map(
      (path) =>
        `  <url>\n    <loc>${SITE}${path}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n  </url>`,
    )
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries}\n` +
    `</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
