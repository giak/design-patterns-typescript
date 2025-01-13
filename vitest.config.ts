import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/SOLID/hotel/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/SOLID/hotel/**/*.ts'],
      exclude: ['src/SOLID/hotel/**/*.{test,spec}.ts', 'src/SOLID/hotel/**/types/**', 'src/SOLID/hotel/**/*.d.ts'],
    },
  },
});
