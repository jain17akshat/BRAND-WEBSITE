import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Safely sync brass bells assets without crashing Vercel/Linux build environment
try {
  const bellSrcDir = path.resolve(__dirname, 'public/brass bells');
  const bellDestDir = path.resolve(__dirname, 'public/assets/brass bells');
  if (!fs.existsSync(bellDestDir)) {
    fs.mkdirSync(bellDestDir, { recursive: true });
  }
  if (fs.existsSync(bellSrcDir)) {
    fs.readdirSync(bellSrcDir).forEach(f => {
      const srcPath = path.join(bellSrcDir, f);
      const destPath = path.join(bellDestDir, f);
      try {
        const stat = fs.statSync(srcPath);
        if (stat.isFile() && f !== 'README.md') {
          fs.copyFileSync(srcPath, destPath);
        }
      } catch (err) {
        // Safely skip any nested directories or unreadable files
      }
    });
  }
} catch (err) {
  // Fail-safe wrapper for CI/CD environments like Vercel
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Forward all /api requests to the Express backend
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
