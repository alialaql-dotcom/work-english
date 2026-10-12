/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// الوضع العادي: موقع للنشر (Vercel / Netlify) مع Service Worker للعمل دون اتصال.
// وضع "preview": ملف HTML واحد للمعاينة السريعة (يحفظ التقدم على الجهاز فقط).
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'preview' ? [viteSingleFile()] : [])],
  build: mode === 'preview' ? { outDir: 'dist-preview' } : {},
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    testTimeout: 30000,
  },
}))
