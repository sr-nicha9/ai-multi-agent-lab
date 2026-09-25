import type { APIRoute } from 'astro';
import { insertContact } from '../../lib/db';

export const prerender = false;

/**
 * POST /api/contact
 * Validates JSON {name,email,message} via insertContact and returns 201 with
 * the stored row. Error contract (D7/D8): only short public codes leave the
 * server — `NOT_IMPLEMENTED` -> 501, `VALIDATION` -> 400, anything else is
 * logged server-side (never the request body — it holds visitor PII) and
 * returned as a generic 500. The UI translates codes into human copy.
 */
export const POST: APIRoute = async ({ request }) => {
  let code = 'INTERNAL';
  try {
    const body = await request.json();
    const row = insertContact(body);
    return new Response(JSON.stringify(row), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message.startsWith('NOT_IMPLEMENTED')) {
      code = 'NOT_IMPLEMENTED';
    } else if (message.startsWith('VALIDATION')) {
      code = 'VALIDATION';
    } else {
      // Unexpected: log the error only — never the body (contains email).
      console.error('[api/contact] unexpected error:', err);
    }
    const status = code === 'NOT_IMPLEMENTED' ? 501 : code === 'VALIDATION' ? 400 : 500;
    return new Response(JSON.stringify({ error: code }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
};