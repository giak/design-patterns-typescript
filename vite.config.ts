import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/dayjs/, /node_modules/],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['dayjs', 'mermaid'],
  },
});
