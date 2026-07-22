import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Relative base so the built site works at any mount point
// (GitHub Pages project page: https://rs-256.github.io/dustNotifierOrderCalc/)
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    rollupOptions: {
      // Two-page site: main calculator + all-patterns reference at docs/
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        docs: fileURLToPath(new URL('./docs/index.html', import.meta.url)),
      },
    },
  },
})
