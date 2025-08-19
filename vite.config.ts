/// <reference types="vitest" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  test: {
    mockReset: true,
    globals: true,
    environment: 'happy-dom',
    setupFiles: './testSetup.ts',
    include: ['src/**/*.spec.jsx'],

    coverage: {
      include: ['src'],
    },
  },
});
