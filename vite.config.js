import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base: './' ทำให้ build ไปวางที่ GitHub Pages (path แบบ /repo-name/) ได้เลย
export default defineConfig({
  plugins: [react()],
  base: './',
})
