import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import viteTsconfigPaths from 'vite-tsconfig-paths';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), viteTsconfigPaths()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://sandbox.vtpass.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});