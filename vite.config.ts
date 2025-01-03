import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['react-beautiful-dnd']
  },
  build: {
    commonjsOptions: {
      include: [/react-beautiful-dnd/, /node_modules/],
      transformMixedEsModules: true
    }
  }
})
