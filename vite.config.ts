import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // This ensures relative paths in the built files
  build: {
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'src/sidepanel.html'),
        background: resolve(__dirname, 'src/background.ts'),
        'content-script': resolve(__dirname, 'src/content-script.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: false, // Don't clear dist folder to preserve manifest files
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})