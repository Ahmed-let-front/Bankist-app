import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
export default defineConfig({
  base: '/Bankist-app',
  plugins: [tailwindcss()],
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        ui: resolve(__dirname, 'index.html'),
        account: resolve(__dirname, 'account.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
