import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2024',
  outDir: 'dist',
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  outExtension() {
    return { js: '.js' };
  }
});