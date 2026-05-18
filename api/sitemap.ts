export const config = { runtime: 'edge' };

const SITE = 'https://sanchienterprises.com';
const LASTMOD = '2026-05-19';

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

export default function handler(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405 });
  }

  const entries = pages
    .map(
      (path) =>
        `  <url>\n    <loc>${SITE}${path}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n  </url>`,
    )
    .join('\n');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries +
    '\n</urlset>';

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
