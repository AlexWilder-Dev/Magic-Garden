import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/magic-garden-battersea/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
});
