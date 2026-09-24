import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // картинки: /api/uploads/... -> http://localhost:5000/uploads/...
      '/api/uploads': {
        target: 'http://localhost:5000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // API: /api/... -> http://localhost:5000/api/...
      '/api': 'http://localhost:5000',
    },
  },
})
