import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/doctor': 'http://localhost:3000',
      '/patient': 'http://localhost:3000',
      '/prescription': 'http://localhost:3000',
      '/schedule': 'http://localhost:3000',
      '/hospital': 'http://localhost:3000',
      '/appointment': 'http://localhost:3000',
      '/dashboard': 'http://localhost:3000'
    }
  }
})
