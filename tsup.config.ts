import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: 'tsconfig.app.json',
});
