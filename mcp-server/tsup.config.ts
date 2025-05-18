import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { glob } from 'glob';
import { RESOURCES_DIR } from './src/constants/paths.js';

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
  onSuccess: async () => {
    // Create resources directory in build folder
    if (!existsSync(RESOURCES_DIR)) {
      mkdirSync(RESOURCES_DIR, { recursive: true });
    }

    // Find all markdown files in src directory
    const mdFiles = await glob('src/**/*.md');

    // Copy each markdown file to the resources directory
    for (const mdFile of mdFiles) {
      const fileName = basename(mdFile);
      const destPath = join(RESOURCES_DIR, fileName);
      copyFileSync(mdFile, destPath);
    }
  },
});