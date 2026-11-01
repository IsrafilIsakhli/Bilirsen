import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { ApiError, fetchJson } from '../../mobile/src/services/http/fetch-json';

describe('mobile HTTP transport deadlines', () => {
  let server: Server;
  let address: string;

  beforeAll(async () => {
    server = createServer((request, response) => {
      response.setHeader('Content-Type', 'application/json');
      if (request.url === '/slow-headers' || request.url === '/slow-body') {
        if (request.url === '/slow-body') {
          response.flushHeaders();
          response.write('{"ok":');
        }
        const timer = setTimeout(() => response.end('true}'), 5000);
        response.once('close', () => clearTimeout(timer));
        return;
      }
      if (request.url === '/invalid') {
        response.statusCode = 502;
        response.end('not-json');
        return;
      }
      if (request.url === '/drop') {
        response.destroy();
        return;
      }
      if (request.url === '/partial-drop') {
        response.write('{"ok":');
        const timer = setTimeout(() => response.destroy(), 40);
        response.once('close', () => clearTimeout(timer));
        return;
      }
      response.statusCode = request.url === '/unauthorized' ? 401 : 200;
      response.end('{"ok":true}');
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const location = server.address();
    if (!location || typeof location === 'string') throw new Error('Missing test listener');
    address = `http://127.0.0.1:${location.port}`;
  });
  afterAll(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });

  it('reads JSON while preserving HTTP status for the session and error handlers', async () => {
    const success = await fetchJson(address, {});
    expect(success.response.status).toBe(200);
    expect(success.payload).toEqual({ ok: true });
    const unauthorized = await fetchJson(`${address}/unauthorized`, {});
    expect(unauthorized.response.status).toBe(401);
    expect(unauthorized.payload).toEqual({ ok: true });
  });
  it.each(['slow-headers', 'slow-body'])(
    'aborts %s within the complete-response deadline',
    async (path) => {
      await expect(fetchJson(`${address}/${path}`, {}, 150)).rejects.toMatchObject({
        code: 'network_error',
        status: 0,
        message: 'Serverin cavabı gecikir. Yenidən yoxla.',
      });
      // A timeout must not affect the next request.
      expect((await fetchJson(address, {})).payload).toEqual({ ok: true });
    },
  );
  it('distinguishes malformed responses from connection failures', async () => {
    await expect(fetchJson(`${address}/invalid`, {})).rejects.toMatchObject({
      code: 'invalid_response',
      status: 502,
    });
    const error: unknown = await fetchJson(`${address}/drop`, {}).catch((cause: unknown) => cause);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: 'network_error', status: 0 });
  });
  it('reports a connection lost while receiving JSON as a network failure', async () => {
    await expect(fetchJson(`${address}/partial-drop`, {})).rejects.toMatchObject({
      code: 'network_error',
      status: 0,
    });
  });
});
