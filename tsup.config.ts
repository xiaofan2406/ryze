import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/lib/index.tsx'],
  splitting: false,
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: 'tsconfig.app.json',
});
