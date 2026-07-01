import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

/**
 * Standard Vite Configuration for Production & Local Environments
 * Optimized for container environments, local mock testing, and ultra-fast build times.
 */
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Standalone dev server configurations
      port: 3000,
      host: '0.0.0.0',
      // Condition HMR depending on dev environment flags to minimize unexpected repaints
      hmr: process.env.DISABLE_HMR !== 'true',
      // Toggle standard file watcher depending on environment specs to preserve runtime memory
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
