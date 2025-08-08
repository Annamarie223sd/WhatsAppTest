import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // 监听所有网络接口，允许手机访问
    open: true,
    hmr: {
      overlay: true,
      port: 3001 // HMR 使用不同端口
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  optimizeDeps: {
    exclude: ['fsevents']
  }
}) 