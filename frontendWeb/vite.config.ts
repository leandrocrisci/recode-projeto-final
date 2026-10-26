import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },
   build: {
    chunkSizeWarningLimit: 1000, // Aumenta o limite do aviso para 1000kB (1MB)
  }
})

