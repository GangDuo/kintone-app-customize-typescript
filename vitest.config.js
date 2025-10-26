import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // ... vitest options
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
