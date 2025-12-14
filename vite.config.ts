import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Declare process to satisfy TypeScript without @types/node
declare const process: any;

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  }
});