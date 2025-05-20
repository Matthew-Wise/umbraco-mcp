import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  format: ['esm', 'cjs'],
  target: 'node20',
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx', '.md'];
    options.mainFields = ['module', 'main'];
    options.loader = {
      ...options.loader,
      '.md': 'text'
    };
  },
  noExternal: ['@modelcontextprotocol/sdk'],
});