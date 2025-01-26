import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Replace with your backend URL
        changeOrigin: true,
        secure: false, // Use `true` if you're using HTTPS in the backend
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional, rewrites `/api` prefix
      },
    },
  },
});