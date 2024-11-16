import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:3000/socket.io',
        ws: true,
      },
    },
  },
})
