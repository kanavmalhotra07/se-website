export const config = { runtime: 'edge' };

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

export default async function handler(request: Request): Promise<Response> {
  const headers = { 'Content-Type': 'application/json' };

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers,
    });
  }

  let token: string | undefined;
  try {
    const body = await request.json() as { token?: string };
    token = body.token;
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request body' }), {
      status: 400,
      headers,
    });
  }

  if (!token || typeof token !== 'string') {
    return new Response(JSON.stringify({ success: false, error: 'Missing verification token' }), {
      status: 400,
      headers,
    });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY is not configured');
    return new Response(JSON.stringify({ success: false, error: 'Server misconfiguration' }), {
      status: 500,
      headers,
    });
  }

  const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token }),
  });

  const data = await cfRes.json() as TurnstileResponse;

  if (data.success) {
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  }

  return new Response(
    JSON.stringify({ success: false, error: 'Security verification failed. Please try again.' }),
    { status: 400, headers }
  );
}
