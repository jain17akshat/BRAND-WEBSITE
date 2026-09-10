import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Safely sync top-level public directories (e.g., "public/brass bells") into "public/assets/" for Linux/CI build environments
try {
  const publicDir = path.resolve(__dirname, 'public');
  const assetsDir = path.resolve(__dirname, 'public/assets');
  if (fs.existsSync(publicDir)) {
    const items = fs.readdirSync(publicDir);
    for (const item of items) {
      if (item === 'assets') continue;
      const srcPath = path.join(publicDir, item);
      try {
        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
          const destPath = path.join(assetsDir, item);
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          fs.readdirSync(srcPath).forEach(f => {
            const fileSrc = path.join(srcPath, f);
            const fileDest = path.join(destPath, f);
            try {
              const fileStat = fs.statSync(fileSrc);
              if (fileStat.isFile() && f !== 'README.md') {
                fs.copyFileSync(fileSrc, fileDest);
              }
            } catch (fileErr) {
              // Safely skip unreadable files
            }
          });
        }
      } catch (itemErr) {
        // Safely skip items that cannot be accessed
      }
    }
  }
} catch (err) {
  // Fail-safe wrapper for CI/CD environments like Vercel / Netlify
}

export default defineConfig({
  // Root domain hosting uses '/'. For subdirectory hosting (e.g. '/app/'), update base accordingly.
  base: '/',
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
