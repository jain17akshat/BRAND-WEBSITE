import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const bellSrcDir = path.resolve(__dirname, 'public/brass bells');
const bellDestDir = path.resolve(__dirname, 'public/assets/brass bells');
if (!fs.existsSync(bellDestDir)) {
  fs.mkdirSync(bellDestDir, { recursive: true });
}
if (fs.existsSync(bellSrcDir)) {
  fs.readdirSync(bellSrcDir).forEach(f => {
    if (f !== 'README.md') {
      fs.copyFileSync(path.join(bellSrcDir, f), path.join(bellDestDir, f));
    }
  });
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
