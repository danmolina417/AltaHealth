import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * Next.js turns `import hero from './hero.webp'` into `{ src, width, height }`, which
 * `next/image` requires. Vite would return a plain URL string, so mirror Next here.
 */
const nextStaticImages = (): Plugin => ({
  name: 'next-static-images',
  enforce: 'pre',
  load(id) {
    if (!/\.(png|jpe?g|gif|webp|avif)$/.test(id)) return null;
    const src = JSON.stringify(`/${id.split('/').slice(-2).join('/')}`);
    return `export default { src: ${src}, width: 1200, height: 800 };`;
  },
});

export default defineConfig({
  plugins: [nextStaticImages(), react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: false,
  },
});
