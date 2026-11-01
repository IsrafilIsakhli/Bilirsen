import 'reflect-metadata';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Controller, Get, Module, Post, Req } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { request, Server } from 'node:http';
import type { Request } from 'express';
import { gzipSync } from 'node:zlib';
import { z } from 'zod';
import { errorSchema } from '@azquiz/contracts';
import { configureHttp, JSON_BODY_LIMIT } from '../src/common/http-setup';

@Controller('probe')
class ProbeController {
  @Post() probe(@Req() req: Request & { receivedAt: number }) {
    return { receivedAt: req.receivedAt };
  }

  @Get('failure') failure(): never {
    throw new Error('private-database-details');
  }
}

@Module({ controllers: [ProbeController] })
class ProbeModule {}

describe('HTTP failure boundaries', () => {
  let app: NestExpressApplication;
  let address: string;
  let server: Server;

  beforeAll(async () => {
    app = await NestFactory.create<NestExpressApplication>(ProbeModule, {
      bodyParser: false,
      logger: false,
    });
    configureHttp(app, 'production');
    await app.listen(0, '127.0.0.1');
    const httpServer: unknown = app.getHttpServer();
    if (!(httpServer instanceof Server)) throw new Error('Expected an HTTP server');
    server = httpServer;
    const location = server.address();
    if (!location || typeof location === 'string') throw new Error('No test server address');
    address = `http://127.0.0.1:${location.port}/v1/probe`;
  });

  afterAll(async () => {
    server?.closeIdleConnections();
    await app?.close();
  });

  it('rejects malformed JSON without echoing the body and keeps the API usable', async () => {
    const response = await fetch(address, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Request-Id': 'untrusted-client-id' },
      body: '{"private":"do-not-echo",',
    });
    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).not.toContain('do-not-echo');
    expect(errorSchema.parse(JSON.parse(text)).code).toBe('invalid_json');
    expect(z.uuid().safeParse(response.headers.get('X-Request-Id')).success).toBe(true);
    expect(response.headers.get('X-Request-Id')).not.toBe('untrusted-client-id');
    const valid = await fetch(address, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    expect(valid.status).toBe(201);
    expect(valid.headers.get('X-Request-Id')).not.toBe(response.headers.get('X-Request-Id'));
    expect(valid.headers.get('X-Powered-By')).toBeNull();
  });

  it('bounds request bodies and rejects compressed uploads before decompression', async () => {
    const large = JSON.stringify({ value: 'x'.repeat(JSON_BODY_LIMIT) });
    const response = await fetch(address, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: large,
    });
    expect(response.status).toBe(413);
    expect(errorSchema.parse(await response.json()).code).toBe('payload_too_large');
    const compressed = await fetch(address, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' },
      body: gzipSync(large),
    });
    expect(compressed.status).toBe(415);
    expect(errorSchema.parse(await compressed.json()).code).toBe('unsupported_encoding');
  });

  it('records answer receipt after the complete JSON body, not after headers or the first chunk', async () => {
    const body = '{"value":"complete"}';
    let completedAt = 0;
    const response = await new Promise<string>((resolve, reject) => {
      const upload = request(
        address,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
          res.on('error', reject);
        },
      );
      upload.on('error', reject);
      upload.flushHeaders();
      upload.write(body.slice(0, 10));
      setTimeout(() => {
        completedAt = Date.now();
        upload.end(body.slice(10));
      }, 80);
    });
    const payload = z.object({ receivedAt: z.number().int() }).parse(JSON.parse(response));
    expect(payload.receivedAt).toBeGreaterThanOrEqual(completedAt);
  });

  it('hides internal error details and returns an independently generated request ID', async () => {
    const response = await fetch(`${address}/failure`);
    expect(response.status).toBe(503);
    const text = await response.text();
    expect(text).not.toContain('private-database-details');
    expect(errorSchema.parse(JSON.parse(text)).code).toBe('server_unavailable');
    expect(z.uuid().safeParse(response.headers.get('X-Request-Id')).success).toBe(true);
  });
});
