import { defineConfig } from 'vitest/config';
export default defineConfig({
  oxc: { decorator: { legacy: true, emitDecoratorMetadata: true } },
  test: { include: ['apps/api/tests/**/*.test.ts'], testTimeout: 30000, hookTimeout: 30000 },
});
