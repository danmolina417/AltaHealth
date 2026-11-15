// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { GET as unknownRoute } from '../[...slug]/route';
import { GET } from './route';

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const res = GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toMatchObject({ status: 'ok' });
    expect(typeof body.uptimeSeconds).toBe('number');
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });
});

describe('unknown API routes', () => {
  it('return a 404 JSON error', async () => {
    const res = unknownRoute();

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'Not Found' });
  });
});
