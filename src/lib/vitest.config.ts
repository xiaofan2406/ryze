import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    mockReset: true,
    root: __dirname,
    globals: true,
    environment: 'jsdom',
    setupFiles: './testSetup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
  },
});
