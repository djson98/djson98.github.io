import { copyFileSync } from 'node:fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** GitHub Pages: /projects 등에서 새로고침 시에도 React 앱이 뜨도록 index 복제 */
function ghPagesSpaFallback(): import('vite').Plugin {
  return {
    name: 'gh-pages-spa-fallback',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), ghPagesSpaFallback()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
