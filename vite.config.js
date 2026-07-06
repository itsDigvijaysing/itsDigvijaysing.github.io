import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User site served at root (https://itsdigvijaysing.github.io/) → base '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: { outDir: 'dist' },
  server: { port: 5173, open: false },
});
