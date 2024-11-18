import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    ...configDefaults,
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
  },
});