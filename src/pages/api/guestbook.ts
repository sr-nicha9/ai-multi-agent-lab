import type { APIRoute } from 'astro';
import { insertGuestbook, listGuestbook } from '../../lib/db';

export const prerender = false;

/**
 * Error contract (D7/D8): only short public codes leave the server —
 * `NOT_IMPLEMENTED` -> 501, `VALIDATION` -> 400, anything else is logged
 * server-side (never the request body) and returned as a generic 500.
 */
function errorResponse(err: unknown, fallbackStatus: number): Response {
  const message = err instanceof Error ? err.message : '';
  let code = 'INTERNAL';
  if (message.startsWith('NOT_IMPLEMENTED')) {
    code = 'NOT_IMPLEMENTED';
  } else if (message.startsWith('VALIDATION')) {
    code = 'VALIDATION';
  } else {
    console.error('[api/guestbook] unexpected error:', err);
  }
  const status = code === 'NOT_IMPLEMENTED' ? 501 : code === 'VALIDATION' ? 400 : fallbackStatus;
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const GET: APIRoute = async () => {
  try {
    const rows = listGuestbook();
    return new Response(JSON.stringify({ entries: rows }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return errorResponse(err, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const row = insertGuestbook(body);
    return new Response(JSON.stringify(row), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return errorResponse(err, 400);
  }
};