import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    mockReset: true,
    root: __dirname,
    globals: true,
    environment: 'jsdom',
    setupFiles: './testSetup.ts',
  },
});
