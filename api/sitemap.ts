export const config = { runtime: 'edge' };

export default function handler(_request: Request): Response {
  return new Response(null, {
    status: 301,
    headers: {
      Location: 'https://www.sanchienterprises.com/sitemap.xml',
    },
  });
}
