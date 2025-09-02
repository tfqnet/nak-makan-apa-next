import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove base path for Vercel deployment
  // base: '/nak-makan-apa/', // Only needed for GitHub Pages
})
