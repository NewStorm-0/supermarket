import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',  //你要跨域访问的网址
        changeOrigin: true,   // 允许跨域
        ws: true,    //是否启用websockets，用不到可设为false
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
