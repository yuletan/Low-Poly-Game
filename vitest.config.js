import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./js/__tests__/setup.js'],
    include: ['./js/__tests__/**/*.test.js'],
  },
});
