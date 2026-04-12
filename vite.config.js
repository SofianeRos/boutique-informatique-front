import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 1. On importe Tailwind

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
})