import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// no build (e no "npm run preview", que serve o build) o app fica em
// https://isacarol-04.github.io/s05-ihm-app-inatel/ (GitHub Pages);
// em desenvolvimento continua na raiz (localhost:5173/)
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/s05-ihm-app-inatel/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
