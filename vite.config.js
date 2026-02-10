import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      protocol: 'ws',
    },
  },
  optimizeDeps: {
    // Это заставит Vite предварительно собрать библиотеку, 
    // чтобы она не вызывала проблем с безопасностью
    include: ['cytoscape'],
  },
})